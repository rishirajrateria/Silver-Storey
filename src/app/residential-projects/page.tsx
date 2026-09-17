import ResidentialProjects from '@/features/ResidentialProjects/ResidentialProjects';
import { sanityClient } from '@/lib/sanity/client';
import { urlFor } from '@/lib/sanity/image';
import {
  projectPageBySlugQuery,
  allProjectPagesQuery,
} from '@/lib/sanity/queries';
import type { SanityProjectPage } from '@/lib/sanity/types';
import type { Metadata } from 'next';
import JsonLd from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, graph, webPageSchema } from '@/lib/seo/schema';
import { galleryProjects as defaultGallery } from '@/features/ResidentialProjects/constants';

const TITLE = 'Residential Interior Design Projects | Silver Storey Portfolio';
const DESCRIPTION =
  'Browse Silver Storey residential interior projects — living rooms, modular kitchens, bedrooms and complete homes across Kolkata and India, designed in 3D and delivered in 45 days.';

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/residential-projects',
  keywords: [
    'residential interior design',
    'home interior projects',
    'interior design portfolio',
    'residential interior designers',
  ],
});

export default async function ResidentialProjectsPage() {
  const [page, projectPages] = await Promise.all([
    sanityClient
      .fetch<SanityProjectPage | null>(projectPageBySlugQuery, {
        slug: 'residential-projects',
      })
      .catch(() => null),
    sanityClient
      .fetch<{ title: string; slug: string }[]>(allProjectPagesQuery)
      .catch(() => []),
  ]);

  const gallery =
    page && page.gallerySections?.length > 0
      ? page.gallerySections
          .flatMap((section) => section.images ?? [])
          .map((item, i) => ({
            id: i + 1,
            title: item.title,
            description: item.description ?? '',
            image: urlFor(item.image).width(640).height(800).url(),
          }))
      : defaultGallery;

  const jsonLd = graph(
    webPageSchema({
      name: TITLE,
      description: DESCRIPTION,
      path: '/residential-projects',
      type: 'CollectionPage',
      primaryImage: page?.heroImage
        ? urlFor(page.heroImage).width(1200).height(630).url()
        : undefined,
    }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: TITLE.split(' | ')[0], path: '/residential-projects' },
    ]),
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <ResidentialProjects
        gallery={gallery}
        heroImageUrl={
          page?.heroImage
            ? urlFor(page.heroImage).width(1920).height(1080).url()
            : undefined
        }
        heroTitle={page?.heroTitle}
        heroSubtitle={page?.heroSubtitle}
        projectPages={projectPages}
      />
    </>
  );
}
