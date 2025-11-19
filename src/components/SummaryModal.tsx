'use client';

import { useEffect } from 'react';
import { X, ExternalLink, Calendar, Tag } from 'lucide-react';
import Image from 'next/image';
import { Article } from '@/lib/types';

interface SummaryModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function SummaryModal({ article, isOpen, onClose }: SummaryModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !article) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="relative h-48 sm:h-64">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center space-x-1 bg-primary-600/90 backdrop-blur-sm text-white text-sm font-medium px-3 py-1.5 rounded-full">
                <Tag className="w-3.5 h-3.5" />
                <span>{article.category}</span>
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-12rem)]">
            {/* Date */}
            <div className="flex items-center space-x-2 text-gray-500 text-sm mb-4">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(article.publishedDate)}</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Summary */}
            <div className="prose prose-gray max-w-none mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Summary</h2>
              <p className="text-gray-700 leading-relaxed text-base">
                {article.summary}
              </p>
            </div>

            {/* Action */}
            <div className="border-t border-gray-200 pt-6">
              <a
                href={article.guardianUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 w-full sm:w-auto justify-center"
              >
                <ExternalLink className="w-5 h-5" />
                <span>Read Full Article on The Guardian</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}