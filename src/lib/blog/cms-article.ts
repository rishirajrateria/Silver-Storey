import type { Article } from './types';

/**
 * The shape the related-content matchers need, built from a CMS post. Posts
 * written in the admin have no tags or sections, so matching runs on the
 * title, slug and category alone — which is enough to point a reader at the
 * right service pages and city guides.
 */
export function cmsPostAsArticle(post: {
  title: string;
  slug: string;
  category?: string;
  description?: string;
  author?: string;
  publishedAt?: string;
  updatedAt?: string;
}): Article {
  return {
    slug: post.slug,
    title: post.title,
    description: post.description ?? '',
    category: post.category ?? '',
    tags: [],
    publishedAt: post.publishedAt ?? '',
    updatedAt: post.updatedAt,
    author: post.author ?? 'Silver Storey',
    sections: [],
  };
}
