// pages/api/admin/articles/[id]/toggle-delete.ts

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

  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Article slug is required' })
    }

    // Toggle article visibility using ContentManager
    const success = await contentManager.toggleArticleVisibility(id)

    if (!success) {
      return res.status(404).json({ error: 'Article not found' })
    }

    // Get updated article to confirm status
    const updatedArticle = await contentManager.getArticleBySlug(id)

    res.status(200).json({
      success: true,
      message: `Article ${updatedArticle?.isDeleted ? 'hidden from' : 'restored to'} website`,
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