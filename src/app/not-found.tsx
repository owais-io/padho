import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* 404 Illustration */}
        <div className="mx-auto w-32 h-32 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center">
          <div className="text-6xl font-bold text-primary-600">404</div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Page Not Found</h1>
          <p className="text-gray-600 leading-relaxed">
            Sorry, we couldn't find the page you're looking for. 
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            <Home className="w-5 h-5" />
            <span>Go to Homepage</span>
          </Link>
          
          <Link
            href="/categories"
            className="w-full inline-flex items-center justify-center space-x-2 border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            <Search className="w-5 h-5" />
            <span>Browse Categories</span>
          </Link>
        </div>

        {/* Help Text */}
        <div className="text-sm text-gray-500">
          <p>Need help? The page you're looking for might be in one of our categories.</p>
        </div>
      </div>
    </div>
  );
}