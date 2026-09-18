import CommercialProjects from '@/features/CommercialProjects/CommercialProjects';
import {
  getProjectPage,
  getProjectPageLinks,
  COMMERCIAL_SLUG,
} from '@/lib/db/content';
import { galleryProjects as defaultGallery } from '@/features/CommercialProjects/constants';
import type { Metadata } from 'next';
import JsonLd from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, graph, webPageSchema } from '@/lib/seo/schema';

export const revalidate = 60;

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
    getProjectPage(COMMERCIAL_SLUG),
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
      path: '/commercial-projects',
      type: 'CollectionPage',
      primaryImage: page?.heroImageUrl,
    }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Commercial Projects', path: '/commercial-projects' },
    ]),
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <CommercialProjects
        gallery={gallery}
        heroImageUrl={page?.heroImageUrl}
        heroTitle={page?.heroTitle}
        heroSubtitle={page?.heroSubtitle}
        projectPages={projectPages}
      />
    </>
  );
}
