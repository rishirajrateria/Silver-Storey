'use client';

import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { RANGES } from '@/lib/analytics/range';

/** Standard dashboard time-range control — one row, above the charts. */
export default function RangeFilter({ current }: { current: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function select(days: number) {
    const next = new URLSearchParams(params.toString());
    next.set('range', String(days));
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <div
      className="inline-flex rounded-full border border-black/15 bg-white p-1"
      role="group"
      aria-label="Date range"
    >
      {RANGES.map((days) => (
        <button
          key={days}
          type="button"
          onClick={() => select(days)}
          aria-pressed={current === days}
          className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
            current === days
              ? 'bg-black text-white'
              : 'text-black/60 hover:text-black'
          }`}
        >
          {days}d
        </button>
      ))}
    </div>
  );
}
