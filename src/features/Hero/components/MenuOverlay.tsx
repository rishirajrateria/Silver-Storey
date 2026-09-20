'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { SITE } from '@/lib/seo/site';

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  projectPages?: { title: string; slug: string }[];
}

interface NavLinkItem {
  label: string;
  href: string;
  note?: string;
}

/**
 * Grouping keeps a seventeen-item menu scannable: people arrive either to
 * browse the work, to price a project, or to deal with the company.
 */
const EXPLORE: NavLinkItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Services & Prices', href: '/services' },
  { label: 'Residential Projects', href: '/residential-projects' },
  { label: 'Commercial Projects', href: '/commercial-projects' },
  { label: 'Cities We Serve', href: '/interior-designers' },
  { label: 'Blog', href: '/blog' },
];

const PLAN: NavLinkItem[] = [
  { label: 'Cost Calculator', href: '/estimate', note: 'with EMI' },
  { label: '3D Visualisation', href: '/3d-visualisation', note: 'free' },
  { label: 'Lookbooks', href: '/lookbooks', note: 'PDF' },
  { label: 'How it Works', href: '/how-it-works' },
  { label: 'Pricing Structure', href: '/pricing-structure' },
  { label: '10-Year Warranty', href: '/warranty' },
];

const COMPANY: NavLinkItem[] = [
  { label: 'About Us', href: '/about-us' },
  { label: 'Track Your Project', href: '/track' },
  { label: 'Contact', href: '/contact' },
  { label: 'Terms & Conditions', href: '/terms-conditions' },
];

/**
 * The metros people most often look for, so the commonest journey is one tap.
 * Hardcoded rather than derived so the 150-city dataset stays out of the
 * client bundle; `features.test.ts` checks every path still resolves.
 */
export const MENU_CITIES: { label: string; href: string }[] = [
  { label: 'Kolkata', href: '/interior-designers/west-bengal/kolkata' },
  { label: 'Delhi NCR', href: '/interior-designers/delhi/new-delhi' },
  { label: 'Gurugram', href: '/interior-designers/haryana/gurugram' },
  { label: 'Mumbai', href: '/interior-designers/maharashtra/mumbai' },
  { label: 'Pune', href: '/interior-designers/maharashtra/pune' },
  { label: 'Bengaluru', href: '/interior-designers/karnataka/bengaluru' },
  { label: 'Hyderabad', href: '/interior-designers/telangana/hyderabad' },
  { label: 'Chennai', href: '/interior-designers/tamil-nadu/chennai' },
  { label: 'Ahmedabad', href: '/interior-designers/gujarat/ahmedabad' },
];

/** Inline glyphs — crisp at any size and inked in the panel's own text colour. */
const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  instagram: (
    <>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.4" />
      <circle cx="12" cy="12" r="4.4" />
      <circle cx="17.6" cy="6.4" r="1.25" fill="currentColor" stroke="none" />
    </>
  ),
  facebook: (
    <path d="M14.5 21.5v-8h2.7l.5-3.2h-3.2V8.2c0-.93.3-1.56 1.6-1.56h1.7V3.77a22 22 0 0 0-2.5-.13c-2.47 0-4.16 1.5-4.16 4.27v2.39H8.4v3.2h2.74v8" />
  ),
  linkedin: (
    <>
      <path d="M4.2 9.4v12M4.2 4.35v.1" />
      <path d="M10.4 21.4V9.4M10.4 14.2c0-2.6 1.5-4.3 3.9-4.3 2.3 0 3.7 1.5 3.7 4.4v7.1" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.2" y="5" width="19.6" height="14" rx="4.4" />
      <path d="M10.3 9.3v5.4l4.7-2.7z" fill="currentColor" stroke="none" />
    </>
  ),
  pinterest: (
    <>
      <circle cx="12" cy="12" r="9.3" />
      <path d="M9.6 20.4c.8-1.3 1.4-2.8 1.7-4.2l.7-3.1" />
      <path d="M8.6 10.6c0-2.2 1.8-4 4.1-4 2.2 0 3.7 1.4 3.7 3.5 0 2.4-1.3 4.3-3.1 4.3-1 0-1.7-.8-1.5-1.7" />
    </>
  ),
};

