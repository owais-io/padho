import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../../../lib/auth'
import { prisma } from '../../../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check authentication
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Article ID is required' })
    }

    // Get current article status
    const article = await prisma.guardianArticle.findUnique({
      where: { id },
      select: { isDeleted: true, webTitle: true }
    })

    if (!article) {
      return res.status(404).json({ error: 'Article not found' })
    }

    // Toggle soft delete status
    const updatedArticle = await prisma.guardianArticle.update({
      where: { id },
      data: {
        isDeleted: !article.isDeleted,
        deletedAt: !article.isDeleted ? new Date() : null
      },
      include: {
        openAiSummary: {
          select: {
            heading: true,
            category: true
          }
        }
      }
    })

    res.status(200).json({
      success: true,
      message: `Article ${updatedArticle.isDeleted ? 'hidden from' : 'restored to'} website`,
      article: updatedArticle
    })
  } catch (error) {
    console.error('Error toggling article delete status:', error)
    res.status(500).json({
      error: 'Failed to update article status',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}