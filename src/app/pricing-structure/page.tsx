import type { Metadata } from 'next';
import PricingPage from '@/features/Pricing/PricingPage';
import { getProjectPageLinks } from '@/lib/db/content';
import JsonLd from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import {
  breadcrumbSchema,
  faqSchema,
  graph,
  webPageSchema,
} from '@/lib/seo/schema';

const TITLE =
  'Interior Design Pricing Structure | Transparent Costs – Silver Storey';
const DESCRIPTION =
  'Understand how Silver Storey prices interiors: free design and 3D visualisation, itemised execution quotes, room-wise starting prices (kitchens from ₹1.4 L, bedrooms from ₹2.1 L, living rooms from ₹2.4 L) and no hidden charges.';

const FAQS = [
  {
    question: 'Is there a design fee?',
    answer:
      'No — consultation, site measurement and 3D visualisation are complimentary for residential projects.',
  },
  {
    question: 'What are the starting prices?',
    answer:
      'Dining from ₹1 lakh, modular kitchen from ₹1.4 lakh, bathroom from ₹1.8 lakh, home office from ₹2 lakh, bedroom from ₹2.1 lakh and living room from ₹2.4 lakh. Full 2BHK homes start around ₹5.5 lakh and 3BHK around ₹8 lakh.',
  },
  {
    question: 'Are there hidden charges?',
    answer:
      'No. The itemised quote you approve is the amount you pay; any change requested later is priced and approved in writing before it is done.',
  },
  {
    question: 'What payment schedule do you follow?',
    answer:
      'A small token to book the project, followed by milestone payments aligned to design approval, material procurement and handover, all detailed in your agreement.',
  },
];

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/pricing-structure',
  keywords: [
    'interior design pricing',
    'interior design cost',
    'interior designer charges',
    'home interior cost India',
  ],
});

export default async function Page() {
  const projectPages = await getProjectPageLinks();
  const jsonLd = graph(
    webPageSchema({
      name: TITLE,
      description: DESCRIPTION,
      path: '/pricing-structure',
    }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Pricing Structure', path: '/pricing-structure' },
    ]),
    faqSchema(FAQS),
  );
  return (
    <>
      <JsonLd data={jsonLd} />
      <PricingPage projectPages={projectPages} />
    </>
  );
}
