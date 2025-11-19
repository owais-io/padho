'use client';

import { RefreshCw } from 'lucide-react';
import { LoadMoreButtonProps } from '@/lib/types';

export default function LoadMoreButton({ onLoadMore, loading, hasMore }: LoadMoreButtonProps) {
  if (!hasMore) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No more articles to load</p>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <button
        onClick={onLoadMore}
        disabled={loading}
        className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
      >
        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        <span>{loading ? 'Loading...' : 'Load More Articles'}</span>
      </button>
    </div>
  );
}