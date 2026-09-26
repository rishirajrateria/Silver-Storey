import type { Metadata } from 'next';
import AboutUsPage from '@/features/AboutUs/AboutUsPage';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
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
} from '@/lib/seo/schema';
import { SITE, brandStatement, keyFacts } from '@/lib/seo/site';

const PATH = '/about-us';
const TITLE = `About Silver Storey | Interior Designers in Kolkata since ${SITE.foundingYear}`;
const DESCRIPTION = `Founded in ${SITE.foundingYear} in ${SITE.address.locality}, Kolkata by ${SITE.founders.map((f) => f.name).join(' and ')}: turnkey interiors, free 3D design, itemised quotes, ${SITE.warranty.termYears}-year warranty.`;

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: PATH },
];

export default async function Page() {
  const [projectPages, testimonials] = await Promise.all([
    getProjectPageLinks(),
    getTestimonials(),
  ]);
  // The founders' Person nodes live in the root layout graph; the anchors
  // below are what their @ids resolve to, so they are not repeated here.
  const jsonLd = graph(
    webPageSchema({
      name: TITLE,
      description: DESCRIPTION,
      path: PATH,
      type: 'AboutPage',
    }),
    reviewsSchema(testimonialsToSchema(testimonials)),
    breadcrumbSchema(CRUMBS),
  );
  return (
    <main>
      <JsonLd data={jsonLd} />

      {/* Fact block: plain server HTML, so every crawler reads the same entity. */}
      <header className="mx-auto max-w-6xl px-6 pt-16 pb-6 sm:pt-24">
        <Breadcrumbs items={CRUMBS} />
        <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-[#6b1a1a] uppercase">
          {SITE.tagline}
        </p>
        <h1 className="mb-5 text-4xl leading-tight font-bold tracking-tight text-black sm:text-5xl lg:text-6xl">
          About Silver Storey — Interior Designers in Kolkata since{' '}
          {SITE.foundingYear}
        </h1>
        <div className="max-w-3xl space-y-4 text-base leading-relaxed text-black/70 sm:text-lg">
          <p>{brandStatement()}</p>
          <p>{SITE.serviceModel.hq}</p>
          <p>{SITE.serviceModel.outstation}</p>
        </div>
      </header>

      <section
        className="mx-auto max-w-6xl px-6 py-8"
        aria-labelledby="key-facts-title"
      >
        <h2
          id="key-facts-title"
          className="mb-4 text-2xl font-bold tracking-tight text-black sm:text-3xl"
        >
          Key facts
        </h2>
        <dl className="glass-panel grid gap-x-8 gap-y-3 rounded-xl px-6 py-5 sm:grid-cols-2">
          {keyFacts().map((fact) => (
            <div
              key={fact.label}
              className="flex flex-col gap-0.5 sm:flex-row sm:gap-3"
            >
              <dt className="shrink-0 text-xs tracking-wide text-black/50 uppercase sm:w-36 sm:pt-1">
                {fact.label}
              </dt>
              <dd className="text-sm text-black sm:text-base">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section
        className="mx-auto max-w-6xl px-6 py-8"
        aria-labelledby="founders-title"
      >
        <h2
          id="founders-title"
          className="mb-4 text-2xl font-bold tracking-tight text-black sm:text-3xl"
        >
          Founders
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {SITE.founders.map((founder) => (
            <li
              key={founder.slug}
              id={founder.slug}
              className="glass-panel flex scroll-mt-24 items-center gap-5 rounded-xl p-5"
            >
              <img
                src={founder.image}
                alt={founder.name}
                width={96}
                height={120}
                loading="lazy"
                decoding="async"
                className="h-30 w-24 shrink-0 rounded-2xl object-cover"
              />
              <div>
                <p className="text-lg font-bold text-black">{founder.name}</p>
                <p className="text-sm text-black/60">{founder.role}</p>
                {founder.credentials && (
                  <p className="mt-1 text-sm text-black/60">
                    {founder.credentials}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <AboutUsPage
        projectPages={projectPages}
        reviews={testimonialsToReviews(testimonials)}
      />
    </main>
  );
}
