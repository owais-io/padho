import Link from 'next/link';
import { Heart, Globe, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.65 9 11.09 5.16-1.44 9-5.54 9-11.09V7l-10-5z"/>
                </svg>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-700 to-accent-600 bg-clip-text text-transparent">
                padho.net
              </span>
            </Link>
            <p className="text-gray-600 max-w-md leading-relaxed mb-6">
              Your trusted source for curated news from The Guardian. Stay informed with 
              AI-powered summaries and discover stories that matter most to you.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-gray-500">
                <Globe className="w-4 h-4" />
                <span className="text-sm">Global Coverage</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-500">
                <Heart className="w-4 h-4" />
                <span className="text-sm">Made with Care</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  All Categories
                </Link>
              </li>
              <li>
                <Link href="/category/world" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  World News
                </Link>
              </li>
              <li>
                <Link href="/category/technology" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  Technology
                </Link>
              </li>
              <li>
                <Link href="/category/science" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  Science
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Connect</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="mailto:contact@padho.net" 
                  className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact Us</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://theguardian.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary-600 transition-colors duration-200"
                >
                  The Guardian
                </a>
              </li>
              <li>
                <button className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {currentYear} padho.net. All rights reserved. Content sourced from The Guardian.
          </p>
          <p className="text-gray-500 text-sm">
            Powered by AI-enhanced journalism
          </p>
        </div>
      </div>
    </footer>
  );
}