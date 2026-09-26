import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageShell from '@/components/seo/PageShell';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import FAQSection from '@/components/seo/FAQSection';
import CTASection from '@/components/seo/CTASection';
import LinkGrid from '@/components/seo/LinkGrid';
import { PageHero, Prose, StatsRow, FeatureList } from '@/components/seo/Prose';
import JsonLd from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import { isServiceCityIndexable } from '@/lib/seo/indexing';
import {
  breadcrumbSchema,
  cityArea,
  faqSchema,
  graph,
  serviceSchema,
  webPageSchema,
} from '@/lib/seo/schema';
import { getProjectPageLinks } from '@/lib/db/content';
import { articlesForService } from '@/lib/related';
import { articlePath } from '@/lib/blog';
import {
  SERVICES_WITH_CITY_PAGES,
  getService,
  servicePath,
  serviceCityPath,
} from '@/lib/services';
import {
  SERVICE_CITIES,
  getCity,
  getState,
  cityPath,
  statePath,
  nearbyCities,
} from '@/lib/locations';
import {
  CLIMATE_GUIDANCE,
  cityPrice,
  formatINR,
  lowerName,
  serviceAudience,
  serviceCityFaqs,
  serviceCityIntro,
  serviceModelFor,
} from '@/lib/locations/content';

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES_WITH_CITY_PAGES.flatMap((s) =>
    SERVICE_CITIES.map((c) => ({ service: s.slug, city: c.slug })),
  );
}

type Props = { params: Promise<{ service: string; city: string }> };

function resolve(serviceSlug: string, citySlug: string) {
  const service = getService(serviceSlug);
  const city = getCity(citySlug);
  if (!service || !service.cityPages || !city || city.tier > 2) return null;
  const state = getState(city.state);
  if (!state) return null;
  const who = serviceAudience(service.category);
  // Commercial work is priced per sq ft; a city-scaled lump sum would be wrong.
  const startingPriceINR =
    who.commercial || !service.startingPriceINR
      ? undefined
      : cityPrice(service.startingPriceINR, city);
  return { service, city, state, who, startingPriceINR };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service: s, city: c } = await params;
  const r = resolve(s, c);
  if (!r) return {};
  const { service, city, who, startingPriceINR } = r;
  const where = city.localities.slice(0, 2).join(', ');
  const promise = who.commercial
    ? 'Free 3D design, itemised quote, timelines aligned to your lease, 10-year warranty.'
    : 'Free 3D design, itemised quote, 45-day delivery, 10-year warranty.';
  return buildMetadata({
    title: `${service.shortName} in ${city.name} | Silver Storey`,
    // The city-unique clause leads so the snippet is never the boilerplate.
    description: `${service.shortName} in ${city.name}${startingPriceINR ? ` from ${formatINR(startingPriceINR)}` : ''} — ${where}. ${promise}`,
    path: serviceCityPath(service, city.slug),
    // Near-duplicate pages outside the states with real presence stay
    // crawlable but out of the index (see lib/seo/indexing.ts).
    noIndex: !isServiceCityIndexable(city),
  });
}

