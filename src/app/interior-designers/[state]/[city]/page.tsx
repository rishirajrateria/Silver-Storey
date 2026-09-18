import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageShell from '@/components/seo/PageShell';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import FAQSection from '@/components/seo/FAQSection';
import CTASection from '@/components/seo/CTASection';
import LinkGrid from '@/components/seo/LinkGrid';
import PricingTable from '@/components/seo/PricingTable';
import { PageHero, Prose, StatsRow, FeatureList } from '@/components/seo/Prose';
import JsonLd from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import {
  breadcrumbSchema,
  faqSchema,
  graph,
  howToSchema,
  localBusinessSchema,
  serviceSchema,
  webPageSchema,
} from '@/lib/seo/schema';
import { PROCESS_STEPS } from '@/lib/seo/process';
import { getProjectPages } from '@/lib/sanity/projectPages';
import {
  CITIES,
  getCityInState,
  cityPath,
  statePath,
  nearbyCities,
  citiesInState,
} from '@/lib/locations';
import {
  cityFaqs,
  cityIntro,
  cityMetaDescription,
  cityMetaTitle,
  cityPricing,
  cityTitle,
  cityWhySection,
} from '@/lib/locations/content';
import { SERVICES, servicePath, serviceCityPath } from '@/lib/services';

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return CITIES.map((c) => ({ state: c.state, city: c.slug }));
}

type Props = { params: Promise<{ state: string; city: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: s, city: c } = await params;
  const match = getCityInState(s, c);
  if (!match) return {};
  const { state, city } = match;
  return buildMetadata({
    title: cityMetaTitle(city),
    description: cityMetaDescription(city, state),
    path: cityPath(city),
    keywords: [
      `interior designers in ${city.name}`,
      `best interior designer in ${city.name}`,
      `interior designer ${city.name}`,
      `home interior design ${city.name}`,
      `modular kitchen ${city.name}`,
      `interior decorators in ${city.name}`,
      ...(city.aka ?? []).map((a) => `interior designers in ${a}`),
    ],
  });
}

