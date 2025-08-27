// pages/api/admin/categories/analyze.ts

import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../../lib/auth'
import { contentManager } from '../../../../lib/services/contentManager'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface CategoryWithCount {
  category: string
  count: number
}

interface CategoryAnalysis {
  originalCategory: string
  suggestedCategory: string
  reason: string
  articleCount: number
  confidence: 'high' | 'medium' | 'low'
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
    // Get all categories with their article counts using ContentManager
    const categoriesWithCounts = await contentManager.getAllCategories()

    if (categoriesWithCounts.length === 0) {
      return res.status(200).json({ suggestions: [] })
    }

    // Prepare prompt for OpenAI
    const categoriesText = categoriesWithCounts
      .map(c => `"${c.category}" (${c.count} articles)`)
      .join(', ')

    const prompt = `You are a content categorization expert for an Indian news website called Padho.net. 

CONTEXT: This website serves Indian audiences and covers news about India. All categories should be relevant to Indian context.

TASK: Analyze the following categories and identify duplicates that should be merged. Some categories have different wording but represent the same concept.

CATEGORIES TO ANALYZE:
${categoriesText}

INSTRUCTIONS:
1. Identify categories that are semantically duplicate (same meaning, different wording)
2. Suggest which category name should be the "master" category (clearest, most professional)
3. Prioritize categories with more articles as the master category when possible
4. Use clear, professional category names suitable for Indian news
5. Don't merge categories that are genuinely different topics

RESPONSE FORMAT: Return a JSON object with a "suggestions" array:
{
  "suggestions": [
    {
      "originalCategory": "Category to be merged",
      "suggestedCategory": "Master category to merge into", 
      "reason": "Brief explanation why these should be merged",
      "confidence": "high|medium|low"
    }
  ]
}

EXAMPLES OF WHAT TO MERGE:
- "Cricket India" + "Indian Cricket" + "India Cricket" → "Cricket"
- "India-US Trade" + "India-U.S. Trade" → "India-US Trade" 
- "Indian Aviation" + "Aviation, India" → "Aviation"

EXAMPLES OF WHAT NOT TO MERGE:
- "Cricket" and "Football" (different sports)
- "Weather" and "Natural Disasters" (related but different)
- "History" and "Literature" (different topics)

Be conservative - only suggest merges when you're confident the categories represent the same concept.`

    // Call OpenAI API with JSON mode
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a content categorization expert. Respond only with valid JSON."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 2000,
      response_format: { type: "json_object" } // Force JSON response
    })

    const responseText = completion.choices[0].message.content
    if (!responseText) {
      throw new Error('No response from OpenAI')
    }

    // Parse OpenAI response - now guaranteed to be valid JSON
    let aiSuggestions: Omit<CategoryAnalysis, 'articleCount'>[]
    try {
      const parsed = JSON.parse(responseText)
      console.log('Parsed OpenAI response:', parsed)
      
      // Handle different response formats
      if (Array.isArray(parsed)) {
        aiSuggestions = parsed
      } else if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
        aiSuggestions = parsed.suggestions
      } else if (parsed.merges && Array.isArray(parsed.merges)) {
        aiSuggestions = parsed.merges
      } else {
        console.error('Unexpected response structure:', parsed)
        throw new Error('Response is not in expected array format')
      }
    } catch (error) {
      console.error('Failed to parse OpenAI response:', responseText)
      throw new Error('Invalid response format from OpenAI')
    }

    // Add article counts to suggestions
    const suggestions: CategoryAnalysis[] = aiSuggestions.map(suggestion => {
      const categoryData = categoriesWithCounts.find(c => c.category === suggestion.originalCategory)
      return {
        ...suggestion,
        articleCount: categoryData?.count || 0
      }
    })

    // Filter out suggestions for categories that don't exist (safety check)
    const validSuggestions = suggestions.filter(s => 
      categoriesWithCounts.some(c => c.category === s.originalCategory)
    )

    return res.status(200).json({
      success: true,
      suggestions: validSuggestions,
      totalCategories: categoriesWithCounts.length,
      duplicatesFound: validSuggestions.length
    })

  } catch (error) {
    console.error('Error analyzing categories:', error)
    return res.status(500).json({
      error: 'Failed to analyze categories',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}