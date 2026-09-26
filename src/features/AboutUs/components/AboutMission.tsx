'use client';

import React from 'react';
import { QUOTE, stats } from '../constants';
import type { Stat } from '../types';
import { useCountUp } from '../hooks/useCountUp';

// ── Individual animated stat ──────────────────────────────────────────────────
function StatItem({ value, label }: Stat) {
  const numeric = parseInt(value.replace(/\D/g, ''), 10);
  // "50,000+" keeps its "+" but not its comma: the counter re-adds grouping.
  const suffix = value.replace(/[\d,]/g, '');
  const { value: count, ref } = useCountUp(numeric);

  return (
    <div ref={ref} className="flex flex-col items-center gap-2 text-center">
      <span className="text-5xl font-extralight tracking-tight text-black sm:text-6xl lg:text-7xl">
        {count.toLocaleString('en-IN')}
        {suffix}
      </span>
      <span className="text-xs font-medium tracking-widest text-black/50 uppercase sm:text-sm">
        {label}
      </span>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
export default function AboutMission() {
  return (
    <section className="cursor-default bg-white px-6 py-20 sm:py-28">
      {/* Quote */}
      <div className="mx-auto max-w-5xl">
        <p className="text-center text-lg leading-relaxed font-light text-black sm:text-xl md:text-2xl">
          {QUOTE}
        </p>
      </div>

      {/* Stats */}
      <div className="mx-auto mt-20 max-w-5xl">
        <div className="grid grid-cols-2 gap-12 sm:grid-cols-4 sm:gap-8">
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