export default async function CityPage({ params }: Props) {
  const { state: s, city: c } = await params;
  const match = getCityInState(s, c);
  if (!match) notFound();
  const { state, city } = match;

  const projectPages = await getProjectPages();
  const path = cityPath(city);
  const intro = cityIntro(city, state);
  const faqs = cityFaqs(city, state);
  const pricing = cityPricing(city);
  const why = cityWhySection(city);
  const nearby = nearbyCities(city, 6);
  const others = citiesInState(city.state)
    .filter(
      (x) => x.slug !== city.slug && !nearby.some((n) => n.slug === x.slug),
    )
    .slice(0, 8);
  const hasServiceCityPages = city.tier <= 2;

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Interior Designers in India', path: '/interior-designers' },
    { name: state.name, path: statePath(state) },
    { name: city.name, path },
  ];

  const jsonLd = graph(
    webPageSchema({
      name: cityTitle(city),
      description: cityMetaDescription(city, state),
      path,
    }),
    breadcrumbSchema(crumbs),
    localBusinessSchema({
      id: `${path}#localbusiness`,
      url: path,
      name: `Silver Storey — Interior Designers in ${city.name}`,
      description: cityMetaDescription(city, state),
      areaServed: [
        { type: 'City', name: city.name, region: state.name },
        ...nearby
          .slice(0, 3)
          .map((n) => ({ type: 'City' as const, name: n.name })),
      ],
    }),
    serviceSchema({
      name: `Interior Design Services in ${city.name}`,
      description: intro[0],
      path,
      areaServed: [{ type: 'City', name: city.name }],
      startingPriceINR: pricing.find((r) => r.key === 'kitchen')?.from,
    }),
    howToSchema({
      name: `How to get your ${city.name} home designed by Silver Storey`,
      description:
        'Our six-step process from free consultation to handover in 45 days.',
      steps: PROCESS_STEPS,
      totalTime: 'P45D',
    }),
    faqSchema(faqs),
  );

  return (
    <PageShell projectPages={projectPages}>
      <JsonLd data={jsonLd} />
      <PageHero
        eyebrow={`Interior designers · ${state.name}${city.district && city.district !== city.name ? ` · ${city.district} district` : ''}`}
        title={cityTitle(city)}
        subtitle={intro[0]}
      >
        <Breadcrumbs items={crumbs} />
      </PageHero>

      <StatsRow />

      <section className="mx-auto max-w-4xl px-6 py-10">
        <Prose>
          <h2>Home interior design in {city.name}</h2>
          <p>{intro[1]}</p>
          <p>{intro[2]}</p>
          <p>{intro[3]}</p>
        </Prose>
      </section>

      {/* Services in this city */}
      <section
        id="services"
        className="mx-auto max-w-6xl px-6 py-14 sm:py-20"
        aria-labelledby="svc-title"
      >
        <h2
          id="svc-title"
          className="mb-3 text-2xl font-bold tracking-tight text-black sm:text-3xl"
        >
          Interior design services in {city.name}
        </h2>
        <p className="mb-8 max-w-2xl text-sm text-black/55 sm:text-base">
          Room-wise, BHK-wise and complete home packages, plus commercial
          interiors — all with complimentary 3D design.
        </p>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((svc) => {
            const href =
              hasServiceCityPages && svc.cityPages
                ? serviceCityPath(svc, city.slug)
                : servicePath(svc);
            const label =
              hasServiceCityPages && svc.cityPages
                ? `${svc.shortName} in ${city.name}`
                : svc.name;
            return (
              <li key={svc.slug}>
                <Link
                  href={href}
                  className="flex h-full flex-col rounded-xl bg-white px-5 py-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="text-sm font-semibold text-black">
                    {label}
                  </span>
                  <span className="mt-1 line-clamp-2 text-xs text-black/50">
                    {svc.description}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <PricingTable
        title={`Interior design cost in ${city.name}`}
        rows={pricing}
      />

      {/* Climate + housing */}
      <section
        className="mx-auto max-w-6xl px-6 py-14 sm:py-20"
        aria-labelledby="why-title"
      >
        <h2
          id="why-title"
          className="mb-3 text-2xl font-bold tracking-tight text-black sm:text-3xl"
        >
          {why.climateTitle}
        </h2>
        <p className="mb-8 max-w-3xl text-sm text-black/60 sm:text-base">
          {why.climateSummary}
        </p>
        <div className="grid gap-8 rounded-xl bg-white p-6 shadow-sm sm:p-8 md:grid-cols-2">
          <FeatureList
            title={`What we specify in ${city.name}`}
            columns={1}
            items={why.materials}
          />
          <FeatureList title="What we avoid" columns={1} items={why.avoid} />
        </div>

        <h2 className="mt-14 mb-6 text-2xl font-bold tracking-tight text-black sm:text-3xl">
          {why.housingTitle}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {why.housing.map((h) => (
            <div key={h.label} className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-lg font-bold text-black capitalize">
                {h.label}
              </h3>
              <p className="text-sm text-black/65 sm:text-base">{h.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Localities */}
      <section
        id="areas"
        className="mx-auto max-w-6xl px-6 py-14 sm:py-20"
        aria-labelledby="areas-title"
      >
        <h2
          id="areas-title"
          className="mb-3 text-2xl font-bold tracking-tight text-black sm:text-3xl"
        >
          Areas we serve in {city.name}
        </h2>
        <p className="mb-6 max-w-2xl text-sm text-black/55 sm:text-base">
          Our {city.name} projects are spread across these neighbourhoods and
          beyond
          {city.landmarks?.length
            ? ` — from ${city.landmarks.slice(0, 2).join(' to ')} and everywhere in between`
            : ''}
          .
        </p>
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

      {/* Process */}
      <section
        className="mx-auto max-w-6xl px-6 py-14 sm:py-20"
        aria-labelledby="process-title"
      >
        <h2
          id="process-title"
          className="mb-8 text-2xl font-bold tracking-tight text-black sm:text-3xl"
        >
          How it works in {city.name}
        </h2>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROCESS_STEPS.map((st, i) => (
            <li key={st.name} className="rounded-xl bg-white p-6 shadow-sm">
              <span className="mb-2 block text-xs font-semibold tracking-[0.2em] text-[#6b1a1a]">
                STEP {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mb-2 text-lg font-bold text-black">{st.name}</h3>
              <p className="text-sm text-black/65">{st.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <FAQSection
        faqs={faqs}
        title={`Interior designers in ${city.name} — FAQs`}
      />
      <CTASection title={`Ready to design your ${city.name} home?`} />

      <LinkGrid
        id="nearby"
        title={`Interior designers near ${city.name}`}
        columns={3}
        items={nearby.map((n) => ({
          name: `Interior Designers in ${n.name}`,
          path: cityPath(n),
        }))}
      />
      {others.length > 0 && (
        <LinkGrid
          id="more-in-state"
          title={`More cities in ${state.name}`}
          columns={4}
          items={others.map((n) => ({ name: n.name, path: cityPath(n) }))}
        />
      )}
      <div className="mx-auto max-w-6xl px-6 pb-16 text-sm text-black/50">
        <Link
          href={statePath(state)}
          className="underline-offset-2 hover:underline"
        >
          ← All interior designers in {state.name}
        </Link>
      </div>
    </PageShell>
  );
}
