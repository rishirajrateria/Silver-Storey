import type { Metadata } from 'next';
import PricingPage from '@/features/Pricing/PricingPage';
import { PRICING_FAQS, startingPrice } from '@/features/Pricing/faqs';
import { getProjectPageLinks } from '@/lib/db/content';
import JsonLd from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import {
  breadcrumbSchema,
  faqSchema,
  graph,
  webPageSchema,
} from '@/lib/seo/schema';

const PATH = '/pricing-structure';
const TITLE = 'Interior Design Prices & Payment Schedule | Silver Storey';
const DESCRIPTION = `Kitchens from ${startingPrice('modular-kitchen')}, bedrooms from ${startingPrice('bedroom-interiors')}, 2BHK from ${startingPrice('2bhk-interior-design')}, 3BHK from ${startingPrice('3bhk-interior-design')} (Kolkata baseline). Design and 3D free; 50% advance at contract signing.`;

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Pricing Structure', path: PATH },
];

export default async function Page() {
  const projectPages = await getProjectPageLinks();
  const jsonLd = graph(
    webPageSchema({
      name: TITLE,
      description: DESCRIPTION,
      path: PATH,
    }),
    breadcrumbSchema(CRUMBS),
    faqSchema(PRICING_FAQS),
  );
  return (
    <>
      <JsonLd data={jsonLd} />
      <PricingPage projectPages={projectPages} crumbs={CRUMBS} />
    </>
  );
}
