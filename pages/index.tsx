// pages/index.tsx - Updated with Category Thumbnails

import { GetServerSideProps } from 'next'
import { NextSeo } from 'next-seo'
import Link from 'next/link'
import Image from 'next/image'
import { contentManager } from '../lib/services/contentManager'
import { Clock, ArrowRight, TrendingUp, Eye } from 'lucide-react'
import { format } from 'date-fns'
import Layout from '../components/Layout'

interface Article {
  slug: string
  title: string
  category: string
  publishedAt: string
  originalUrl: string
  thumbnail?: string
  tldr?: string[]
  description?: string
  content: string
}

interface CategoryWithThumbnails {
  category: string
  count: number
  sampleThumbnails: string[]
}

interface HomePageProps {
  featuredArticles: Article[]
  latestArticles: Article[]
  categories: CategoryWithThumbnails[]
  totalArticles: number
}

export default function HomePage({ featuredArticles, latestArticles, categories, totalArticles }: HomePageProps) {
  const SEO = {
    title: 'Padho.net - India\'s Premier News Platform | Latest News Summaries',
    description: 'Stay updated with the latest news from India. Read simplified, AI-powered summaries of important stories. Get the facts without the noise.',
    canonical: 'https://padho.net',
    openGraph: {
      title: 'Padho.net - India\'s Premier News Platform | Latest News Summaries',
      description: 'Stay updated with the latest news from India. Read simplified, AI-powered summaries of important stories. Get the facts without the noise.',
      url: 'https://padho.net',
      type: 'website',
      images: [
        {
          url: 'https://padho.net/og-homepage.jpg',
          width: 1200,
          height: 630,
          alt: 'Padho.net Homepage - Latest News from India',
        }
      ],
    },
    additionalMetaTags: [
      {
        name: 'keywords',
        content: 'India news, news summaries, AI news, current affairs, latest news, Hindi news, Indian politics, sports news India'
      }
    ]
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Padho.net',
    url: 'https://padho.net',
    description: 'India\'s Premier News Platform - Simplified AI-powered news summaries',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://padho.net/categories?search={search_term_string}',
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Padho.net',
      logo: {
        '@type': 'ImageObject',
        url: 'https://padho.net/android-chrome-512x512.png'
      }
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
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                  Stay <span className="text-orange-600">Informed</span>, Stay <span className="text-green-600">Ahead</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                  Discover India's most important stories, simplified and summarized for the modern reader. 
                  Get the facts without the noise.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/categories"
                    className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center"
                  >
                    Explore Stories
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Stories */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-bold text-gray-900">Featured Stories</h2>
                <Link 
                  href="/categories" 
                  className="text-orange-600 hover:text-orange-700 font-medium flex items-center"
                >
                  View All
                  <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredArticles.map((article) => (
                  <Link 
                        href={`/story/${article.slug}`}><article key={article.slug} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
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
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
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

                      <p className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
                      >
                        Read Full Story
                        <ArrowRight className="ml-1 w-4 h-4" />
                      </p>
                    </div>
                  </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Categories Grid */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore by Category</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Discover stories that matter to you across different categories
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.map((cat) => (
                  <Link
                    key={cat.category}
                    href={`/category/${encodeURIComponent(cat.category.toLowerCase())}`}
                    className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-300 border border-gray-200 group"
                  >
                    {/* Category Thumbnails */}
                    <div className="w-16 h-16 mx-auto mb-4 rounded-lg overflow-hidden bg-gray-100">
                      {cat.sampleThumbnails.length > 0 ? (
                        <div className="w-full h-full relative">
                          {cat.sampleThumbnails.length === 1 ? (
                            // Single thumbnail
                            <Image
                              src={cat.sampleThumbnails[0]}
                              alt={`${cat.category} stories`}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          ) : cat.sampleThumbnails.length === 2 ? (
                            // Two thumbnails side by side
                            <div className="flex w-full h-full">
                              <div className="w-1/2 h-full relative">
                                <Image
                                  src={cat.sampleThumbnails[0]}
                                  alt={`${cat.category} stories`}
                                  width={32}
                                  height={64}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="w-1/2 h-full relative">
                                <Image
                                  src={cat.sampleThumbnails[1]}
                                  alt={`${cat.category} stories`}
                                  width={32}
                                  height={64}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          ) : (
                            // Three thumbnails in a grid
                            <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-0.5">
                              <div className="relative">
                                <Image
                                  src={cat.sampleThumbnails[0]}
                                  alt={`${cat.category} stories`}
                                  width={32}
                                  height={32}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="relative">
                                <Image
                                  src={cat.sampleThumbnails[1]}
                                  alt={`${cat.category} stories`}
                                  width={32}
                                  height={32}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="relative col-span-2">
                                <Image
                                  src={cat.sampleThumbnails[2]}
                                  alt={`${cat.category} stories`}
                                  width={64}
                                  height={32}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        // Fallback to original design when no thumbnails available
                        <div className="w-full h-full bg-gradient-to-b from-orange-500 via-white to-green-500 rounded-lg flex items-center justify-center border border-gray-300">
                          <Eye className="w-6 h-6 text-gray-700" />
                        </div>
                      )}
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                      {cat.category}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {cat.count} {cat.count === 1 ? 'Story' : 'Stories'}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Latest Stories */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-10">Latest Stories</h2>
              
              <div className="space-y-6">
                {latestArticles.map((article, index) => (
                  <div key={article.slug} className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    {/* Thumbnail for latest stories */}
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
                  </div>
                ))}
              </div>

              <div className="text-center mt-10">
                <Link 
                  href="/categories"
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  View All Stories
                </Link>
              </div>
            </div>
          </section>
        </div>
      </Layout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Get all published articles
    const allArticles = await contentManager.getPublishedArticles();

    // Get featured articles (first 6)
    const featuredArticles = allArticles.slice(0, 6);

    // Get latest articles (next 5, excluding featured)
    const latestArticles = allArticles.slice(6, 11);

    // Get categories with counts
    const categoriesMap = new Map<string, { count: number; sampleThumbnails: string[] }>();
    
    allArticles.forEach(article => {
      if (!categoriesMap.has(article.category)) {
        categoriesMap.set(article.category, { count: 0, sampleThumbnails: [] });
      }
      const categoryData = categoriesMap.get(article.category)!;
      categoryData.count++;
      
      // Collect sample thumbnails (max 3 per category)
      if (article.thumbnail && categoryData.sampleThumbnails.length < 3) {
        categoryData.sampleThumbnails.push(article.thumbnail);
      }
    });

    // Convert to array and sort by count
    const categoriesWithThumbnails = Array.from(categoriesMap.entries())
      .map(([category, data]) => ({
        category,
        count: data.count,
        sampleThumbnails: data.sampleThumbnails
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8); // Take top 8 categories

    return {
      props: {
        featuredArticles,
        latestArticles,
        categories: categoriesWithThumbnails,
        totalArticles: allArticles.length
      }
    }
  } catch (error) {
    console.error('Error fetching homepage data:', error)
    return {
      props: {
        featuredArticles: [],
        latestArticles: [],
        categories: [],
        totalArticles: 0
      }
    }
  }
}