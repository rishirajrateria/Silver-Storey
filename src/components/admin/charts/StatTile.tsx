import React from 'react';
import type { Kpi } from '@/lib/analytics/queries';
import { formatNumber, formatPercent } from './format';

/**
 * Headline figure with its period-over-period delta. A single number is a stat
 * tile, never a one-bar chart.
 */
export default function StatTile({
  kpi,
  rangeDays,
}: {
  kpi: Kpi;
  rangeDays: number;
}) {
  const value =
    kpi.format === 'percent'
      ? formatPercent(kpi.value)
      : formatNumber(kpi.value);

  const up = kpi.change !== null && kpi.change > 0;
  const down = kpi.change !== null && kpi.change < 0;
  const flat = kpi.change === 0;

  return (
    <div className="viz-root rounded-xl bg-white p-5 shadow-sm">
      <p className="text-xs tracking-wide text-black/50 uppercase">
        {kpi.label}
      </p>
      <p className="mt-1.5 text-3xl font-bold text-black tabular-nums">
        {value}
      </p>
      <p className="mt-1.5 flex items-center gap-1.5 text-xs">
        {kpi.change === null ? (
          <span className="text-black/40">No earlier data</span>
        ) : (
          <>
            <span
              className="font-semibold"
              style={{
                color: flat
                  ? 'var(--viz-ink-muted)'
                  : up
                    ? 'var(--viz-positive)'
                    : 'var(--viz-negative)',
              }}
            >
              {up ? '▲' : down ? '▼' : '—'} {Math.abs(kpi.change).toFixed(1)}%
            </span>
            <span className="text-black/40">vs previous {rangeDays} days</span>
          </>
        )}
      </p>
    </div>
  );
}
