import type { Metadata } from 'next';
import BlogListPage from '@/features/Blog/BlogListPage';
import { getProjectPages } from '@/lib/sanity/projectPages';
import {
  getAllBlogItems,
  BLOG_CATEGORIES,
  categoryPath,
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

const TITLE =
  'Interior Design Blog | Cost Guides, Ideas & Expert Advice – Silver Storey';
const DESCRIPTION =
  'Practical interior design guides from Silver Storey — cost breakdowns, modular kitchen advice, materials comparisons, vastu tips, city guides and design ideas for Indian homes and offices.';

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/blog',
  keywords: [
    'interior design blog',
    'interior design tips India',
    'home interior ideas',
    'interior design cost guide',
  ],
});

export default async function BlogPage() {
  const [posts, projectPages] = await Promise.all([
    getAllBlogItems(),
    getProjectPages(),
  ]);
  const jsonLd = graph(
    webPageSchema({
      name: TITLE,
      description: DESCRIPTION,
      path: '/blog',
      type: 'CollectionPage',
    }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Blog', path: '/blog' },
    ]),
    itemListSchema({
      name: 'Latest articles',
      items: posts
        .slice(0, 20)
        .map((p) => ({ name: p.title, path: articlePath(p.slug) })),
    }),
  );
  return (
    <>
      <JsonLd data={jsonLd} />
      <BlogListPage
        posts={posts}
        projectPages={projectPages}
        categories={BLOG_CATEGORIES.map((c) => ({
          name: c.name,
          slug: c.slug,
          href: categoryPath(c.slug),
        }))}
      />
    </>
  );
}