const SOCIALS = SITE.socials.filter((s) => SOCIAL_ICONS[s.key]);

const linkClass =
  'group flex items-baseline gap-2 py-2 text-[17px] leading-snug font-medium text-black/70 transition-colors duration-150 hover:text-black sm:text-lg';

function NavColumn({
  title,
  links,
  onClose,
  delay,
}: {
  title: string;
  links: NavLinkItem[];
  onClose: () => void;
  delay: number;
}) {
  return (
    <div className="menu-in" style={{ animationDelay: `${delay}ms` }}>
      <h2 className="mb-3 text-xs font-semibold tracking-[0.25em] text-[#6b1a1a] uppercase">
        {title}
      </h2>
      <ul className="-mx-2 list-none">
        {links.map((item) => (
          <li key={item.href}>
            <Link href={item.href} onClick={onClose} className={linkClass}>
              <span className="relative px-2">
                {item.label}
                <span
                  aria-hidden
                  className="absolute inset-x-2 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-200 group-hover:scale-x-100"
                />
              </span>
              {item.note && (
                <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-black/60 uppercase">
                  {item.note}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function MenuOverlay({
  isOpen,
  onClose,
  projectPages = [],
}: MenuOverlayProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusTo = useRef<Element | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    restoreFocusTo.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKeyDown);
      if (restoreFocusTo.current instanceof HTMLElement)
        restoreFocusTo.current.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // CMS project pages sit with the rest of the work, before the wider listings.
  const explore: NavLinkItem[] = [
    ...EXPLORE.slice(0, 4),
    ...projectPages.map(({ title, slug }) => ({
      label: title,
      href: `/projects/${slug}`,
    })),
    ...EXPLORE.slice(4),
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="menu-veil fixed inset-0 z-100 overflow-y-auto bg-[#e9e4df] text-black"
    >
      {/* Daylight drifting across the cream. Viewport-anchored rather than
          scrolling with the panel, so it reads as light in the room instead
          of as content. See .menu-sheen in globals.css. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <span className="menu-sheen menu-sheen-a" />
        <span className="menu-sheen menu-sheen-b" />
      </div>

      <div className="relative mx-auto flex min-h-full w-full max-w-7xl flex-col px-6 py-6 sm:px-10 sm:py-8">
        {/* Top bar */}
        <div className="menu-in flex items-center justify-between gap-4">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            {/* The mark is light-on-dark everywhere else on the site, so it
                keeps its dark ground here rather than vanishing into the cream */}
            <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-black">
              <img
                src="/images/home_logo.avif"
                alt=""
                className="h-full w-full origin-center scale-[0.78] object-cover"
              />
            </span>
            <span>
              <span className="block text-sm font-semibold tracking-[0.2em] uppercase">
                {SITE.name}
              </span>
              <span className="block text-[11px] text-black/60">
                {SITE.tagline}
              </span>
            </span>
          </Link>

          <button
            ref={closeRef}
            onClick={onClose}
            className="flex h-11 shrink-0 items-center gap-2 rounded-full border border-black/20 px-4 text-sm font-medium text-black transition-colors hover:bg-black/5"
          >
            Close
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Search */}
        <form
          action="/search"
          method="get"
          role="search"
          onSubmit={onClose}
          className="menu-in relative mt-8 max-w-xl"
          style={{ animationDelay: '60ms' }}
        >
          <label htmlFor="menu-search" className="sr-only">
            Search the site
          </label>
          <svg
            aria-hidden
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-black/55"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
          </svg>
          <input
            id="menu-search"
            type="search"
            name="q"
            placeholder="Search cities, services, ideas…"
            autoComplete="off"
            className="h-12 w-full rounded-full border border-black/15 bg-white pr-24 pl-11 text-[15px] text-black transition-colors placeholder:text-black/55 focus:border-black/60 focus:outline-none"
          />
          <button
            type="submit"
            className="absolute top-1.5 right-1.5 h-9 rounded-full bg-black px-4 text-sm font-medium text-white transition-opacity hover:opacity-85"
          >
            Search
          </button>
        </form>

        {/* Body */}
        <div className="grid flex-1 gap-10 py-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-14">
          <div>
            <nav
              aria-label="Main"
              className="grid gap-x-10 gap-y-9 sm:grid-cols-2 xl:grid-cols-3"
            >
              <NavColumn
                title="Explore"
                links={explore}
                onClose={onClose}
                delay={100}
              />
              <NavColumn
                title="Plan your project"
                links={PLAN}
                onClose={onClose}
                delay={160}
              />
              <NavColumn
                title="Company"
                links={COMPANY}
                onClose={onClose}
                delay={220}
              />
            </nav>

            {/* Straight to the commonest journey: "designers in my city" */}
            <div
              className="menu-in mt-10 border-t border-black/10 pt-6"
              style={{ animationDelay: '260ms' }}
            >
              <h2 className="mb-3 text-xs font-semibold tracking-[0.25em] text-[#6b1a1a] uppercase">
                Popular cities
              </h2>
              <ul className="flex list-none flex-wrap gap-2">
                {MENU_CITIES.map((city) => (
                  <li key={city.href}>
                    <Link
                      href={city.href}
                      onClick={onClose}
                      className="inline-flex rounded-full border border-black/15 bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:border-black/40"
                    >
                      {city.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/interior-designers"
                    onClick={onClose}
                    className="inline-flex rounded-full px-4 py-2 text-sm font-semibold text-black underline underline-offset-2"
                  >
                    All 150+ cities →
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Side panel: the two things people open a menu to do */}
          <aside
            className="menu-in flex flex-col gap-4"
            style={{ animationDelay: '260ms' }}
          >
            <Link
              href="/estimate"
              onClick={onClose}
              className="group rounded-2xl bg-black p-6 text-white transition-opacity duration-200 hover:opacity-85"
            >
              <span className="block text-xs font-semibold tracking-[0.25em] text-white/70 uppercase">
                Free · 60 seconds
              </span>
              <span className="mt-2 block text-2xl leading-tight font-bold tracking-tight">
                Get an instant estimate
              </span>
              <span className="mt-2 block text-sm text-white/70">
                Your city, your home size, your finish — with an EMI figure.
              </span>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
                Open the calculator
                <span
                  aria-hidden
                  className="transition-transform duration-200 group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </Link>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xs font-semibold tracking-[0.25em] text-[#6b1a1a] uppercase">
                Talk to a designer
              </h2>
              <ul className="list-none space-y-3 text-sm">
                <li>
                  <a
                    href={`tel:${SITE.phoneE164}`}
                    className="font-semibold text-black underline underline-offset-2"
                  >
                    {SITE.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a
                    href={SITE.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black/70 underline underline-offset-2 transition-colors hover:text-black"
                  >
                    WhatsApp us
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="text-black/70 underline underline-offset-2 transition-colors hover:text-black"
                  >
                    {SITE.email}
                  </a>
                </li>
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-black/45">
                {SITE.address.locality}, {SITE.address.city} — projects across
                India. Mon–Sat, 10:00–19:00 IST.
              </p>
            </div>
          </aside>
        </div>

        {/* Footer strip */}
        <div
          className="menu-in mt-auto flex flex-col gap-4 border-t border-black/10 pt-6 sm:flex-row sm:items-center sm:justify-between"
          style={{ animationDelay: '300ms' }}
        >
          <p className="text-xs text-black/60">
            © {new Date().getFullYear()} {SITE.name}. Interior designers in{' '}
            {SITE.address.city}, serving all of India.
          </p>
          {SOCIALS.length > 0 && (
            <div className="flex items-center gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-black/15 bg-white text-black/60 transition-colors hover:border-black/40 hover:text-black"
                >
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    {SOCIAL_ICONS[s.key]}
                  </svg>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
