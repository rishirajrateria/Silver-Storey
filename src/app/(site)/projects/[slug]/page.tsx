import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProjectPageTemplate from '@/features/ProjectPage/ProjectPageTemplate';
import {
  getAllProjectSlugs,
  getProjectPage,
  getProjectPageLinks,
  RESERVED_PROJECT_SLUGS,
} from '@/lib/db/content';
import JsonLd from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import {
  breadcrumbSchema,
  graph,
  imageGallerySchema,
  webPageSchema,
} from '@/lib/seo/schema';
import { markdownToPlainText } from '@/lib/markdown';

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs
    .filter(({ slug }) => !RESERVED_PROJECT_SLUGS.includes(slug))
    .map(({ slug }) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (RESERVED_PROJECT_SLUGS.includes(slug)) return {};
  const page = await getProjectPage(slug);
  if (!page) return {};
  return buildMetadata({
    title: `${page.heroTitle || page.title} | Silver Storey Projects`,
    description:
      page.heroSubtitle ||
      (page.summary ? markdownToPlainText(page.summary).slice(0, 160) : '') ||
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
  // Reserved slugs have their own route or none at all, so this route must not
  // serve them as a second copy at /projects/<slug>.
  if (RESERVED_PROJECT_SLUGS.includes(slug)) notFound();

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
      roomType: img.roomType,
    })),
  }));

  const caseStudy = {
    summary: page.summary,
    location: page.location,
    areaSqft: page.areaSqft,
    budget: page.budget,
    durationDays: page.durationDays,
    propertyType: page.propertyType,
    style: page.style,
    materials: page.materials,
    clientName: page.clientName,
    clientQuote: page.clientQuote,
    beforeImageUrl: page.beforeImageUrl,
    afterImageUrl: page.afterImageUrl,
  };
  const description =
    page.heroSubtitle ||
    (page.summary ? markdownToPlainText(page.summary).slice(0, 160) : '') ||
    `${page.title} — interior design project by Silver Storey.`;

  const jsonLd = graph(
    webPageSchema({
      name: page.heroTitle || page.title,
      description,
      path: `/projects/${slug}`,
      type: 'CollectionPage',
      primaryImage: page.heroImageUrl,
      dateModified: page.updatedAt.toISOString(),
    }),
    imageGallerySchema({
      name: `${page.heroTitle || page.title} — project gallery`,
      path: `/projects/${slug}`,
      images: page.sections.flatMap((s) =>
        s.images.map((i) => ({ url: i.imageUrl, caption: i.title })),
      ),
    }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Gallery', path: '/gallery' },
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
        caseStudy={caseStudy}
      />
    </>
  );
}
