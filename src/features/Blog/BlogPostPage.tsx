'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import type { BlogPostFull } from './types';
import Markdown from '@/components/Markdown';
import { markdownReadMinutes } from '@/lib/markdown';
import HeroControls from '../Hero/components/HeroControls';
import MenuOverlay from '../Hero/components/MenuOverlay';

// ── Icons ─────────────────────────────────────────────────────────────────────
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

// ── Component ─────────────────────────────────────────────────────────────────
interface Props {
  post: BlogPostFull;
  projectPages?: { title: string; slug: string }[];
}

export default function BlogPostPage({ post, projectPages = [] }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const readTime = markdownReadMinutes(post.body ?? '');
  const authorInitial = post.author ? post.author[0]?.toUpperCase() : 'A';

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        {/* Back */}
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-black/50 transition-colors hover:text-black"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Blog
        </Link>

        {/* Title */}
        <h1 className="mb-4 text-3xl leading-tight font-bold text-black sm:text-4xl lg:text-5xl">
          {post.title}
        </h1>

        {/* Description */}
        {post.description && (
          <p className="mb-8 text-base leading-relaxed text-black/50 sm:text-lg">
            {post.description}
          </p>
        )}

        {/* Meta row */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Author */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black/10 text-sm font-semibold text-black">
                {authorInitial}
              </div>
              <span className="text-sm font-medium text-black">
                {post.author ?? 'Silver Storey'}
              </span>
            </div>

            {/* Date */}
            {post.publishedAt && (
              <span className="flex items-center gap-1.5 text-sm text-black/45">
                <CalendarIcon />
                {dayjs(post.publishedAt).format('MMMM D, YYYY')}
              </span>
            )}

            {/* Read time */}
            <span className="flex items-center gap-1.5 text-sm text-black/45">
              <ClockIcon />
              {readTime} min read
            </span>
          </div>

          {/* Share */}
          <button
            className="flex items-center gap-1.5 text-sm text-black/45 transition-colors hover:text-black"
            onClick={() => {
              if (typeof navigator !== 'undefined' && navigator.share) {
                void navigator.share({
                  title: post.title,
                  url: window.location.href,
                });
              } else if (typeof navigator !== 'undefined') {
                void navigator.clipboard.writeText(window.location.href);
              }
            }}
          >
            <ShareIcon />
            Share
          </button>
        </div>

        {/* Cover image */}
        {post.mainImageUrl && (
          <div className="mb-10 overflow-hidden rounded-xl">
            <img
              src={post.mainImageUrl}
              alt={post.title}
              className="w-full object-cover"
            />
          </div>
        )}

        {/* Body */}
        {post.body && post.body.trim().length > 0 && (
          <article>
            <Markdown source={post.body} />
          </article>
        )}
      </div>
      <HeroControls onMenuClick={() => setIsMenuOpen(true)} />
      <MenuOverlay
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        projectPages={projectPages}
      />
    </div>
  );
}
