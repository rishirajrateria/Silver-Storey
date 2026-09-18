'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  projectPages?: { title: string; slug: string }[];
}

const NAV_TOP = [{ label: 'Home', href: '/' }];

const NAV_BOTTOM = [
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
  { label: 'How it Works', href: '/how-it-works' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Pricing Structure', href: '/pricing-structure' },
  { label: 'Terms & Conditions', href: '/terms-conditions' },
];

const SOCIAL_LINKS = [
  { label: 'Facebook', href: '#', src: '/images/facebook.avif' },
  { label: 'LinkedIn', href: '#', src: '/images/linkedin-menu.avif' },
  { label: 'Instagram', href: '#', src: '/images/insta-menu.avif' },
  { label: 'YouTube', href: '#', src: '/images/you-tube-menu.avif' },
];

const LINK_STYLE: React.CSSProperties = {
  display: 'block',
  position: 'relative',
  padding: '10px 0',
  fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
  fontSize: 'clamp(14px, 2.5vw, 30px)',
  fontWeight: 500,
  letterSpacing: '0.01em',
  color: '#000000',
  textDecoration: 'none',
  lineHeight: 1.25,
  transition: 'opacity 0.15s',
};

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
      {/* Social icons */}
      <div className="flex justify-center gap-6 pt-8 pb-4">
        {SOCIAL_LINKS.map(({ label, href, src }) => (
          <a
            key={label}
            href={href}
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

      {/* Navigation */}
      <nav className="flex flex-1 items-center justify-center">
        <ul
          className="w-full max-w-3xl px-10 text-center"
          style={{
            listStyle: 'none',
            padding: '0 2.5rem',
            margin: 0,
          }}
        >
          {NAV_TOP.map((item) => (
            <li
              key={item.label}
              style={{ position: 'relative', display: 'block' }}
            >
              <Link
                href={item.href}
                onClick={onClose}
                style={LINK_STYLE}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                {item.label}
              </Link>
            </li>
          ))}

          {projectPages.map(({ title, slug }) => (
            <li key={slug} style={{ position: 'relative', display: 'block' }}>
              <Link
                href={`/projects/${slug}`}
                onClick={onClose}
                style={LINK_STYLE}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                {title}
              </Link>
            </li>
          ))}

          {NAV_BOTTOM.map((item) => (
            <li
              key={item.label}
              style={{ position: 'relative', display: 'block' }}
            >
              <Link
                href={item.href}
                onClick={onClose}
                style={LINK_STYLE}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Close Button */}
      <div className="flex justify-center pb-10">
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
