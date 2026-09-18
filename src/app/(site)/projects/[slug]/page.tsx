import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProjectPageTemplate from '@/features/ProjectPage/ProjectPageTemplate';
import {
  getAllProjectSlugs,
  getProjectPage,
  getProjectPageLinks,
  RESIDENTIAL_SLUG,
  COMMERCIAL_SLUG,
} from '@/lib/db/content';
import JsonLd from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, graph, webPageSchema } from '@/lib/seo/schema';

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs
    .filter(({ slug }) => slug !== RESIDENTIAL_SLUG && slug !== COMMERCIAL_SLUG)
    .map(({ slug }) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getProjectPage(slug);
  if (!page) return {};
  return buildMetadata({
    title: `${page.heroTitle || page.title} | Silver Storey Projects`,
    description:
      page.heroSubtitle ||
      `${page.title} — an interior design project by Silver Storey. Explore the gallery, materials and spaces we designed and delivered.`,
    path: `/projects/${slug}`,
    image: page.heroImageUrl,
    keywords: [
      page.title,
      `${page.title} interior design`,
      'interior design project',
    ],
  });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const [page, projectPages] = await Promise.all([
    getProjectPage(slug),
    getProjectPageLinks(),
  ]);

  if (!page) notFound();

  const gallerySections = page.sections.map((section) => ({
    key: section.id,
    title: section.title,
    items: section.images.map((img, i) => ({
      id: i + 1,
      title: img.title,
      description: img.description,
      image: img.imageUrl,
    })),
  }));

  const jsonLd = graph(
    webPageSchema({
      name: page.heroTitle || page.title,
      description:
        page.heroSubtitle ||
        `${page.title} — interior design project by Silver Storey.`,
      path: `/projects/${slug}`,
      type: 'CollectionPage',
      primaryImage: page.heroImageUrl,
    }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Projects', path: '/residential-projects' },
      { name: page.title, path: `/projects/${slug}` },
    ]),
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <ProjectPageTemplate
        heroImageUrl={page.heroImageUrl}
        heroTitle={page.heroTitle}
        heroSubtitle={page.heroSubtitle}
        gallerySections={gallerySections}
        projectPages={projectPages}
      />
    </>
  );
}
