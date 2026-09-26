'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import HeroControls from '../Hero/components/HeroControls';
import MenuOverlay from '../Hero/components/MenuOverlay';
import Breadcrumbs, { type Crumb } from '@/components/seo/Breadcrumbs';
import CmsImage from '@/features/Gallery/CmsImage';
import GallerySection from './GallerySection';
import type { GalleryProject } from './gallery-types';
import Markdown from '@/components/Markdown';
import { roomLabel } from '@/lib/rooms';
import BeforeAfterSlider from './BeforeAfterSlider';

export interface GalleryRowItem extends GalleryProject {
  roomType?: string;
}

interface GalleryRow {
  key: string;
  title: string;
  items: GalleryRowItem[];
}

export interface CaseStudyDetails {
  summary?: string;
  location?: string;
  areaSqft?: number;
  budget?: string;
  durationDays?: number;
  propertyType?: string;
  style?: string;
  materials?: string;
  clientName?: string;
  clientQuote?: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
}

interface ProjectPageTemplateProps {
  /** The project's name — the page's one heading. */
  title: string;
  slug: string;
  heroImageUrl?: string;
  /** A strapline under the heading; skipped when it only repeats the title. */
  heroSubtitle?: string;
  /** The same trail the route puts in BreadcrumbList schema. */
  crumbs: Crumb[];
  gallerySections: GalleryRow[];
  projectPages?: { title: string; slug: string }[];
  caseStudy?: CaseStudyDetails;
}

