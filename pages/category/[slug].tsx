// pages/category/[slug].tsx - Updated with NextSeo and Thumbnails

import { GetServerSideProps } from 'next'
import { NextSeo } from 'next-seo'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { contentManager } from '../../lib/services/contentManager'
import { ArrowLeft, Clock, ArrowRight, Search, Filter, Grid, List, Eye } from 'lucide-react'
import { useState } from 'react'
import { format } from 'date-fns'
import Layout from '../../components/Layout'

interface Article {
  slug: string
  title: string
  category: string
  publishedAt: string
  thumbnail?: string
  tldr: string[]
  content: string
  section?: string
}

interface CategoryPageProps {
  category: string
  articles: Article[]
  totalCount: number
  relatedCategories: string[]
}

export default function CategoryPage({ category, articles, totalCount, relatedCategories }: CategoryPageProps) {
  const router = useRouter()
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredArticles = articles
    .filter(article => 
      searchTerm === '' || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime()
      const dateB = new Date(b.publishedAt).getTime()
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB
    })

  const latestArticle = articles[0]
  
  const SEO = {
    title: `${category} News - Latest ${category} Stories | Padho.net`,
    description: `Latest ${category} news and stories from India. Stay updated with simplified summaries. ${totalCount} stories available in ${category} category.`,
    canonical: `https://padho.net/category/${encodeURIComponent(category.toLowerCase())}`,
    openGraph: {
      title: `${category} News - Latest ${category} Stories | Padho.net`,
      description: `Latest ${category} news and stories from India. Stay updated with simplified summaries. ${totalCount} stories available.`,
      url: `https://padho.net/category/${encodeURIComponent(category.toLowerCase())}`,
      type: 'website',
      images: latestArticle ? [
        {
          url: latestArticle.thumbnail || `https://padho.net/api/og-image?title=${encodeURIComponent(latestArticle.title)}&category=${encodeURIComponent(category)}`,
          width: 1200,
          height: 630,
          alt: `${category} News - ${latestArticle.title}`,
        }
      ] : [
        {
          url: `https://padho.net/api/og-image?title=${encodeURIComponent(`${category} News`)}&category=${encodeURIComponent(category)}`,
          width: 1200,
          height: 630,
          alt: `${category} News from Padho.net`,
        }
      ],
    },
    additionalMetaTags: [
      {
        name: 'keywords',
        content: `${category} news, India ${category.toLowerCase()}, latest ${category.toLowerCase()} news, ${category.toLowerCase()} updates, Indian ${category.toLowerCase()}`
      }
    ]
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category} News`,
    description: `Latest ${category} news and stories from India`,
    url: `https://padho.net/category/${encodeURIComponent(category.toLowerCase())}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: totalCount,
      itemListElement: articles.slice(0, 10).map((article, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'NewsArticle',
          headline: article.title,
          url: `https://padho.net/story/${article.slug}`,
          datePublished: article.publishedAt,
          articleSection: category
        }
      }))
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://padho.net'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Categories',
          item: 'https://padho.net/categories'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: category,
          item: `https://padho.net/category/${encodeURIComponent(category.toLowerCase())}`
        }
      ]
    }
  }

  return (
    <>
      <NextSeo {...SEO} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <Layout>
        <div className="min-h-screen bg-white">
          {/* Breadcrumb */}
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <nav className="flex items-center space-x-2 text-sm">
                <Link href="/" className="text-gray-500 hover:text-orange-600">
                  Home
                </Link>
                <span className="text-gray-400">/</span>
                <Link href="/categories" className="text-gray-500 hover:text-orange-600">
                  Categories
                </Link>
                <span className="text-gray-400">/</span>
                <span className="text-orange-600 font-medium">{category}</span>
              </nav>
            </div>
          </div>

          {/* Hero Section */}
          <section className="bg-gradient-to-b from-orange-50 via-white to-green-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center mb-6">
                <button 
                  onClick={() => router.back()}
                  className="mr-4 p-2 text-gray-600 hover:text-orange-600 hover:bg-white rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                    <span className="text-orange-600">{category}</span> Stories
                  </h1>
                  {/* <p className="text-xl text-gray-600">
                    {totalCount} {totalCount === 1 ? 'story' : 'stories'} in this category
                  </p> */}
                </div>
              </div>
            </div>
          </section>

          {/* Filters and Search */}
          <section className="py-6 bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search within category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                {/* Filters and View Options */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                    </select>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-orange-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-orange-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Results count */}
              {/* <div className="mt-4 text-sm text-gray-600">
                Showing {filteredArticles.length} of {totalCount} stories
                {searchTerm && ` for "${searchTerm}"`}
              </div> */}
            </div>
          </section>

          {/* Articles Grid */}
          <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {filteredArticles.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No stories found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm ? 'Try adjusting your search term' : 'No stories available in this category yet'}
                  </p>
                  <Link 
                    href="/categories"
                    className="text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Browse Other Categories →
                  </Link>
                </div>
              ) : (
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                  : 'space-y-6'
                }>
                  {filteredArticles.map((article, index) => (
                    <article 
                      key={article.slug} 
                      className={viewMode === 'grid' 
                        ? 'bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100'
                        : 'flex items-start space-x-4 p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
                      }
                    >
                      {viewMode === 'grid' ? (
                        <Link 
                              href={`/story/${article.slug}`}>
                          {/* Thumbnail with 5:4 aspect ratio */}
                          <div className="relative w-full aspect-[5/4] bg-gray-200">
                            {article.thumbnail ? (
                              <Image
                                src={article.thumbnail}
                                alt={article.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-green-100 flex items-center justify-center">
                                <div className="text-center">
                                  <Eye className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                  <span className="text-gray-500 text-sm">{article.category}</span>
                                </div>
                              </div>
                            )}
                            {/* Position badge overlay */}
                            {/* <div className="absolute top-3 left-3">
                              <span className="bg-orange-600 text-white text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm bg-opacity-90">
                                #{index + 1}
                              </span>
                            </div> */}
                            {/* Date badge overlay */}
                            <div className="absolute top-3 right-3">
                              <span className="bg-black bg-opacity-50 text-white text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {format(new Date(article.publishedAt), 'MMM dd')}
                              </span>
                            </div>
                          </div>

                          <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-3">
                              {article.title}
                            </h3>
                            
                            <div className="mb-4">
                              <p className="text-sm font-medium text-gray-700 mb-2">Key Points:</p>
                              <ul className="space-y-2">
                                {article.tldr.map((point, pointIndex) => (
                                  <li key={pointIndex} className="text-sm text-gray-600 flex items-start">
                                    <span className="text-green-500 mr-2 mt-1 font-bold">•</span>
                                    <span className="line-clamp-2">{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <p
                              className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
                            >
                              Read Full Story
                              <ArrowRight className="ml-1 w-4 h-4" />
                            </p>
                          </div>
                        </Link>
                      ) : (
                        <>
                          {/* List view with thumbnail */}
                          {/* <div className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div> */}
                          <div className="flex-shrink-0 w-24 h-20 rounded-lg overflow-hidden bg-gray-200">
                            {article.thumbnail ? (
                              <Image
                                src={article.thumbnail}
                                alt={article.title}
                                width={96}
                                height={80}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-green-100 flex items-center justify-center">
                                <Eye className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="text-gray-500 text-sm">
                                {format(new Date(article.publishedAt), 'MMM dd, yyyy')}
                              </span>
                              {/* {article.section && (
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                                  {article.section}
                                </span>
                              )} */}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {article.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {article.content.substring(0, 200)}...
                            </p>
                            <Link 
                              href={`/story/${article.slug}`}
                              className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                            >
                              Read More →
                            </Link>
                          </div>
                        </>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Related Categories */}
          {relatedCategories.length > 0 && (
            <section className="py-12 bg-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore Other Categories</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {relatedCategories.map((relatedCategory) => (
                    <Link
                      key={relatedCategory}
                      href={`/category/${encodeURIComponent(relatedCategory.toLowerCase())}`}
                      className="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow duration-300 border border-gray-200 group"
                    >
                      <div className="w-8 h-8 bg-gradient-to-b from-orange-500 via-white to-green-500 rounded-lg mx-auto mb-2 flex items-center justify-center border border-gray-300">
                        <span className="text-gray-700 text-sm font-bold">
                          {relatedCategory.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <h3 className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors text-sm">
                        {relatedCategory}
                      </h3>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Call to Action */}
          <section className="py-16 bg-gradient-to-b from-orange-50 via-white to-green-50">
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Stay Updated with More Stories
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Discover more categories and never miss important news that matters to you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/categories"
                  className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors inline-flex items-center justify-center"
                >
                  Browse All Categories
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link 
                  href="/"
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center justify-center"
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

    // Convert slug back to category name
    const category = decodeURIComponent(slug).split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')

    // Get all published articles
    const allArticles = await contentManager.getPublishedArticles();
    
    // Filter articles for this category (case insensitive)
    const articles = allArticles.filter(article => 
      article.category.toLowerCase() === category.toLowerCase()
    );

    if (articles.length === 0) {
      return { notFound: true }
    }

    // Get all unique categories for related categories (excluding current)
    const allCategories = await contentManager.getAllCategories();
    const relatedCategories = allCategories
      .filter(cat => cat.category.toLowerCase() !== category.toLowerCase())
      .slice(0, 8) // Take top 8
      .map(cat => cat.category);

    return {
      props: {
        category: articles[0].category, // Use the actual case from the article
        articles,
        totalCount: articles.length,
        relatedCategories
      }
    }
  } catch (error) {
    console.error('Error fetching category data:', error)
    return { notFound: true }
  }
}