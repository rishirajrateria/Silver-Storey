'use client';

import React, { useMemo, useState } from 'react';
import HeroControls from '../Hero/components/HeroControls';
import MenuOverlay from '../Hero/components/MenuOverlay';
import GallerySection from '../CommercialProjects/components/GallerySection';
import type { GalleryProject } from '../CommercialProjects/constants';
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
  heroImageUrl?: string;
  heroTitle?: string;
  heroSubtitle?: string;
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
  heroImageUrl,
  heroTitle = 'Our Projects',
  heroSubtitle,
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

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="relative h-screen w-full overflow-hidden">
        <img
          src={heroImageUrl ?? '/images/4bhk.avif'}
          alt={heroTitle}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 flex h-full -translate-y-20 transform flex-col items-center justify-center px-6 text-center sm:-translate-y-24">
          <div className="mb-6 flex flex-col items-center">
            <div className="h-16 w-16 overflow-hidden rounded-full sm:h-20 sm:w-20">
              <img
                src="/images/home_logo.avif"
                alt="Silver Storey logo"
                className="h-full w-full origin-center scale-[0.78] transform object-cover"
                loading="eager"
              />
            </div>
            <div className="mt-0 pt-0 text-base font-light tracking-[0.16em] text-white sm:text-lg">
              Silver Storey&apos;s
            </div>
          </div>
          <h1 className="max-w-4xl leading-tight font-normal tracking-tight text-white">
            <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
              {heroTitle}
            </span>
            {heroSubtitle && (
              <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
                {heroSubtitle}
              </span>
            )}
          </h1>
        </div>

        <HeroControls onMenuClick={() => setIsMenuOpen(true)} />
        <MenuOverlay
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          projectPages={projectPages}
        />
      </header>

      {hasStory && (
        <section
          className="bg-[#f4f4f4] text-black"
          aria-labelledby="case-study-title"
        >
          <div className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
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
                  alt={heroTitle}
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
    </div>
  );
}
