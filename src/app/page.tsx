import Timeline from '@/components/Timeline';
import { getAllArticles } from '@/lib/mdx';
import { Article } from '@/lib/types';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Padho - Asian Geopolitical News with AI Summaries',
  description: 'Stay informed with news from India, Pakistan, China, Iran, Afghanistan, Sri Lanka, Bangladesh and more. AI-powered summaries from The Guardian help you understand South Asian geopolitics.',
  keywords: 'India news, Pakistan news, China news, Iran news, Afghanistan news, Kashmir, South Asia, geopolitics, AI summaries, Bangladesh, Sri Lanka, Nepal',
  openGraph: {
    title: 'Padho - Asian Geopolitical News with AI Summaries',
    description: 'Stay informed with news from India, Pakistan, China, Iran, Afghanistan, Sri Lanka and more. AI-powered summaries from The Guardian.',
    type: 'website',
  },
};

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
            Your Gateway to
            <span className="bg-gradient-to-r from-primary-700 to-accent-700 bg-clip-text text-transparent"> Asian Geopolitical News</span>
          </h1>
          <p className="text-lg sm:text-xl mb-8 leading-relaxed" style={{color: '#4a3428'}}>
            Discover the most important stories from South Asia, Iran, China, and neighboring regions with AI-powered summaries
            that help you stay informed without the overwhelming noise.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
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
            <div className="bg-cream-50 rounded-lg p-4 shadow-md border border-gold-200">
              <div className="flex items-center space-x-2" style={{color: '#4a3428'}}>
                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                <span className="text-sm font-medium">Multi-Region</span>
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

      {/* Regional Coverage Badges */}
      <section className="max-w-7xl mx-auto mt-16 mb-12 px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-center" style={{color: '#2c1810'}}>
          Countries We Cover
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 max-w-2xl mx-auto">
          <div className="bg-cream-50 rounded-lg p-3 text-center border border-gold-200 hover:border-primary-400 transition-colors">
            <span className="text-lg mb-1 block">🇮🇳</span>
            <span className="text-xs font-semibold text-primary-700">India</span>
          </div>
          <div className="bg-cream-50 rounded-lg p-3 text-center border border-gold-200 hover:border-primary-400 transition-colors">
            <span className="text-lg mb-1 block">🇵🇰</span>
            <span className="text-xs font-semibold text-primary-700">Pakistan</span>
          </div>
          <div className="bg-cream-50 rounded-lg p-3 text-center border border-gold-200 hover:border-primary-400 transition-colors">
            <span className="text-lg mb-1 block">🇨🇳</span>
            <span className="text-xs font-semibold text-primary-700">China</span>
          </div>
          <div className="bg-cream-50 rounded-lg p-3 text-center border border-gold-200 hover:border-primary-400 transition-colors">
            <span className="text-lg mb-1 block">🇮🇷</span>
            <span className="text-xs font-semibold text-primary-700">Iran</span>
          </div>
          <div className="bg-cream-50 rounded-lg p-3 text-center border border-gold-200 hover:border-primary-400 transition-colors">
            <span className="text-lg mb-1 block">🇦🇫</span>
            <span className="text-xs font-semibold text-primary-700">Afghanistan</span>
          </div>
        </div>
      </section>

      {/* Key Topics Section */}
      <section className="max-w-7xl mx-auto mb-12 px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-center" style={{color: '#2c1810'}}>
          Key Topics We Cover
        </h3>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          <span className="px-3 sm:px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-xs sm:text-sm font-medium hover:bg-primary-200 transition-colors">Geopolitics</span>
          <span className="px-3 sm:px-4 py-2 bg-accent-100 text-accent-700 rounded-full text-xs sm:text-sm font-medium hover:bg-accent-200 transition-colors">India-Pakistan Relations</span>
          <span className="px-3 sm:px-4 py-2 bg-gold-100 text-gold-700 rounded-full text-xs sm:text-sm font-medium hover:bg-gold-200 transition-colors">China-India Border</span>
          <span className="px-3 sm:px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-xs sm:text-sm font-medium hover:bg-primary-200 transition-colors">Iran & Middle East</span>
          <span className="px-3 sm:px-4 py-2 bg-accent-100 text-accent-700 rounded-full text-xs sm:text-sm font-medium hover:bg-accent-200 transition-colors">Afghanistan Conflict</span>
          <span className="px-3 sm:px-4 py-2 bg-gold-100 text-gold-700 rounded-full text-xs sm:text-sm font-medium hover:bg-gold-200 transition-colors">Kashmir</span>
          <span className="px-3 sm:px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-xs sm:text-sm font-medium hover:bg-primary-200 transition-colors">Nuclear Policy</span>
          <span className="px-3 sm:px-4 py-2 bg-accent-100 text-accent-700 rounded-full text-xs sm:text-sm font-medium hover:bg-accent-200 transition-colors">Cricket & Sports</span>
          <span className="px-3 sm:px-4 py-2 bg-gold-100 text-gold-700 rounded-full text-xs sm:text-sm font-medium hover:bg-gold-200 transition-colors">Sri Lanka</span>
          <span className="px-3 sm:px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-xs sm:text-sm font-medium hover:bg-primary-200 transition-colors">Bangladesh</span>
        </div>
      </section>

      {/* Coverage Statistics Section */}
      <section className="max-w-7xl mx-auto mb-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-6 sm:p-8 border border-gold-300">
          <h3 className="text-xl sm:text-2xl font-bold text-center mb-6" style={{color: '#2c1810'}}>
            Our Coverage Scope
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-primary-700">{articles.length}</div>
              <div className="text-xs sm:text-sm mt-1" style={{color: '#6b5548'}}>Total Articles</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-accent-700">8+</div>
              <div className="text-xs sm:text-sm mt-1" style={{color: '#6b5548'}}>Countries Covered</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gold-700">70+</div>
              <div className="text-xs sm:text-sm mt-1" style={{color: '#6b5548'}}>Keywords Tracked</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-primary-700">Daily</div>
              <div className="text-xs sm:text-sm mt-1" style={{color: '#6b5548'}}>Updates</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}