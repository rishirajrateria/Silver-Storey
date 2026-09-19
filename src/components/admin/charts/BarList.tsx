'use client';

import React, { useState } from 'react';
import type { Breakdown } from '@/lib/analytics/queries';
import { formatNumber } from './format';

/**
 * Ranked magnitude list. One series, so one hue for every bar — a value-ramp
 * here would double-encode length as colour. Values sit at the bar tip, so no
 * hover is required to read them.
 */
export default function BarList({
  rows,
  emptyMessage = 'No data yet.',
  labelHeading = 'Item',
  valueHeading = 'Views',
  linkLabels = false,
}: {
  rows: Breakdown[];
  emptyMessage?: string;
  labelHeading?: string;
  valueHeading?: string;
  /** Render each label as a link to that path (used for the top-pages list). */
  linkLabels?: boolean;
}) {
  const [hover, setHover] = useState<string | null>(null);

  if (rows.length === 0) {
    return <p className="py-6 text-sm text-black/40">{emptyMessage}</p>;
  }

  return (
    <div className="viz-root">
      <ul className="space-y-2.5">
        {rows.map((row) => (
          <li
            key={row.label}
            className="group relative"
            onPointerEnter={() => setHover(row.label)}
            onPointerLeave={() => setHover(null)}
            onFocus={() => setHover(row.label)}
            onBlur={() => setHover(null)}
            tabIndex={0}
          >
            <div className="mb-1 flex items-baseline justify-between gap-4">
              <span
                className="min-w-0 truncate text-sm text-black/70"
                title={row.label}
              >
                {linkLabels && row.label.startsWith('/') ? (
                  <a
                    href={row.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-2 hover:underline"
                  >
                    {row.label}
                  </a>
                ) : (
                  row.label
                )}
              </span>
              <span className="shrink-0 text-sm font-semibold text-black tabular-nums">
                {formatNumber(row.value)}
              </span>
            </div>
            {/* Track + bar: max 24px thick, 4px rounded data-end */}
            <div
              className="h-2 w-full overflow-hidden rounded-full"
              style={{ background: 'var(--viz-track)' }}
            >
              <div
                className="h-full rounded-full transition-[width] duration-300"
                style={{
                  width: `${Math.max(row.ratio * 100, row.value > 0 ? 2 : 0)}%`,
                  background: 'var(--viz-series-1)',
                  opacity: hover && hover !== row.label ? 0.55 : 1,
                }}
              />
            </div>
          </li>
        ))}
      </ul>

      <details className="mt-4">
        <summary className="cursor-pointer text-xs text-black/45 hover:text-black">
          View as table
        </summary>
        <table className="mt-2 w-full text-left text-xs">
          <thead className="bg-black text-white">
            <tr>
              <th scope="col" className="px-3 py-2 font-semibold">
                {labelHeading}
              </th>
              <th scope="col" className="px-3 py-2 font-semibold">
                {valueHeading}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10">
            {rows.map((r) => (
              <tr key={r.label}>
                <td className="px-3 py-1.5 break-all text-black/70">
                  {r.label}
                </td>
                <td className="px-3 py-1.5 text-black/70 tabular-nums">
                  {formatNumber(r.value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
