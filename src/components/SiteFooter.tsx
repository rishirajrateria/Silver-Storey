import React from 'react';
import Link from 'next/link';
import { SITE } from '@/lib/seo/site';
import { SERVICES, servicePath } from '@/lib/services';
import {
  TIER1_CITIES,
  STATES,
  cityPath,
  statePath,
  CITIES,
} from '@/lib/locations';
import { BLOG_CATEGORIES, categoryPath } from '@/lib/blog/categories';

const COMPANY_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about-us' },
  { label: 'How it Works', href: '/how-it-works' },
  { label: 'Pricing Structure', href: '/pricing-structure' },
  { label: 'Residential Projects', href: '/residential-projects' },
  { label: 'Commercial Projects', href: '/commercial-projects' },
  { label: 'Interior Designers in India', href: '/interior-designers' },
  { label: 'All Services', href: '/services' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
  { label: 'Terms & Conditions', href: '/terms-conditions' },
];

function Column({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="mb-4 text-xs font-semibold tracking-[0.2em] text-white/60 uppercase">
        {title}
      </h2>
      {children}
    </div>
  );
}

const linkCls = 'text-sm text-white/75 transition-colors hover:text-white';

/**
 * Site-wide footer with the full internal-link mesh: services, cities,
 * states, blog categories, company pages and NAP data. Rendered from the root
 * layout beneath every page; existing page components are untouched.
 */
export default function SiteFooter() {
  const year = new Date().getFullYear();
  const popularCities = [
    ...TIER1_CITIES,
    ...CITIES.filter((c) => c.tier === 2),
  ].slice(0, 28);

  return (
    <footer
      className="relative z-10 bg-black text-white"
      aria-label="Site footer"
    >
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-28 sm:pb-24">
        {/* Top: brand + NAP */}
        <div className="grid gap-10 border-b border-white/10 pb-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-2xl font-bold tracking-tight">Silver Storey</p>
            <p className="mt-1 text-xs tracking-[0.25em] text-white/60 uppercase">
              {SITE.tagline}
            </p>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/70">
              {SITE.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`tel:${SITE.phoneE164}`}
                className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-transform hover:scale-105"
              >
                Call {SITE.phoneDisplay}
              </a>
              <a
                href={SITE.calendly}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/70 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black"
              >
                Book Free Consultation
              </a>
            </div>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-7">
            <Column title="Head office">
              <address className="text-sm leading-relaxed text-white/75 not-italic">
                {SITE.address.street},<br />
                {SITE.address.city}, {SITE.address.region}{' '}
                {SITE.address.postalCode}, India
              </address>
              <p className="mt-3 text-sm text-white/75">
                <a href={`mailto:${SITE.email}`} className="hover:text-white">
                  {SITE.email}
                </a>
                <br />
                <a href={`tel:${SITE.phoneE164}`} className="hover:text-white">
                  {SITE.phoneDisplay}
                </a>
                <span className="text-white/40"> · </span>
                <a
                  href={SITE.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  WhatsApp
                </a>
              </p>
              <p className="mt-3 text-xs text-white/50">
                Mon–Sat, 10:00–19:00 IST · Pan-India projects
              </p>
            </Column>
            <Column title="Why Silver Storey">
              <ul className="space-y-1.5 text-sm text-white/75">
                <li>Complimentary 3D visualisation</li>
                <li>Transparent, itemised pricing</li>
                <li>Delivery in 45 days</li>
                <li>10-year warranty</li>
                <li>
                  {SITE.stats.yearsExperience} years ·{' '}
                  {SITE.stats.sqftTransformed} sq ft delivered
                </li>
                <li className="text-white/50">
                  Partners: {SITE.brandPartners.join(', ')}
                </li>
              </ul>
            </Column>
          </div>
        </div>

        {/* Middle: link columns */}
        <div className="grid gap-10 border-b border-white/10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <Column title="Services">
            <ul className="space-y-1.5">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link href={servicePath(s)} className={linkCls}>
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Column>
          <Column title="Interior designers by city">
            <ul className="space-y-1.5">
              {popularCities.map((c) => (
                <li key={c.slug}>
                  <Link href={cityPath(c)} className={linkCls}>
                    Interior Designers in {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/interior-designers"
                  className={`${linkCls} font-semibold text-white`}
                >
                  All {CITIES.length} cities →
                </Link>
              </li>
            </ul>
          </Column>
          <Column title="Company">
            <ul className="space-y-1.5">
              {COMPANY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkCls}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Column>
          <Column title="Guides & resources">
            <ul className="space-y-1.5">
              {BLOG_CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link href={categoryPath(c.slug)} className={linkCls}>
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/blog"
                  className={`${linkCls} font-semibold text-white`}
                >
                  All articles →
                </Link>
              </li>
            </ul>
          </Column>
        </div>

        {/* States */}
        <div className="border-b border-white/10 py-10">
          <h2 className="mb-4 text-xs font-semibold tracking-[0.2em] text-white/60 uppercase">
            Interior designers by state & union territory
          </h2>
          <p className="text-sm leading-7 text-white/70">
            {STATES.map((s, i) => (
              <React.Fragment key={s.slug}>
                <Link href={statePath(s)} className="hover:text-white">
                  {s.name}
                </Link>
                {i < STATES.length - 1 && (
                  <span className="text-white/30"> · </span>
                )}
              </React.Fragment>
            ))}
          </p>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-3 pt-8 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.legalName}. All rights reserved. Interior designers
            headquartered in Kolkata, serving all of India.
          </p>
          <p className="flex flex-wrap gap-4">
            <Link href="/sitemap-index.xml" className="hover:text-white">
              Sitemap
            </Link>
            <Link href="/terms-conditions" className="hover:text-white">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-white">
              Contact
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
