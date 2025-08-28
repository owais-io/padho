#!/usr/bin/env node

const { ArticleProcessorService } = require('../lib/services/articleProcessor');
require('dotenv').config();

class AutoFetcher {
  constructor() {
    this.processor = new ArticleProcessorService();
  }

  log(message) {
    const timestamp = new Date().toLocaleString();
    console.log(`[${timestamp}] ${message}`);
  }

  async fetchArticles() {
    this.log('🚀 Starting scheduled article fetch...');

    try {
      const today = new Date().toISOString().split('T')[0];
      
      const results = await this.processor.processArticles({
        fromDate: today,
        toDate: today,
        onProgress: (current, total, message) => {
          this.log(`Progress: ${current}/${total} - ${message}`);
        }
      });

      this.log(`✅ Fetch completed! Processed: ${results.processed}/${results.total}, Errors: ${results.errors.length}`);
      
      if (results.errors.length > 0) {
        this.log('❌ Errors encountered:');
        results.errors.forEach(error => this.log(`  - ${error}`));
        process.exit(1); // Exit with error code for Task Scheduler
      }

      this.log('✅ All done! Exiting...');
      process.exit(0); // Success exit

    } catch (error) {
      this.log(`❌ Fatal error during fetch: ${error.message}`);
      console.error(error);
      process.exit(1); // Exit with error code
    }
  }

  async run() {
    await this.fetchArticles();
  }
}

// Run the fetcher if this file is executed directly
if (require.main === module) {
  const autoFetcher = new AutoFetcher();
  autoFetcher.run();
}

module.exports = AutoFetcher;