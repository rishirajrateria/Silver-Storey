import { notFound } from 'next/navigation';
import { sanityClient } from '@/lib/sanity/client';
import { urlFor } from '@/lib/sanity/image';
import {
  projectPageBySlugQuery,
  allProjectSlugsQuery,
  allProjectPagesQuery,
} from '@/lib/sanity/queries';
import type { SanityProjectPage } from '@/lib/sanity/types';
import ProjectPageTemplate from '@/features/ProjectPage/ProjectPageTemplate';
import type { Metadata } from 'next';
import { cache } from 'react';
import JsonLd from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, graph, webPageSchema } from '@/lib/seo/schema';

const getPage = cache(async (slug: string) =>
  sanityClient
    .fetch<SanityProjectPage | null>(projectPageBySlugQuery, { slug })
    .catch(() => null),
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) return {};
  const image = page.heroImage
    ? urlFor(page.heroImage).width(1200).height(630).url()
    : undefined;
  return buildMetadata({
    title: `${page.heroTitle || page.title} | Silver Storey Projects`,
    description:
      page.heroSubtitle ||
      `${page.title} — an interior design project by Silver Storey. Explore the gallery, materials and spaces we designed and delivered.`,
    path: `/projects/${slug}`,
    image,
    keywords: [
      page.title,
      `${page.title} interior design`,
      'interior design project',
    ],
  });
}

export async function generateStaticParams() {
  const slugs = await sanityClient
    .fetch<{ slug: string }[]>(allProjectSlugsQuery)
    .catch(() => [] as { slug: string }[]);
  return slugs.map(({ slug }) => ({ slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [page, projectPages] = await Promise.all([
    getPage(slug),
    sanityClient
      .fetch<{ title: string; slug: string }[]>(allProjectPagesQuery)
      .catch(() => []),
  ]);

  if (!page) notFound();

  const gallerySections = (page.gallerySections ?? []).map((section) => ({
    key: section._key,
    title: section.sectionTitle,
    items: (section.images ?? []).map((img, i) => ({
      id: i + 1,
      title: img.title,
      description: img.description ?? '',
      image: urlFor(img.image).width(640).height(800).url(),
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
      primaryImage: page.heroImage
        ? urlFor(page.heroImage).width(1200).height(630).url()
        : undefined,
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
        heroImageUrl={
          page.heroImage
            ? urlFor(page.heroImage).width(1920).height(1080).url()
            : undefined
        }
        heroTitle={page.heroTitle}
        heroSubtitle={page.heroSubtitle}
        gallerySections={gallerySections}
        projectPages={projectPages}
      />
    </>
  );
}
