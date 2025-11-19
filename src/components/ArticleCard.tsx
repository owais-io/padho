'use client';

import Image from 'next/image';
import { Clock, ExternalLink } from 'lucide-react';
import { ArticleCardProps } from '@/lib/types';

export default function ArticleCard({ article, onSummaryOpen }: ArticleCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <article className="timeline-item bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group border border-gray-100">
      {/* Image Container */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-block bg-primary-600/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
            {article.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        {/* Date */}
        <div className="flex items-center space-x-1 text-gray-500 text-sm mb-3">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatDate(article.publishedDate)}</span>
        </div>

        {/* Title */}
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
          {article.title}
        </h2>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onSummaryOpen(article)}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 text-sm"
          >
            Read Summary
          </button>
          
          <a
            href={article.guardianUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Original</span>
            <span className="sm:hidden">Full Article</span>
          </a>
        </div>
      </div>
    </article>
  );
}