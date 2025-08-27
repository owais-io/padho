import fs from 'fs';
import path from 'path';

const TRACKER_FILE = path.join(process.cwd(), 'content', 'processed-articles.json');

export interface ProcessedArticle {
  guardianId: string;
  slug: string;
  processedAt: string;
}

export class DuplicateTracker {
  private processedArticles: ProcessedArticle[] = [];
  
  constructor() {
    this.loadProcessedArticles();
  }

  // Load processed articles from JSON file
  private loadProcessedArticles(): void {
    try {
      if (fs.existsSync(TRACKER_FILE)) {
        const content = fs.readFileSync(TRACKER_FILE, 'utf-8');
        this.processedArticles = JSON.parse(content);
      } else {
        this.processedArticles = [];
        this.saveProcessedArticles();
      }
    } catch (error) {
      console.error('Error loading processed articles:', error);
      this.processedArticles = [];
    }
  }

  // Save processed articles to JSON file
  private saveProcessedArticles(): void {
    try {
      // Ensure directory exists
      const dir = path.dirname(TRACKER_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(
        TRACKER_FILE, 
        JSON.stringify(this.processedArticles, null, 2), 
        'utf-8'
      );
    } catch (error) {
      console.error('Error saving processed articles:', error);
      throw error;
    }
  }

  // Check if article was already processed
  isProcessed(guardianId: string): boolean {
    return this.processedArticles.some(article => article.guardianId === guardianId);
  }

  // Add article to processed list
  addProcessed(guardianId: string, slug: string): void {
    if (!this.isProcessed(guardianId)) {
      this.processedArticles.push({
        guardianId,
        slug,
        processedAt: new Date().toISOString()
      });
      this.saveProcessedArticles();
    }
  }

  // Get all processed articles
  getProcessedArticles(): ProcessedArticle[] {
    return [...this.processedArticles];
  }

  // Remove from processed list (if article is deleted)
  removeProcessed(guardianId: string): boolean {
    const initialLength = this.processedArticles.length;
    this.processedArticles = this.processedArticles.filter(
      article => article.guardianId !== guardianId
    );
    
    if (this.processedArticles.length < initialLength) {
      this.saveProcessedArticles();
      return true;
    }
    return false;
  }

  // Get processed count
  getProcessedCount(): number {
    return this.processedArticles.length;
  }

  // Clean up old entries (optional - for maintenance)
  cleanupOldEntries(daysOld: number = 90): number {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    const initialLength = this.processedArticles.length;
    this.processedArticles = this.processedArticles.filter(
      article => new Date(article.processedAt) >= cutoffDate
    );
    
    const removedCount = initialLength - this.processedArticles.length;
    if (removedCount > 0) {
      this.saveProcessedArticles();
    }
    
    return removedCount;
  }

  // Get statistics
  getStats(): {
    total: number;
    recentWeek: number;
    recentMonth: number;
  } {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const recentWeek = this.processedArticles.filter(
      article => new Date(article.processedAt) >= weekAgo
    ).length;

    const recentMonth = this.processedArticles.filter(
      article => new Date(article.processedAt) >= monthAgo
    ).length;

    return {
      total: this.processedArticles.length,
      recentWeek,
      recentMonth
    };
  }
}

// Export singleton instance
export const duplicateTracker = new DuplicateTracker();