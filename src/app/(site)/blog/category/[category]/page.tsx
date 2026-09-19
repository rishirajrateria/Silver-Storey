import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogListPage from '@/features/Blog/BlogListPage';
import { getProjectPageLinks } from '@/lib/db/content';
import {
  BLOG_CATEGORIES,
  CATEGORY_BY_SLUG,
  categoryPath,
  getBlogItemsByCategory,
  articlePath,
} from '@/lib/blog';
import JsonLd from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import {
  breadcrumbSchema,
  graph,
  itemListSchema,
  webPageSchema,
} from '@/lib/seo/schema';

export const revalidate = 60;
export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_CATEGORIES.map((c) => ({ category: c.slug }));
}

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const c = CATEGORY_BY_SLUG[category];
  if (!c) return {};
  return buildMetadata({
    title: `${c.name} | Silver Storey Blog`,
    description: c.description,
    path: categoryPath(c.slug),
  });
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const c = CATEGORY_BY_SLUG[category];
  if (!c) notFound();
  const [posts, projectPages] = await Promise.all([
    getBlogItemsByCategory(c.slug),
    getProjectPageLinks(),
  ]);
  const jsonLd = graph(
    webPageSchema({
      name: c.name,
      description: c.description,
      path: categoryPath(c.slug),
      type: 'CollectionPage',
    }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Blog', path: '/blog' },
      { name: c.name, path: categoryPath(c.slug) },
    ]),
    itemListSchema({
      name: c.name,
      items: posts.map((p) => ({ name: p.title, path: articlePath(p.slug) })),
    }),
  );
  return (
    <>
      <JsonLd data={jsonLd} />
      <BlogListPage
        posts={posts}
        projectPages={projectPages}
        title={c.name}
        subtitle={c.description}
        categories={[
          { name: 'All articles', slug: 'all', href: '/blog' },
          ...BLOG_CATEGORIES.map((x) => ({
            name: x.name,
            slug: x.slug,
            href: categoryPath(x.slug),
            active: x.slug === c.slug,
          })),
        ]}
      />
    </>
  );
}
