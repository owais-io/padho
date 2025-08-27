// pages/categories.tsx - Updated with NextSeo and Thumbnails

import { GetServerSideProps } from 'next'
import { NextSeo } from 'next-seo'
import Link from 'next/link'
import Image from 'next/image'
import { contentManager } from '../lib/services/contentManager'
import { ArrowRight, Search, Grid, List, Clock, TrendingUp, Eye } from 'lucide-react'
import { useState } from 'react'
import { format } from 'date-fns'
import Layout from '../components/Layout'

interface Article {
  slug: string
  title: string
  category: string
  publishedAt: string
  thumbnail?: string
  tldr: string[]
  content: string
}

interface Category {
  category: string
  count: number
  articles: Article[]
}

interface CategoriesPageProps {
  categories: Category[]
  allArticles: Article[]
  totalArticles: number
}

export default function CategoriesPage({ categories, allArticles, totalArticles }: CategoriesPageProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredArticles = allArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || 
                           article.category.toLowerCase() === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  const filteredCategories = categories.filter(cat =>
    cat.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const SEO = {
    title: 'Categories - Explore News by Topic | Padho.net',
    description: `Explore news stories by category. Find the topics that interest you most - ${categories.slice(0, 5).map(c => c.category).join(', ')} and more.`,
    canonical: 'https://padho.net/categories',
    openGraph: {
      title: 'Categories - Explore News by Topic | Padho.net',
      description: `Explore news stories by category. Find the topics that interest you most - ${categories.slice(0, 5).map(c => c.category).join(', ')} and more.`,
      url: 'https://padho.net/categories',
      type: 'website',
    },
    additionalMetaTags: [
      {
        name: 'keywords',
        content: `news categories, India news topics, ${categories.map(c => c.category.toLowerCase()).join(', ')}`
      }
    ]
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'News Categories',
    description: 'Explore news stories by category',
    url: 'https://padho.net/categories',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: categories.length,
      itemListElement: categories.map((category, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Thing',
          name: category.category,
          url: `https://padho.net/category/${encodeURIComponent(category.category.toLowerCase())}`
        }
      }))
    }
  }

  return (
    <>
      <NextSeo {...SEO} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <Layout categories={categories}>
        <div className="min-h-screen bg-white">
          {/* Hero Section */}
          <section className="bg-gradient-to-b from-orange-50 via-white to-green-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Explore <span className="text-orange-600">Categories</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                  Discover stories that matter to you. Browse through different categories or search for specific topics.
                </p>
                {/* <div className="flex items-center justify-center text-gray-600">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  <span>{totalArticles} Stories across {categories.length} Categories</span>
                </div> */}
              </div>
            </div>
          </section>

          {/* Search and Filters */}
          <section className="py-8 bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search categories or stories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex items-center space-x-4">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.category} value={cat.category.toLowerCase()}>
                        {cat.category} ({cat.count})
                      </option>
                    ))}
                  </select>

                  {/* View Mode Toggle */}
                  {/* <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-orange-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-orange-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          </section>

          {/* Categories Grid */}
          {selectedCategory === 'all' && !searchTerm && (
            <section className="py-12 bg-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse by Category</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCategories.map((category) => (
                    <Link
                      key={category.category}
                      href={`/category/${encodeURIComponent(category.category.toLowerCase())}`}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200 group"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                            {category.category}
                          </h3>
                          {/* <span className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">
                            {category.count}
                          </span> */}
                        </div>
                        
                        <div className="space-y-3">
                          {category.articles.slice(0, 2).map((article) => (
                            <div key={article.slug} className="flex items-start space-x-3 border-l-3 border-green-500 pl-3">
                              {/* Small thumbnail */}
                              <div className="flex-shrink-0 w-12 h-10 rounded overflow-hidden bg-gray-200">
                                {article.thumbnail ? (
                                  <Image
                                    src={article.thumbnail}
                                    alt={article.title}
                                    width={48}
                                    height={40}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-orange-100 to-green-100 flex items-center justify-center">
                                    <Eye className="w-4 h-4 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-800 text-sm line-clamp-2">
                                  {article.title}
                                </h4>
                                <p className="text-xs text-gray-500 mt-1">
                                  {format(new Date(article.publishedAt), 'MMM dd, yyyy')}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-4 flex items-center text-orange-600 font-medium">
                          View All Stories
                          <ArrowRight className="ml-1 w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Articles Section */}
          {(selectedCategory !== 'all' || searchTerm) && (
            <section className="py-12 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {searchTerm ? `Search Results` : `${selectedCategory} Stories`}
                    <span className="text-gray-500 text-lg ml-2">({filteredArticles.length})</span>
                  </h2>
                </div>

                {filteredArticles.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No stories found</h3>
                    <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                  </div>
                ) : (
                  <div className={viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                    : 'space-y-6'
                  }>
                    {filteredArticles.map((article) => (
                      <article 
                        key={article.slug} 
                        className={viewMode === 'grid' 
                          ? 'bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100'
                          : 'flex items-start space-x-4 p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
                        }
                      >
                        {viewMode === 'grid' ? (
                          <>
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
                              {/* Category badge overlay */}
                              <div className="absolute top-3 left-3">
                                <span className="bg-orange-600 text-white text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm bg-opacity-90">
                                  {article.category}
                                </span>
                              </div>
                              {/* Date badge overlay */}
                              <div className="absolute top-3 right-3">
                                <span className="bg-black bg-opacity-50 text-white text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {format(new Date(article.publishedAt), 'MMM dd')}
                                </span>
                              </div>
                            </div>

                            <div className="p-6">
                              <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-3">
                                {article.title}
                              </h3>
                              
                              <div className="mb-4">
                                {article.tldr ? (
                                  <>
                                    <p className="text-sm font-medium text-gray-700 mb-2">Key Points:</p>
                                    <ul className="space-y-1">
                                      {article.tldr.slice(0, 2).map((point, index) => (
                                        <li key={index} className="text-sm text-gray-600 flex items-start">
                                          <span className="text-green-500 mr-2 mt-1">•</span>
                                          <span className="line-clamp-2">{point}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </>
                                ) : (
                                  <p className="text-sm text-gray-600 line-clamp-3">
                                    {article.description}
                                  </p>
                                )}
                              </div>

                              <Link 
                                href={`/story/${article.slug}`}
                                className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
                              >
                                Read Full Story
                                <ArrowRight className="ml-1 w-4 h-4" />
                              </Link>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* List view with thumbnail */}
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
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                                  {article.category}
                                </span>
                                <span className="text-gray-500 text-sm">
                                  {format(new Date(article.publishedAt), 'MMM dd, yyyy')}
                                </span>
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {article.title}
                              </h3>
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {article.content.substring(0, 150)}...
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
          )}

          {/* Call to Action */}
          {selectedCategory === 'all' && !searchTerm && (
            <section className="py-16 bg-gradient-to-b from-orange-50 via-white to-green-50">
              <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Stay Updated with the Latest Stories
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Don't miss out on important news. Explore our latest stories and stay informed.
                </p>
                <Link 
                  href="/"
                  className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors inline-flex items-center"
                >
                  Back to Homepage
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </section>
          )}
        </div>
      </Layout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Get all published articles
    const allArticles = await contentManager.getPublishedArticles();

    // Group articles by category
    const categoryMap = new Map<string, Article[]>();
    
    allArticles.forEach(article => {
      if (!categoryMap.has(article.category)) {
        categoryMap.set(article.category, []);
      }
      categoryMap.get(article.category)!.push(article);
    });

    // Create categories with sample articles
    const categoriesWithArticles = Array.from(categoryMap.entries())
      .map(([category, articles]) => ({
        category,
        count: articles.length,
        articles: articles.slice(0, 3) // Take first 3 for preview
      }))
      .sort((a, b) => b.count - a.count); // Sort by count descending

    return {
      props: {
        categories: categoriesWithArticles,
        allArticles: allArticles,
        totalArticles: allArticles.length
      }
    }
  } catch (error) {
    console.error('Error fetching categories data:', error)
    return {
      props: {
        categories: [],
        allArticles: [],
        totalArticles: 0
      }
    }
  }
}