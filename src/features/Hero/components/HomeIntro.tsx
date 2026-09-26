import React from 'react';
import Link from 'next/link';
import { SITE, brandStatement, keyFacts } from '@/lib/seo/site';

/** The subset of keyFacts() that fits a strip; the rest lives on /about-us. */
const STRIP_FACTS = [
  'Founded',
  'Experience',
  'Clients',
  'Delivery',
  'Warranty',
];

const LINKS = [
  { label: 'Services & prices', href: '/services' },
  { label: 'Pricing structure', href: '/pricing-structure' },
  { label: 'Gallery', href: '/gallery' },
  {
    label: 'Interior designers in Kolkata',
    href: '/interior-designers/west-bengal/kolkata',
  },
  { label: 'Cost calculator', href: '/estimate' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
];

/**
 * The first words a crawler meets after the video: who the studio is, where
 * it works from and how it serves the rest of the country. A Server
 * Component, so the copy is in the HTML for assistants that never run
 * JavaScript.
 */
export default function HomeIntro() {
  const facts = keyFacts().filter((f) => STRIP_FACTS.includes(f.label));

  // The outstation statement opens with the phrase this paragraph leads
  // with, so that opener is dropped rather than read twice; only its first
  // sentence is used here — the CTA sentence is what the links row is for.
  const outstation = SITE.serviceModel.outstation
    .split('. ')[0]
    .replace(/^Outside West Bengal\s+/, '');
  const reach = `${SITE.serviceModel.hq} Outside West Bengal, ${outstation}.`;

  return (
    <section
      id="about"
      aria-labelledby="home-intro-title"
      className="mx-auto max-w-6xl px-6 pt-16 sm:pt-24"
    >
      <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-[#6b1a1a] uppercase">
        About the studio
      </p>
      <h2
        id="home-intro-title"
        className="mb-5 max-w-3xl text-3xl font-bold tracking-tight text-black sm:text-4xl"
      >
        Turnkey interior design, headquartered in Kolkata and working across
        India
      </h2>
      <div className="max-w-3xl space-y-4 text-base leading-relaxed text-black/70 sm:text-lg">
        <p>{brandStatement()}</p>
        <p>{reach}</p>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {facts.map((f) => (
          <div key={f.label} className="glass-panel rounded-xl px-4 py-4">
            <dt className="text-[11px] font-semibold tracking-[0.2em] text-black/50 uppercase">
              {f.label}
            </dt>
            <dd className="mt-1 text-sm font-semibold text-black sm:text-base">
              {f.value}
            </dd>
          </div>
        ))}
      </dl>

      <ul className="mt-8 flex list-none flex-wrap gap-2">
        {LINKS.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="glass-panel glass-lift inline-flex rounded-full px-4 py-2 text-sm font-medium text-black"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
