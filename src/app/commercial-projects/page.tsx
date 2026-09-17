import CommercialProjects from '@/features/CommercialProjects/CommercialProjects';
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
import { galleryProjects as defaultGallery } from '@/features/CommercialProjects/constants';

const TITLE = 'Commercial Interior Design Projects | Silver Storey Portfolio';
const DESCRIPTION =
  'Explore Silver Storey commercial interiors — offices, retail stores, cafés and clinics — designed for brand, productivity and fast, on-schedule fit-outs across India.';

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/commercial-projects',
  keywords: [
    'commercial interior design',
    'office interior projects',
    'retail interior design',
    'commercial interior designers',
  ],
});

export default async function CommercialProjectsPage() {
  const [page, projectPages] = await Promise.all([
    sanityClient
      .fetch<SanityProjectPage | null>(projectPageBySlugQuery, {
        slug: 'commercial-projects',
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
      path: '/commercial-projects',
      type: 'CollectionPage',
      primaryImage: page?.heroImage
        ? urlFor(page.heroImage).width(1200).height(630).url()
        : undefined,
    }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: TITLE.split(' | ')[0], path: '/commercial-projects' },
    ]),
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <CommercialProjects
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
