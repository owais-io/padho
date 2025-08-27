import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface ArticleMetadata {
  title: string;
  slug: string;
  category: string;
  publishedAt: string;
  originalUrl: string;
  guardianId: string;
  thumbnail?: string;
  section?: string;
  pillarName?: string;
  isDeleted: boolean;
  tldr: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export interface Article extends ArticleMetadata {
  content: string;
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'articles');

export class ContentManager {
  // Ensure content directory exists
  private ensureContentDir() {
    if (!fs.existsSync(CONTENT_DIR)) {
      fs.mkdirSync(CONTENT_DIR, { recursive: true });
    }
  }

  // Get all articles from MDX files
  async getAllArticles(): Promise<Article[]> {
    this.ensureContentDir();
    
    try {
      const files = fs.readdirSync(CONTENT_DIR).filter(file => file.endsWith('.mdx'));
      const articles: Article[] = [];

      for (const file of files) {
        try {
          const filePath = path.join(CONTENT_DIR, file);
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          const { data, content } = matter(fileContent);
          
          const article = {
            ...data as ArticleMetadata,
            content
          };
          
          articles.push(article);
        } catch (error) {
          console.error(`Error reading article ${file}:`, error);
          continue;
        }
      }

      // Sort by publishedAt descending
      return articles.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    } catch (error) {
      console.error('Error reading articles directory:', error);
      return [];
    }
  }

  // Get published articles only
  async getPublishedArticles(): Promise<Article[]> {
    const articles = await this.getAllArticles();
    return articles.filter(article => !article.isDeleted);
  }

  // Get article by slug
  async getArticleBySlug(slug: string): Promise<Article | null> {
    this.ensureContentDir();
    
    try {
      // Since filenames might not match slugs, we need to search through all articles
      const files = fs.readdirSync(CONTENT_DIR).filter(file => file.endsWith('.mdx'));
      
      for (const file of files) {
        try {
          const filePath = path.join(CONTENT_DIR, file);
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          const { data, content } = matter(fileContent);
          
          // Check if this article has the matching slug
          if (data.slug === slug) {
            return {
              ...data as ArticleMetadata,
              content
            };
          }
        } catch (error) {
          console.error(`Error reading article file ${file}:`, error);
          continue;
        }
      }
      
      return null; // Article with this slug not found
    } catch (error) {
      console.error(`Error searching for article ${slug}:`, error);
      return null;
    }
  }

  // Save article as MDX file
  async saveArticle(article: Article): Promise<void> {
    this.ensureContentDir();
    
    const filePath = path.join(CONTENT_DIR, `${article.slug}.mdx`);
    
    const frontmatter = {
      title: article.title,
      slug: article.slug,
      category: article.category,
      publishedAt: article.publishedAt,
      originalUrl: article.originalUrl,
      guardianId: article.guardianId,
      thumbnail: article.thumbnail,
      section: article.section,
      pillarName: article.pillarName,
      isDeleted: article.isDeleted,
      tldr: article.tldr,
      faqs: article.faqs
    };

    const mdxContent = matter.stringify(article.content, frontmatter);
    
    try {
      fs.writeFileSync(filePath, mdxContent, 'utf-8');
    } catch (error) {
      console.error(`Error saving article ${article.slug}:`, error);
      throw error;
    }
  }

  // Delete article (remove file)
  async deleteArticle(slug: string): Promise<boolean> {
    this.ensureContentDir();
    
    const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
    
    if (!fs.existsSync(filePath)) {
      return false;
    }

    try {
      fs.unlinkSync(filePath);
      return true;
    } catch (error) {
      console.error(`Error deleting article ${slug}:`, error);
      return false;
    }
  }

  // Soft delete article (update isDeleted flag)
  async toggleArticleVisibility(slug: string): Promise<boolean> {
    const article = await this.getArticleBySlug(slug);
    if (!article) {
      return false;
    }

    article.isDeleted = !article.isDeleted;
    
    try {
      await this.saveArticle(article);
      return true;
    } catch (error) {
      console.error(`Error toggling visibility for article ${slug}:`, error);
      return false;
    }
  }

  // Get articles by category
  async getArticlesByCategory(category: string): Promise<Article[]> {
    const articles = await this.getPublishedArticles();
    return articles.filter(article => 
      article.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Get all unique categories
  async getAllCategories(): Promise<Array<{category: string, count: number}>> {
    const articles = await this.getPublishedArticles();
    const categoryMap = new Map<string, number>();

    articles.forEach(article => {
      const category = article.category;
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });

    return Array.from(categoryMap.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  }

  // Search articles
  async searchArticles(query: string): Promise<Article[]> {
    const articles = await this.getPublishedArticles();
    const searchTerm = query.toLowerCase();
    
    return articles.filter(article => 
      article.title.toLowerCase().includes(searchTerm) ||
      article.content.toLowerCase().includes(searchTerm) ||
      article.category.toLowerCase().includes(searchTerm)
    );
  }

  // Get articles with pagination
  async getArticlesPaginated(
    page: number = 1, 
    limit: number = 20,
    showDeleted: boolean = false
  ): Promise<{
    articles: Article[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const allArticles = showDeleted 
      ? await this.getAllArticles()
      : await this.getPublishedArticles();
    
    const total = allArticles.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const articles = allArticles.slice(startIndex, startIndex + limit);
    
    return {
      articles,
      total,
      page,
      totalPages
    };
  }

  // Get statistics
  async getStats(): Promise<{
    total: number;
    published: number;
    hidden: number;
    recent: number;
  }> {
    const allArticles = await this.getAllArticles();
    const publishedArticles = allArticles.filter(a => !a.isDeleted);
    const hiddenArticles = allArticles.filter(a => a.isDeleted);
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const recentArticles = publishedArticles.filter(a => 
      new Date(a.publishedAt) >= yesterday
    );

    return {
      total: allArticles.length,
      published: publishedArticles.length,
      hidden: hiddenArticles.length,
      recent: recentArticles.length
    };
  }
}

// Export singleton instance
export const contentManager = new ContentManager();