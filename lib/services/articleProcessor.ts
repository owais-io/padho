// lib/services/articleProcessor.ts

import { prisma } from '../prisma'
import { GuardianService, GuardianArticle } from './guardian'
import { OpenAIService } from './openai'
import { generateSlug } from '../utils'


export class ArticleProcessorService {
  private guardianService: GuardianService
  private openAIService: OpenAIService

  constructor() {
    this.guardianService = new GuardianService()
    this.openAIService = new OpenAIService()
  }

  async processArticles(options: {
    fromDate?: string
    toDate?: string
    onProgress?: (current: number, total: number, message: string) => void
  }) {
    const { fromDate, toDate, onProgress } = options

    try {
      onProgress?.(0, 0, 'Fetching articles from Guardian API...')

      // Fetch articles from Guardian API
      const articles = await this.guardianService.fetchAllArticles({
        query: 'India',
        fromDate,
        toDate
      })

      onProgress?.(0, articles.length, `Found ${articles.length} articles. Checking for duplicates...`)

      // Get existing Guardian IDs to avoid duplicates
      const existingIds = await prisma.guardianArticleId.findMany({
        select: { guardianId: true }
      })
      const existingIdSet = new Set(existingIds.map(item => item.guardianId))

      // Filter out existing articles
      const newArticles = articles.filter(article => !existingIdSet.has(article.id))

      onProgress?.(0, newArticles.length, `Processing ${newArticles.length} new articles...`)

      let processed = 0
      const results = {
        total: newArticles.length,
        processed: 0,
        errors: [] as string[]
      }

      for (const article of newArticles) {
        try {
          await this.processSingleArticle(article)
          processed++
          results.processed++
          onProgress?.(processed, newArticles.length, `Processed ${processed}/${newArticles.length} articles`)
        } catch (error) {
          const errorMessage = `Failed to process article ${article.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
          console.error(errorMessage)
          results.errors.push(errorMessage)
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      return results
    } catch (error) {
      console.error('Error in processArticles:', error)
      throw error
    }
  }

  private async processSingleArticle(article: GuardianArticle) {
    // Step 1: Save Guardian article and ID tracking (fast operations)
    const savedArticle = await prisma.$transaction(async (tx) => {
      // Add to Guardian ID tracking table
      await tx.guardianArticleId.create({
        data: {
          guardianId: article.id
        }
      })

      // Save Guardian article
      return await tx.guardianArticle.create({
        data: {
          guardianId: article.id,
          webTitle: article.webTitle,
          sectionName: article.sectionName || null,
          webPublicationDate: new Date(article.webPublicationDate),
          webUrl: article.webUrl,
          apiUrl: article.apiUrl,
          bodyText: this.extractBodyText(article),
          headline: article.fields?.headline || article.webTitle,
          thumbnail: article.fields?.thumbnail || null,
          pillarName: article.pillarName || null,
          isHosted: article.isHosted
        }
      })
    }, {
      timeout: 10000, // 10 seconds for database operations
    })

    // Step 2: Process with OpenAI (slow operation, outside transaction)
    const bodyText = this.extractBodyText(article)
    if (bodyText && bodyText.length > 100) {
      try {
        // Process with OpenAI (this can take 10-30 seconds)
        const openAISummary = await this.openAIService.summarizeArticle(bodyText)

        let baseSlug = generateSlug(openAISummary.heading)
        let finalSlug = baseSlug
        let counter = 1

        // Ensure slug uniqueness
        while (true) {
          const existingSlug = await prisma.openAiSummary.findUnique({
            where: { slug: finalSlug }
          })

          if (!existingSlug) {
            break // Slug is unique
          }

          finalSlug = `${baseSlug}-${counter}`
          counter++
        }

        // Create summary with slug
        await prisma.openAiSummary.create({
          data: {
            guardianArticleId: savedArticle.id,
            summary: openAISummary.summary,
            tldr: openAISummary.tldr,
            faqs: openAISummary.faqs,
            heading: openAISummary.heading,
            category: openAISummary.category,
            slug: finalSlug // ← ADD THIS LINE
          }
        })
      } catch (openAIError) {
        console.error(`OpenAI processing failed for article ${article.id}:`, openAIError)
        // Article is saved, but OpenAI summary failed - this is acceptable
        // The article will still be tracked and won't be reprocessed
        throw new Error(`OpenAI processing failed: ${openAIError instanceof Error ? openAIError.message : 'Unknown error'}`)
      }
    }

    return savedArticle
  }

  private extractBodyText(article: GuardianArticle): string | null {
    // Try bodyText first, then body, then fall back to webTitle
    const bodyText = article.fields?.bodyText || article.fields?.body
    
    if (bodyText) {
      // Remove HTML tags and clean up the text
      return bodyText
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim()
    }

    return null
  }

  async getProcessingStats() {
    const [totalArticles, totalSummaries, recentArticles] = await Promise.all([
      prisma.guardianArticle.count(),
      prisma.openAiSummary.count(),
      prisma.guardianArticle.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        }
      })
    ])

    return {
      totalArticles,
      totalSummaries,
      recentArticles,
      successRate: totalArticles > 0 ? (totalSummaries / totalArticles) * 100 : 0
    }
  }
}