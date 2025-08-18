// pages/api/admin/process-articles.ts

import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../lib/auth'
import { ArticleProcessorService } from '../../../lib/services/articleProcessor'

export const config = {
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
  maxDuration: 300, // 5 minutes timeout for Vercel
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
    const { fromDate, toDate } = req.body

    if (!fromDate || !toDate) {
      return res.status(400).json({ error: 'fromDate and toDate are required' })
    }

    const processor = new ArticleProcessorService()
    
    // For now, we'll process synchronously
    // In production, you might want to use a queue system
    const results = await processor.processArticles({
      fromDate,
      toDate,
      onProgress: (current, total, message) => {
        console.log(`Progress: ${current}/${total} - ${message}`)
      }
    })

    res.status(200).json({
      success: true,
      message: 'Articles processed successfully',
      results
    })
  } catch (error) {
    console.error('Error processing articles:', error)
    res.status(500).json({
      error: 'Failed to process articles',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}