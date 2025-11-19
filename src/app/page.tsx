import Timeline from '@/components/Timeline';
import { getAllArticles } from '@/lib/mdx';
import { Article } from '@/lib/types';

export default function HomePage() {
  // Get articles from MDX files and map to UI Article type
  const mdxArticles = getAllArticles();
  const articles: Article[] = mdxArticles.map(article => ({
    id: article.id,
    title: article.title,
    summary: article.summary,
    imageUrl: article.imageUrl,
    category: article.category,
    publishedDate: article.publishedAt,
    guardianUrl: `https://www.theguardian.com/${article.id}`,
  }));

  return (
    <div className="py-8 sm:py-12">
      {/* Hero Section */}
      <section className="text-center mb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight" style={{color: '#2c1810'}}>
            Stay Informed with
            <span className="bg-gradient-to-r from-primary-700 to-accent-700 bg-clip-text text-transparent"> India & Pakistan News</span>
          </h1>
          <p className="text-lg sm:text-xl mb-8 leading-relaxed" style={{color: '#4a3428'}}>
            Discover the most important stories from India and Pakistan with AI-powered summaries
            that help you stay informed without the overwhelming noise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-cream-50 rounded-lg p-4 shadow-md border border-gold-200">
              <div className="flex items-center space-x-2" style={{color: '#4a3428'}}>
                <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Live Updates</span>
              </div>
            </div>
            <div className="bg-cream-50 rounded-lg p-4 shadow-md border border-gold-200">
              <div className="flex items-center space-x-2" style={{color: '#4a3428'}}>
                <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
                <span className="text-sm font-medium">AI Summaries</span>
              </div>
            </div>
            <div className="bg-cream-50 rounded-lg p-4 shadow-md border border-gold-200">
              <div className="flex items-center space-x-2" style={{color: '#4a3428'}}>
                <div className="w-2 h-2 bg-gold-600 rounded-full"></div>
                <span className="text-sm font-medium">Trusted Source</span>
              </div>
            </div>
          </div>
          <p className="text-sm mt-6" style={{color: '#6b5548'}}>
            Articles sourced from{' '}
            <a
              href="https://www.theguardian.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-accent-700 transition-colors underline"
            >
              The Guardian API
            </a>
          </p>
        </div>
      </section>

      {/* Articles Timeline */}
      <section className="max-w-7xl mx-auto">
        <div className="text-center mb-12 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{color: '#2c1810'}}>
            Latest Stories
          </h2>
          <p className="max-w-2xl mx-auto" style={{color: '#4a3428'}}>
            Browse through our carefully curated selection of the most important news stories,
            each with concise AI-generated summaries to help you stay informed efficiently.
          </p>
        </div>

        <Timeline articles={articles} />
      </section>
    </div>
  );
}