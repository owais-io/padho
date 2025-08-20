// pages/api/admin/articles/[id]/delete.ts

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

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Article ID is required' })
    }

    // Check if article exists and get its details
    const article = await prisma.guardianArticle.findUnique({
      where: { id },
      include: {
        openAiSummary: {
          select: {
            heading: true,
            category: true
          }
        }
      }
    })

    if (!article) {
      return res.status(404).json({ error: 'Article not found' })
    }

    // Hard delete the article (this will cascade delete the openAiSummary due to your schema)
    await prisma.guardianArticle.delete({
      where: { id }
    })

    // Note: GuardianArticleId record is intentionally kept for deduplication

    res.status(200).json({
      success: true,
      message: 'Article permanently deleted from database',
      deletedArticle: {
        id: article.id,
        title: article.webTitle,
        heading: article.openAiSummary?.heading,
        category: article.openAiSummary?.category
      }
    })
  } catch (error) {
    console.error('Error permanently deleting article:', error)
    res.status(500).json({
      error: 'Failed to delete article permanently',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}