import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Calendar, TrendingUp } from 'lucide-react';
import Timeline from '@/components/Timeline';
import { getArticlesByCategory, getCategoryBySlug, getAllCategories } from '@/lib/mdx';
import { Article } from '@/lib/types';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = getCategoryBySlug(params.slug);
  const mdxArticles = getArticlesByCategory(params.slug);

  if (!category) {
    notFound();
  }

  // Map MDX articles to UI Article type
  const articles: Article[] = mdxArticles.map(article => ({
    id: article.id,
    title: article.title,
    summary: article.summary,
    imageUrl: article.imageUrl,
    category: article.category,
    publishedDate: article.publishedAt,
    guardianUrl: `https://www.theguardian.com/${article.id}`,
  }));

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link
            href="/categories"
            className="inline-flex items-center space-x-2 text-primary-700 hover:text-accent-700 transition-colors font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Categories</span>
          </Link>
        </div>

        {/* Category Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-sm">
            <Calendar className="w-4 h-4" />
            <span>Category</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6" style={{color: '#2c1810'}}>
            {category.name}
            <span className="bg-gradient-to-r from-primary-700 to-accent-700 bg-clip-text text-transparent"> News</span>
          </h1>

          <p className="text-lg sm:text-xl mb-8 max-w-3xl mx-auto leading-relaxed" style={{color: '#4a3428'}}>
            Stay updated with the latest developments in {category.name.toLowerCase()}.
            Our AI-curated summaries help you quickly understand the most important stories in this field.
          </p>

          {/* Category Stats */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="bg-cream-50 rounded-lg px-6 py-3 shadow-md border border-gold-200">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                <span className="font-medium" style={{color: '#2c1810'}}>{category.articleCount} Articles</span>
              </div>
            </div>

            <div className="bg-cream-50 rounded-lg px-6 py-3 shadow-md border border-gold-200">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-accent-600" />
                <span className="font-medium" style={{color: '#2c1810'}}>Regularly Updated</span>
              </div>
            </div>
          </div>

          <div className="w-24 h-1 bg-gradient-to-r from-primary-700 to-accent-700 mx-auto rounded-full mt-8 shadow-sm"></div>
        </div>

        {/* Articles Timeline */}
        <Timeline articles={articles} />

        {/* Related Categories */}
        {articles.length === 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-8" style={{color: '#2c1810'}}>
              Explore Other Categories
            </h2>
            <div className="flex justify-center">
              <Link
                href="/categories"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-700 to-primary-600 hover:from-primary-800 hover:to-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md"
              >
                <span>View All Categories</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const categories = getAllCategories();

  return categories.map((category) => ({
    slug: category.slug,
  }));
}