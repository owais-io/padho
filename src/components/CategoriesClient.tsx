'use client';

import Link from 'next/link';
import { Newspaper, TrendingUp, ArrowUpDown, ArrowDownAZ, ArrowUpAZ, TrendingDown, Clock } from 'lucide-react';
import { useState, useMemo } from 'react';

type Category = {
  id: string;
  name: string;
  slug: string;
  articleCount: number;
  latestPostDate?: string;
};

type SortOption = 'most-articles' | 'least-articles' | 'a-z' | 'z-a' | 'latest';

export default function CategoriesClient({ categories }: { categories: Category[] }) {
  const [sortBy, setSortBy] = useState<SortOption>('most-articles');

  const sortedCategories = useMemo(() => {
    const sorted = [...categories];
    switch (sortBy) {
      case 'most-articles':
        return sorted.sort((a, b) => b.articleCount - a.articleCount);
      case 'least-articles':
        return sorted.sort((a, b) => a.articleCount - b.articleCount);
      case 'a-z':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'z-a':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'latest':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.latestPostDate || 0).getTime();
          const dateB = new Date(b.latestPostDate || 0).getTime();
          return dateB - dateA;
        });
      default:
        return sorted;
    }
  }, [categories, sortBy]);

  const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
    { value: 'most-articles', label: 'Most Articles', icon: <TrendingUp className="w-4 h-4" /> },
    { value: 'least-articles', label: 'Least Articles', icon: <TrendingDown className="w-4 h-4" /> },
    { value: 'latest', label: 'Latest', icon: <Clock className="w-4 h-4" /> },
    { value: 'a-z', label: 'A to Z', icon: <ArrowDownAZ className="w-4 h-4" /> },
    { value: 'z-a', label: 'Z to A', icon: <ArrowUpAZ className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Sort Controls */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        <div className="flex items-center gap-2 text-sm font-medium" style={{color: '#4a3428'}}>
          <ArrowUpDown className="w-4 h-4" />
          <span>Sort by:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSortBy(option.value)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                sortBy === option.value
                  ? 'bg-gradient-to-r from-primary-700 to-accent-700 text-white shadow-md'
                  : 'bg-cream-100 border border-gold-300 hover:border-accent-400 hover:bg-cream-200'
              }`}
              style={sortBy !== option.value ? {color: '#4a3428'} : undefined}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedCategories.map((category, index) => (
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
                {sortBy === 'most-articles' && index < 3 && (
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
    </>
  );
}
