import { cache } from 'react';
import type { Article, BlogListItem } from './types';
import { COST_GUIDE_ARTICLES } from './articles/cost-guides';
import { MATERIALS_DESIGN_ARTICLES } from './articles/materials-design';
import { PLANNING_CITY_ARTICLES } from './articles/planning-city';
import { getBlogPosts, type BlogPostSummary } from '@/lib/db/content';
import { CATEGORY_BY_SLUG } from './categories';

export type { Article, ArticleSection, BlogListItem } from './types';
export { BLOG_CATEGORIES, CATEGORY_BY_SLUG, categoryPath } from './categories';

export const ARTICLES: Article[] = [
  ...COST_GUIDE_ARTICLES,
  ...MATERIALS_DESIGN_ARTICLES,
  ...PLANNING_CITY_ARTICLES,
].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

export const ARTICLE_BY_SLUG: Record<string, Article> = Object.fromEntries(
  ARTICLES.map((a) => [a.slug, a]),
);

export function getArticle(slug: string): Article | undefined {
  return ARTICLE_BY_SLUG[slug];
}

export function articlePath(slug: string) {
  return `/blog/${slug}`;
}

/** Rough word count for reading time and Article schema. */
export function articleWordCount(a: Article): number {
  const text = [
    a.title,
    a.description,
    ...(a.keyTakeaways ?? []),
    ...a.sections.flatMap((s) => [
      s.heading ?? '',
      ...(s.paragraphs ?? []),
      ...(s.bullets ?? []),
      ...(s.numbered ?? []),
      s.callout ?? '',
      ...(s.table ? s.table.rows.flat() : []),
    ]),
    ...(a.faqs ?? []).flatMap((f) => [f.question, f.answer]),
  ].join(' ');
  return text.split(/\s+/).filter(Boolean).length;
}

export function articleReadMinutes(a: Article) {
  return Math.max(1, Math.round(articleWordCount(a) / 200));
}

export function relatedArticles(a: Article, limit = 3): Article[] {
  const explicit = (a.related ?? [])
    .map(getArticle)
    .filter((x): x is Article => Boolean(x) && x!.slug !== a.slug);
  if (explicit.length >= limit) return explicit.slice(0, limit);
  const sameCat = ARTICLES.filter(
    (x) =>
      x.category === a.category &&
      x.slug !== a.slug &&
      !explicit.some((e) => e.slug === x.slug),
  );
  return [...explicit, ...sameCat].slice(0, limit);
}

export function articleToListItem(a: Article): BlogListItem {
  return {
    _id: `local-${a.slug}`,
    title: a.title,
    slug: a.slug,
    description: a.description,
    author: a.author,
    publishedAt: a.publishedAt,
    mainImageUrl: `/api/og?title=${encodeURIComponent(a.title)}&subtitle=${encodeURIComponent(CATEGORY_BY_SLUG[a.category]?.name ?? 'Silver Storey Blog')}`,
    category: a.category,
    source: 'local',
  };
}

/** Posts created in the CMS. */
export const getCmsPosts = cache(
  async (): Promise<BlogPostSummary[]> => getBlogPosts(),
);

/** CMS posts + built-in articles, de-duplicated by slug (CMS wins), newest first. */
export const getAllBlogItems = cache(async (): Promise<BlogListItem[]> => {
  const cms = await getCmsPosts();
  const cmsSlugs = new Set(cms.map((p) => p.slug));
  const items: BlogListItem[] = [
    ...cms.map((p) => ({ ...p, _id: p.id, source: 'cms' as const })),
    ...ARTICLES.filter((a) => !cmsSlugs.has(a.slug)).map(articleToListItem),
  ];
  return items.sort((a, b) => {
    const da = a.publishedAt ?? '';
    const db = b.publishedAt ?? '';
    return da < db ? 1 : da > db ? -1 : 0;
  });
});

export async function getBlogItemsByCategory(
  category: string,
): Promise<BlogListItem[]> {
  const all = await getAllBlogItems();
  return all.filter((i) => i.category === category);
}
