import 'server-only';
import { cache } from 'react';
import { prisma, safeQuery } from '@/lib/db/client';
import { countryLabel, regionLabel } from './regions';
import { sourceName } from './sources';
import {
  buildPeriod,
  dayKeys,
  percentChange,
  type Period,
  type RangeDays,
} from './range';

export interface Kpi {
  label: string;
  value: number;
  previous: number;
  change: number | null;
  format: 'number' | 'percent';
}

export interface SeriesPoint {
  date: string;
  visitors: number;
  views: number;
}

export interface Breakdown {
  label: string;
  value: number;
  /** 0–1, relative to the largest row. */
  ratio: number;
}

export interface DashboardData {
  period: Period;
  kpis: Kpi[];
  series: SeriesPoint[];
  topPages: Breakdown[];
  sources: Breakdown[];
  devices: Breakdown[];
  countries: Breakdown[];
  referrers: Breakdown[];
  states: Breakdown[];
  cities: Breakdown[];
  totalViews: number;
  hasData: boolean;
}

function toBreakdown(rows: { label: string; value: number }[]): Breakdown[] {
  const max = rows.reduce((m, r) => Math.max(m, r.value), 0);
  return rows.map((r) => ({ ...r, ratio: max > 0 ? r.value / max : 0 }));
}

/** Raw rows for one window; `distinct` counts unique visitors. */
async function countsFor(from: Date, to: Date) {
  const [views, visitors, leads] = await Promise.all([
    prisma.pageView.count({ where: { createdAt: { gte: from, lte: to } } }),
    prisma.pageView
      .findMany({
        where: { createdAt: { gte: from, lte: to } },
        distinct: ['visitorHash'],
        select: { visitorHash: true },
      })
      .then((rows) => rows.length),
    prisma.lead.count({ where: { createdAt: { gte: from, lte: to } } }),
  ]);
  return { views, visitors, leads };
}

