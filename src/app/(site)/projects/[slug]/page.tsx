import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProjectPageTemplate from '@/features/ProjectPage/ProjectPageTemplate';
import { projectDescription } from '@/features/ProjectPage/description';
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
    title: `${page.title} — Interior Design Case Study | Silver Storey`,
    description: projectDescription(page),
    path: `/projects/${slug}`,
    image: page.heroImageUrl,
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

  const path = `/projects/${slug}`;
  const description = projectDescription(page);
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: page.title, path },
  ];

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

  const jsonLd = graph(
    webPageSchema({
      name: page.title,
      description,
      path,
      type: 'ItemPage',
      primaryImage: page.heroImageUrl,
      dateModified: page.updatedAt.toISOString(),
    }),
    imageGallerySchema({
      name: `${page.title} — project gallery`,
      path,
      images: page.sections.flatMap((s) =>
        s.images.map((i) => ({ url: i.imageUrl, caption: i.title })),
      ),
    }),
    breadcrumbSchema(crumbs),
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <ProjectPageTemplate
        title={page.title}
        slug={slug}
        heroImageUrl={page.heroImageUrl}
        heroSubtitle={page.heroSubtitle}
        crumbs={crumbs}
        gallerySections={gallerySections}
        projectPages={projectPages}
        caseStudy={caseStudy}
      />
    </>
  );
}
