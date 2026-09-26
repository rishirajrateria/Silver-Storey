import React from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';

/** Bylines that mean "the studio", not a person. */
const HOUSE_BYLINE = /silver storey|editorial|team/i;

/** The byline text for an author string: the team, or a real person's name. */
export function bylineFor(author?: string): string {
  return !author || HOUSE_BYLINE.test(author)
    ? 'the Silver Storey design team'
    : author;
}

const DATE_FORMAT = 'D MMM YYYY';

function CalendarIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

/**
 * Byline, publication dates and reading time, shared by the built-in guides
 * and CMS posts. The byline links to the About page because that is where
 * the people behind it are named; the dates are spelled out because "last
 * updated" is what both readers and search engines use to judge whether a
 * cost guide is still current.
 */
export default function ArticleMeta({
  author,
  publishedAt,
  updatedAt,
  readMinutes,
  children,
}: {
  author?: string;
  publishedAt?: string;
  updatedAt?: string;
  readMinutes: number;
  /** Extra controls, right-aligned — the share button on CMS posts. */
  children?: React.ReactNode;
}) {
  const byline = bylineFor(author);
  const published = publishedAt ? dayjs(publishedAt) : null;
  const updated = updatedAt ? dayjs(updatedAt) : null;
  // A same-day "updated" stamp says nothing; only show a later revision.
  const showUpdated =
    updated?.isValid() &&
    (!published ||
      updated.format(DATE_FORMAT) !== published.format(DATE_FORMAT));

  return (
    <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-6">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/10 text-sm font-semibold text-black"
          >
            {byline.replace(/^the /i, '')[0]?.toUpperCase() ?? 'S'}
          </span>
          <span className="text-sm font-medium text-black">
            By{' '}
            <Link
              href="/about-us"
              rel="author"
              className="underline-offset-2 hover:underline"
            >
              {byline}
            </Link>
          </span>
        </p>
        {published?.isValid() && (
          <p className="flex items-center gap-1.5 text-sm text-black/45">
            <CalendarIcon />
            <span>
              Published{' '}
              <time dateTime={published.format('YYYY-MM-DD')}>
                {published.format(DATE_FORMAT)}
              </time>
            </span>
          </p>
        )}
        {showUpdated && updated && (
          <p className="text-sm text-black/45">
            Updated{' '}
            <time dateTime={updated.format('YYYY-MM-DD')}>
              {updated.format(DATE_FORMAT)}
            </time>
          </p>
        )}
        <p className="flex items-center gap-1.5 text-sm text-black/45">
          <ClockIcon />
          {readMinutes} min read
        </p>
      </div>
      {children}
    </div>
  );
}
