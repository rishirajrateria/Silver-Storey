import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageShell from '@/components/seo/PageShell';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import CTASection from '@/components/seo/CTASection';
import { PageHero } from '@/components/seo/Prose';
import LookbookDownload from '@/features/Lookbooks/LookbookDownload';
import JsonLd from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, graph, webPageSchema } from '@/lib/seo/schema';
import {
  getLookbook,
  getLookbooks,
  getProjectPageLinks,
} from '@/lib/db/content';
import { roomLabel } from '@/lib/rooms';

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const l = await getLookbook(slug);
  if (!l) return {};
  return buildMetadata({
    title: `${l.title} — Free PDF Lookbook | Silver Storey`,
    description:
      l.description ??
      `Download the ${l.title} lookbook from Silver Storey — real interiors, finishes and indicative prices.`,
    path: `/lookbooks/${slug}`,
    image: l.coverImageUrl,
  });
}

export default async function LookbookPage({ params }: Props) {
  const { slug } = await params;
  const [lookbook, projectPages, all] = await Promise.all([
    getLookbook(slug),
    getProjectPageLinks(),
    getLookbooks(),
  ]);
  if (!lookbook) notFound();

  const path = `/lookbooks/${slug}`;
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Lookbooks', path: '/lookbooks' },
    { name: lookbook.title, path },
  ];
  const others = all.filter((l) => l.slug !== slug).slice(0, 3);
  const jsonLd = graph(
    webPageSchema({
      name: lookbook.title,
      description: lookbook.description ?? `${lookbook.title} lookbook`,
      path,
      type: 'ItemPage',
      primaryImage: lookbook.coverImageUrl,
      dateModified: lookbook.updatedAt.toISOString(),
    }),
    breadcrumbSchema(crumbs),
  );

  return (
    <PageShell projectPages={projectPages}>
      <JsonLd data={jsonLd} />
      <PageHero
        eyebrow={roomLabel(lookbook.roomType) ?? 'Lookbook'}
        title={lookbook.title}
        subtitle={lookbook.description}
      >
        <Breadcrumbs items={crumbs} />
      </PageHero>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-8 lg:grid-cols-[1fr_420px] lg:items-start">
        <div className="overflow-hidden rounded-2xl bg-black/5 shadow-sm">
          {lookbook.coverImageUrl ? (
            <img
              src={lookbook.coverImageUrl}
              alt={lookbook.title}
              className="aspect-[4/3] w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center text-sm text-black/40">
              PDF lookbook
            </div>
          )}
        </div>
        <div className="space-y-4 lg:sticky lg:top-6">
          <LookbookDownload slug={lookbook.slug} title={lookbook.title} />
          <dl className="grid grid-cols-2 gap-3 text-sm">
            {lookbook.pages && (
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <dt className="text-xs tracking-wide text-black/50 uppercase">
                  Pages
                </dt>
                <dd className="mt-1 font-semibold text-black">
                  {lookbook.pages}
                </dd>
              </div>
            )}
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <dt className="text-xs tracking-wide text-black/50 uppercase">
                Format
              </dt>
              <dd className="mt-1 font-semibold text-black">PDF · free</dd>
            </div>
          </dl>
        </div>
      </section>

      {others.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-10">
          <h2 className="mb-6 text-2xl font-bold tracking-tight text-black">
            More lookbooks
          </h2>
          <ul className="grid gap-4 sm:grid-cols-3">
            {others.map((l) => (
              <li key={l.id}>
                <Link
                  href={`/lookbooks/${l.slug}`}
                  className="block rounded-xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="block font-semibold text-black">
                    {l.title}
                  </span>
                  {l.description && (
                    <span className="mt-1 line-clamp-2 block text-sm text-black/55">
                      {l.description}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <CTASection />
    </PageShell>
  );
}
