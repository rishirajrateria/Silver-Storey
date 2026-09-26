import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/seo/PageShell';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import FAQSection from '@/components/seo/FAQSection';
import CTASection from '@/components/seo/CTASection';
import LinkGrid from '@/components/seo/LinkGrid';
import { PageHero, Prose, StatsRow } from '@/components/seo/Prose';
import JsonLd from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import {
  breadcrumbSchema,
  faqSchema,
  graph,
  itemListSchema,
  webPageSchema,
  type FAQ,
} from '@/lib/seo/schema';
import { SITE } from '@/lib/seo/site';
import { getProjectPageLinks } from '@/lib/db/content';
import {
  CITIES,
  TIER1_CITIES,
  cityPath,
  statePath,
  statesByRegion,
  citiesInState,
} from '@/lib/locations';
import { SERVICES, servicePath } from '@/lib/services';

export const revalidate = 3600;

const PATH = '/interior-designers';
const TITLE = 'Interior Designers in India | Silver Storey';
// The city count comes from the dataset, so the number never drifts from the pages that exist.
const DESCRIPTION = `Interior designers across India — pages for ${CITIES.length} cities in all 28 states and 8 UTs. Free 3D design, itemised pricing, 45-day delivery, 10-year warranty.`;

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const FAQS: FAQ[] = [
  {
    question: 'How do I choose an interior designer in India?',
    answer: `Choose one who shows you the design in 3D before building, gives a fixed itemised price, uses branded materials and stands behind the work with a written warranty. Silver Storey does all four — complimentary 3D visualisation, transparent pricing, Greenply/Hettich/Asian Paints/Kohler materials and a 10-year warranty — with city pages for ${CITIES.length} Indian cities.`,
  },
  {
    question: 'How much does an interior designer cost in India?',
    answer:
      'At Silver Storey the design itself is free — consultation, measurement and 3D visualisation are complimentary. Execution is priced per itemised quote: modular kitchens from about ₹1.4 lakh, 2BHK full homes from ₹5.5 lakh, 3BHK from ₹8 lakh and villas from ₹18 lakh. Costs vary by city, carpet area and finish grade.',
  },
  {
    question: 'Which cities does Silver Storey serve?',
    answer: `We have dedicated coverage for ${CITIES.length} cities across every state and union territory — from our home base in Kolkata to Mumbai, Delhi, Bengaluru, Hyderabad, Chennai, Pune, Ahmedabad, Guwahati and beyond — and take up projects in other towns on request.`,
  },
  {
    question: 'How long does a home interior project take?',
    answer:
      'Most homes are delivered within 45 days of design approval. Design and 3D visualisation typically take 2–3 weeks before that.',
  },
  {
    question: 'Do you handle projects outside Kolkata?',
    answer:
      'Yes. Silver Storey is headquartered in Kolkata and runs projects across India through on-site consultations, a dedicated project manager, supervised execution teams and weekly photo and video progress reports.',
  },
  {
    question: 'What is included in a turnkey interior package?',
    answer:
      'Space planning, modular kitchen, wardrobes and storage, false ceilings and lighting, wall finishes, loose furniture, soft furnishings and styling, plus coordination of electrical and plumbing — a complete move-in-ready home from one team with one quote.',
  },
];

