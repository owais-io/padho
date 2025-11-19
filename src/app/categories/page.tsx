import Link from 'next/link';
import { getAllCategories } from '@/lib/mdx';
import { Newspaper, TrendingUp } from 'lucide-react';

export default function CategoriesPage() {
  const categories = getAllCategories();

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6" style={{color: '#2c1810'}}>
            Explore All
            <span className="bg-gradient-to-r from-primary-700 to-accent-700 bg-clip-text text-transparent"> Categories</span>
          </h1>
          <p className="text-lg max-w-3xl mx-auto leading-relaxed" style={{color: '#4a3428'}}>
            Dive deep into specific topics that interest you. From global affairs to cutting-edge technology,
            we have carefully organized content to help you stay informed about what matters most to you.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-700 to-accent-700 mx-auto rounded-full mt-8 shadow-sm"></div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group"
            >
              <div className="bg-cream-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gold-200 hover:border-accent-400 h-full">
                {/* Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg group-hover:from-primary-200 group-hover:to-accent-200 transition-colors shadow-sm">
                    <Newspaper className="w-6 h-6 text-primary-700" />
                  </div>
                  {index < 3 && (
                    <div className="flex items-center space-x-1 text-xs text-accent-700 bg-accent-100 px-2 py-1 rounded-full shadow-sm">
                      <TrendingUp className="w-3 h-3" />
                      <span>Popular</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-xl font-semibold group-hover:text-accent-700 transition-colors mb-2" style={{color: '#2c1810'}}>
                    {category.name}
                  </h3>
                  <p className="text-sm mb-4" style={{color: '#6b5548'}}>
                    {category.articleCount} articles available
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full bg-gold-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-gradient-to-r from-primary-600 to-accent-600 h-2 rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${Math.min(100, (category.articleCount / 60) * 100)}%` }}
                    ></div>
                  </div>

                  <span className="inline-flex items-center text-primary-700 group-hover:text-accent-700 text-sm font-medium">
                    Explore {category.name}
                    <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-8 border border-gold-300 shadow-md">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{color: '#2c1810'}}>
              Can't find what you're looking for?
            </h2>
            <p className="mb-6 max-w-2xl mx-auto" style={{color: '#4a3428'}}>
              Our AI-powered system is constantly learning and categorizing new content.
              Check back regularly as we add more categories and improve our content organization.
            </p>
            <Link
              href="/"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-700 to-primary-600 hover:from-primary-800 hover:to-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md"
            >
              <span>Browse All Articles</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}