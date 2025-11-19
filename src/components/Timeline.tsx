'use client';

import { useState } from 'react';
import ArticleCard from './ArticleCard';
import SummaryModal from './SummaryModal';
import LoadMoreButton from './LoadMoreButton';
import { Article } from '@/lib/types';

interface TimelineProps {
  articles: Article[];
  title?: string;
}

export default function Timeline({ articles, title }: TimelineProps) {
  const [displayedArticles, setDisplayedArticles] = useState<Article[]>(articles.slice(0, 10));
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSummaryOpen = (article: Article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  const handleLoadMore = () => {
    setLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      const currentCount = displayedArticles.length;
      const nextArticles = articles.slice(currentCount, currentCount + 10);
      setDisplayedArticles([...displayedArticles, ...nextArticles]);
      setLoading(false);
    }, 1000);
  };

  const hasMore = displayedArticles.length < articles.length;

  return (
    <div className="w-full">
      {title && (
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {title}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-accent-600 mx-auto rounded-full"></div>
        </div>
      )}

      {displayedArticles.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles found</h3>
          <p className="text-gray-500">Check back later for new content in this category.</p>
        </div>
      ) : (
        <>
          <div className="timeline-zigzag px-4 sm:px-6 lg:px-8">
            {displayedArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onSummaryOpen={handleSummaryOpen}
              />
            ))}
          </div>

          <LoadMoreButton
            onLoadMore={handleLoadMore}
            loading={loading}
            hasMore={hasMore}
          />
        </>
      )}

      <SummaryModal
        article={selectedArticle}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
}