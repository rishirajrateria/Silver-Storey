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
  itemListSchema,
  serviceSchema,
  webPageSchema,
} from '@/lib/seo/schema';
import { getProjectPageLinks } from '@/lib/db/content';
import {
  STATES,
  getState,
  citiesInState,
  cityPath,
  statePath,
  cityForDistrict,
} from '@/lib/locations';
import {
  stateFaqs,
  stateMetaDescription,
  stateMetaTitle,
  stateTitle,
} from '@/lib/locations/content';
import { SERVICES, servicePath } from '@/lib/services';

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return STATES.map((s) => ({ state: s.slug }));
}

type Props = { params: Promise<{ state: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: slug } = await params;
  const state = getState(slug);
  if (!state) return {};
  return buildMetadata({
    title: stateMetaTitle(state),
    description: stateMetaDescription(state),
    path: statePath(state),
    keywords: [
      `interior designers in ${state.name}`,
      `best interior designer ${state.name}`,
      `home interior ${state.name}`,
      `interior design company ${state.name}`,
    ],
  });
}

export default async function StatePage({ params }: Props) {
  const { state: slug } = await params;
  const state = getState(slug);
  if (!state) notFound();

  const [projectPages] = await Promise.all([getProjectPageLinks()]);
  const cities = citiesInState(state.slug);
  const faqs = stateFaqs(state);
  const path = statePath(state);
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Interior Designers in India', path: '/interior-designers' },
    { name: state.name, path },
  ];
  const siblings = STATES.filter(
    (s) => s.region === state.region && s.slug !== state.slug,
  );

  const jsonLd = graph(
    webPageSchema({
      name: stateTitle(state),
      description: stateMetaDescription(state),
      path,
      type: 'CollectionPage',
    }),
    breadcrumbSchema(crumbs),
    serviceSchema({
      name: `Interior Design Services in ${state.name}`,
      description: stateMetaDescription(state),
      path,
      areaServed: [{ type: 'State', name: state.name }],
    }),
    cities.length
      ? itemListSchema({
          name: `Interior designers in ${state.name} by city`,
          items: cities.map((c) => ({
            name: `Interior Designers in ${c.name}`,
            path: cityPath(c),
          })),
        })
      : null,
    faqSchema(faqs),
  );

  return (
    <PageShell projectPages={projectPages}>
      <JsonLd data={jsonLd} />
      <PageHero
        eyebrow={`${state.kind === 'ut' ? 'Union Territory' : 'State'} · ${state.region} India · Capital: ${state.capital}`}
        title={stateTitle(state)}
        subtitle={state.intro}
      >
        <Breadcrumbs items={crumbs} />
      </PageHero>

      <StatsRow />

      <section className="mx-auto max-w-4xl px-6 py-10">
        <Prose>
          <h2>Designing homes in {state.name}: what we consider</h2>
          <ul>
            {state.designNotes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          {state.languages?.length ? (
            <p>
              Our {state.name} clients can work with us in English, Hindi
              {state.languages.length
                ? ` and ${state.languages.join(' / ')}`
                : ''}
              , and every design is approved in 3D before execution begins.
            </p>
          ) : null}
        </Prose>
      </section>

      {cities.length > 0 && (
        <LinkGrid
          id="cities"
          title={`Interior designers in ${state.name} by city`}
          description={`Dedicated pages with local pricing, materials guidance and the neighbourhoods we serve in each ${state.name} city.`}
          columns={3}
          items={cities.map((c) => ({
            name: `Interior Designers in ${c.name}`,
            path: cityPath(c),
            meta:
              c.district && c.district !== c.name
                ? `${c.district} district`
                : undefined,
          }))}
        />
      )}

      <section
        id="districts"
        className="mx-auto max-w-6xl px-6 py-14 sm:py-20"
        aria-labelledby="districts-title"
      >
        <h2
          id="districts-title"
          className="mb-3 text-2xl font-bold tracking-tight text-black sm:text-3xl"
        >
          Districts of {state.name} we serve
        </h2>
        <p className="mb-8 max-w-2xl text-sm text-black/55 sm:text-base">
          We take up residential and commercial interior projects across all{' '}
          {state.districts.length} districts of {state.name}. Districts with a
          dedicated city page are linked.
        </p>
        <ul className="flex flex-wrap gap-2">
          {state.districts.map((d) => {
            const city = cityForDistrict(state.slug, d);
            return city ? (
              <li key={d}>
                <Link
                  href={cityPath(city)}
                  className="inline-block rounded-full bg-black px-4 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-80 sm:text-sm"
                >
                  {d}
                </Link>
              </li>
            ) : (
              <li
                key={d}
                className="glass-panel inline-block rounded-full px-4 py-1.5 text-xs font-medium text-black/70 sm:text-sm"
              >
                {d}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="glass-panel grid gap-8 rounded-xl p-6 sm:p-8 md:grid-cols-2">
          <FeatureList
            title={`What we design in ${state.name}`}
            columns={1}
            items={SERVICES.slice(0, 8).map((s) => s.name)}
          />
          <FeatureList
            title="Why families choose Silver Storey"
            columns={1}
            items={[
              'Complimentary 3D visualisation before execution',
              'Itemised, transparent quote — no hidden charges',
              'Own manufacturing workshop; delivery in 45 days',
              '10-year warranty on modular components and workmanship',
              'Branded materials: Greenply, Hettich, Ebco, Asian Paints, Havells, Kohler',
              'Dedicated project manager with weekly progress reports',
            ]}
          />
        </div>
      </section>

      <LinkGrid
        id="services"
        title={`Interior design services in ${state.name}`}
        items={SERVICES.map((s) => ({ name: s.name, path: servicePath(s) }))}
      />

      <FAQSection
        faqs={faqs}
        title={`Interior designers in ${state.name} — FAQs`}
      />
      <CTASection title={`Planning a home or office in ${state.name}?`} />

      {siblings.length > 0 && (
        <LinkGrid
          id="nearby-states"
          title={`Also serving ${state.region} India`}
          columns={4}
          items={siblings.map((s) => ({
            name: `Interior Designers in ${s.name}`,
            path: statePath(s),
          }))}
        />
      )}
    </PageShell>
  );
}
