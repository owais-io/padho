import { GuardianService, GuardianArticle } from './guardian';
import { OpenAIService } from './openai-mdx';
import { duplicateTracker } from './duplicateTracker';

export interface ProcessingProgress {
  total: number;
  processed: number;
  skipped: number;
  errors: number;
  currentArticle?: string;
  stage: 'fetching' | 'processing' | 'completed' | 'error';
}

export interface ProcessingStats {
  totalFetched: number;
  alreadyProcessed: number;
  newlyProcessed: number;
  errors: number;
  processingTime: number;
}

export class FileProcessor {
  private guardianService: GuardianService;
  private openaiService: OpenAIService;
  
  constructor() {
    this.guardianService = new GuardianService();
    this.openaiService = new OpenAIService();
  }

  async processArticles(
    options: {
      fromDate?: string;
      toDate?: string;
      query?: string;
    },
    onProgress?: (progress: ProcessingProgress) => void
  ): Promise<ProcessingStats> {
    const startTime = Date.now();
    let totalFetched = 0;
    let alreadyProcessed = 0;
    let newlyProcessed = 0;
    let errors = 0;

    try {
      // Update progress: Starting to fetch articles
      onProgress?.({
        total: 0,
        processed: 0,
        skipped: 0,
        errors: 0,
        stage: 'fetching'
      });

      console.log('🔍 Fetching articles from Guardian API...');
      const guardianArticles = await this.guardianService.fetchAllArticles(options);
      totalFetched = guardianArticles.length;

      console.log(`📥 Fetched ${totalFetched} articles from Guardian API`);

      if (totalFetched === 0) {
        return {
          totalFetched: 0,
          alreadyProcessed: 0,
          newlyProcessed: 0,
          errors: 0,
          processingTime: Date.now() - startTime
        };
      }

      // Filter out already processed articles
      const unprocessedArticles = guardianArticles.filter(article => {
        if (duplicateTracker.isProcessed(article.id)) {
          alreadyProcessed++;
          return false;
        }
        return true;
      });

      console.log(`📋 Found ${unprocessedArticles.length} new articles to process`);

      // Update progress: Starting processing
      onProgress?.({
        total: unprocessedArticles.length,
        processed: 0,
        skipped: alreadyProcessed,
        errors: 0,
        stage: 'processing'
      });

      // Process each article
      for (let i = 0; i < unprocessedArticles.length; i++) {
        const article = unprocessedArticles[i];
        
        try {
          // Update progress
          onProgress?.({
            total: unprocessedArticles.length,
            processed: i,
            skipped: alreadyProcessed,
            errors,
            currentArticle: article.webTitle,
            stage: 'processing'
          });

          console.log(`🤖 Processing article ${i + 1}/${unprocessedArticles.length}: ${article.webTitle}`);

          // Skip if no body text
          if (!article.fields?.bodyText) {
            console.log('⚠️ Skipping article with no body text');
            continue;
          }

          // Generate AI summary
          const summaryData = await this.openaiService.summarizeArticle(article.fields.bodyText);
          
          // Create MDX file
          const slug = await this.openaiService.createMDXArticle(article, summaryData);
          
          // Track as processed
          duplicateTracker.addProcessed(article.id, slug);
          
          newlyProcessed++;
          
          console.log(`✅ Successfully processed article: ${slug}`);

        } catch (error) {
          errors++;
          console.error(`❌ Error processing article "${article.webTitle}":`, error);
          
          // Continue processing other articles even if one fails
          continue;
        }

        // Rate limiting: 1 second delay between articles
        if (i < unprocessedArticles.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Final progress update
      onProgress?.({
        total: unprocessedArticles.length,
        processed: newlyProcessed,
        skipped: alreadyProcessed,
        errors,
        stage: 'completed'
      });

      const processingTime = Date.now() - startTime;
      
      console.log(`\n🎉 Processing completed!`);
      console.log(`📊 Summary:`);
      console.log(`   • Total fetched: ${totalFetched}`);
      console.log(`   • Already processed: ${alreadyProcessed}`);
      console.log(`   • Newly processed: ${newlyProcessed}`);
      console.log(`   • Errors: ${errors}`);
      console.log(`   • Processing time: ${Math.round(processingTime / 1000)}s`);

      return {
        totalFetched,
        alreadyProcessed,
        newlyProcessed,
        errors,
        processingTime
      };

    } catch (error) {
      console.error('❌ Fatal error during article processing:', error);
      
      onProgress?.({
        total: 0,
        processed: 0,
        skipped: alreadyProcessed,
        errors: errors + 1,
        stage: 'error'
      });

      throw new Error('Article processing failed: ' + (error as Error).message);
    }
  }

  // Get processing statistics
  async getProcessingStats(): Promise<{
    totalArticles: number;
    processedCount: number;
    duplicateTrackerStats: any;
  }> {
    // Note: We could enhance this to read from content manager
    // for now, we'll rely on duplicate tracker
    const duplicateStats = duplicateTracker.getStats();
    
    return {
      totalArticles: 0, // Could be populated by scanning content directory
      processedCount: duplicateStats.total,
      duplicateTrackerStats: duplicateStats
    };
  }
}

// Export singleton instance
export const fileProcessor = new FileProcessor();