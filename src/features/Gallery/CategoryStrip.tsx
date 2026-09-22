import React from 'react';
import Link from 'next/link';
import type { CategoryCard } from '@/lib/db/content';

/**
 * Links across to the other rooms. Shown on every gallery page so a visitor
 * who arrived on one room can reach the rest without going back.
 */
export default function CategoryStrip({
  categories,
  currentSlug,
  title = 'Browse other rooms',
}: {
  categories: CategoryCard[];
  currentSlug?: string;
  title?: string;
}) {
  const others = categories.filter((c) => c.slug !== currentSlug);
  if (others.length === 0) return null;

  return (
    <nav aria-label={title} className="mx-auto max-w-6xl px-6 py-12">
      <h2 className="mb-4 text-xs font-semibold tracking-[0.2em] text-[#6b1a1a] uppercase">
        {title}
      </h2>
      <ul className="flex list-none flex-wrap gap-2.5">
        {others.map((category) => (
          <li key={category.slug}>
            <Link
              href={`/gallery/${category.slug}`}
              className="glass inline-flex items-baseline gap-2 rounded-full px-4 py-2.5 text-sm text-black transition-transform hover:scale-[1.03]"
            >
              <span className="font-medium">{category.name}</span>
              <span className="text-xs text-black/50">
                {category.price} onwards
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
