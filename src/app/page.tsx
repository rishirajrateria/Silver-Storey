import React from 'react';
import type { Metadata } from 'next';
import Hero from '../features/Hero/Hero';
import { sanityClient } from '@/lib/sanity/client';
import { urlFor } from '@/lib/sanity/image';
import {
  categoriesQuery,
  videosQuery,
  allProjectPagesQuery,
  brochureQuery,
} from '@/lib/sanity/queries';
import type { SanityCategory, SanityVideo } from '@/lib/sanity/types';
import JsonLd from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import {
  faqSchema,
  graph,
  howToSchema,
  localBusinessSchema,
  webPageSchema,
} from '@/lib/seo/schema';
import { PROCESS_STEPS } from '@/lib/seo/process';
import { SITE } from '@/lib/seo/site';

// ISR: cached for 60s and refreshed on-demand by the Sanity webhook (/api/revalidate).
export const revalidate = 60;

const HOME_TITLE =
  'Silver Storey | Premium Interior Designers in Kolkata & Across India';
const HOME_DESCRIPTION =
  'Silver Storey — best interior designers for homes & offices. Turnkey interiors with free 3D visualisation, transparent pricing, delivery in 45 days and a 10-year warranty. Headquartered in Kolkata, serving 150+ cities across India.';

export const metadata: Metadata = buildMetadata({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  path: '/',
  image: '/opengraph-image',
  keywords: [
    'interior designers in Kolkata',
    'best interior designer in Kolkata',
    'interior design company Kolkata',
    'home interior designers India',
    'turnkey interior design',
  ],
});

const HOME_FAQS = [
  {
    question: 'Why choose Silver Storey as your interior designer?',
    answer:
      'Four reasons our clients cite most: complimentary 3D visualisation so you see the design before it is built, transparent itemised pricing with no hidden charges, delivery within 45 days of design approval from our own workshop, and a 10-year warranty on modular components and workmanship.',
  },
  {
    question: 'Where is Silver Storey located and which cities do you serve?',
    answer: `Our head office and workshop are at ${SITE.address.street}, Kolkata ${SITE.address.postalCode}. We serve Kolkata and West Bengal locally and run projects across 150+ cities in every Indian state and union territory through on-site consultations and dedicated project managers.`,
  },
  {
    question: 'How much does interior design cost with Silver Storey?',
    answer:
      'Design, measurement and 3D visualisation are free. Execution is priced per itemised quote — modular kitchens from about ₹1.4 lakh, bedrooms from ₹2.1 lakh, living rooms from ₹2.4 lakh, 2BHK full homes from ₹5.5 lakh and 3BHK from ₹8 lakh.',
  },
  {
    question: 'How do I get started?',
    answer: `Call or WhatsApp ${SITE.phoneDisplay}, email ${SITE.email}, or book a free 30-minute consultation online. We will visit your site or meet on video, measure the space and share an estimate within days.`,
  },
];

export default async function Home() {
  const [rawCategories, videos, projectPages, brochure] = await Promise.all([
    sanityClient.fetch<SanityCategory[]>(categoriesQuery).catch((e) => {
      console.error('CATEGORIES FETCH ERROR:', e);
      return [] as SanityCategory[];
    }),
    sanityClient.fetch<SanityVideo[]>(videosQuery).catch((e) => {
      console.error('VIDEOS FETCH ERROR:', e);
      return [] as SanityVideo[];
    }),
    sanityClient
      .fetch<{ title: string; slug: string }[]>(allProjectPagesQuery)
      .then((pages) => pages ?? [])
      .catch((e) => {
        console.error('[Sanity] PROJECT PAGES ERROR:', e);
        return [] as { title: string; slug: string }[];
      }),
    sanityClient.fetch<{ url: string } | null>(brochureQuery).catch(() => null),
  ]);

  const categories = rawCategories.map((cat) => ({
    name: cat.name,
    price: cat.price,
    imageUrl: cat.image
      ? urlFor(cat.image).width(400).height(500).url()
      : undefined,
  }));

  const jsonLd = graph(
    webPageSchema({
      name: HOME_TITLE,
      description: HOME_DESCRIPTION,
      path: '/',
      primaryImage: '/opengraph-image',
    }),
    localBusinessSchema(),
    howToSchema({
      name: 'How Silver Storey designs and delivers your home',
      description: 'Six steps from a free consultation to handover in 45 days.',
      steps: PROCESS_STEPS,
      totalTime: 'P45D',
    }),
    faqSchema(HOME_FAQS),
  );

  return (
    <>
      <JsonLd id="home-jsonld" data={jsonLd} />
      <Hero
        categories={categories}
        videos={videos}
        projectPages={projectPages}
        brochureUrl={brochure?.url}
      />
    </>
  );
}
