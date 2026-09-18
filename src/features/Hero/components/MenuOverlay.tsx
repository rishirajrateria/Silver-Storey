'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { SITE } from '@/lib/seo/site';

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  projectPages?: { title: string; slug: string }[];
}

const NAV_TOP = [
  { label: 'Home', href: '/' },
  { label: 'Get an Estimate', href: '/estimate' },
  { label: 'Services', href: '/services' },
];

const NAV_BOTTOM = [
  { label: 'Cities We Serve', href: '/interior-designers' },
  { label: 'Lookbooks', href: '/lookbooks' },
  { label: '3D Visualisation', href: '/3d-visualisation' },
  { label: 'Blog', href: '/blog' },
  { label: 'How it Works', href: '/how-it-works' },
  { label: 'Pricing Structure', href: '/pricing-structure' },
  { label: 'Warranty', href: '/warranty' },
  { label: 'Track Your Project', href: '/track' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Contact', href: '/contact' },
  { label: 'Terms & Conditions', href: '/terms-conditions' },
];

const SOCIAL_ICONS: Record<string, string> = {
  facebook: '/images/facebook.avif',
  linkedin: '/images/linkedin-menu.avif',
  instagram: '/images/insta-menu.avif',
  youtube: '/images/you-tube-menu.avif',
};

const SOCIAL_LINKS = SITE.socials
  .filter((s) => SOCIAL_ICONS[s.key])
  .map((s) => ({ label: s.label, href: s.href, src: SOCIAL_ICONS[s.key] }));

const LINK_STYLE: React.CSSProperties = {
  display: 'block',
  position: 'relative',
  padding: '8px 0',
  fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
  fontSize: 'clamp(14px, 2.2vw, 26px)',
  fontWeight: 500,
  letterSpacing: '0.01em',
  color: '#000000',
  textDecoration: 'none',
  lineHeight: 1.25,
  transition: 'opacity 0.15s',
};

function NavLink({
  href,
  label,
  onClose,
}: {
  href: string;
  label: string;
  onClose: () => void;
}) {
  return (
    <li style={{ position: 'relative', display: 'block' }}>
      <Link
        href={href}
        onClick={onClose}
        style={LINK_STYLE}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        {label}
      </Link>
    </li>
  );
}

export default function MenuOverlay({
  isOpen,
  onClose,
  projectPages = [],
}: MenuOverlayProps) {
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
    return;
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex h-screen flex-col overflow-hidden"
      style={{
        background: 'rgba(180, 158, 132, 0.55)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      {/* Social icons — only networks with a configured URL are shown */}
      {SOCIAL_LINKS.length > 0 && (
        <div className="flex justify-center gap-6 pt-8 pb-2">
          {SOCIAL_LINKS.map(({ label, href, src }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="transition-opacity duration-200 hover:opacity-75"
            >
              <img
                loading="lazy"
                decoding="async"
                src={src}
                alt={label}
                className="h-16 w-16 object-contain"
              />
            </a>
          ))}
        </div>
      )}

      {/* Site search */}
      <form
        action="/search"
        method="get"
        role="search"
        className="mx-auto mt-6 flex w-full max-w-md items-center gap-2 px-8"
        onSubmit={onClose}
      >
        <label htmlFor="menu-search" className="sr-only">
          Search the site
        </label>
        <input
          id="menu-search"
          type="search"
          name="q"
          placeholder="Search cities, services, ideas…"
          autoComplete="off"
          className="h-11 w-full rounded-full border border-black/15 bg-white/85 px-5 text-sm text-black placeholder:text-black/40 focus:border-black/40 focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Search"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-white transition-transform hover:scale-105"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
          </svg>
        </button>
      </form>

      {/* Navigation — scrolls on short viewports; margin auto centres the
          list when it fits without clipping it when it does not */}
      <nav className="flex min-h-0 flex-1 overflow-y-auto py-4">
        <ul
          className="m-auto w-full max-w-3xl px-10 text-center"
          style={{ listStyle: 'none', padding: '0 2.5rem' }}
        >
          {NAV_TOP.map((item) => (
            <NavLink key={item.href} {...item} onClose={onClose} />
          ))}

          {projectPages.map(({ title, slug }) => (
            <NavLink
              key={slug}
              href={`/projects/${slug}`}
              label={title}
              onClose={onClose}
            />
          ))}

          {NAV_BOTTOM.map((item) => (
            <NavLink key={item.href} {...item} onClose={onClose} />
          ))}
        </ul>
      </nav>

      {/* Close Button */}
      <div className="flex justify-center pt-2 pb-8">
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-xl ring-2 ring-orange-300 transition-all duration-200 hover:scale-105 hover:bg-white/90"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#c2410c"
            strokeWidth="1.6"
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
    </div>
  );
}
