import React from 'react';
import Link from 'next/link';

export type LinkItem = { name: string; path: string; meta?: string };

export default function LinkGrid({
  title,
  description,
  items,
  columns = 3,
  id,
}: {
  title: string;
  description?: string;
  items: LinkItem[];
  columns?: 2 | 3 | 4;
  id?: string;
}) {
  if (!items.length) return null;
  const cols =
    columns === 4
      ? 'sm:grid-cols-2 lg:grid-cols-4'
      : columns === 2
        ? 'sm:grid-cols-2'
        : 'sm:grid-cols-2 lg:grid-cols-3';
  return (
    <section
      id={id}
      className="mx-auto max-w-6xl px-6 py-14 sm:py-20"
      aria-labelledby={id ? `${id}-title` : undefined}
    >
      <h2
        id={id ? `${id}-title` : undefined}
        className="mb-3 text-2xl font-bold tracking-tight text-black sm:text-3xl"
      >
        {title}
      </h2>
      {description && (
        <p className="mb-8 max-w-2xl text-sm text-black/55 sm:text-base">
          {description}
        </p>
      )}
      <ul className={`grid grid-cols-1 gap-3 ${cols}`}>
        {items.map((it) => (
          <li key={it.path}>
            <Link
              href={it.path}
              className="glass-panel glass-lift flex items-center justify-between rounded-xl px-5 py-4 text-sm font-medium text-black"
            >
              <span>{it.name}</span>
              <span className="text-xs text-black/40">{it.meta ?? '→'}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
