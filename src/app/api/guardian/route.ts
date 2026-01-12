import { NextResponse } from 'next/server';
import { saveArticles, filterNewArticleIds } from '@/lib/db';

// Helper function to add delay between requests (rate limiting)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Get date range parameters
    const fromDateParam = searchParams.get('fromDate');
    const toDateParam = searchParams.get('toDate');

    // Validate date parameters
    if (!fromDateParam || !toDateParam) {
      return NextResponse.json(
        { success: false, error: 'Both fromDate and toDate parameters are required' },
        { status: 400 }
      );
    }

    const fromDate = fromDateParam; // Format: YYYY-MM-DD
    const toDate = toDateParam; // Format: YYYY-MM-DD

    // Validate date format and range
    const from = new Date(fromDate);
    const to = new Date(toDate);

    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    if (from > to) {
      return NextResponse.json(
        { success: false, error: 'fromDate must be before or equal to toDate' },
        { status: 400 }
      );
    }

    const pageSize = 50; // Guardian API max per request

    console.log(`Fetching articles from ${fromDate} to ${toDate}`);

    const apiKey = process.env.GUARDIAN_API_KEY;
    let allFetchedArticles: any[] = [];
    let totalAvailable = 0;
    let page = 1;

    // Fetch all available articles within the date range
    while (true) {
      // Build Guardian API URL for this page
      const guardianUrl = new URL('https://content.guardianapis.com/search');

      guardianUrl.searchParams.set('api-key', apiKey || '');
      guardianUrl.searchParams.set('from-date', fromDate);
      guardianUrl.searchParams.set('page-size', pageSize.toString());
      guardianUrl.searchParams.set('page', page.toString());
      guardianUrl.searchParams.set('order-by', 'newest');
      guardianUrl.searchParams.set('show-fields', 'thumbnail,trailText,byline');

      // Fetch from Guardian API
      const response = await fetch(guardianUrl.toString());

      if (!response.ok) {
        console.log(`Page ${page} returned status ${response.status}. Stopping pagination.`);
        break; // Stop fetching if we hit an error
      }

      const data = await response.json();
      const pageArticles = data.response.results;
      totalAvailable = data.response.total; // Total articles available in the time range

      // If no articles returned, we've reached the end
      if (!pageArticles || pageArticles.length === 0) {
        console.log(`No more articles available after page ${page - 1}`);
        break;
      }

      allFetchedArticles = allFetchedArticles.concat(pageArticles);

      console.log(`Fetched page ${page}: ${pageArticles.length} articles (${allFetchedArticles.length}/${totalAvailable} total)`);

      // Stop if we've fetched all available articles
      if (allFetchedArticles.length >= totalAvailable) {
        console.log(`All articles fetched: ${allFetchedArticles.length}`);
        break;
      }

      // Rate limiting: Wait 1 second between requests
      await delay(1000); // 1 second delay to respect API rate limit

      page++; // Move to next page
    }

    // FILTER: Only keep articles that have relevant keywords in the title (case-insensitive)
    const keywords = [
      // Core countries
      'india', 'modi', 'pakistan',
      // Major cities
      'kashmir', 'delhi', 'mumbai', 'islamabad', 'karachi', 'lahore',
      'bengaluru', 'bangalore', 'hyderabad', 'chennai', 'kolkata', 'peshawar',
      // States and regions
      'punjab', 'bangladesh', 'gujarat', 'kerala', 'rajasthan', 'tamil nadu', 'balochistan',
      // Political leaders and parties
      'gandhi', 'bjp', 'congress', 'imran khan', 'sharif', 'bhutto',
      'rss', 'hindutva', 'amit shah', 'rahul gandhi', 'partition', 'nehru',
      // Religious and cultural
      'hindu', 'muslim', 'sikh', 'taj mahal',
      // Security and conflict
      'border', 'terrorism', 'nuclear', 'militant', 'taliban', 'afghanistan',
      'pulwama', 'kargil', 'ceasefire', 'drone',
      // Sports
      'cricket', 'kohli', 'tendulkar', 'ipl',
      // Business and economy
      'bollywood', 'rupee', 'tata', 'reliance', 'adani', 'ambani',
      // Regional neighbors
      'china', 'nepal', 'sri lanka',
      // Geographic and environmental
      'monsoon', 'ganges', 'ganga', 'indus', 'himalaya',
      // Iran related
      'iran', 'tehran', 'iranian', 'khamenei', 'rouhani', 'raisi',
      'persian', 'shiite', 'shia', 'hormuz', 'isfahan', 'mashhad', 'persian gulf',
      // Afghanistan related (additional)
      'kabul', 'kandahar', 'afghan', 'panjshir', 'herat', 'mazar',
      // China related (additional)
      'beijing', 'shanghai', 'xi jinping', 'tibet', 'taiwan', 'hong kong',
      'uyghur', 'xinjiang', 'ladakh', 'pla',
      // Sri Lanka related (additional)
      'colombo', 'sinhalese', 'tamil tigers', 'rajapaksa', 'gotabaya', 'kandy'
    ];

    const filteredArticles = allFetchedArticles.filter((article: any) => {
      const title = article.webTitle.toLowerCase();
      return keywords.some(keyword => title.includes(keyword));
    });

    console.log(`Filtered ${allFetchedArticles.length} articles down to ${filteredArticles.length} articles with India/Pakistan-related keywords in title`);

    // Filter out duplicate articles (already fetched before)
    const articleIds = filteredArticles.map((article: any) => article.id);
    const newArticleIds = filterNewArticleIds(articleIds);
    const newArticles = filteredArticles.filter((article: any) =>
      newArticleIds.includes(article.id)
    );

    // Save only new articles to database
    if (newArticles.length > 0) {
      saveArticles(newArticles);
    }

    return NextResponse.json({
      success: true,
      dateRange: {
        from: fromDate,
        to: toDate,
      },
      articles: newArticles,
      totalAvailable: totalAvailable, // Total articles in date range
      fetched: allFetchedArticles.length,
      filtered: filteredArticles.length,
      new: newArticles.length,
      duplicates: filteredArticles.length - newArticles.length,
    });

  } catch (error) {
    console.error('Guardian API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