export default async function InteriorDesignersIndiaPage() {
  const projectPages = await getProjectPageLinks();
  const regions = statesByRegion();
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Interior Designers in India', path: PATH },
  ];

  const jsonLd = graph(
    webPageSchema({
      name: TITLE,
      description: DESCRIPTION,
      path: PATH,
      type: 'CollectionPage',
    }),
    breadcrumbSchema(crumbs),
    itemListSchema({
      name: 'Interior designers by city',
      items: TIER1_CITIES.map((c) => ({
        name: `Interior Designers in ${c.name}`,
        path: cityPath(c),
      })),
    }),
    faqSchema(FAQS),
  );

  return (
    <PageShell projectPages={projectPages}>
      <JsonLd data={jsonLd} />
      <PageHero
        eyebrow="Pan-India interior design studio"
        title="Interior Designers in India"
        subtitle={`Silver Storey takes up turnkey home and commercial interiors across all 28 states and 8 union territories of India, with dedicated pages for ${CITIES.length} cities — complimentary 3D visualisation, transparent itemised pricing, delivery in 45 days and a 10-year warranty.`}
      >
        <Breadcrumbs items={crumbs} />
      </PageHero>

      <StatsRow />

      <section className="mx-auto max-w-4xl px-6 py-10">
        <Prose>
          <p>
            Finding a good interior designer in India usually means choosing
            between a local carpenter with no design capability, a freelance
            designer with no execution team, or a large platform that treats
            your home as a catalogue order. Silver Storey was founded in Kolkata
            by {SITE.founders[0].name} and {SITE.founders[1].name} to offer a
            fourth option: a design-led studio with its own manufacturing
            workshop, fixed pricing and a single project manager from the first
            sketch to the final handover.
          </p>
          <p>
            Over {SITE.stats.yearsExperience} years we have transformed more
            than {SITE.stats.sqftTransformed} sq ft of homes, offices and
            hospitality spaces. Every project follows the same six-step process
            — meet our expert, get a free estimate, book with a token, approve
            complimentary 3D visualisations, sign off the design, and move in
            within 45 days — whether it is a 1BHK in Thane or a bungalow in
            Ludhiana.
          </p>
          <p>
            Because India is not one climate, we specify differently for every
            region: marine-grade boards and stainless hardware on the humid
            coasts of Mumbai, Chennai and Kochi; heat-stable finishes and stone
            floors in Jaipur, Ahmedabad and Nagpur; insulated envelopes and
            engineered wood in Shimla, Dehradun and Gangtok. Choose your city
            below to see local pricing, materials guidance and the
            neighbourhoods we serve.
          </p>
        </Prose>
      </section>

      <LinkGrid
        id="metros"
        title="Interior designers in major cities"
        description="Our most active markets, with dedicated design coverage and city-specific pricing."
        columns={4}
        items={TIER1_CITIES.map((c) => ({ name: c.name, path: cityPath(c) }))}
      />

      <section
        id="states"
        className="mx-auto max-w-6xl px-6 py-14 sm:py-20"
        aria-labelledby="states-title"
      >
        <h2
          id="states-title"
          className="mb-3 text-2xl font-bold tracking-tight text-black sm:text-3xl"
        >
          Interior designers by state and union territory
        </h2>
        <p className="mb-8 max-w-2xl text-sm text-black/55 sm:text-base">
          Every state and UT has its own hub page with district coverage,
          regional design guidance and links to city pages.
        </p>
        <div className="grid gap-8 md:grid-cols-2">
          {regions.map(({ region, states }) => (
            <div key={region} className="glass-panel rounded-xl p-6">
              <h3 className="mb-4 text-lg font-bold text-black">
                {region} India
              </h3>
              <ul className="space-y-2">
                {states.map((s) => {
                  const n = citiesInState(s.slug).length;
                  return (
                    <li
                      key={s.slug}
                      className="flex items-center justify-between text-sm"
                    >
                      <Link
                        href={statePath(s)}
                        className="font-medium text-black underline-offset-2 hover:underline"
                      >
                        {s.name}
                      </Link>
                      <span className="text-xs text-black/40">
                        {n
                          ? `${n} ${n === 1 ? 'city' : 'cities'}`
                          : 'on request'}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <LinkGrid
        id="services"
        title="What we design"
        description="Room-wise, BHK-wise and complete home packages, plus commercial interiors — each with transparent starting prices."
        items={SERVICES.map((s) => ({ name: s.name, path: servicePath(s) }))}
      />

      <FAQSection faqs={FAQS} title="Interior designers in India — FAQs" />
      <CTASection />
    </PageShell>
  );
}
