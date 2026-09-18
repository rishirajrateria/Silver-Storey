import type { FAQ } from '@/lib/seo/schema';

export interface ArticleSection {
  heading?: string;
  level?: 2 | 3;
  paragraphs?: string[];
  bullets?: string[];
  numbered?: string[];
  /** Simple two-column table: header row + rows. */
  table?: { headers: string[]; rows: string[][] };
  callout?: string;
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  author: string;
  keyTakeaways?: string[];
  sections: ArticleSection[];
  faqs?: FAQ[];
  related?: string[];
}

/** Common shape used by the blog list for both CMS and local articles. */
export interface BlogListItem {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  author?: string;
  publishedAt?: string;
  mainImageUrl?: string;
  category?: string;
  source: 'cms' | 'local';
}
