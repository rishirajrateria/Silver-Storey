import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import PageShell from '@/components/seo/PageShell';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import CTASection from '@/components/seo/CTASection';
import LinkGrid from '@/components/seo/LinkGrid';
import { PageHero, Prose } from '@/components/seo/Prose';
import CmsImage from '@/features/Gallery/CmsImage';
import {
  MIN_DESCRIPTION,
  summaryExcerpt,
} from '@/features/ProjectPage/description';
import JsonLd from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import {
  breadcrumbSchema,
  graph,
  itemListSchema,
  webPageSchema,
} from '@/lib/seo/schema';
import { SITE } from '@/lib/seo/site';
import { getProjectPageLinks, getProjectPageSummaries } from '@/lib/db/content';

export const revalidate = 300;

const PATH = '/projects';
const TITLE = 'Interior Design Projects & Case Studies | Silver Storey';
const DESCRIPTION =
  'Case studies of homes and offices designed and delivered by Silver Storey: the brief, the design, the materials and the finished rooms.';

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Projects', path: PATH },
];

/**
 * The hub every case study links back to. It exists even before the first
 * case study is published, because the sitemap, llms.txt and the footer all
 * point here — a hub that 404s is worse than one that says what is coming.
 */
export default async function ProjectsPage() {
  const [projects, projectPages] = await Promise.all([
    getProjectPageSummaries(),
    getProjectPageLinks(),
  ]);

  const jsonLd = graph(
    webPageSchema({
      name: TITLE,
      description: DESCRIPTION,
      path: PATH,
      type: 'CollectionPage',
    }),
    breadcrumbSchema(CRUMBS),
    projects.length > 0 &&
      itemListSchema({
        name: 'Silver Storey projects and case studies',
        items: projects.map((p) => ({
          name: p.title,
          path: `/projects/${p.slug}`,
        })),
      }),
  );

  return (
    <PageShell projectPages={projectPages}>
      <JsonLd data={jsonLd} />
      <PageHero
        eyebrow="Our work"
        title="Interior design projects & case studies"
        subtitle={`Homes and offices designed and delivered by ${SITE.name} — what each client asked for, how the space was planned and what was built, with the finished rooms photographed.`}
      >
        <Breadcrumbs items={CRUMBS} />
      </PageHero>

      <section
        className="mx-auto max-w-6xl px-6 py-8"
        aria-label="Case studies"
      >
        {projects.length === 0 ? (
          <div className="glass-panel rounded-2xl p-10 text-center">
            <p className="mb-2 text-lg font-bold text-black">
              The first case studies are being written up
            </p>
            <p className="mx-auto mb-6 max-w-md text-sm text-black/60">
              Until they are published, the room gallery shows finished work and
              the reviews page has clients in their own words.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/gallery"
                className="btn-bump inline-flex rounded-full bg-black px-6 py-3 text-sm font-medium text-white"
              >
                Browse the gallery
              </Link>
              <Link
                href="/reviews"
                className="btn-bump inline-flex rounded-full border border-black/20 px-6 py-3 text-sm font-medium text-black"
              >
                Read client reviews
              </Link>
            </div>
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => {
              const excerpt =
                summaryExcerpt(p.summary, 160) ||
                (p.heroSubtitle && p.heroSubtitle.length >= MIN_DESCRIPTION
                  ? p.heroSubtitle
                  : '');
              return (
                <li key={p.slug}>
                  <Link
                    href={`/projects/${p.slug}`}
                    className="glass-panel glass-lift group flex h-full flex-col overflow-hidden rounded-2xl"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/5">
                      {p.heroImageUrl && (
                        <CmsImage
                          src={p.heroImageUrl}
                          alt={`${p.title} — interior design by Silver Storey`}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 384px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      {p.location && (
                        <span className="mb-2 text-[11px] font-semibold tracking-[0.2em] text-[#6b1a1a] uppercase">
                          {p.location}
                        </span>
                      )}
                      <h2 className="mb-2 text-lg font-bold text-black">
                        {p.title}
                      </h2>
                      {excerpt && (
                        <p className="mb-4 line-clamp-3 flex-1 text-sm text-black/60">
                          {excerpt}
                        </p>
                      )}
                      <span className="mt-auto text-sm font-medium text-black">
                        Read the case study →
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mx-auto max-w-4xl px-6 py-10">
        <Prose>
          <h2>What a Silver Storey case study records</h2>
          <p>
            Each project page sets out the brief, the layout and material
            decisions, the time it took to deliver and the finished rooms, with
            before-and-after photographs where we have them. They are written
            for people planning a similar home: the sizes, finishes and budgets
            are the real ones, so a case study is also a fair guide to what your
            own project might cost.
          </p>
          <p>
            Every project starts the same way — a free consultation and site
            measurement, an itemised estimate and complimentary 3D visualisation
            of each room — and is delivered within {SITE.stats.deliveryDays}{' '}
            days of design approval, with a {SITE.warranty.termYears}-year
            warranty on modular components and workmanship.
          </p>
        </Prose>
      </section>

      <LinkGrid
        id="more-work"
        title="More of our work"
        columns={4}
        items={[
          { name: 'Gallery, room by room', path: '/gallery' },
          { name: 'Client reviews', path: '/reviews' },
          { name: '3D visualisations', path: '/3d-visualisation' },
          { name: 'Design lookbooks', path: '/lookbooks' },
        ]}
      />

      <CTASection
        title="Want a home like these?"
        subtitle="Share your floor plan and we will send a 3D visualisation and an itemised quote — free, and yours to keep."
      />
    </PageShell>
  );
}
