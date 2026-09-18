import ResidentialProjects from '@/features/ResidentialProjects/ResidentialProjects';
import {
  getProjectPage,
  getProjectPageLinks,
  RESIDENTIAL_SLUG,
} from '@/lib/db/content';
import { galleryProjects as defaultGallery } from '@/features/ResidentialProjects/constants';
import type { Metadata } from 'next';
import JsonLd from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, graph, webPageSchema } from '@/lib/seo/schema';

export const revalidate = 60;

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
    getProjectPage(RESIDENTIAL_SLUG),
    getProjectPageLinks(),
  ]);

  const gallery =
    page && page.sections.length > 0
      ? page.sections
          .flatMap((section) => section.images)
          .map((item, i) => ({
            id: i + 1,
            title: item.title,
            description: item.description,
            image: item.imageUrl,
          }))
      : defaultGallery;

  const jsonLd = graph(
    webPageSchema({
      name: TITLE,
      description: DESCRIPTION,
      path: '/residential-projects',
      type: 'CollectionPage',
      primaryImage: page?.heroImageUrl,
    }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Residential Projects', path: '/residential-projects' },
    ]),
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <ResidentialProjects
        gallery={gallery}
        heroImageUrl={page?.heroImageUrl}
        heroTitle={page?.heroTitle}
        heroSubtitle={page?.heroSubtitle}
        projectPages={projectPages}
      />
    </>
  );
}
