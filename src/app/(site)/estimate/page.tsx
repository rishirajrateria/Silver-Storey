import type { Metadata } from 'next';
import PageShell from '@/components/seo/PageShell';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import FAQSection from '@/components/seo/FAQSection';
import CTASection from '@/components/seo/CTASection';
import LinkGrid from '@/components/seo/LinkGrid';
import { PageHero, Prose } from '@/components/seo/Prose';
import EstimateCalculator from '@/features/Estimate/EstimateCalculator';
import JsonLd from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import {
  breadcrumbSchema,
  faqSchema,
  graph,
  webPageSchema,
  type FAQ,
} from '@/lib/seo/schema';
import { getProjectPageLinks } from '@/lib/db/content';
import { CITIES, TIER1_CITIES, cityPath } from '@/lib/locations';
import { SERVICES, servicePath } from '@/lib/services';

export const revalidate = 3600;

const PATH = '/estimate';
const TITLE = 'Interior Design Cost Calculator India | Silver Storey';
const DESCRIPTION =
  'Estimate your home interior cost in 60 seconds. Pick your city, home size and finish level for an instant ₹ range with EMI, based on Silver Storey’s published price book — free 3D design and itemised quote to follow.';

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  keywords: [
    'interior design cost calculator',
    'home interior cost estimate',
    'interior design budget calculator India',
    '2BHK interior cost',
    '3BHK interior cost',
    'interior design EMI',
  ],
});

const FAQS: FAQ[] = [
  {
    question: 'How accurate is this estimate?',
    answer:
      'It is an indicative range built from our real price book — the same starting prices published on every service and city page — adjusted for your city and finish level. The exact figure comes from a site measurement and an itemised quote, both of which are free.',
  },
  {
    question: 'What does a "full home" estimate include?',
    answer:
      'Modular kitchen, wardrobes in every bedroom, TV and storage units, false ceiling with lighting in the living and bedrooms, and wall paint. Loose furniture, civil changes and electrical rework are optional add-ons because not every home needs them.',
  },
  {
    question: 'Why does the price change with the city?',
    answer:
      'Skilled labour rates, transport of modular units from our Kolkata workshop, local material markets and society working-hour rules all vary. We index each city against the Kolkata baseline so the estimate is realistic wherever you are.',
  },
  {
    question: 'Can I pay for my interiors in EMI?',
    answer:
      'Yes. Many clients use a personal loan or a home-improvement loan from their bank; several NBFCs also offer interior-specific financing. The EMI shown here is an illustration at the rate you choose — we can introduce partner lenders during your consultation.',
  },
  {
    question: 'Is there a design fee?',
    answer:
      'No. Consultation, measurement and 3D visualisation are complimentary for residential projects. You pay only for execution, as per the quote you approve.',
  },
];

export default async function EstimatePage() {
  const projectPages = await getProjectPageLinks();
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Cost calculator', path: PATH },
  ];
  const cities = CITIES.map((c) => ({
    slug: c.slug,
    name: c.name,
    state: c.state,
    priceIndex: c.priceIndex,
  }));
  const jsonLd = graph(
    webPageSchema({ name: TITLE, description: DESCRIPTION, path: PATH }),
    breadcrumbSchema(crumbs),
    faqSchema(FAQS),
  );

  return (
    <PageShell projectPages={projectPages}>
      <JsonLd data={jsonLd} />
      <PageHero
        eyebrow="Free · instant · no sign-up"
        title="Interior Design Cost Calculator"
        subtitle="Answer four questions and get a realistic ₹ range for your home — with an EMI illustration. Built from the same price book we quote from, so there are no surprises later."
      >
        <Breadcrumbs items={crumbs} />
      </PageHero>

      <section className="mx-auto max-w-6xl px-6 py-6">
        <EstimateCalculator cities={cities} />
      </section>

      <section className="mx-auto max-w-4xl px-6 py-10">
        <Prose>
          <h2>How the calculator works</h2>
          <p>
            Every Silver Storey quote is itemised, so we know what each scope of
            work costs at each finish level. The calculator starts from our
            Kolkata price book — for example a 2BHK full home from ₹5.5 lakh and
            a modular kitchen from ₹1.4 lakh — scales it by your city’s cost
            index, and then places the estimate within the band according to the
            finish you choose. Add-ons such as civil work or loose furniture are
            added as a share of the base, which is how they typically land on
            real projects.
          </p>
          <p>
            The result is deliberately shown as a range. Two 3BHKs of the same
            size can differ by 40% once shutter finishes, countertop stone and
            lighting are chosen — which is exactly what the free 3D
            visualisation stage settles before anything is manufactured.
          </p>
        </Prose>
      </section>

      <LinkGrid
        id="services"
        title="See what each service includes"
        columns={3}
        items={SERVICES.filter((s) => s.startingPriceINR).map((s) => ({
          name: s.name,
          path: servicePath(s),
        }))}
      />
      <LinkGrid
        id="cities"
        title="Interior design prices by city"
        columns={4}
        items={TIER1_CITIES.map((c) => ({
          name: `Interior Designers in ${c.name}`,
          path: cityPath(c),
        }))}
      />

      <FAQSection faqs={FAQS} />
      <CTASection
        title="Turn the estimate into a real quote"
        subtitle="Book a free consultation. We measure, design in 3D and send an itemised quote — no design fee."
      />
    </PageShell>
  );
}
