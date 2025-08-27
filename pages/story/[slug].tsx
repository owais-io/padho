// pages/story/[slug].tsx - Fixed syntax error

import { GetServerSideProps } from 'next'
import { NextSeo, ArticleJsonLd } from 'next-seo'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { contentManager } from '../../lib/services/contentManager'
import { ArrowLeft, Clock, ExternalLink, Tag, Share2, BookOpen, MessageCircle, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { useState } from 'react'
import Layout from '../../components/Layout'

interface FAQ {
  question: string
  answer: string
}

interface Article {
  slug: string
  title: string
  category: string
  publishedAt: string
  originalUrl: string
  thumbnail?: string
  section?: string
  content: string
  tldr: string[]
  faqs: FAQ[]
}

interface RelatedArticle {
  slug: string
  title: string
  category: string
  publishedAt: string
  thumbnail?: string
}

interface StoryPageProps {
  article: Article
  relatedArticles: RelatedArticle[]
}

export default function StoryPage({ article, relatedArticles }: StoryPageProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'summary' | 'faqs'>('summary')
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.tldr[0],
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  const SEO = {
    title: `${article.title} | Padho.net`,
    description: article.tldr[0] || article.content.substring(0, 160),
    canonical: `https://padho.net/story/${article.slug}`,
    openGraph: {
      title: article.title,
      description: article.tldr[0] || article.content.substring(0, 160),
      url: `https://padho.net/story/${article.slug}`,
      type: 'article',
      article: {
        publishedTime: article.publishedAt,
        modifiedTime: article.publishedAt,
        authors: ['Padho.net Editorial Team'],
        section: article.category,
        tags: [article.category, 'India News', 'News Summary'],
      },
      images: [
        {
          url: article.thumbnail || `https://padho.net/api/og-image?title=${encodeURIComponent(article.title)}&category=${encodeURIComponent(article.category)}`,
          width: 1200,
          height: 630,
          alt: article.title,
        }
      ],
    },
    additionalMetaTags: [
      {
        name: 'keywords',
        content: `${article.category}, India news, ${article.title}, news summary`
      },
      {
        name: 'article:published_time',
        content: article.publishedAt
      },
      {
        name: 'article:modified_time',
        content: article.publishedAt
      }
    ]
  }

  return (
    <>
      <NextSeo {...SEO} />
      <ArticleJsonLd
        type="NewsArticle"
        url={`https://padho.net/story/${article.slug}`}
        title={article.title}
        images={[
          article.thumbnail || `https://padho.net/api/og-image?title=${encodeURIComponent(article.title)}&category=${encodeURIComponent(article.category)}`
        ]}
        datePublished={article.publishedAt}
        dateModified={article.publishedAt}
        authorName="Padho.net Editorial Team"
        publisherName="Padho.net"
        publisherLogo="https://padho.net/android-chrome-512x512.png"
        description={article.tldr[0] || article.content.substring(0, 160)}
      />
      
      <Layout>
        <div className="min-h-screen bg-white">
          {/* Breadcrumb */}
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <nav className="flex items-center space-x-2 text-sm">
                <Link href="/" className="text-gray-500 hover:text-orange-600">
                  Home
                </Link>
                <span className="text-gray-400">/</span>
                <Link href="/categories" className="text-gray-500 hover:text-orange-600">
                  Categories
                </Link>
                <span className="text-gray-400">/</span>
                <Link 
                  href={`/category/${encodeURIComponent(article.category.toLowerCase())}`}
                  className="text-gray-500 hover:text-orange-600"
                >
                  {article.category}
                </Link>
                <span className="text-gray-400">/</span>
                <span className="text-orange-600 font-medium">Story</span>
              </nav>
            </div>
          </div>

          {/* Back Button */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button 
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-orange-600 font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Previous Page
            </button>
          </div>

          {/* Article Content */}
          <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Hero Image */}
            {article.thumbnail && (
              <div className="relative w-full aspect-[5/4] mb-8 rounded-xl overflow-hidden bg-gray-200">
                <Image
                  src={article.thumbnail}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 896px"
                />
                {/* Overlay gradient for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                
                {/* Category badge overlay */}
                <div className="absolute top-4 left-4">
                  <span className="bg-orange-600 text-white text-sm font-medium px-3 py-1 rounded-full backdrop-blur-sm bg-opacity-90">
                    {article.category}
                  </span>
                </div>
                
                {/* Share button overlay */}
                <div className="absolute top-4 right-4">
                  <button
                    onClick={handleShare}
                    className="bg-black bg-opacity-50 text-white p-2 rounded-full backdrop-blur-sm hover:bg-opacity-70 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {!article.thumbnail && (
                  <span className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">
                    {article.category}
                  </span>
                )}
                {article.section && (
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full flex items-center">
                    <Tag className="w-3 h-3 mr-1" />
                    {article.section}
                  </span>
                )}
                <span className="text-gray-500 text-sm flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {format(new Date(article.publishedAt), 'MMMM dd, yyyy')}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {article.title}
              </h1>

              <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-b from-orange-50 via-white to-green-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-gray-600">
                    <BookOpen className="w-5 h-5 mr-2" />
                    <span className="text-sm">
                      {Math.ceil(article.content.length / 200)} min read
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    <span className="text-sm">{article.faqs.length} FAQs</span>
                  </div>
                </div>
                {/* <a
                  href={article.webUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center text-sm"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Read Original
                </a> */}
              </div>
            </header>

            {/* Key Points */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-2 h-6 bg-green-500 rounded mr-3"></span>
                TL;DR
              </h2>
              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                <ul className="space-y-3">
                  {article.tldr.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white text-sm font-bold rounded-full flex items-center justify-center mr-3 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-800 font-medium">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Tab Navigation */}
            <div className="mb-8">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('summary')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'summary'
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Full Summary
                  </button>
                  <button
                    onClick={() => setActiveTab('faqs')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'faqs'
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    FAQs ({article.faqs.length})
                  </button>
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'summary' ? (
              <section className="mb-12">
                <div className="prose prose-lg max-w-none">
                  <div className="text-gray-800 leading-relaxed space-y-4">
                    {article.content.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-lg leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </section>
            ) : (
              <section className="mb-12">
                <div className="space-y-4">
                  {article.faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                        className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center"
                      >
                        <h3 className="font-semibold text-gray-900 pr-4">{faq.question}</h3>
                        <svg
                          className={`w-5 h-5 text-gray-500 transform transition-transform ${
                            expandedFAQ === index ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {expandedFAQ === index && (
                        <div className="px-6 py-4 bg-white">
                          <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Source Attribution */}
            {/* <section className="mb-12 p-6 bg-gray-50 rounded-lg border-l-4 border-orange-500">
              <h3 className="font-semibold text-gray-900 mb-2">Source Information</h3>
              <p className="text-gray-700 mb-3">
                This summary is based on the original article: "{article.webTitle}"
              </p>
              <a
                href={article.webUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:text-orange-700 font-medium flex items-center"
              >
                Read the complete original article
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </section> */}
          </article>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="py-12 bg-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Stories</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedArticles.map((relatedArticle) => (
                    <Link
                      key={relatedArticle.slug}
                      href={`/story/${relatedArticle.slug}`}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200 group"
                    >
                      {/* Related article thumbnail */}
                      <div className="relative w-full aspect-[5/4] bg-gray-200">
                        {relatedArticle.thumbnail ? (
                          <Image
                            src={relatedArticle.thumbnail}
                            alt={relatedArticle.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                            <Eye className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                        {/* Category badge overlay */}
                        <div className="absolute top-3 left-3">
                          <span className="bg-green-600 text-white text-xs font-medium px-2 py-1 rounded backdrop-blur-sm bg-opacity-90">
                            {relatedArticle.category}
                          </span>
                        </div>
                        {/* Date badge overlay */}
                        <div className="absolute top-3 right-3">
                          <span className="bg-black bg-opacity-50 text-white text-xs font-medium px-2 py-1 rounded backdrop-blur-sm">
                            {format(new Date(relatedArticle.publishedAt), 'MMM dd')}
                          </span>
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-3">
                          {relatedArticle.title}
                        </h3>
                        <p className="text-orange-600 text-sm font-medium group-hover:text-orange-700">
                          Read Story →
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="text-center mt-8">
                  <Link 
                    href={`/category/${encodeURIComponent(article.category.toLowerCase())}`}
                    className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                  >
                    View More in {article.category}
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* Call to Action */}
          <section className="py-16 bg-gradient-to-b from-orange-50 via-white to-green-50">
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Discover More Stories
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Stay informed with our latest news summaries and insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/categories"
                  className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                >
                  Browse Categories
                </Link>
                <Link 
                  href="/"
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Back to Homepage
                </Link>
              </div>
            </div>
          </section>
        </div>
      </Layout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const slug = params?.slug as string
    if (!slug) {
      return { notFound: true }
    }

    // Find article by slug
    const article = await contentManager.getArticleBySlug(slug);

    if (!article) {
      return { notFound: true }
    }

    // Get related articles from the same category (excluding current article)
    const allArticles = await contentManager.getPublishedArticles();
    const relatedArticles = allArticles
      .filter(a => a.category === article.category && a.slug !== article.slug)
      .slice(0, 3); // Take first 3

    return {
      props: {
        article,
        relatedArticles
      }
    }
  } catch (error) {
    console.error('Error fetching story data:', error)
    return { notFound: true }
  }
}