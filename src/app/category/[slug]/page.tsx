import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Calendar, TrendingUp } from 'lucide-react';
import Timeline from '@/components/Timeline';
import { getArticlesByCategory, getCategoryBySlug } from '@/data/dummyData';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = getCategoryBySlug(params.slug);
  const articles = getArticlesByCategory(params.slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link
            href="/categories"
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Categories</span>
          </Link>
        </div>

        {/* Category Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Calendar className="w-4 h-4" />
            <span>Category</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            {category.name}
            <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent"> News</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Stay updated with the latest developments in {category.name.toLowerCase()}. 
            Our AI-curated summaries help you quickly understand the most important stories in this field.
          </p>

          {/* Category Stats */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="bg-white rounded-lg px-6 py-3 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700 font-medium">{category.articleCount} Articles</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg px-6 py-3 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-primary-600" />
                <span className="text-gray-700 font-medium">Regularly Updated</span>
              </div>
            </div>
          </div>

          <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-accent-600 mx-auto rounded-full mt-8"></div>
        </div>

        {/* Articles Timeline */}
        <Timeline articles={articles} />

        {/* Related Categories */}
        {articles.length === 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Explore Other Categories
            </h2>
            <div className="flex justify-center">
              <Link
                href="/categories"
                className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                <span>View All Categories</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const slugs = [
    'world', 'politics', 'technology', 'science', 'environment', 'sport',
    'culture', 'business', 'health', 'education', 'travel', 'food',
    'fashion', 'art'
  ];
  
  return slugs.map((slug) => ({
    slug,
  }));
}