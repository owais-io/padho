import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth/next'
import { signOut, useSession } from 'next-auth/react'
import { authOptions } from '../../lib/auth'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { format } from 'date-fns'
import toast, { Toaster } from 'react-hot-toast'
import { 
  Calendar, Database, FileText, TrendingUp, LogOut, Play, BarChart3, 
  Search, Eye, EyeOff, ExternalLink, Clock, Tag, Trash2, RotateCcw,
  ChevronLeft, ChevronRight
} from 'lucide-react'

interface Stats {
  totalArticles: number
  totalSummaries: number
  recentArticles: number
  publishedArticles: number
  hiddenArticles: number
  successRate: number
}

interface Article {
  id: string
  webTitle: string
  sectionName: string | null
  webPublicationDate: string
  webUrl: string
  thumbnail: string | null
  isDeleted: boolean
  deletedAt: string | null
  createdAt: string
  openAiSummary: {
    heading: string
    category: string
    tldr: string[]
    createdAt: string
  } | null
}

interface ArticlesResponse {
  articles: Article[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export default function AdminDashboard() {
  const { data: session } = useSession()
  const [fromDate, setFromDate] = useState(format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'))
  const [toDate, setToDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [isProcessing, setIsProcessing] = useState(false)
  const [stats, setStats] = useState<Stats | null>(null)
  const [articles, setArticles] = useState<Article[]>([])
  const [pagination, setPagination] = useState<ArticlesResponse['pagination'] | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [showDeleted, setShowDeleted] = useState(false)
  const [activeTab, setActiveTab] = useState<'process' | 'articles'>('process')

  useEffect(() => {
    fetchStats()
    fetchArticles()
  }, [currentPage, searchTerm, showDeleted])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchArticles = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        search: searchTerm,
        showDeleted: showDeleted.toString()
      })

      const response = await fetch(`/api/admin/articles?${params}`)
      if (response.ok) {
        const data: ArticlesResponse = await response.json()
        setArticles(data.articles)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching articles:', error)
    }
  }

  const handleProcessArticles = async () => {
    if (!fromDate || !toDate) {
      toast.error('Please select both from and to dates')
      return
    }

    if (new Date(fromDate) > new Date(toDate)) {
      toast.error('From date cannot be after to date')
      return
    }

    setIsProcessing(true)
    const loadingToast = toast.loading('Processing articles...')

    try {
      const response = await fetch('/api/admin/process-articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fromDate, toDate }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(`Successfully processed ${data.results.processed} articles!`, {
          id: loadingToast,
        })
        fetchStats()
        fetchArticles()
      } else {
        toast.error(data.error || 'Failed to process articles', {
          id: loadingToast,
        })
      }
    } catch (error) {
      toast.error('An error occurred while processing articles', {
        id: loadingToast,
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const toggleArticleStatus = async (articleId: string) => {
    try {
      const response = await fetch(`/api/admin/articles/${articleId}/toggle-delete`, {
        method: 'PATCH',
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message)
        fetchStats()
        fetchArticles()
      } else {
        toast.error(data.error || 'Failed to update article status')
      }
    } catch (error) {
      toast.error('An error occurred while updating article status')
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchArticles()
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - Padho.net</title>
      </Head>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Padho.net Admin</h1>
                <p className="text-gray-600">News Article Processing Dashboard</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <img
                    className="w-8 h-8 rounded-full"
                    src={session?.user?.image || ''}
                    alt={session?.user?.name || ''}
                  />
                  <span className="text-sm text-gray-700">{session?.user?.name}</span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FileText className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Articles</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.totalArticles}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Eye className="h-6 w-6 text-green-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Published</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.publishedArticles}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <EyeOff className="h-6 w-6 text-red-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Hidden</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.hiddenArticles}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <TrendingUp className="h-6 w-6 text-blue-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Recent (24h)</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.recentArticles}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <BarChart3 className="h-6 w-6 text-purple-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Success Rate</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.successRate.toFixed(1)}%</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('process')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'process'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Process Articles
                </button>
                <button
                  onClick={() => setActiveTab('articles')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'articles'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <FileText className="w-4 h-4 inline mr-2" />
                  Manage Articles ({stats?.totalArticles || 0})
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'process' ? (
            /* Article Processing Section */
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Process Articles
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Fetch articles from Guardian API and process them with OpenAI
                </p>
              </div>
              <div className="px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700">
                      From Date
                    </label>
                    <input
                      type="date"
                      id="fromDate"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      disabled={isProcessing}
                    />
                  </div>
                  <div>
                    <label htmlFor="toDate" className="block text-sm font-medium text-gray-700">
                      To Date
                    </label>
                    <input
                      type="date"
                      id="toDate"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      disabled={isProcessing}
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleProcessArticles}
                      disabled={isProcessing}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Process Articles
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Processing Information
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Only articles with "India" in the title will be fetched</li>
                          <li>Duplicate articles will be automatically skipped</li>
                          <li>Each article will be summarized using OpenAI GPT-4o</li>
                          <li>Processing may take several minutes depending on the number of articles</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Articles Management Section */
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Manage Articles
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      View, search, and manage article visibility
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={showDeleted}
                        onChange={(e) => setShowDeleted(e.target.checked)}
                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm text-gray-600">Show hidden articles</span>
                    </label>
                  </div>
                </div>

                {/* Search */}
                <div className="mt-4">
                  <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search articles by title, heading, or section..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Search
                    </button>
                  </form>
                </div>
              </div>

              {/* Articles List */}
              <div className="divide-y divide-gray-200">
                {articles.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p>No articles found</p>
                  </div>
                ) : (
                  articles.map((article) => (
                    <div key={article.id} className={`p-6 ${article.isDeleted ? 'bg-red-50' : 'bg-white'}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            {article.isDeleted && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <EyeOff className="w-3 h-3 mr-1" />
                                Hidden
                              </span>
                            )}
                            {article.openAiSummary && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                AI Processed
                              </span>
                            )}
                            {article.sectionName && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <Tag className="w-3 h-3 mr-1" />
                                {article.sectionName}
                              </span>
                            )}
                          </div>
                          
                          <h3 className="text-lg font-medium text-gray-900 mb-1">
                            {article.openAiSummary?.heading || article.webTitle}
                          </h3>
                          
                          <p className="text-sm text-gray-600 mb-2">
                            Original: {article.webTitle}
                          </p>

                          {article.openAiSummary?.tldr && (
                            <div className="mb-3">
                              <p className="text-sm font-medium text-gray-700 mb-1">Key Points:</p>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {article.openAiSummary.tldr.map((point, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="text-gray-400 mr-2">•</span>
                                    {point}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {format(new Date(article.webPublicationDate), 'MMM dd, yyyy')}
                            </span>
                            {article.openAiSummary && (
                              <span className="flex items-center">
                                <Database className="w-4 h-4 mr-1" />
                                {article.openAiSummary.category}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 ml-4">
                          <a
                            href={article.webUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-900"
                            title="View original article"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                          
                          <button
                            onClick={() => toggleArticleStatus(article.id)}
                            className={`p-2 rounded-md ${
                              article.isDeleted
                                ? 'text-green-600 hover:bg-green-50'
                                : 'text-red-600 hover:bg-red-50'
                            }`}
                            title={article.isDeleted ? 'Restore to website' : 'Hide from website'}
                          >
                            {article.isDeleted ? (
                              <RotateCcw className="w-5 h-5" />
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing page {pagination.page} of {pagination.totalPages} 
                    ({pagination.total} total articles)
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={!pagination.hasPrev}
                      className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-1 text-sm">
                      {pagination.page}
                    </span>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={!pagination.hasNext}
                      className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    }
  }

  return {
    props: {
      session,
    },
  }
}