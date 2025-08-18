import Head from 'next/head'
import Link from 'next/link'
import { ReactNode } from 'react'
import { Share2, ExternalLink } from 'lucide-react'

interface LayoutProps {
  children: ReactNode
  title?: string
  description?: string
  showShareButton?: boolean
  shareUrl?: string
  shareTitle?: string
  shareText?: string
  originalUrl?: string
  categories?: { category: string; count?: number }[]
}

export default function Layout({ 
  children, 
  title = "Padho.net - India's Premier News Platform", 
  description = "Stay updated with the latest news from India. Read simplified, AI-powered summaries of important stories.",
  showShareButton = false,
  shareUrl,
  shareTitle,
  shareText,
  originalUrl,
  categories = []
}: LayoutProps) {

  const handleShare = async () => {
    if (navigator.share && shareUrl) {
      try {
        await navigator.share({
          title: shareTitle || title,
          text: shareText || description,
          url: shareUrl,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else if (shareUrl) {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        
        {/* Favicon */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="shortcut icon" href="/favicon.ico" />
        
        {/* Additional meta tags */}
        <meta name="theme-color" content="#ff7700" />
        <meta name="msapplication-TileColor" content="#ff7700" />
        
        {/* Open Graph tags for better sharing */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        {shareUrl && <meta property="og:url" content={shareUrl} />}
      </Head>

      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="flex items-center">
                  <div className="w-6 h-8 bg-gradient-to-b from-orange-500 via-white to-green-500 rounded border border-gray-300"></div>
                  <span className="ml-3 text-2xl">
                    <span className="font-extrabold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">padho</span>
                    <span className="font-normal text-gray-700">.net</span>
                  </span>
                </div>
              </Link>
              
              <nav className="hidden md:flex space-x-8">
                <Link href="/" className="text-gray-700 hover:text-orange-600 font-medium">
                  Home
                </Link>
                <Link href="/categories" className="text-gray-700 hover:text-orange-600 font-medium">
                  Categories
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-orange-600 font-medium">
                  About
                </Link>
              </nav>

              <div className="flex items-center space-x-4">
                {showShareButton && (
                  <button
                    onClick={handleShare}
                    className="p-2 text-gray-600 hover:text-orange-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Share this story"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                )}
                <div className="md:hidden">
                  <button className="text-gray-700 hover:text-orange-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-6 h-8 bg-gradient-to-b from-orange-500 via-white to-green-500 rounded border border-gray-400"></div>
                  <span className="text-2xl">
                    <span className="font-extrabold bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">padho</span>
                    <span className="font-normal text-gray-300">.net</span>
                  </span>
                </div>
                <p className="text-gray-300 mb-4">
                  Your trusted source for simplified, AI-powered news summaries. 
                  Stay informed about India and the world with clear, concise reporting.
                </p>
                {categories.length > 0 && (
                  <div className="flex space-x-4">
                    <span className="text-orange-400 font-semibold">{categories.reduce((acc, cat) => acc + (cat.count || 0), 0)}+</span>
                    <span className="text-gray-300">Stories Published</span>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link href="/" className="text-gray-300 hover:text-orange-400">Home</Link></li>
                  <li><Link href="/categories" className="text-gray-300 hover:text-orange-400">Categories</Link></li>
                  <li><Link href="/about" className="text-gray-300 hover:text-orange-400">About</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {showShareButton ? 'Share & Links' : 'Top Categories'}
                </h3>
                {showShareButton ? (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleShare}
                      className="text-gray-300 hover:text-orange-400 transition-colors"
                      title="Share this story"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                    {originalUrl && (
                      <a
                        href={originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-green-400 transition-colors"
                        title="View original article"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {categories.slice(0, 4).map((cat) => (
                      <li key={cat.category}>
                        <Link 
                          href={`/category/${encodeURIComponent(cat.category.toLowerCase())}`}
                          className="text-gray-300 hover:text-green-400"
                        >
                          {cat.category}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 Padho.net. All rights reserved. Made with ❤️ for India.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}