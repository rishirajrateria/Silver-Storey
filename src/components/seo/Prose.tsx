import React from 'react';

/** Consistent typography for long-form SEO copy. */
export function Prose({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`space-y-5 text-base leading-relaxed text-black/70 [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-black [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-black [&_li]:mb-1.5 [&_ol]:list-decimal [&_ol]:pl-6 [&_strong]:font-semibold [&_strong]:text-black [&_ul]:list-disc [&_ul]:pl-6 ${className}`}
    >
      {children}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="mx-auto max-w-6xl px-6 pt-16 pb-6 sm:pt-24">
      {children}
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-[#6b1a1a] uppercase">
          {eyebrow}
        </p>
      )}
      <h1 className="mb-5 text-4xl leading-tight font-bold tracking-tight text-black sm:text-5xl lg:text-6xl">
        {title}
      </h1>
      {subtitle && (
        <p className="max-w-3xl text-base leading-relaxed text-black/60 sm:text-lg">
          {subtitle}
        </p>
      )}
    </header>
  );
}

export function StatsRow() {
  const stats = [
    { value: '15', label: 'Years of experience' },
    { value: '50,000+', label: 'Sq ft transformed' },
    { value: '45', label: 'Days to delivery' },
    { value: '10 yr', label: 'Warranty' },
  ];
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="glass-panel rounded-xl px-5 py-5">
            <dt className="order-2 text-xs tracking-wide text-black/50 uppercase">
              {s.label}
            </dt>
            <dd className="order-1 text-2xl font-bold text-black sm:text-3xl">
              {s.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function FeatureList({
  title,
  items,
  columns = 2,
}: {
  title: string;
  items: string[];
  columns?: 1 | 2;
}) {
  return (
    <div>
      <h3 className="mb-3 text-lg font-bold text-black">{title}</h3>
      <ul className={`grid gap-2 ${columns === 2 ? 'sm:grid-cols-2' : ''}`}>
        {items.map((it) => (
          <li
            key={it}
            className="flex items-start gap-2 text-sm text-black/70 sm:text-base"
          >
            <span
              aria-hidden
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6b1a1a]"
            />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
