import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Hero from '@/features/Hero/Hero';
import HomeIntro from '@/features/Hero/components/HomeIntro';
import FAQSection from '@/components/seo/FAQSection';
import {
  getBrochureUrl,
  getCategories,
  getProjectPageLinks,
  getTestimonials,
  getVideos,
} from '@/lib/db/content';
import {
  testimonialsToReviews,
  testimonialsToSchema,
} from '@/lib/testimonials';
import JsonLd from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import {
  faqSchema,
  graph,
  howToSchema,
  localBusinessSchema,
  reviewsSchema,
  videoObjectSchema,
  webPageSchema,
} from '@/lib/seo/schema';
import { PROCESS_STEPS } from '@/lib/seo/process';
import { SITE } from '@/lib/seo/site';
import { SERVICE_BY_SLUG } from '@/lib/services';
import { formatINR } from '@/lib/locations/content';

// ISR: the admin panel revalidates this page on every save, so the timer
// only has to catch anything that bypasses it.
export const revalidate = 3600;

const HOME_TITLE =
  'Interior Designers in Kolkata & Across India | Silver Storey';
const HOME_DESCRIPTION = `Turnkey interior designers headquartered in Kolkata, working across India. Free 3D visualisation, itemised pricing, ${SITE.stats.deliveryDays}-day delivery, ${SITE.warranty.termYears}-year warranty.`;

export const metadata: Metadata = buildMetadata({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  path: '/',
  image: '/opengraph-image',
  imageWidth: 1200,
  imageHeight: 630,
});

/** Indicative Kolkata starting price for a service, as the catalogue lists it. */
function from(slug: string) {
  return formatINR(SERVICE_BY_SLUG[slug].startingPriceINR ?? 0);
}

const HOME_FAQS = [
  {
    question: 'Why choose Silver Storey as your interior designer?',
    answer: `Every project gets four things: complimentary 3D visualisation so you see the design before it is built, itemised pricing you approve before work begins, delivery within ${SITE.stats.deliveryDays} days of design approval from our own Kolkata workshop, and a ${SITE.warranty.termYears}-year warranty on modular components and workmanship.`,
  },
  {
    question: 'Where is Silver Storey located and which cities do you serve?',
    answer: `Our head office and manufacturing workshop are at ${SITE.address.street}, ${SITE.address.city} ${SITE.address.postalCode}, ${SITE.address.region}. Kolkata and West Bengal are our home market, with site visits and showroom appointments. ${SITE.serviceModel.outstation}`,
  },
  {
    question: 'How much does interior design cost with Silver Storey?',
    answer: `${SITE.commitment.split('. ')[0]}. Execution is priced line by line: modular kitchens from ${from('modular-kitchen')}, bedrooms from ${from('bedroom-interiors')}, living rooms from ${from('living-room-interiors')}, 2BHK homes from ${from('2bhk-interior-design')} and 3BHK homes from ${from('3bhk-interior-design')} — indicative Kolkata starting prices; every quote is itemised.`,
  },
  {
    question: 'How do I get started?',
    answer: `Call or WhatsApp ${SITE.phoneDisplay}, email ${SITE.email}, or book a free 30-minute consultation online. We meet at your site or over video, measure the space and share an itemised estimate before you commit to anything.`,
  },
];

const HOW_TO_DESCRIPTION = `Six steps from a free consultation to handover in ${SITE.stats.deliveryDays} days.`;

/** The HowTo schema's steps, on the page where people can read them. */
function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-title"
      className="mx-auto max-w-6xl px-6 py-14 sm:py-20"
    >
      <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-[#6b1a1a] uppercase">
        Our process
      </p>
      <h2
        id="how-it-works-title"
        className="mb-3 text-2xl font-bold tracking-tight text-black sm:text-3xl"
      >
        How it works
      </h2>
      <p className="mb-8 max-w-2xl text-sm text-black/55 sm:text-base">
        {HOW_TO_DESCRIPTION}
      </p>
      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PROCESS_STEPS.map((step, i) => (
          <li key={step.name} className="glass-panel rounded-xl px-5 py-5">
            <span className="text-xs font-semibold tracking-[0.2em] text-[#6b1a1a] uppercase">
              Step {i + 1}
            </span>
            <h3 className="mt-1 text-base font-bold text-black">{step.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-black/65">
              {step.text}
            </p>
          </li>
        ))}
      </ol>
      <Link
        href="/how-it-works"
        className="mt-8 inline-flex rounded-full border border-black px-6 py-2.5 text-sm font-medium text-black transition-colors hover:bg-black hover:text-white"
      >
        The full process →
      </Link>
    </section>
  );
}

export default async function Home() {
  const [categories, videos, projectPages, brochureUrl, testimonials] =
    await Promise.all([
      getCategories(),
      getVideos(),
      getProjectPageLinks(),
      getBrochureUrl(),
      getTestimonials(),
    ]);

  const jsonLd = graph(
    webPageSchema({
      name: HOME_TITLE,
      description: HOME_DESCRIPTION,
      path: '/',
      primaryImage: '/opengraph-image',
      hasBreadcrumb: false,
    }),
    // The head office: the one place a LocalBusiness node belongs.
    localBusinessSchema(),
    howToSchema({
      name: 'How Silver Storey designs and delivers your home',
      description: HOW_TO_DESCRIPTION,
      steps: PROCESS_STEPS,
      totalTime: 'P45D',
    }),
    faqSchema(HOME_FAQS),
    ...videos.map((v) =>
      videoObjectSchema({
        title: v.title,
        youtubeId: v.youtubeId,
        description: v.description,
        uploadDate: v.createdAt,
      }),
    ),
    // Ratings only from real, published testimonials — never invented.
    reviewsSchema(testimonialsToSchema(testimonials)),
  );

  return (
    <>
      <JsonLd id="home-jsonld" data={jsonLd} />
      <Hero
        categories={categories}
        videos={videos}
        projectPages={projectPages}
        brochureUrl={brochureUrl}
        reviews={testimonialsToReviews(testimonials)}
        intro={<HomeIntro />}
      >
        <HowItWorks />
        <FAQSection faqs={HOME_FAQS} />
      </Hero>
    </>
  );
}
