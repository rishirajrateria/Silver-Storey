'use client';

import React from 'react';
import type { Breakdown } from '@/lib/analytics/queries';
import { formatNumber } from './format';

const COLORS = [
  'var(--viz-series-1)',
  'var(--viz-series-2)',
  'var(--viz-series-3)',
];

const TITLES: Record<string, string> = {
  desktop: 'Desktop',
  mobile: 'Mobile',
  tablet: 'Tablet',
};

/**
 * Part-to-whole across three device classes as a horizontal stacked bar.
 * Segments are separated by a 2px surface gap rather than a stroke, and each
 * carries a visible legend label with its share — which is also the relief the
 * palette's contrast warning requires.
 */
export default function DeviceBar({ rows }: { rows: Breakdown[] }) {
  const total = rows.reduce((sum, r) => sum + r.value, 0);
  if (total === 0) {
    return <p className="py-6 text-sm text-black/40">No data yet.</p>;
  }

  const ordered = rows.slice(0, 3);

  return (
    <div className="viz-root">
      <div
        className="flex h-6 w-full overflow-hidden rounded-full"
        style={{ background: 'var(--viz-track)', gap: '2px' }}
        role="img"
        aria-label={ordered
          .map(
            (r) =>
              `${TITLES[r.label] ?? r.label} ${Math.round((r.value / total) * 100)}%`,
          )
          .join(', ')}
      >
        {ordered.map((row, i) => (
          <div
            key={row.label}
            style={{
              width: `${(row.value / total) * 100}%`,
              background: COLORS[i % COLORS.length],
            }}
            title={`${TITLES[row.label] ?? row.label}: ${formatNumber(row.value)}`}
          />
        ))}
      </div>

      {/* Legend with direct values — identity never rests on colour alone */}
      <ul className="mt-4 space-y-2">
        {ordered.map((row, i) => (
          <li key={row.label} className="flex items-center gap-2.5 text-sm">
            <span
              aria-hidden
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            <span className="flex-1 text-black/70">
              {TITLES[row.label] ?? row.label}
            </span>
            <span className="font-semibold text-black tabular-nums">
              {Math.round((row.value / total) * 100)}%
            </span>
            <span className="w-16 text-right text-black/45 tabular-nums">
              {formatNumber(row.value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
