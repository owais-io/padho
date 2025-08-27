// lib/services/articleProcessor.ts

import { GuardianService, GuardianArticle } from './guardian'
import { OpenAIService } from './openai-mdx'
import { duplicateTracker } from './duplicateTracker'


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

      // Filter out existing articles using our duplicate tracker
      const newArticles = articles.filter(article => !duplicateTracker.isProcessed(article.id))

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
    try {
      // Extract body text
      const bodyText = this.extractBodyText(article)
      
      if (!bodyText || bodyText.length <= 100) {
        throw new Error('Article body text is too short or missing')
      }

      // Generate AI summary first
      const summaryData = await this.openAIService.summarizeArticle(bodyText)
      
      // Create MDX article using the OpenAI MDX service
      const slug = await this.openAIService.createMDXArticle(article, summaryData)
      
      // Mark as processed after successful creation
      duplicateTracker.addProcessed(article.id, slug)
      
      console.log(`Successfully created MDX article: ${slug}`)
      
      return { success: true, slug }
    } catch (error) {
      // Don't add to processed list if creation failed
      throw error
    }
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
}