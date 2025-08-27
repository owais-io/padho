// pages/api/admin/categories/merge.ts

import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../../lib/auth'
import { contentManager } from '../../../../lib/services/contentManager'

interface CategoryMerge {
  originalCategory: string
  suggestedCategory: string
  reason: string
  articleCount: number
  confidence: 'high' | 'medium' | 'low'
}

interface MergeRequest {
  merges: CategoryMerge[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check authentication
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { merges }: MergeRequest = req.body

    if (!merges || !Array.isArray(merges) || merges.length === 0) {
      return res.status(400).json({ error: 'No merges provided' })
    }

    // Validate merges
    for (const merge of merges) {
      if (!merge.originalCategory || !merge.suggestedCategory) {
        return res.status(400).json({ 
          error: 'Invalid merge data: originalCategory and suggestedCategory are required' 
        })
      }
    }

    let totalArticlesUpdated = 0
    let mergedCategoriesCount = 0

    // Execute merges by updating MDX files
    for (const merge of merges) {
      try {
        // Get all articles with the original category
        const articlesWithCategory = await contentManager.getArticlesByCategory(merge.originalCategory)
        
        if (articlesWithCategory.length > 0) {
          // Update each article's category
          for (const article of articlesWithCategory) {
            article.category = merge.suggestedCategory
            await contentManager.saveArticle(article)
            totalArticlesUpdated++
          }
          
          mergedCategoriesCount++
          console.log(`Merged "${merge.originalCategory}" → "${merge.suggestedCategory}" (${articlesWithCategory.length} articles)`)
        }
      } catch (error) {
        console.error(`Error merging category "${merge.originalCategory}":`, error)
        // Continue with other merges even if one fails
      }
    }

    // Log the merge activity
    console.log(`Category merge completed: ${mergedCategoriesCount} categories merged, ${totalArticlesUpdated} articles updated`)

    return res.status(200).json({
      success: true,
      message: `Successfully merged ${mergedCategoriesCount} categories`,
      mergedCount: mergedCategoriesCount,
      articlesUpdated: totalArticlesUpdated,
      mergeDetails: merges.map(merge => ({
        from: merge.originalCategory,
        to: merge.suggestedCategory,
        reason: merge.reason
      }))
    })

  } catch (error) {
    console.error('Error merging categories:', error)
    return res.status(500).json({
      error: 'Failed to merge categories',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}