/** Shared formatting for dashboard figures. */

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-IN').format(Math.round(n));
}

export function formatCompact(n: number): string {
  if (n < 1000) return String(Math.round(n));
  return new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n);
}

export function formatPercent(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function formatDay(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });
}

/** Rounds an axis maximum up to a clean 1/2/5 × 10ⁿ value. */
export function niceMax(value: number): number {
  if (value <= 0) return 4;
  const exponent = Math.floor(Math.log10(value));
  const magnitude = Math.pow(10, exponent);
  const fraction = value / magnitude;
  const step = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
  return step * magnitude;
}

/** Four clean gridline values from 0 to max. */
export function axisTicks(max: number, count = 4): number[] {
  return Array.from({ length: count + 1 }, (_, i) => (max / count) * i);
}
