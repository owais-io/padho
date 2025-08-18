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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const [
      totalArticles, 
      totalSummaries, 
      recentArticles, 
      publishedArticles,
      hiddenArticles
    ] = await Promise.all([
      prisma.guardianArticle.count(),
      prisma.openAiSummary.count(),
      prisma.guardianArticle.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        }
      }),
      prisma.guardianArticle.count({
        where: { isDeleted: false }
      }),
      prisma.guardianArticle.count({
        where: { isDeleted: true }
      })
    ])

    res.status(200).json({
      totalArticles,
      totalSummaries,
      recentArticles,
      publishedArticles,
      hiddenArticles,
      successRate: totalArticles > 0 ? (totalSummaries / totalArticles) * 100 : 0
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    res.status(500).json({
      error: 'Failed to fetch stats',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}