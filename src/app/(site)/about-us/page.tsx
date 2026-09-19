import type { Metadata } from 'next';
import AboutUsPage from '@/features/AboutUs/AboutUsPage';
import { getProjectPageLinks, getTestimonials } from '@/lib/db/content';
import {
  testimonialsToReviews,
  testimonialsToSchema,
} from '@/lib/testimonials';
import JsonLd from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import {
  breadcrumbSchema,
  graph,
  reviewsSchema,
  webPageSchema,
  ORG_ID,
} from '@/lib/seo/schema';
import { SITE, absoluteUrl } from '@/lib/seo/site';

const TITLE = 'About Silver Storey | Interior Designers Founded in Kolkata';
const DESCRIPTION = `Meet Silver Storey — founded by ${SITE.founders[0].name} and ${SITE.founders[1].name}. ${SITE.stats.yearsExperience} years of experience, ${SITE.stats.sqftTransformed} sq ft transformed, ${SITE.stats.teamMembers} experts, and a process built on free 3D design, transparent pricing and 45-day delivery.`;

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/about-us',
  keywords: [
    'about Silver Storey',
    'interior design company Kolkata',
    'Palak Singhania',
    'Subham Bhattacharya',
  ],
});

export default async function Page() {
  const [projectPages, testimonials] = await Promise.all([
    getProjectPageLinks(),
    getTestimonials(),
  ]);
  const jsonLd = graph(
    webPageSchema({
      name: TITLE,
      description: DESCRIPTION,
      path: '/about-us',
      type: 'AboutPage',
    }),
    reviewsSchema(testimonialsToSchema(testimonials)),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'About Us', path: '/about-us' },
    ]),
    ...SITE.founders.map((f) => ({
      '@type': 'Person',
      name: f.name,
      jobTitle: f.role,
      image: absoluteUrl(f.image),
      worksFor: { '@id': ORG_ID },
      url: absoluteUrl('/about-us'),
    })),
  );
  return (
    <>
      <JsonLd data={jsonLd} />
      <AboutUsPage
        projectPages={projectPages}
        reviews={testimonialsToReviews(testimonials)}
      />
    </>
  );
}
