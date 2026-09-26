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
  cityArea,
  faqSchema,
  graph,
  howToSchema,
  localBusinessSchema,
  serviceSchema,
  webPageSchema,
} from '@/lib/seo/schema';
import { SITE } from '@/lib/seo/site';
import { PROCESS_STEPS } from '@/lib/seo/process';
import { getProjectPageLinks } from '@/lib/db/content';
import { articlesForCity } from '@/lib/related';
import { articlePath } from '@/lib/blog';
import {
  CITIES,
  getCityInState,
  cityPath,
  statePath,
  nearbyCities,
  citiesInState,
} from '@/lib/locations';
import {
  HQ_CITY_SLUG,
  cityFaqs,
  cityIntro,
  cityMetaDescription,
  cityMetaTitle,
  cityPricing,
  cityPricingNote,
  cityTitle,
  cityWhySection,
  openingHoursLabel,
  serviceModelFor,
  studioMapUrl,
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
  const { city } = match;
  return buildMetadata({
    title: cityMetaTitle(city),
    description: cityMetaDescription(city),
    path: cityPath(city),
  });
}

export default async function CityPage({ params }: Props) {
  const { state: s, city: c } = await params;
  const match = getCityInState(s, c);
  if (!match) notFound();
  const { state, city } = match;

  const projectPages = await getProjectPageLinks();
  const path = cityPath(city);
  const isHQ = city.slug === HQ_CITY_SLUG;
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
  const guides = articlesForCity(city);
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
      description: cityMetaDescription(city),
      path,
    }),
    breadcrumbSchema(crumbs),
    // The head office is a real place only on its own city's page.
    isHQ &&
      localBusinessSchema({
        areaServed: [
          cityArea(city, state),
          ...nearby.map((n) => cityArea(n)),
          { type: 'State', name: state.name },
        ],
      }),
    serviceSchema({
      name: `Interior Design Services in ${city.name}`,
      description: intro[0],
      path,
      areaServed: [
        cityArea(city, state),
        ...nearby.slice(0, 3).map((n) => cityArea(n)),
      ],
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

      {isHQ && (
        <section
          id="studio"
          className="mx-auto max-w-6xl px-6 py-10"
          aria-labelledby="studio-title"
        >
          <h2
            id="studio-title"
            className="mb-3 text-2xl font-bold tracking-tight text-black sm:text-3xl"
          >
            Our Kolkata studio
          </h2>
          <p className="mb-8 max-w-2xl text-sm text-black/55 sm:text-base">
            Head office, design studio and manufacturing workshop — visit by
            appointment to see finishes, hardware and sample units in person.
          </p>
          <div className="glass-panel grid gap-8 rounded-xl p-6 sm:p-8 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-lg font-bold text-black">Address</h3>
              <address className="text-sm leading-relaxed text-black/70 not-italic sm:text-base">
                {SITE.name}
                <br />
                {SITE.address.street}
                <br />
                {SITE.address.city} {SITE.address.postalCode},{' '}
                {SITE.address.region}
              </address>
              <p className="mt-3 text-sm text-black/70 sm:text-base">
                Open {openingHoursLabel()}
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-black">
                <li>
                  <a
                    href={studioMapUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-2 hover:underline"
                  >
                    Open in Google Maps
                  </a>
                </li>
                {SITE.googleBusinessProfile && (
                  <li>
                    <a
                      href={SITE.googleBusinessProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline-offset-2 hover:underline"
                    >
                      Google reviews
                    </a>
                  </li>
                )}
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-bold text-black">Contact</h3>
              <ul className="space-y-2 text-sm text-black/70 sm:text-base">
                <li>
                  Call{' '}
                  <a
                    href={`tel:${SITE.phoneE164}`}
                    className="font-medium text-black underline-offset-2 hover:underline"
                  >
                    {SITE.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a
                    href={SITE.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-black underline-offset-2 hover:underline"
                  >
                    WhatsApp us
                  </a>
                </li>
                <li>
                  Email{' '}
                  <a
                    href={`mailto:${SITE.email}`}
                    className="font-medium text-black underline-offset-2 hover:underline"
                  >
                    {SITE.email}
                  </a>
                </li>
              </ul>
              <h3 className="mt-6 mb-3 text-lg font-bold text-black">
                See the work
              </h3>
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-black">
                <li>
                  <Link
                    href="/projects"
                    className="underline-offset-2 hover:underline"
                  >
                    Completed projects
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gallery"
                    className="underline-offset-2 hover:underline"
                  >
                    Room gallery
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}

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
                  className="glass-panel glass-lift flex h-full flex-col rounded-xl px-5 py-4"
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
        note={cityPricingNote(city)}
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
        <div className="glass-panel grid gap-8 rounded-xl p-6 sm:p-8 md:grid-cols-2">
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
            <div key={h.label} className="glass-panel rounded-xl p-6">
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
          We take up projects across these {city.name} neighbourhoods
          {city.landmarks?.length
            ? ` — from ${city.landmarks.slice(0, 2).join(' to ')} and everywhere in between`
            : ''}
          .
        </p>
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

      {/* Process */}
      <section
        className="mx-auto max-w-6xl px-6 py-14 sm:py-20"
        aria-labelledby="process-title"
      >
        <h2
          id="process-title"
          className="mb-8 text-2xl font-bold tracking-tight text-black sm:text-3xl"
        >
          How to get your {city.name} home designed by Silver Storey
        </h2>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROCESS_STEPS.map((st, i) => (
            <li key={st.name} className="glass-panel rounded-xl p-6">
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

      {guides.length > 0 && (
        <LinkGrid
          id="guides"
          title={`Guides for ${city.name}`}
          description="Reading from our blog that speaks to this city — costs, materials and how to choose a designer."
          columns={3}
          items={guides.map((a) => ({
            name: a.title,
            path: articlePath(a.slug),
          }))}
        />
      )}

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
