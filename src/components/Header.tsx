'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Github } from 'lucide-react';
import { Category } from '@/lib/types';

interface HeaderProps {
  topCategories: Category[];
  remainingCategories: Category[];
}

export default function Header({ topCategories, remainingCategories }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Split categories into two rows
  const midPoint = Math.ceil(topCategories.length / 2);
  const firstRowCategories = topCategories.slice(0, midPoint);
  const secondRowCategories = topCategories.slice(midPoint);

  return (
    <header className="sticky top-0 z-50 bg-cream-100/95 backdrop-blur-md border-b border-gold-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="bg-gradient-to-r from-primary-700 to-accent-600 p-2 rounded-lg shadow-md">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.65 9 11.09 5.16-1.44 9-5.54 9-11.09V7l-10-5z"/>
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-700 to-accent-700 bg-clip-text text-transparent">
              padho.net
            </span>
          </Link>

          {/* Desktop Navigation - Two Rows - Centered */}
          <nav className="hidden lg:flex flex-1 flex-col items-center space-y-1 mx-8">
            {/* First Row */}
            <div className="flex items-center justify-evenly w-full">
              <Link
                href="/"
                className="text-primary-900 hover:text-accent-600 transition-colors duration-200 font-medium text-sm"
              >
                Home
              </Link>
              {firstRowCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="text-primary-900 hover:text-accent-600 transition-colors duration-200 font-medium text-sm"
                >
                  {category.name}
                </Link>
              ))}
            </div>

            {/* Second Row */}
            <div className="flex items-center justify-evenly w-full">
              {secondRowCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="text-primary-900 hover:text-accent-600 transition-colors duration-200 font-medium text-sm"
                >
                  {category.name}
                </Link>
              ))}
              {/* View More Button - Opens in new tab */}
              {remainingCategories.length > 0 && (
                <a
                  href="/categories"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-600 hover:text-accent-800 transition-colors duration-200 font-semibold text-sm"
                >
                  View More →
                </a>
              )}
            </div>
          </nav>

          {/* GitHub Button */}
          <a
            href="https://github.com/owais-io/padho"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-primary-700 to-accent-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold flex-shrink-0"
          >
            <Github className="w-5 h-5" />
            <span>View Code on GitHub</span>
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-primary-900 hover:text-accent-600 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gold-200/50">
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-primary-900 hover:text-accent-600 transition-colors duration-200 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>

              {topCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="text-primary-900 hover:text-accent-600 transition-colors duration-200 font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}

              {/* View More Button - Opens in new tab */}
              {remainingCategories.length > 0 && (
                <a
                  href="/categories"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-700 font-semibold hover:text-accent-800 transition-colors duration-200 py-2 border-t border-gold-200/50 mt-2 pt-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  View More →
                </a>
              )}

              {/* GitHub Button Mobile */}
              <a
                href="https://github.com/owais-io/padho"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 px-5 py-3 bg-gradient-to-r from-primary-700 to-accent-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold mt-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Github className="w-5 h-5" />
                <span>View Code on GitHub</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}