/** Date-range handling for the analytics dashboard. Pure and unit tested. */

export const RANGES = [7, 30, 90] as const;
export type RangeDays = (typeof RANGES)[number];

export function parseRange(value: string | undefined): RangeDays {
  const n = Number(value);
  return (RANGES as readonly number[]).includes(n) ? (n as RangeDays) : 30;
}

export interface Period {
  from: Date;
  to: Date;
  /** The equally long window immediately before `from`, for comparison. */
  previousFrom: Date;
  previousTo: Date;
  days: RangeDays;
}

/** Builds the current and preceding windows, both aligned to UTC midnight. */
export function buildPeriod(days: RangeDays, now: Date = new Date()): Period {
  const to = new Date(now);
  const from = new Date(to);
  from.setUTCDate(from.getUTCDate() - (days - 1));
  from.setUTCHours(0, 0, 0, 0);

  const previousTo = new Date(from);
  previousTo.setUTCMilliseconds(-1);
  const previousFrom = new Date(previousTo);
  previousFrom.setUTCDate(previousFrom.getUTCDate() - (days - 1));
  previousFrom.setUTCHours(0, 0, 0, 0);

  return { from, to, previousFrom, previousTo, days };
}

/** Every UTC day in the window, as YYYY-MM-DD, so gaps render as zero. */
export function dayKeys(period: Period): string[] {
  const keys: string[] = [];
  const cursor = new Date(period.from);
  while (cursor <= period.to) {
    keys.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return keys;
}

/** Percentage change, guarding the divide-by-zero case. */
export function percentChange(
  current: number,
  previous: number,
): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return ((current - previous) / previous) * 100;
}
