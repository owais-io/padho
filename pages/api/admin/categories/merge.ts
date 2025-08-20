// pages/api/admin/categories/merge.ts

import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../../lib/auth'
import { prisma } from '../../../../lib/prisma'

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

    // Execute merges in a transaction
    await prisma.$transaction(async (tx) => {
      for (const merge of merges) {
        // Update all summaries with the original category to the new category
        const updateResult = await tx.openAiSummary.updateMany({
          where: {
            category: merge.originalCategory
          },
          data: {
            category: merge.suggestedCategory
          }
        })

        if (updateResult.count > 0) {
          totalArticlesUpdated += updateResult.count
          mergedCategoriesCount++
          console.log(`Merged "${merge.originalCategory}" → "${merge.suggestedCategory}" (${updateResult.count} articles)`)
        }
      }
    }, {
      timeout: 30000 // 30 second timeout
    })

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