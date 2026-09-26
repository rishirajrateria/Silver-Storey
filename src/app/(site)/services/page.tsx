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
import { SERVICES, SERVICE_CATEGORIES, servicePath } from '@/lib/services';
import { formatINR } from '@/lib/locations/content';
import { TIER1_CITIES, cityPath } from '@/lib/locations';

export const revalidate = 3600;

const PATH = '/services';
const TITLE = 'Interior Design Services & Prices | Silver Storey';
const DESCRIPTION =
  'Explore Silver Storey interior design services — full home packages, 1/2/3/4 BHK interiors, modular kitchens, wardrobes, false ceilings, villas and commercial spaces — with transparent starting prices.';

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const FAQS: FAQ[] = [
  {
    question: 'Do you charge a design fee?',
    // The one commitment sentence from site.ts, so this answer never drifts
    // from the pricing page or the FAQ on a city page.
    answer: `No. ${SITE.commitment} You pay only for execution as per the itemised quote you approve.`,
  },
  {
    question: 'Can I combine services?',
    answer:
      'Yes. Most clients combine a modular kitchen with wardrobes and a living room package, or choose a full home package that includes everything. Each line item is priced separately so you can adjust scope.',
  },
  {
    question: 'Which brands do you use?',
    answer:
      'Greenply plywood, Hettich and Ebco hardware, Asian Paints, Havells electricals, Philips lighting, Kohler sanitaryware and Evara fittings, among others.',
  },
  {
    question: 'What warranty do you provide?',
    answer:
      'A 10-year warranty on modular components and workmanship, detailed on our Terms & Conditions page.',
  },
];

export default async function ServicesPage() {
  const projectPages = await getProjectPageLinks();
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: PATH },
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
      name: 'Interior design services',
      items: SERVICES.map((s) => ({ name: s.name, path: servicePath(s) })),
    }),
    faqSchema(FAQS),
  );

  return (
    <PageShell projectPages={projectPages}>
      <JsonLd data={jsonLd} />
      <PageHero
        eyebrow="Services & pricing"
        title="Interior Design Services"
        subtitle="Everything from a single wardrobe to a complete villa — designed in 3D, priced line by line, delivered in 45 days and backed by a 10-year warranty."
      >
        <Breadcrumbs items={crumbs} />
      </PageHero>
      <StatsRow />

      <section className="mx-auto max-w-4xl px-6 py-10">
        <Prose>
          <p>
            Silver Storey offers interior design as clearly scoped,
            transparently priced packages. Pick a room, a home size or a
            complete package below; every page explains exactly what is
            included, which materials we use and what it typically costs, so you
            can plan your budget before we even meet.
          </p>
        </Prose>
      </section>

      {SERVICE_CATEGORIES.map((cat) => {
        const list = SERVICES.filter((s) => s.category === cat.key);
        if (!list.length) return null;
        return (
          <section
            key={cat.key}
            className="mx-auto max-w-6xl px-6 py-10"
            aria-labelledby={`cat-${cat.key}`}
          >
            <h2
              id={`cat-${cat.key}`}
              className="mb-6 text-2xl font-bold tracking-tight text-black sm:text-3xl"
            >
              {cat.label}
            </h2>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={servicePath(s)}
                    className="glass-panel glass-lift flex h-full flex-col rounded-xl p-6"
                  >
                    <h3 className="mb-2 text-lg font-bold text-black">
                      {s.name}
                    </h3>
                    <p className="mb-4 line-clamp-3 flex-1 text-sm text-black/60">
                      {s.description}
                    </p>
                    {s.startingPriceINR && (
                      <span className="text-sm font-semibold text-[#6b1a1a]">
                        {s.category === 'commercial'
                          ? `From ₹${s.startingPriceINR.toLocaleString('en-IN')}/sq ft`
                          : `From ${formatINR(s.startingPriceINR)}`}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <LinkGrid
        id="cities"
        title="Interior design services by city"
        columns={4}
        items={TIER1_CITIES.map((c) => ({
          name: `Interior Designers in ${c.name}`,
          path: cityPath(c),
        }))}
      />

      <FAQSection faqs={FAQS} />
      <CTASection />
    </PageShell>
  );
}