function Facts({ c }: { c: CaseStudyDetails }) {
  const facts = [
    c.location && { label: 'Location', value: c.location },
    c.propertyType && { label: 'Property', value: c.propertyType },
    c.areaSqft && {
      label: 'Area',
      value: `${c.areaSqft.toLocaleString('en-IN')} sq ft`,
    },
    c.style && { label: 'Style', value: c.style },
    c.budget && { label: 'Budget', value: c.budget },
    c.durationDays && {
      label: 'Delivered in',
      value: `${c.durationDays} days`,
    },
  ].filter(Boolean) as { label: string; value: string }[];
  if (!facts.length) return null;
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-6">
      {facts.map((f) => (
        <div key={f.label}>
          <dt className="text-[11px] font-semibold tracking-[0.2em] text-black/45 uppercase">
            {f.label}
          </dt>
          <dd className="mt-1 text-base font-semibold text-black">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function ProjectPageTemplate({
  title,
  slug,
  heroImageUrl,
  heroSubtitle,
  crumbs,
  gallerySections,
  projectPages = [],
  caseStudy,
}: ProjectPageTemplateProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [room, setRoom] = useState<string>('all');

  const roomTypes = useMemo(() => {
    const set = new Set<string>();
    for (const s of gallerySections)
      for (const i of s.items) if (i.roomType) set.add(i.roomType);
    return [...set];
  }, [gallerySections]);

  const visibleSections = useMemo(
    () =>
      room === 'all'
        ? gallerySections
        : gallerySections
            .map((s) => ({
              ...s,
              items: s.items.filter((i) => i.roomType === room),
            }))
            .filter((s) => s.items.length > 0),
    [gallerySections, room],
  );

  // The admin often splits a name across the two hero fields ("Urbana" /
  // "3BHK"); once the title carries the whole name the fragment adds nothing.
  const strapline =
    heroSubtitle && !title.toLowerCase().includes(heroSubtitle.toLowerCase())
      ? heroSubtitle
      : undefined;

  const c = caseStudy ?? {};
  const hasStory = Boolean(
    c.summary ||
    c.location ||
    c.areaSqft ||
    c.budget ||
    c.durationDays ||
    c.propertyType ||
    c.style ||
    c.materials ||
    c.clientQuote ||
    (c.beforeImageUrl && c.afterImageUrl),
  );
  const materials = (c.materials ?? '')
    .split(',')
    .map((m) => m.trim())
    .filter(Boolean);
  const others = projectPages.filter((p) => p.slug !== slug).slice(0, 6);

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="relative h-screen w-full overflow-hidden">
        <CmsImage
          src={heroImageUrl ?? '/images/4bhk.avif'}
          alt={`${title} — interior design by Silver Storey`}
          sizes="100vw"
          preload
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 flex h-full -translate-y-20 transform flex-col items-center justify-center px-6 text-center sm:-translate-y-24">
          <div className="mb-6 flex flex-col items-center">
            <div className="h-16 w-16 overflow-hidden rounded-full sm:h-20 sm:w-20">
              <img
                src="/images/home_logo.avif"
                alt="Silver Storey logo"
                width={80}
                height={80}
                className="h-full w-full origin-center scale-[0.78] transform object-cover"
                loading="eager"
              />
            </div>
            <div className="mt-0 pt-0 text-base font-light tracking-[0.16em] text-white sm:text-lg">
              Silver Storey&apos;s
            </div>
          </div>
          <h1 className="max-w-4xl text-5xl leading-tight font-normal tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
            {title}
          </h1>
          {strapline && (
            <p className="mt-4 max-w-2xl text-lg font-light text-white/80 sm:text-xl">
              {strapline}
            </p>
          )}
        </div>

        <HeroControls onMenuClick={() => setIsMenuOpen(true)} />
        <MenuOverlay
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          projectPages={projectPages}
        />
      </header>

      <div className="bg-[#f4f4f4] px-6 pt-6 text-black">
        <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-x-6">
          <Breadcrumbs items={crumbs} />
          <Link
            href="/projects"
            className="mb-6 text-xs font-medium text-black/60 transition-colors hover:text-black sm:text-sm"
          >
            ← All projects
          </Link>
        </div>
      </div>

      {hasStory && (
        <section
          className="bg-[#f4f4f4] text-black"
          aria-labelledby="case-study-title"
        >
          <div className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
            <Facts c={c} />

            {(c.summary || materials.length > 0) && (
              <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_320px]">
                {c.summary && (
                  <div>
                    <h2
                      id="case-study-title"
                      className="mb-5 text-2xl font-bold tracking-tight sm:text-3xl"
                    >
                      The story
                    </h2>
                    <div className="space-y-5 text-base leading-relaxed text-black/70 [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-black [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-black [&_li]:mb-1.5 [&_ol]:list-decimal [&_ol]:pl-6 [&_strong]:font-semibold [&_strong]:text-black [&_ul]:list-disc [&_ul]:pl-6">
                      <Markdown source={c.summary} />
                    </div>
                  </div>
                )}
                {materials.length > 0 && (
                  <aside className="glass-panel h-fit rounded-2xl p-6">
                    <h3 className="mb-3 text-sm font-semibold tracking-[0.2em] text-black/50 uppercase">
                      Materials & brands
                    </h3>
                    <ul className="space-y-2 text-sm text-black/75">
                      {materials.map((m) => (
                        <li key={m} className="flex items-start gap-2">
                          <span
                            aria-hidden
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6b1a1a]"
                          />
                          {m}
                        </li>
                      ))}
                    </ul>
                  </aside>
                )}
              </div>
            )}

            {c.beforeImageUrl && c.afterImageUrl && (
              <div className="mt-14">
                <h2 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
                  Before & after
                </h2>
                <p className="mb-6 text-sm text-black/55">
                  Drag the handle to compare.
                </p>
                <BeforeAfterSlider
                  before={c.beforeImageUrl}
                  after={c.afterImageUrl}
                  alt={title}
                />
              </div>
            )}

            {c.clientQuote && (
              <figure className="mt-14 rounded-2xl bg-black px-8 py-10 text-white sm:px-12">
                <blockquote className="text-xl leading-relaxed font-light sm:text-2xl">
                  “{c.clientQuote}”
                </blockquote>
                {c.clientName && (
                  <figcaption className="mt-5 text-sm font-semibold text-white/70">
                    — {c.clientName}
                  </figcaption>
                )}
              </figure>
            )}
          </div>
        </section>
      )}

      {roomTypes.length > 1 && (
        <div className="bg-[#f4f4f4] px-6 pt-10 text-black">
          <div
            className="mx-auto flex max-w-6xl flex-wrap justify-center gap-2"
            role="group"
            aria-label="Filter gallery by room"
          >
            {[
              { key: 'all', label: 'All rooms' },
              ...roomTypes.map((k) => ({ key: k, label: roomLabel(k) ?? k })),
            ].map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRoom(r.key)}
                aria-pressed={room === r.key}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  room === r.key
                    ? 'border-black bg-black text-white'
                    : 'border-black/15 bg-white text-black hover:border-black/40'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {visibleSections.map((section) => (
        <GallerySection
          key={section.key}
          title={section.title}
          projects={section.items}
        />
      ))}

      <section
        className="bg-[#f4f4f4] px-6 py-12 text-black"
        aria-labelledby="more-projects-title"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            id="more-projects-title"
            className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl"
          >
            More case studies
          </h2>
          {others.length > 0 && (
            <ul className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/projects/${p.slug}`}
                    className="glass-panel glass-lift flex items-center justify-between rounded-xl px-5 py-4 text-sm font-medium text-black"
                  >
                    <span>{p.title}</span>
                    <span className="text-xs text-black/40">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/projects"
            className="text-sm font-semibold underline underline-offset-2"
          >
            All projects and case studies →
          </Link>
        </div>
      </section>
    </main>
  );
}
