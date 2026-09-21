import React from 'react';
import { SITE } from '@/lib/seo/site';

/**
 * Inline glyphs — crisp at any size and inked in the surrounding text colour,
 * so one set serves both the cream menu panel and the black footer.
 */
export const SOCIAL_ICONS: Record<string, React.ReactNode> = {
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

/** Only networks that have both a configured URL and a glyph. */
export const SOCIAL_LINKS = SITE.socials.filter((s) => SOCIAL_ICONS[s.key]);

const VARIANTS = {
  /** Cream / white surfaces — the menu panel. */
  light:
    'border-black/15 bg-white text-black/60 hover:border-black/40 hover:text-black',
  /** Black surfaces — the site footer. */
  dark: 'border-white/20 text-white/70 hover:border-white/60 hover:bg-white hover:text-black',
} as const;

/**
 * Renders the configured social profiles as a row of 40px circular buttons —
 * comfortably over the 24px minimum tap target. Nothing renders when no
 * profile URLs are configured, so the site never links to a dead "#".
 */
export default function SocialLinks({
  variant = 'light',
  className = '',
}: {
  variant?: keyof typeof VARIANTS;
  className?: string;
}) {
  if (SOCIAL_LINKS.length === 0) return null;

  return (
    <ul className={`flex list-none items-center gap-2 ${className}`}>
      {SOCIAL_LINKS.map((s) => (
        <li key={s.key}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer me"
            aria-label={s.label}
            title={s.label}
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${VARIANTS[variant]}`}
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
        </li>
      ))}
    </ul>
  );
}
