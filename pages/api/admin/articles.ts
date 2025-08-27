import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../lib/auth'
import { contentManager } from '../../../lib/services/contentManager'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check authentication
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'GET') {
    try {
      const { 
        page = '1', 
        limit = '10', 
        search = '', 
        showDeleted = 'false' 
      } = req.query

      const pageNum = parseInt(page as string)
      const limitNum = parseInt(limit as string)
      const includeDeleted = showDeleted === 'true'

      let articles
      
      if (search && typeof search === 'string' && search.trim() !== '') {
        // Use search functionality
        const searchResults = await contentManager.searchArticles(search as string)
        const filteredResults = includeDeleted ? searchResults : searchResults.filter(article => !article.isDeleted)
        
        // Manual pagination for search results
        const total = filteredResults.length
        const totalPages = Math.ceil(total / limitNum)
        const startIndex = (pageNum - 1) * limitNum
        const paginatedArticles = filteredResults.slice(startIndex, startIndex + limitNum)
        
        res.status(200).json({
          articles: paginatedArticles,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages,
            hasNext: pageNum < totalPages,
            hasPrev: pageNum > 1
          }
        })
      } else {
        // Use pagination functionality
        const result = await contentManager.getArticlesPaginated(pageNum, limitNum, includeDeleted)
        
        res.status(200).json({
          articles: result.articles,
          pagination: {
            page: result.page,
            limit: limitNum,
            total: result.total,
            totalPages: result.totalPages,
            hasNext: result.page < result.totalPages,
            hasPrev: result.page > 1
          }
        })
      }
    } catch (error) {
      console.error('Error fetching articles:', error)
      res.status(500).json({
        error: 'Failed to fetch articles',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}