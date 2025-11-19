'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { getTopCategories, getRemainingCategories } from '@/data/dummyData';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const topCategories = getTopCategories();
  const remainingCategories = getRemainingCategories();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.65 9 11.09 5.16-1.44 9-5.54 9-11.09V7l-10-5z"/>
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-700 to-accent-600 bg-clip-text text-transparent">
              padho.net
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium"
            >
              Home
            </Link>
            
            {topCategories.map((category) => (
              <Link 
                key={category.id}
                href={`/category/${category.slug}`}
                className="text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium"
              >
                {category.name}
              </Link>
            ))}
            
            {/* View More Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium"
              >
                <span>View More</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                  {remainingCategories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.slug}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                  <Link
                    href="/categories"
                    className="block px-4 py-2 text-primary-600 font-medium hover:bg-primary-50 transition-colors duration-200 border-t border-gray-100 mt-2"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    All Categories
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-3">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              
              {topCategories.map((category) => (
                <Link 
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              
              <Link
                href="/categories"
                className="text-primary-600 font-medium hover:text-primary-700 transition-colors duration-200 py-2 border-t border-gray-100 mt-2 pt-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                All Categories
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}