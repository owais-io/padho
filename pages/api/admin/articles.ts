import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'

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
      const skip = (pageNum - 1) * limitNum
      const includeDeleted = showDeleted === 'true'

      // Build where clause
      const where: any = {}
      
      if (!includeDeleted) {
        where.isDeleted = false
      }

      if (search) {
        where.OR = [
          { webTitle: { contains: search as string, mode: 'insensitive' } },
          { openAiSummary: { heading: { contains: search as string, mode: 'insensitive' } } },
          { sectionName: { contains: search as string, mode: 'insensitive' } }
        ]
      }

      // Get articles with pagination
      const [articles, totalCount] = await Promise.all([
        prisma.guardianArticle.findMany({
          where,
          include: {
            openAiSummary: {
              select: {
                heading: true,
                category: true,
                tldr: true,
                createdAt: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limitNum
        }),
        prisma.guardianArticle.count({ where })
      ])

      const totalPages = Math.ceil(totalCount / limitNum)

      res.status(200).json({
        articles,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: totalCount,
          totalPages,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1
        }
      })
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