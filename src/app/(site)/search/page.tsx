import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/seo/PageShell';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import CTASection from '@/components/seo/CTASection';
import { PageHero } from '@/components/seo/Prose';
import { buildMetadata } from '@/lib/seo/metadata';
import { getProjectPageLinks } from '@/lib/db/content';
import { searchSite, type SearchHit } from '@/lib/search';

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Search | Silver Storey',
    description:
      'Search Silver Storey services, cities, projects, lookbooks and articles.',
    path: '/search',
  }),
  robots: { index: false, follow: true },
};

const TYPE_LABELS: Record<SearchHit['type'], string> = {
  city: 'City',
  state: 'State',
  service: 'Service',
  article: 'Article',
  project: 'Project',
  lookbook: 'Lookbook',
  page: 'Page',
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = '' } = await searchParams;
  const query = q.trim().slice(0, 100);
  const [projectPages, hits] = await Promise.all([
    getProjectPageLinks(),
    query ? searchSite(query) : Promise.resolve([]),
  ]);
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Search', path: '/search' },
  ];

  return (
    <PageShell projectPages={projectPages}>
      <PageHero
        title={query ? `Results for “${query}”` : 'Search'}
        subtitle={
          query
            ? `${hits.length} result${hits.length === 1 ? '' : 's'} across services, cities, projects, lookbooks and articles.`
            : 'Find a city, a service, a project or an article.'
        }
      >
        <Breadcrumbs items={crumbs} />
      </PageHero>

      <section className="mx-auto max-w-4xl px-6 pb-6">
        <form
          action="/search"
          method="get"
          role="search"
          className="flex gap-2"
        >
          <label htmlFor="q" className="sr-only">
            Search
          </label>
          <input
            id="q"
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Try “modular kitchen Bangalore” or “2BHK cost”"
            className="h-12 w-full rounded-full border border-black/15 bg-white px-5 text-base text-black outline-none focus:border-black/60"
            autoFocus={!query}
          />
          <button
            type="submit"
            className="h-12 shrink-0 rounded-full bg-black px-6 text-sm font-medium text-white transition-opacity hover:opacity-85"
          >
            Search
          </button>
        </form>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-6">
        {query && hits.length === 0 && (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="mb-2 font-semibold text-black">
              Nothing matched “{query}”.
            </p>
            <p className="text-sm text-black/55">
              Try a city name, a room (kitchen, wardrobe, bedroom) or browse{' '}
              <Link href="/services" className="underline">
                all services
              </Link>{' '}
              and{' '}
              <Link href="/interior-designers" className="underline">
                all cities
              </Link>
              .
            </p>
          </div>
        )}
        {hits.length > 0 && (
          <ol className="divide-y divide-black/10 rounded-xl bg-white shadow-sm">
            {hits.map((h) => (
              <li key={`${h.type}-${h.path}`}>
                <Link
                  href={h.path}
                  className="block px-6 py-4 transition-colors hover:bg-black/[0.02]"
                >
                  <span className="mb-1 block text-[11px] font-semibold tracking-[0.2em] text-[#6b1a1a] uppercase">
                    {TYPE_LABELS[h.type]}
                  </span>
                  <span className="block text-base font-semibold text-black">
                    {h.title}
                  </span>
                  {h.snippet && (
                    <span className="mt-1 line-clamp-2 block text-sm text-black/55">
                      {h.snippet}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>

      <CTASection />
    </PageShell>
  );
}
