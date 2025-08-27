// pages/api/admin/articles/[id]/delete.ts

import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../../../lib/auth'
import { contentManager } from '../../../../../lib/services/contentManager'

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
      return res.status(400).json({ error: 'Article slug is required' })
    }

    // Check if article exists and get its details first
    const article = await contentManager.getArticleBySlug(id)

    if (!article) {
      return res.status(404).json({ error: 'Article not found' })
    }

    // Permanently delete the article file
    const success = await contentManager.deleteArticle(id)

    if (!success) {
      return res.status(500).json({ error: 'Failed to delete article file' })
    }

    res.status(200).json({
      success: true,
      message: 'Article permanently deleted',
      deletedArticle: {
        slug: article.slug,
        title: article.title,
        category: article.category
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