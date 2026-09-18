/**
 * Interior cost estimator — pure functions shared by the /estimate page, the
 * API route that emails the result and the unit tests.
 *
 * Numbers come from the same Kolkata-baseline price book that powers the city
 * pages (`BASE_PRICING`), scaled by the city's price index, so the calculator
 * never contradicts the figures published elsewhere on the site.
 */

export interface EstimateScope {
  key: string;
  label: string;
  /** Kolkata-baseline range in ₹. */
  from: number;
  to: number;
  group: 'home' | 'room';
}

export const SCOPES: EstimateScope[] = [
  {
    key: '1bhk',
    label: '1BHK full home',
    from: 350000,
    to: 700000,
    group: 'home',
  },
  {
    key: '2bhk',
    label: '2BHK full home',
    from: 550000,
    to: 1200000,
    group: 'home',
  },
  {
    key: '3bhk',
    label: '3BHK full home',
    from: 800000,
    to: 1800000,
    group: 'home',
  },
  {
    key: '4bhk',
    label: '4BHK / duplex',
    from: 1400000,
    to: 3500000,
    group: 'home',
  },
  {
    key: 'villa',
    label: 'Villa / bungalow',
    from: 1800000,
    to: 8000000,
    group: 'home',
  },
  {
    key: 'kitchen',
    label: 'Modular kitchen',
    from: 140000,
    to: 450000,
    group: 'room',
  },
  { key: 'bedroom', label: 'Bedroom', from: 210000, to: 500000, group: 'room' },
  {
    key: 'living',
    label: 'Living room',
    from: 240000,
    to: 600000,
    group: 'room',
  },
  {
    key: 'bathroom',
    label: 'Bathroom',
    from: 180000,
    to: 400000,
    group: 'room',
  },
];

export type FinishKey = 'essential' | 'premium' | 'luxury';

export const FINISHES: {
  key: FinishKey;
  label: string;
  blurb: string;
  /** Where in the from–to band this finish sits (0 = from, 1 = to). */
  low: number;
  high: number;
}[] = [
  {
    key: 'essential',
    label: 'Essential',
    blurb:
      'BWP ply, laminate shutters, standard hardware. Built to last, simply finished.',
    low: 0,
    high: 0.3,
  },
  {
    key: 'premium',
    label: 'Premium',
    blurb:
      'Acrylic or PU shutters, Hettich/Ebco soft-close hardware, designer lighting and false ceiling.',
    low: 0.3,
    high: 0.65,
  },
  {
    key: 'luxury',
    label: 'Luxury',
    blurb:
      'Veneer, stone, glass and bespoke joinery, imported fittings, automation-ready.',
    low: 0.65,
    high: 1,
  },
];

export interface AddOn {
  key: string;
  label: string;
  /** Share of the base estimate added (e.g. 0.08 = +8%). */
  share: number;
  /** Only offered for these scope groups. */
  groups: ('home' | 'room')[];
}

export const ADD_ONS: AddOn[] = [
  {
    key: 'painting',
    label: 'Painting & wall finishes',
    share: 0.06,
    groups: ['home'],
  },
  {
    key: 'electrical',
    label: 'Electrical rework & lighting',
    share: 0.08,
    groups: ['home', 'room'],
  },
  {
    key: 'civil',
    label: 'Civil changes (walls, plumbing, flooring)',
    share: 0.12,
    groups: ['home', 'room'],
  },
  {
    key: 'loose',
    label: 'Loose furniture & soft furnishings',
    share: 0.1,
    groups: ['home', 'room'],
  },
];

export interface EstimateInput {
  scope: string;
  finish: FinishKey;
  addOns: string[];
  /** City price index; 1 = Kolkata baseline. */
  priceIndex: number;
}

export interface EstimateResult {
  low: number;
  high: number;
  /** Midpoint used for EMI and the headline figure. */
  mid: number;
  breakdown: { label: string; low: number; high: number }[];
}

function roundLakh(n: number): number {
  // Round to the nearest ₹10,000 below ₹10 L and ₹50,000 above, matching the
  // city pricing tables.
  const step = n >= 1000000 ? 50000 : 10000;
  return Math.round(n / step) * step;
}

export function computeEstimate(input: EstimateInput): EstimateResult | null {
  const scope = SCOPES.find((s) => s.key === input.scope);
  const finish = FINISHES.find((f) => f.key === input.finish);
  if (!scope || !finish) return null;
  const index =
    Number.isFinite(input.priceIndex) && input.priceIndex > 0
      ? input.priceIndex
      : 1;

  const band = scope.to - scope.from;
  const baseLow = (scope.from + band * finish.low) * index;
  const baseHigh = (scope.from + band * finish.high) * index;

  const breakdown = [
    {
      label: `${scope.label} · ${finish.label} finish`,
      low: roundLakh(baseLow),
      high: roundLakh(baseHigh),
    },
  ];
  let low = baseLow;
  let high = baseHigh;
  for (const key of input.addOns) {
    const addOn = ADD_ONS.find(
      (a) => a.key === key && a.groups.includes(scope.group),
    );
    if (!addOn) continue;
    const l = baseLow * addOn.share;
    const h = baseHigh * addOn.share;
    breakdown.push({
      label: addOn.label,
      low: roundLakh(l),
      high: roundLakh(h),
    });
    low += l;
    high += h;
  }
  low = roundLakh(low);
  high = roundLakh(high);
  return { low, high, mid: roundLakh((low + high) / 2), breakdown };
}

/** Standard reducing-balance EMI. Rate is annual percent, tenure in months. */
export function emi(
  principal: number,
  annualRatePct: number,
  months: number,
): number {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRatePct / 12 / 100;
  if (r === 0) return Math.round(principal / months);
  const pow = Math.pow(1 + r, months);
  return Math.round((principal * r * pow) / (pow - 1));
}

export const EMI_TENURES = [12, 24, 36, 48, 60];
export const DEFAULT_EMI_RATE = 12;

/** Indian grouping without the currency symbol: 1234567 → "12,34,567". */
export function formatIndian(n: number): string {
  return Math.round(n).toLocaleString('en-IN');
}
