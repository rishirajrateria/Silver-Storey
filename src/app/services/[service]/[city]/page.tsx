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
import {
  breadcrumbSchema,
  faqSchema,
  graph,
  localBusinessSchema,
  serviceSchema,
  webPageSchema,
} from '@/lib/seo/schema';
import { getProjectPages } from '@/lib/sanity/projectPages';
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
  formatINR,
  serviceCityFaqs,
  serviceCityIntro,
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
  return { service, city, state };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service: s, city: c } = await params;
  const r = resolve(s, c);
  if (!r) return {};
  const { service, city, state } = r;
  const start =
    service.startingPriceINR && service.category !== 'commercial'
      ? formatINR(
          Math.round((service.startingPriceINR * city.priceIndex) / 10000) *
            10000,
        )
      : undefined;
  return buildMetadata({
    title: `${service.shortName} in ${city.name} | ${service.name} – Silver Storey`,
    description: `${service.name} in ${city.name}, ${state.name}${start ? ` from ${start}` : ''}. Free 3D design, itemised pricing, branded materials, 45-day delivery and a 10-year warranty. Serving ${city.localities.slice(0, 3).join(', ')} and across ${city.name}.`,
    path: serviceCityPath(service, city.slug),
    keywords: [
      `${service.shortName.toLowerCase()} ${city.name}`,
      `${service.shortName.toLowerCase()} in ${city.name}`,
      `${service.name.toLowerCase()} ${city.name}`,
      `best ${service.shortName.toLowerCase()} designers in ${city.name}`,
      ...service.keywords.map((k) => `${k} ${city.name}`),
    ],
  });
}

export default async function ServiceCityPage({ params }: Props) {
  const { service: s, city: c } = await params;
  const r = resolve(s, c);
  if (!r) notFound();
  const { service, city, state } = r;

  const projectPages = await getProjectPages();
  const path = serviceCityPath(service, city.slug);
  const intro = serviceCityIntro({
    serviceName: service.name,
    serviceShort: service.shortName,
    city,
    state,
    startingPriceINR:
      service.category === 'commercial' ? undefined : service.startingPriceINR,
  });
  const faqs = serviceCityFaqs({
    serviceName: service.name,
    serviceShort: service.shortName,
    city,
    startingPriceINR:
      service.category === 'commercial' ? undefined : service.startingPriceINR,
    typicalRangeINR:
      service.category === 'commercial' ? undefined : service.typicalRangeINR,
    baseFaqs: service.faqs,
  });
  const climate = CLIMATE_GUIDANCE[city.climate];
  const nearby = nearbyCities(city, 6).filter((n) => n.tier <= 2);
  const otherServices = SERVICES_WITH_CITY_PAGES.filter(
    (x) => x.slug !== service.slug,
  );

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
    localBusinessSchema({
      id: `${path}#localbusiness`,
      url: path,
      areaServed: [{ type: 'City', name: city.name, region: state.name }],
    }),
    serviceSchema({
      name: `${service.name} in ${city.name}`,
      description: intro[0],
      path,
      serviceType: service.name,
      areaServed: [{ type: 'City', name: city.name }],
      startingPriceINR:
        service.category === 'commercial'
          ? undefined
          : service.startingPriceINR
            ? Math.round((service.startingPriceINR * city.priceIndex) / 10000) *
              10000
            : undefined,
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
            {service.shortName} for {city.name} homes
          </h2>
          <p>{intro[1]}</p>
          <p>{intro[2]}</p>
          {service.intro.slice(1, 2).map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </Prose>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 rounded-xl bg-white p-6 shadow-sm sm:p-8 md:grid-cols-2">
          <FeatureList
            title="What’s included"
            columns={1}
            items={service.includes}
          />
          <FeatureList
            title={`Specified for ${city.name}’s ${climate.label}`}
            columns={1}
            items={climate.materials}
          />
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
              className="inline-block rounded-full bg-white px-4 py-1.5 text-xs font-medium text-black/80 shadow-sm sm:text-sm"
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
        title={`Get a free 3D design for your ${city.name} ${service.shortName.toLowerCase()}`}
      />

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
