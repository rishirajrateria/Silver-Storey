import type { Metadata } from 'next';
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
  howToSchema,
  serviceSchema,
  webPageSchema,
} from '@/lib/seo/schema';
import { PROCESS_STEPS } from '@/lib/seo/process';
import { getProjectPageLinks } from '@/lib/db/content';
import { articlesForService } from '@/lib/related';
import { articlePath } from '@/lib/blog';
import {
  SERVICES,
  getService,
  servicePath,
  serviceCityPath,
} from '@/lib/services';
import { SERVICE_CITIES, TIER1_CITIES, cityPath } from '@/lib/locations';
import { formatINR, lowerName } from '@/lib/locations/content';

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((s) => ({ service: s.slug }));
}

type Props = { params: Promise<{ service: string }> };

function priceLabel(s: NonNullable<ReturnType<typeof getService>>) {
  if (!s.startingPriceINR) return undefined;
  return s.category === 'commercial'
    ? `₹${s.startingPriceINR.toLocaleString('en-IN')} per sq ft`
    : formatINR(s.startingPriceINR);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service: slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return buildMetadata({
    title: `${s.name} | Silver Storey`,
    description: s.description,
    path: servicePath(s),
  });
}

export default async function ServicePage({ params }: Props) {
  const { service: slug } = await params;
  const s = getService(slug);
  if (!s) notFound();

  const projectPages = await getProjectPageLinks();
  const path = servicePath(s);
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: s.name, path },
  ];
  const related = s.related.map(getService).filter(Boolean) as NonNullable<
    ReturnType<typeof getService>
  >[];
  const price = priceLabel(s);
  const guides = articlesForService(s);
  const short = lowerName(s.shortName);

  const jsonLd = graph(
    webPageSchema({ name: s.name, description: s.description, path }),
    breadcrumbSchema(crumbs),
    serviceSchema({
      name: s.name,
      description: s.description,
      path,
      serviceType: s.name,
      startingPriceINR:
        s.category === 'commercial' ? undefined : s.startingPriceINR,
    }),
    howToSchema({
      name: `How ${short} projects work at Silver Storey`,
      description: 'Six steps from free consultation to handover.',
      steps: PROCESS_STEPS,
      totalTime: 'P45D',
    }),
    faqSchema(s.faqs),
  );

  return (
    <PageShell projectPages={projectPages}>
      <JsonLd data={jsonLd} />
      <PageHero
        eyebrow={price ? `Starting from ${price}` : 'Interior design service'}
        title={s.name}
        subtitle={s.intro[0]}
      >
        <Breadcrumbs items={crumbs} />
      </PageHero>
      <StatsRow />

      <section className="mx-auto max-w-4xl px-6 py-10">
        <Prose>
          {s.intro.slice(1).map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </Prose>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="glass-panel grid gap-8 rounded-xl p-6 sm:p-8 md:grid-cols-2">
          <FeatureList title="What’s included" columns={1} items={s.includes} />
          <FeatureList
            title="Materials & brands"
            columns={1}
            items={s.materials}
          />
        </div>
      </section>

      {s.typicalRangeINR && (
        <section
          className="mx-auto max-w-4xl px-6 py-10"
          aria-labelledby="cost-title"
        >
          <h2
            id="cost-title"
            className="mb-3 text-2xl font-bold tracking-tight text-black sm:text-3xl"
          >
            {s.shortName} cost
          </h2>
          <div className="glass-panel rounded-xl p-6 sm:p-8">
            <p className="text-3xl font-bold text-[#6b1a1a]">
              {s.category === 'commercial'
                ? `₹${s.typicalRangeINR[0].toLocaleString('en-IN')} – ₹${s.typicalRangeINR[1].toLocaleString('en-IN')} per sq ft`
                : `${formatINR(s.typicalRangeINR[0])} – ${formatINR(s.typicalRangeINR[1])}`}
            </p>
            <p className="mt-3 text-sm text-black/60 sm:text-base">
              {s.priceNote ??
                'Indicative range. Every quote is itemised and the consultation, measurement and 3D visualisation are complimentary.'}
            </p>
          </div>
        </section>
      )}

      <section
        className="mx-auto max-w-6xl px-6 py-14 sm:py-20"
        aria-labelledby="process-title"
      >
        <h2
          id="process-title"
          className="mb-8 text-2xl font-bold tracking-tight text-black sm:text-3xl"
        >
          How {short} projects work at Silver Storey
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

      <FAQSection faqs={s.faqs} title={`${s.name} — FAQs`} />
      <CTASection title={`Get a free 3D design for your ${short}`} />

      {guides.length > 0 && (
        <LinkGrid
          id="guides"
          title="Guides & advice"
          description="Reading from our blog before you brief a designer — costs, materials and how to compare quotes."
          columns={3}
          items={guides.map((a) => ({
            name: a.title,
            path: articlePath(a.slug),
          }))}
        />
      )}

      {s.cityPages ? (
        <LinkGrid
          id="cities"
          title={`${s.shortName} by city`}
          description="City-specific pricing, materials guidance and neighbourhoods served."
          columns={4}
          items={SERVICE_CITIES.map((c) => ({
            name: `${s.shortName} in ${c.name}`,
            path: serviceCityPath(s, c.slug),
          }))}
        />
      ) : (
        <LinkGrid
          id="cities"
          title="Interior designers by city"
          columns={4}
          items={TIER1_CITIES.map((c) => ({
            name: `Interior Designers in ${c.name}`,
            path: cityPath(c),
          }))}
        />
      )}

      {related.length > 0 && (
        <LinkGrid
          id="related"
          title="Related services"
          columns={3}
          items={related.map((r) => ({ name: r.name, path: servicePath(r) }))}
        />
      )}
    </PageShell>
  );
}
