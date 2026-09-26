'use client';

import React from 'react';

function ShareIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

/**
 * The one interactive control on a post, kept in its own client island so
 * the article itself can stay server-rendered for crawlers.
 */
export default function ShareButton({ title }: { title: string }) {
  return (
    <button
      type="button"
      className="flex items-center gap-1.5 text-sm text-black/45 transition-colors hover:text-black"
      onClick={() => {
        if (navigator.share) {
          void navigator.share({ title, url: window.location.href });
        } else {
          void navigator.clipboard.writeText(window.location.href);
        }
      }}
    >
      <ShareIcon />
      Share
    </button>
  );
}
