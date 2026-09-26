import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPostPage from '@/features/Blog/BlogPostPage';
import ArticlePage from '@/features/Blog/ArticlePage';
import {
  getBlogPost,
  getBlogPosts,
  getProjectPageLinks,
} from '@/lib/db/content';
import {
  ARTICLES,
  getArticle,
  articlePath,
  articleWordCount,
  relatedArticles,
  CATEGORY_BY_SLUG,
  categoryPath,
} from '@/lib/blog';
import type { BlogCategory } from '@/lib/blog/categories';
import { cmsPostAsArticle } from '@/lib/blog/cms-article';
import { citiesForArticle, servicesForArticle } from '@/lib/related';
import { markdownToPlainText, markdownWordCount } from '@/lib/markdown';
import JsonLd from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import {
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  graph,
} from '@/lib/seo/schema';

export const revalidate = 3600;

export async function generateStaticParams() {
  const cms = await getBlogPosts();
  const slugs = [
    ...cms.map((p) => ({ slug: p.slug })),
    ...ARTICLES.map((a) => ({ slug: a.slug })),
  ];
  const seen = new Set<string>();
  return slugs.filter((p) =>
    seen.has(p.slug) ? false : (seen.add(p.slug), true),
  );
}

type Props = { params: Promise<{ slug: string }> };

/** One trail for both the visible breadcrumbs and the BreadcrumbList schema. */
function crumbsFor(title: string, slug: string, category?: BlogCategory) {
  return [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    ...(category
      ? [{ name: category.name, path: categoryPath(category.slug) }]
      : []),
    { name: title, path: articlePath(slug) },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const post = await getBlogPost(slug);
  if (post) {
    return buildMetadata({
      title: post.title,
      description:
        post.description ||
        markdownToPlainText(post.body).slice(0, 155) ||
        post.title,
      path: articlePath(slug),
      image: post.mainImageUrl,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author ?? 'Silver Storey'],
      section: post.category
        ? CATEGORY_BY_SLUG[post.category]?.name
        : undefined,
    });
  }

  const article = getArticle(slug);
  if (!article) return {};
  return buildMetadata({
    title: article.title,
    description: article.description,
    path: articlePath(slug),
    type: 'article',
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
    getBlogPost(slug),
    getProjectPageLinks(),
  ]);

  if (post) {
    const category = post.category
      ? CATEGORY_BY_SLUG[post.category]
      : undefined;
    const crumbs = crumbsFor(post.title, slug, category);
    const asArticle = cmsPostAsArticle(post);
    const jsonLd = graph(
      articleSchema({
        title: post.title,
        description:
          post.description || markdownToPlainText(post.body).slice(0, 155),
        path: articlePath(slug),
        image: post.mainImageUrl,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        authorName: post.author,
        wordCount: markdownWordCount(post.body) || undefined,
        section: category?.name,
      }),
      breadcrumbSchema(crumbs),
    );
    return (
      <>
        <JsonLd data={jsonLd} />
        <BlogPostPage
          post={{
            _id: post.id,
            title: post.title,
            slug: post.slug,
            description: post.description,
            author: post.author,
            category: post.category,
            publishedAt: post.publishedAt,
            updatedAt: post.updatedAt,
            mainImageUrl: post.mainImageUrl,
            body: post.body,
          }}
          crumbs={crumbs}
          services={servicesForArticle(asArticle)}
          cities={citiesForArticle(asArticle)}
          related={relatedArticles(asArticle, 3)}
          projectPages={projectPages}
        />
      </>
    );
  }

  const article = getArticle(slug);
  if (!article) notFound();
  const category = CATEGORY_BY_SLUG[article.category];
  const crumbs = crumbsFor(article.title, slug, category);
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
    breadcrumbSchema(crumbs),
    article.faqs?.length ? faqSchema(article.faqs) : null,
  );
  return (
    <>
      <JsonLd data={jsonLd} />
      <ArticlePage
        article={article}
        crumbs={crumbs}
        projectPages={projectPages}
      />
    </>
  );
}
