import Timeline from '@/components/Timeline';
import { dummyArticles } from '@/data/dummyData';

export default function HomePage() {
  return (
    <div className="py-8 sm:py-12">
      {/* Hero Section */}
      <section className="text-center mb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Stay Informed with 
            <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent"> Curated News</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
            Discover the most important stories from The Guardian with AI-powered summaries 
            that help you stay informed without the overwhelming noise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Live Updates</span>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">AI Summaries</span>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium">Trusted Source</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Timeline */}
      <section className="max-w-7xl mx-auto">
        <div className="text-center mb-12 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Latest Stories
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse through our carefully curated selection of the most important news stories, 
            each with concise AI-generated summaries to help you stay informed efficiently.
          </p>
        </div>
        
        <Timeline articles={dummyArticles} />
      </section>
    </div>
  );
}