export interface Article {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  category: string;
  publishedDate: string;
  guardianUrl: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  articleCount: number;
}

export interface ArticleCardProps {
  article: Article;
  onSummaryOpen: (article: Article) => void;
}

export interface LoadMoreButtonProps {
  onLoadMore: () => void;
  loading: boolean;
  hasMore: boolean;
}