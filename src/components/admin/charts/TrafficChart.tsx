'use client';

import React, { useMemo, useState } from 'react';
import type { SeriesPoint } from '@/lib/analytics/queries';
import {
  axisTicks,
  formatCompact,
  formatDay,
  formatNumber,
  niceMax,
} from './format';

const W = 960;
const H = 280;
const PAD = { top: 16, right: 64, bottom: 30, left: 44 };

const SERIES = [
  { key: 'visitors' as const, label: 'Visitors', color: 'var(--viz-series-1)' },
  { key: 'views' as const, label: 'Page views', color: 'var(--viz-series-2)' },
];

/**
 * Two-series trend chart on a single shared axis (both series are counts, so
 * one scale is honest — never a second y-axis). Legend plus endpoint labels
 * mean identity never depends on colour alone, and a crosshair tooltip reads
 * out every series at the hovered day.
 */
export default function TrafficChart({ data }: { data: SeriesPoint[] }) {
  const [hover, setHover] = useState<number | null>(null);

  const { max, ticks, plotW, plotH, x, y } = useMemo(() => {
    const peak = data.reduce((m, d) => Math.max(m, d.visitors, d.views), 0);
    const max = niceMax(peak || 4);
    const plotW = W - PAD.left - PAD.right;
    const plotH = H - PAD.top - PAD.bottom;
    const x = (i: number) =>
      PAD.left +
      (data.length <= 1 ? plotW / 2 : (i / (data.length - 1)) * plotW);
    const y = (v: number) => PAD.top + plotH - (v / max) * plotH;
    return { max, ticks: axisTicks(max), plotW, plotH, x, y };
  }, [data]);

  if (data.length === 0) return null;

  const linePath = (key: 'visitors' | 'views') =>
    data
      .map(
        (d, i) =>
          `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)} ${y(d[key]).toFixed(1)}`,
      )
      .join(' ');

  const areaPath = `${linePath('visitors')} L${x(data.length - 1).toFixed(1)} ${(
    PAD.top + plotH
  ).toFixed(1)} L${x(0).toFixed(1)} ${(PAD.top + plotH).toFixed(1)} Z`;

  const last = data.length - 1;
  const active = hover ?? null;
  const point = active !== null ? data[active] : null;

  // Direct end-labels only work while the series separate at the right edge.
  // When they converge, offsetting one label detaches it from its line and
  // reads as noise — so drop both and let the legend, tooltip and table view
  // carry the values instead.
  const endGap = Math.abs(y(data[last].visitors) - y(data[last].views));
  const showEndLabels = endGap >= 14;

  // Show roughly six date labels regardless of range length.
  const labelEvery = Math.max(1, Math.ceil(data.length / 6));

  return (
    <figure className="viz-root m-0">
      {/* Legend — always present for two or more series */}
      <figcaption className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        {SERIES.map((s) => (
          <span
            key={s.key}
            className="flex items-center gap-2 text-sm text-black/60"
          >
            <svg width="16" height="8" aria-hidden className="shrink-0">
              <line
                x1="0"
                y1="4"
                x2="16"
                y2="4"
                stroke={s.color}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            {s.label}
          </span>
        ))}
      </figcaption>

      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ height: 'auto' }}
          role="img"
          aria-label={`Visitors and page views per day. Peak ${formatNumber(max)}.`}
          onPointerLeave={() => setHover(null)}
          onPointerMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const px = ((e.clientX - rect.left) / rect.width) * W;
            const ratio = (px - PAD.left) / plotW;
            const i = Math.round(ratio * (data.length - 1));
            setHover(i >= 0 && i < data.length ? i : null);
          }}
        >
          {/* Gridlines — hairline, solid, recessive */}
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={y(t)}
                y2={y(t)}
                stroke="var(--viz-grid)"
                strokeWidth="1"
              />
              <text
                x={PAD.left - 10}
                y={y(t) + 4}
                textAnchor="end"
                fontSize="11"
                fill="var(--viz-ink-muted)"
              >
                {formatCompact(t)}
              </text>
            </g>
          ))}

          {/* X labels */}
          {data.map((d, i) =>
            i % labelEvery === 0 || i === last ? (
              <text
                key={d.date}
                x={x(i)}
                y={H - 8}
                textAnchor={i === last ? 'end' : i === 0 ? 'start' : 'middle'}
                fontSize="11"
                fill="var(--viz-ink-muted)"
              >
                {formatDay(d.date)}
              </text>
            ) : null,
          )}

          {/* Area wash under the lead series (~10% opacity) */}
          <path d={areaPath} fill="var(--viz-series-1)" opacity="0.1" />

          {/* Crosshair */}
          {active !== null && (
            <line
              x1={x(active)}
              x2={x(active)}
              y1={PAD.top}
              y2={PAD.top + plotH}
              stroke="var(--viz-grid)"
              strokeWidth="1"
            />
          )}

          {/* Lines — 2px, round joins */}
          {SERIES.map((s) => (
            <path
              key={s.key}
              d={linePath(s.key)}
              fill="none"
              stroke={s.color}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}

          {/* Endpoint markers with a 2px surface ring */}
          {SERIES.map((s) => (
            <circle
              key={s.key}
              cx={x(last)}
              cy={y(data[last][s.key])}
              r="4"
              fill={s.color}
              stroke="var(--viz-surface)"
              strokeWidth="2"
            />
          ))}

          {/* Hovered markers */}
          {active !== null &&
            SERIES.map((s) => (
              <circle
                key={s.key}
                cx={x(active)}
                cy={y(data[active][s.key])}
                r="4"
                fill={s.color}
                stroke="var(--viz-surface)"
                strokeWidth="2"
              />
            ))}

          {/* Selective direct labels — endpoint only, and only when they clear */}
          {showEndLabels &&
            SERIES.map((s) => (
              <text
                key={s.key}
                x={x(last) + 10}
                y={y(data[last][s.key]) + 4}
                fontSize="11"
                fontWeight="600"
                fill="var(--viz-ink-secondary)"
              >
                {formatCompact(data[last][s.key])}
              </text>
            ))}
        </svg>

        {/* Tooltip — values lead, labels follow */}
        {point && (
          <div
            className="pointer-events-none absolute top-2 rounded-lg bg-black/90 px-3 py-2 text-xs text-white shadow-lg"
            style={{
              left: `${(x(active!) / W) * 100}%`,
              transform:
                active! > data.length / 2
                  ? 'translateX(-108%)'
                  : 'translateX(8%)',
            }}
          >
            <p className="mb-1 font-medium text-white/60">
              {formatDay(point.date)}
            </p>
            {SERIES.map((s) => (
              <p
                key={s.key}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <svg width="12" height="6" aria-hidden>
                  <line
                    x1="0"
                    y1="3"
                    x2="12"
                    y2="3"
                    stroke={s.color}
                    strokeWidth="2"
                  />
                </svg>
                <span className="font-semibold">
                  {formatNumber(point[s.key])}
                </span>
                <span className="text-white/60">{s.label}</span>
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Table view — every value reachable without hovering */}
      <details className="mt-4">
        <summary className="cursor-pointer text-xs text-black/45 hover:text-black">
          View as table
        </summary>
        <div className="mt-2 max-h-64 overflow-auto rounded-lg border border-black/10">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-black text-white">
              <tr>
                <th scope="col" className="px-3 py-2 font-semibold">
                  Date
                </th>
                <th scope="col" className="px-3 py-2 font-semibold">
                  Visitors
                </th>
                <th scope="col" className="px-3 py-2 font-semibold">
                  Page views
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {data.map((d) => (
                <tr key={d.date}>
                  <td className="px-3 py-1.5 text-black/70">
                    {formatDay(d.date)}
                  </td>
                  <td className="px-3 py-1.5 text-black/70">
                    {formatNumber(d.visitors)}
                  </td>
                  <td className="px-3 py-1.5 text-black/70">
                    {formatNumber(d.views)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
