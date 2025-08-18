import axios from 'axios'

export interface GuardianArticle {
  id: string
  type: string
  sectionId: string
  sectionName: string
  webPublicationDate: string
  webTitle: string
  webUrl: string
  apiUrl: string
  isHosted: boolean
  pillarId: string
  pillarName: string
  fields?: {
    headline?: string
    body?: string
    thumbnail?: string
    bodyText?: string
  }
}

export interface GuardianResponse {
  response: {
    status: string
    userTier: string
    total: number
    startIndex: number
    pageSize: number
    currentPage: number
    pages: number
    orderBy: string
    results: GuardianArticle[]
  }
}

export class GuardianService {
  private apiKey: string
  private baseUrl = 'https://content.guardianapis.com'

  constructor() {
    this.apiKey = process.env.GUARDIAN_API_KEY!
    if (!this.apiKey) {
      throw new Error('Guardian API key is required')
    }
  }

  async searchArticles(options: {
    query?: string
    fromDate?: string
    toDate?: string
    pageSize?: number
    page?: number
  }): Promise<GuardianResponse> {
    const params = new URLSearchParams({
      'api-key': this.apiKey,
      'show-fields': 'headline,body,thumbnail,bodyText',
      'query-fields': 'headline', // Search only in headlines for "India"
      'order-by': 'newest',
      'q': options.query || 'India',
      'page-size': (options.pageSize || 50).toString(),
      'page': (options.page || 1).toString()
    })

    if (options.fromDate) {
      params.append('from-date', options.fromDate)
    }

    if (options.toDate) {
      params.append('to-date', options.toDate)
    }

    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        params: params
      })

      return response.data
    } catch (error) {
      console.error('Error fetching from Guardian API:', error)
      throw new Error('Failed to fetch articles from Guardian API')
    }
  }

  async fetchAllArticles(options: {
    query?: string
    fromDate?: string
    toDate?: string
  }): Promise<GuardianArticle[]> {
    let allArticles: GuardianArticle[] = []
    let currentPage = 1
    let totalPages = 1

    do {
      const response = await this.searchArticles({
        ...options,
        page: currentPage,
        pageSize: 200 // Maximum page size
      })

      allArticles = allArticles.concat(response.response.results)
      totalPages = response.response.pages
      currentPage++

      // Add delay to avoid rate limiting
      if (currentPage <= totalPages) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      // Safety limit to prevent infinite loops
      if (currentPage > 50) break

    } while (currentPage <= totalPages)

    return allArticles
  }
}