import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { sanityClient } from '@/lib/sanity/client';
import { blogPostBySlugQuery, allBlogSlugsQuery } from '@/lib/sanity/queries';
import { getProjectPages } from '@/lib/sanity/projectPages';
import BlogPostPage from '@/features/Blog/BlogPostPage';
import ArticlePage from '@/features/Blog/ArticlePage';
import type { BlogPostFull } from '@/features/Blog/types';
import {
  ARTICLES,
  getArticle,
  articlePath,
  articleWordCount,
  CATEGORY_BY_SLUG,
  categoryPath,
} from '@/lib/blog';
import JsonLd from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import {
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  graph,
} from '@/lib/seo/schema';

export const revalidate = 60;

const getSanityPost = cache(async (slug: string) =>
  sanityClient
    .fetch<BlogPostFull | null>(blogPostBySlugQuery, { slug })
    .catch(() => null),
);

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await sanityClient
    .fetch(allBlogSlugsQuery)
    .catch(() => []);
  const sanity = (slugs ?? [])
    .filter((s) => Boolean(s.slug))
    .map((s) => ({ slug: s.slug }));
  const local = ARTICLES.map((a) => ({ slug: a.slug }));
  const seen = new Set<string>();
  return [...sanity, ...local].filter((p) =>
    seen.has(p.slug) ? false : (seen.add(p.slug), true),
  );
}

type Props = { params: Promise<{ slug: string }> };

function plainText(body?: unknown[]): string {
  if (!Array.isArray(body)) return '';
  return body
    .filter(
      (b): b is { _type: string; children?: { text?: string }[] } =>
        typeof b === 'object' &&
        b !== null &&
        (b as { _type?: string })._type === 'block',
    )
    .flatMap((b) => (b.children ?? []).map((c) => c.text ?? ''))
    .join(' ');
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getSanityPost(slug);
  if (post) {
    return buildMetadata({
      title: post.title,
      description:
        post.description ?? plainText(post.body).slice(0, 155) ?? post.title,
      path: articlePath(slug),
      image: post.mainImageUrl,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author ?? 'Silver Storey'],
    });
  }
  const article = getArticle(slug);
  if (!article) return {};
  return buildMetadata({
    title: article.title,
    description: article.description,
    path: articlePath(slug),
    type: 'article',
    keywords: article.tags,
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    authors: [article.author],
    section: CATEGORY_BY_SLUG[article.category]?.name,
    tags: article.tags,
  });
}

export default async function BlogPostRoute({ params }: Props) {
  const { slug } = await params;
  const [post, projectPages] = await Promise.all([
    getSanityPost(slug),
    getProjectPages(),
  ]);

  if (post) {
    const jsonLd = graph(
      articleSchema({
        title: post.title,
        description: post.description ?? plainText(post.body).slice(0, 155),
        path: articlePath(slug),
        image: post.mainImageUrl,
        datePublished: post.publishedAt,
        authorName: post.author,
        wordCount:
          plainText(post.body).split(/\s+/).filter(Boolean).length || undefined,
      }),
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: post.title, path: articlePath(slug) },
      ]),
    );
    return (
      <>
        <JsonLd data={jsonLd} />
        <BlogPostPage post={post} projectPages={projectPages} />
      </>
    );
  }

  const article = getArticle(slug);
  if (!article) notFound();
  const category = CATEGORY_BY_SLUG[article.category];
  const jsonLd = graph(
    articleSchema({
      title: article.title,
      description: article.description,
      path: articlePath(slug),
      image: `/api/og?title=${encodeURIComponent(article.title)}`,
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      authorName: article.author,
      wordCount: articleWordCount(article),
      keywords: article.tags,
      section: category?.name,
    }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Blog', path: '/blog' },
      ...(category
        ? [{ name: category.name, path: categoryPath(category.slug) }]
        : []),
      { name: article.title, path: articlePath(slug) },
    ]),
    article.faqs?.length ? faqSchema(article.faqs) : null,
  );
  return (
    <>
      <JsonLd data={jsonLd} />
      <ArticlePage article={article} projectPages={projectPages} />
    </>
  );
}
