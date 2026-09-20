'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import type { BlogPost } from './types';
import HeroControls from '../Hero/components/HeroControls';
import MenuOverlay from '../Hero/components/MenuOverlay';

interface Props {
  posts: BlogPost[];
  projectPages?: { title: string; slug: string }[];
  /** Optional category chips rendered under the header. */
  categories?: { name: string; slug: string; href: string; active?: boolean }[];
  title?: React.ReactNode;
  subtitle?: string;
}

function CalendarIcon() {
  return (
    <svg
      width="13"
      height="13"
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

export default function BlogListPage({
  posts,
  projectPages = [],
  categories = [],
  title,
  subtitle = 'Expert insights on interior design, craftsmanship, and home transformation strategies.',
}: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {title ?? (
              <>
                Insights &amp; <span className="text-[#6b1a1a]">Resources</span>
              </>
            )}
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-black/50 sm:text-base">
            {subtitle}
          </p>
          {categories.length > 0 && (
            <nav
              aria-label="Blog categories"
              className="mt-8 flex flex-wrap justify-center gap-2"
            >
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={c.href}
                  className={
                    c.active
                      ? 'rounded-full bg-black px-4 py-1.5 text-xs font-medium text-white sm:text-sm'
                      : 'rounded-full bg-white px-4 py-1.5 text-xs font-medium text-black/70 shadow-sm transition-colors hover:text-black sm:text-sm'
                  }
                >
                  {c.name}
                </Link>
              ))}
            </nav>
          )}
        </div>

        {/* Grid */}
        {posts.length === 0 ? (
          <p className="text-center text-sm text-black/40">No posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Image */}
                <div className="aspect-[16/10] overflow-hidden bg-zinc-100">
                  {post.mainImageUrl ? (
                    <img
                      loading="lazy"
                      decoding="async"
                      src={post.mainImageUrl}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-zinc-400">
                      No image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="mb-2 text-base leading-snug font-bold text-black transition-opacity group-hover:opacity-75">
                    {post.title}
                  </h2>
                  {post.description && (
                    <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-black/50">
                      {post.description}
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <span className="flex items-center gap-1.5 text-xs text-black/40">
                      <CalendarIcon />
                      {post.publishedAt
                        ? dayjs(post.publishedAt).format('MMM D, YYYY')
                        : '—'}
                    </span>
                    <span className="text-sm font-medium text-black/60 transition-colors group-hover:text-black">
                      Read →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
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
