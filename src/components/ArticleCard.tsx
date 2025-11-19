'use client';

import Image from 'next/image';
import { Clock, ExternalLink } from 'lucide-react';
import { ArticleCardProps } from '@/lib/types';

export default function ArticleCard({ article, onSummaryOpen }: ArticleCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <article className="timeline-item bg-cream-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gold-200">
      {/* Image Container */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/30 transition-all duration-300" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-block bg-gradient-to-r from-primary-700 to-primary-600 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-md">
            {article.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        {/* Date */}
        <div className="flex items-center space-x-1 text-sm mb-3" style={{color: '#6b5548'}}>
          <Clock className="w-3.5 h-3.5" />
          <span>{formatDate(article.publishedDate)}</span>
        </div>

        {/* Title */}
        <h2 className="text-lg sm:text-xl font-semibold mb-4 line-clamp-2 group-hover:text-accent-700 transition-colors duration-200" style={{color: '#2c1810'}}>
          {article.title}
        </h2>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onSummaryOpen(article)}
            className="flex-1 bg-gradient-to-r from-primary-700 to-primary-600 hover:from-primary-800 hover:to-primary-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm shadow-md"
          >
            Read Summary
          </button>

          <a
            href={article.guardianUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 border-2 border-gold-300 hover:border-accent-500 hover:bg-accent-50 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm"
            style={{color: '#4a3428'}}
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