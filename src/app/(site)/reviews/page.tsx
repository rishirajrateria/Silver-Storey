import type { Metadata } from 'next';
import ReviewsPage from '@/features/Reviews/ReviewsPage';
import { getProjectPageLinks, getTestimonials } from '@/lib/db/content';
import { testimonialsToSchema } from '@/lib/testimonials';
import JsonLd from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import {
  breadcrumbSchema,
  graph,
  reviewsSchema,
  webPageSchema,
} from '@/lib/seo/schema';
import { SITE } from '@/lib/seo/site';

export const revalidate = 3600;

const PATH = '/reviews';
const TITLE = 'Silver Storey Reviews | What Clients Say';
const DESCRIPTION = `Reviews from Silver Storey clients, in their own words: homes and offices designed in ${SITE.address.city} and across India with free 3D design and a ${SITE.warranty.termYears}-year warranty.`;

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Reviews', path: PATH },
];

// getTestimonials is request-cached, so the page and its metadata share one
// query. A page with no reviews yet is kept out of the index: an empty
// "reviews" result is worse than none.
export async function generateMetadata(): Promise<Metadata> {
  const rows = await getTestimonials();
  return buildMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: PATH,
    noIndex: rows.length === 0,
  });
}

export default async function Page() {
  const [rows, projectPages] = await Promise.all([
    getTestimonials(),
    getProjectPageLinks(),
  ]);
  const jsonLd = graph(
    webPageSchema({
      name: TITLE,
      description: DESCRIPTION,
      path: PATH,
      type: 'CollectionPage',
    }),
    breadcrumbSchema(CRUMBS),
    rows.length ? reviewsSchema(testimonialsToSchema(rows)) : null,
  );
  return (
    <>
      <JsonLd data={jsonLd} />
      <ReviewsPage rows={rows} projectPages={projectPages} crumbs={CRUMBS} />
    </>
  );
}