export default async function ServiceCityPage({ params }: Props) {
  const { service: s, city: c } = await params;
  const r = resolve(s, c);
  if (!r) notFound();
  const { service, city, state, who, startingPriceINR } = r;

  const projectPages = await getProjectPageLinks();
  const path = serviceCityPath(service, city.slug);
  const intro = serviceCityIntro({
    serviceName: service.name,
    serviceShort: service.shortName,
    category: service.category,
    city,
    state,
    startingPriceINR: who.commercial ? undefined : service.startingPriceINR,
  });
  const faqs = serviceCityFaqs({
    serviceName: service.name,
    serviceShort: service.shortName,
    category: service.category,
    city,
    materials: service.materials,
    startingPriceINR: who.commercial ? undefined : service.startingPriceINR,
    typicalRangeINR: who.commercial ? undefined : service.typicalRangeINR,
    baseFaqs: service.faqs,
  });
  const climate = CLIMATE_GUIDANCE[city.climate];
  const nearby = nearbyCities(city, 6).filter((n) => n.tier <= 2);
  const otherServices = SERVICES_WITH_CITY_PAGES.filter(
    (x) => x.slug !== service.slug,
  );
  const guides = articlesForService(service, 3);
  const short = lowerName(service.shortName);

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: service.name, path: servicePath(service) },
    { name: city.name, path },
  ];

  const jsonLd = graph(
    webPageSchema({
      name: `${service.name} in ${city.name}`,
      description: intro[0],
      path,
    }),
    breadcrumbSchema(crumbs),
    serviceSchema({
      name: `${service.name} in ${city.name}`,
      description: intro[0],
      path,
      serviceType: service.name,
      areaServed: [cityArea(city, state)],
      startingPriceINR,
    }),
    faqSchema(faqs),
  );

  return (
    <PageShell projectPages={projectPages}>
      <JsonLd data={jsonLd} />
      <PageHero
        eyebrow={`${service.name} · ${city.name}, ${state.name}`}
        title={`${service.shortName} in ${city.name}`}
        subtitle={intro[0]}
      >
        <Breadcrumbs items={crumbs} />
      </PageHero>
      <StatsRow />

      <section className="mx-auto max-w-4xl px-6 py-10">
        <Prose>
          <h2>
            {service.shortName} for {city.name} {who.spaces}
          </h2>
          <p>{intro[1]}</p>
          <p>{intro[2]}</p>
          {service.intro.slice(1, 2).map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </Prose>
      </section>

      {/* The quotable service-model sentence, in the same words on every page. */}
      <section
        id="how-we-work"
        className="mx-auto max-w-4xl px-6 py-10"
        aria-labelledby="how-we-work-title"
      >
        <div className="glass-panel rounded-xl p-6 sm:p-8">
          <h2
            id="how-we-work-title"
            className="mb-3 text-2xl font-bold tracking-tight text-black sm:text-3xl"
          >
            How we work in {city.name}
          </h2>
          <p className="text-sm leading-relaxed text-black/70 sm:text-base">
            {serviceModelFor(city.state)}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="glass-panel grid gap-8 rounded-xl p-6 sm:p-8 md:grid-cols-2">
          <FeatureList
            title="What’s included"
            columns={1}
            items={service.includes}
          />
          {who.commercial ? (
            <FeatureList
              title="Materials & systems"
              columns={1}
              items={service.materials}
            />
          ) : (
            <FeatureList
              title={`Specified for ${city.name}’s ${climate.label}`}
              columns={1}
              items={climate.materials}
            />
          )}
        </div>
      </section>

      <section
        className="mx-auto max-w-6xl px-6 py-10"
        aria-labelledby="areas-title"
      >
        <h2
          id="areas-title"
          className="mb-4 text-2xl font-bold tracking-tight text-black sm:text-3xl"
        >
          {service.shortName} across {city.name}
        </h2>
        <ul className="flex flex-wrap gap-2">
          {city.localities.map((l) => (
            <li
              key={l}
              className="glass-panel inline-block rounded-full px-4 py-1.5 text-xs font-medium text-black/80 sm:text-sm"
            >
              {l}
            </li>
          ))}
        </ul>
      </section>

      <FAQSection
        faqs={faqs}
        title={`${service.shortName} in ${city.name} — FAQs`}
      />
      <CTASection
        title={`Get a free 3D design for your ${city.name} ${short}`}
      />

      {guides.length > 0 && (
        <LinkGrid
          id="guides"
          title="Guides & advice"
          columns={3}
          items={guides.map((a) => ({
            name: a.title,
            path: articlePath(a.slug),
          }))}
        />
      )}

      <LinkGrid
        id="other-services"
        title={`Other services in ${city.name}`}
        columns={3}
        items={otherServices.map((x) => ({
          name: `${x.shortName} in ${city.name}`,
          path: serviceCityPath(x, city.slug),
        }))}
      />
      {nearby.length > 0 && (
        <LinkGrid
          id="nearby"
          title={`${service.shortName} near ${city.name}`}
          columns={3}
          items={nearby.map((n) => ({
            name: `${service.shortName} in ${n.name}`,
            path: serviceCityPath(service, n.slug),
          }))}
        />
      )}
      <div className="mx-auto max-w-6xl px-6 pb-16 text-sm text-black/50">
        <Link
          href={cityPath(city)}
          className="underline-offset-2 hover:underline"
        >
          ← All interior design services in {city.name}
        </Link>
        <span className="mx-2">·</span>
        <Link
          href={statePath(state)}
          className="underline-offset-2 hover:underline"
        >
          Interior designers in {state.name}
        </Link>
      </div>
    </PageShell>
  );
}
