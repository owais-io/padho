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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const stats = await contentManager.getStats()
    
    res.status(200).json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    res.status(500).json({
      error: 'Failed to fetch stats',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}