export const getDashboardData = cache(
  async (days: RangeDays): Promise<DashboardData> => {
    const period = buildPeriod(days);
    const empty: DashboardData = {
      period,
      kpis: [],
      series: dayKeys(period).map((date) => ({ date, visitors: 0, views: 0 })),
      topPages: [],
      sources: [],
      devices: [],
      countries: [],
      referrers: [],
      states: [],
      cities: [],
      totalViews: 0,
      hasData: false,
    };

    return safeQuery(
      async () => {
        const [
          current,
          previous,
          rows,
          pages,
          sources,
          devices,
          countries,
          states,
          cities,
          referrers,
        ] = await Promise.all([
          countsFor(period.from, period.to),
          countsFor(period.previousFrom, period.previousTo),
          prisma.pageView.findMany({
            where: { createdAt: { gte: period.from, lte: period.to } },
            select: { createdAt: true, visitorHash: true },
          }),
          prisma.pageView.groupBy({
            by: ['path'],
            where: { createdAt: { gte: period.from, lte: period.to } },
            _count: { path: true },
            orderBy: { _count: { path: 'desc' } },
            take: 10,
          }),
          prisma.pageView.groupBy({
            by: ['source'],
            where: { createdAt: { gte: period.from, lte: period.to } },
            _count: { source: true },
            orderBy: { _count: { source: 'desc' } },
          }),
          prisma.pageView.groupBy({
            by: ['device'],
            where: { createdAt: { gte: period.from, lte: period.to } },
            _count: { device: true },
            orderBy: { _count: { device: 'desc' } },
          }),
          prisma.pageView.groupBy({
            by: ['country'],
            where: {
              createdAt: { gte: period.from, lte: period.to },
              country: { not: null },
            },
            _count: { country: true },
            orderBy: { _count: { country: 'desc' } },
            take: 8,
          }),
          // Grouped with the country so "WB" can be resolved safely — the
          // same subdivision code means different places in different
          // countries.
          prisma.pageView.groupBy({
            by: ['region', 'country'],
            where: {
              createdAt: { gte: period.from, lte: period.to },
              region: { not: null },
            },
            _count: { region: true },
            orderBy: { _count: { region: 'desc' } },
            take: 12,
          }),
          prisma.pageView.groupBy({
            by: ['city'],
            where: {
              createdAt: { gte: period.from, lte: period.to },
              city: { not: null },
            },
            _count: { city: true },
            orderBy: { _count: { city: 'desc' } },
            take: 12,
          }),
          // The named site each visit came from, as opposed to the bucket it
          // falls into. Taken generously and folded down afterwards, since
          // several hosts collapse to one brand (google.co.in, google.com).
          prisma.pageView.groupBy({
            by: ['referrer'],
            where: {
              createdAt: { gte: period.from, lte: period.to },
              referrer: { not: null },
            },
            _count: { referrer: true },
            orderBy: { _count: { referrer: 'desc' } },
            take: 40,
          }),
        ]);

        // Bucket by UTC day, counting unique visitors per day.
        const buckets = new Map<
          string,
          { views: number; visitors: Set<string> }
        >();
        for (const key of dayKeys(period)) {
          buckets.set(key, { views: 0, visitors: new Set() });
        }
        for (const row of rows) {
          const key = row.createdAt.toISOString().slice(0, 10);
          const bucket = buckets.get(key);
          if (!bucket) continue;
          bucket.views += 1;
          bucket.visitors.add(row.visitorHash);
        }

        const series: SeriesPoint[] = [...buckets.entries()].map(
          ([date, b]) => ({
            date,
            visitors: b.visitors.size,
            views: b.views,
          }),
        );

        const conversion =
          current.visitors > 0 ? (current.leads / current.visitors) * 100 : 0;
        const previousConversion =
          previous.visitors > 0
            ? (previous.leads / previous.visitors) * 100
            : 0;

        const kpis: Kpi[] = [
          {
            label: 'Visitors',
            value: current.visitors,
            previous: previous.visitors,
            change: percentChange(current.visitors, previous.visitors),
            format: 'number',
          },
          {
            label: 'Page views',
            value: current.views,
            previous: previous.views,
            change: percentChange(current.views, previous.views),
            format: 'number',
          },
          {
            label: 'Enquiries',
            value: current.leads,
            previous: previous.leads,
            change: percentChange(current.leads, previous.leads),
            format: 'number',
          },
          {
            label: 'Enquiry rate',
            value: conversion,
            previous: previousConversion,
            change: percentChange(conversion, previousConversion),
            format: 'percent',
          },
        ];

        return {
          period,
          kpis,
          series,
          totalViews: current.views,
          hasData: current.views > 0 || previous.views > 0,
          topPages: toBreakdown(
            pages.map((p) => ({ label: p.path, value: p._count.path })),
          ),
          sources: toBreakdown(
            sources.map((s) => ({ label: s.source, value: s._count.source })),
          ),
          devices: toBreakdown(
            devices.map((d) => ({ label: d.device, value: d._count.device })),
          ),
          countries: toBreakdown(
            countries.map((c) => ({
              label: countryLabel(c.country),
              value: c._count.country,
            })),
          ),
          states: toBreakdown(
            states.map((s) => ({
              label: regionLabel(s.region, s.country),
              value: s._count.region,
            })),
          ),
          cities: toBreakdown(
            cities.map((c) => ({
              label: c.city ?? '—',
              value: c._count.city,
            })),
          ),
          referrers: toBreakdown(foldByName(referrers).slice(0, 12)),
        };
      },
      empty,
      `getDashboardData(${days})`,
    );
  },
);

/**
 * Collapses referring hosts onto their brand name and re-sorts, so Google
 * reached through google.com and google.co.in counts once.
 */
function foldByName(
  rows: { referrer: string | null; _count: { referrer: number } }[],
): { label: string; value: number }[] {
  const totals = new Map<string, number>();
  for (const row of rows) {
    const label = sourceName(row.referrer);
    totals.set(label, (totals.get(label) ?? 0) + row._count.referrer);
  }
  return [...totals.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

export const getRecentLeads = cache(async (take = 8) =>
  safeQuery(
    () => prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take }),
    [],
    'getRecentLeads',
  ),
);

export const getLeadCounts = cache(async () =>
  safeQuery(
    async () => {
      const rows = await prisma.lead.groupBy({
        by: ['status'],
        _count: { status: true },
      });
      return Object.fromEntries(
        rows.map((r) => [r.status, r._count.status]),
      ) as Record<string, number>;
    },
    {} as Record<string, number>,
    'getLeadCounts',
  ),
);
