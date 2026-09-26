import type { CityData, StateData, ClimateClass, HousingClass } from './types';
import type { FAQ } from '@/lib/seo/schema';
import { SITE } from '@/lib/seo/site';
import { citiesInState, nearbyCities } from './index';

/* ────────────────────────────────────────────────────────────────────────── */
/* Formatting                                                                 */
/* ────────────────────────────────────────────────────────────────────────── */

/** ₹ formatting in Indian lakh/crore style: 140000 → "₹1.4 L", 25000000 → "₹2.5 Cr". */
export function formatINR(n: number): string {
  if (n >= 1_00_00_000) {
    const cr = n / 1_00_00_000;
    return `₹${trim(cr)} Cr`;
  }
  if (n >= 1_00_000) {
    const l = n / 1_00_000;
    return `₹${trim(l)} L`;
  }
  return `₹${n.toLocaleString('en-IN')}`;
}
function trim(x: number) {
  const s = (Math.round(x * 10) / 10).toFixed(1);
  return s.endsWith('.0') ? s.slice(0, -2) : s;
}

function roundTo(n: number, step: number) {
  return Math.round(n / step) * step;
}

function joinList(items: string[], max = items.length): string {
  const list = items.slice(0, max);
  if (list.length <= 1) return list.join('');
  return `${list.slice(0, -1).join(', ')} and ${list[list.length - 1]}`;
}

/**
 * Lower-cases a name for use mid-sentence without mangling acronyms:
 * "1BHK Interiors" → "1BHK interiors", "BWP plywood or HDHMR" stays as is.
 * A plain toLowerCase() produced "bhk", "hdhmr" and "ss-304" on thousands
 * of pages.
 */
export function lowerName(name: string): string {
  return name
    .split(' ')
    .map((w) => (/[A-Z]{2,}/.test(w) ? w : w.toLowerCase()))
    .join(' ');
}

/** Head office and home market — the only place the studio claims a local presence. */
export const HQ_CITY_SLUG = 'kolkata';
export const HQ_STATE_SLUG = 'west-bengal';

/**
 * The one-sentence service model for a place, straight from site.ts, so a
 * city page never implies a local office the studio does not have.
 */
export function serviceModelFor(stateSlug: string): string {
  return stateSlug === HQ_STATE_SLUG
    ? SITE.serviceModel.hq
    : SITE.serviceModel.outstation;
}

/** "Monday–Saturday, 10:00–19:00" from the structured opening hours. */
export function openingHoursLabel(): string {
  return SITE.openingHours
    .map((h) => {
      const days =
        h.days.length > 1
          ? `${h.days[0]}–${h.days[h.days.length - 1]}`
          : h.days[0];
      return `${days}, ${h.opens}–${h.closes}`;
    })
    .join('; ');
}

/** Same query URL the LocalBusiness `hasMap` carries, for a visible link. */
export function studioMapUrl(): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${SITE.name} ${SITE.address.street} ${SITE.address.city} ${SITE.address.postalCode}`,
  )}`;
}

/** Deterministic small integer from a string, for picking phrasing variants. */
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}
function pick<T>(arr: T[], seed: string): T {
  return arr[hash(seed) % arr.length];
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Climate & housing guidance                                                 */
/* ────────────────────────────────────────────────────────────────────────── */

export const CLIMATE_GUIDANCE: Record<
  ClimateClass,
  { label: string; summary: string; materials: string[]; avoid: string[] }
> = {
  'humid-coastal': {
    label: 'humid coastal climate',
    summary:
      'Year-round humidity, salt-laden air and a heavy monsoon mean moisture is the enemy of every interior. Swelling boards, rusting hinges and peeling laminates are the most common failures we are called in to fix.',
    materials: [
      'BWP (boiling water proof) plywood or HDHMR for all carcasses',
      'Marine-grade adhesives and edge-sealed shutters',
      'SS-304 hinges, channels, baskets and handles',
      'Ventilated wardrobe backs and kitchen plinths to let air circulate',
      'Anti-fungal primers behind wardrobes on external walls',
      'Vitrified tiles, terrazzo or sealed stone rather than untreated wood floors',
    ],
    avoid: [
      'Plain MDF and particle board',
      'Mild-steel hardware',
      'Unsealed natural veneer in bathrooms and kitchens',
    ],
  },
  'tropical-wet': {
    label: 'tropical monsoon climate',
    summary:
      'Very high rainfall and humidity for several months of the year, often combined with seismic considerations, call for breathable, moisture-tolerant and lightweight construction.',
    materials: [
      'BWP plywood, marine ply or solid teak for joinery',
      'Lime-based or breathable paints that release trapped moisture',
      'Terracotta, terrazzo and vitrified flooring',
      'Stainless-steel hardware and brass fittings',
      'Cane, bamboo and rattan for furniture that tolerates humidity',
      'Cross-ventilated layouts and ceiling fans as design elements',
    ],
    avoid: [
      'Particle board',
      'Sealed vinyl wallpapers that trap moisture',
      'Heavy gypsum partitions in seismic zones',
    ],
  },
  'hot-dry': {
    label: 'hot, dry climate',
    summary:
      'Summer temperatures above 42°C, intense sun and dust put finishes and joinery under thermal stress; the design goal is to keep interiors cool, shaded and easy to clean.',
    materials: [
      'Heat-stable PU and acrylic finishes on sun-facing shutters',
      'Light, reflective colour palettes and matte laminates that hide dust',
      'Stone or vitrified flooring that stays cool underfoot',
      'Deep window treatments, blinds and shaded balconies',
      'Kiln-dried timber and engineered boards to avoid seasonal cracking',
      'Sealed cabinetry with dust-proof gaskets',
    ],
    avoid: [
      'Dark high-gloss surfaces on west-facing walls',
      'Untreated solid wood that cracks in dry heat',
      'Wall-to-wall carpets',
    ],
  },
  composite: {
    label: 'composite climate',
    summary:
      'Hot summers, a wet monsoon and cool, often foggy winters mean interiors have to cope with both heat and humidity across the year.',
    materials: [
      'MR or BWP plywood depending on the room (BWP in kitchens and bathrooms)',
      'Sealed veneers and laminates with edge banding',
      'Soft-close, corrosion-resistant hardware',
      'Matte and textured finishes that hide dust',
      'Anti-fungal primers on external walls',
      'Layered lighting for long winter evenings',
    ],
    avoid: [
      'Particle board in wet areas',
      'Unsealed wood in kitchens',
      'Very dark palettes in low-light winter rooms',
    ],
  },
  'cold-hill': {
    label: 'cold hill climate',
    summary:
      'Cold, damp winters, steep sites and narrow access shape every decision — insulation, warmth underfoot and prefabricated delivery matter more than anywhere else.',
    materials: [
      'Insulated wall linings and double-glazed windows',
      'Engineered or solid wood flooring with underlay',
      'Kiln-dried deodar, pine or engineered boards for stable joinery',
      'Provision for radiant or bukhari-style heating',
      'Wool, felt and heavy drapery for thermal comfort',
      'Flat-pack modular units assembled on site',
    ],
    avoid: [
      'Cold stone floors without underfloor warmth',
      'Unseasoned local timber that warps',
      'Large single-glazed panes',
    ],
  },
  moderate: {
    label: 'moderate climate',
    summary:
      'A pleasant year-round climate is the most forgiving of any in India — natural materials age well and the design conversation can focus on light, greenery and lifestyle rather than protection.',
    materials: [
      'Natural veneers, solid wood and open shelving that age gracefully',
      'Indoor plants and biophilic elements',
      'Large openings and balconies as living extensions',
      'Standard MR plywood for dry areas; BWP for kitchens and bathrooms',
      'Linen, cotton and natural-fibre textiles',
      'Warm, layered lighting',
    ],
    avoid: [
      'Over-specifying heavy protective finishes where they are not needed',
    ],
  },
};

export const HOUSING_GUIDANCE: Record<
  HousingClass,
  { label: string; text: string }
> = {
  'high-rise': {
    label: 'high-rise apartments',
    text: 'Apartment towers come with fixed floor plates, shared walls and society rules on working hours. We optimise storage vertically, plan around AC and plumbing shafts, and prefabricate modular units in our workshop so site work is fast and quiet.',
  },
  'gated-villa': {
    label: 'gated villa communities',
    text: 'Villas give us double-height volumes, staircases and indoor–outdoor flow. We design a single material story across floors, integrate automation and coordinate with landscape and façade elements.',
  },
  independent: {
    label: 'independent houses',
    text: 'Self-built independent homes often have generous plots, unusual room shapes and scope for civil changes. We survey structure and services first, then plan interiors that make the most of courtyards, terraces and natural light.',
  },
  heritage: {
    label: 'heritage and older homes',
    text: 'Older homes have high ceilings, thick walls and period details worth keeping. We restore what deserves restoring — lime plaster, terrazzo, original doors — and add modern kitchens, bathrooms and storage discreetly.',
  },
  'builder-floor': {
    label: 'builder floors',
    text: 'Builder floors are typically 3–4 sides open with good light and standard 2–4 bedroom layouts. We design for cross-ventilation, add lofts and full-height storage, and specify finishes that handle dust and heat.',
  },
  'row-house': {
    label: 'row houses and township quarters',
    text: 'Township and row-house plans are consistent across a colony, which lets us reuse proven layouts and focus budget on finishes and personalisation.',
  },
  mixed: {
    label: 'mixed housing',
    text: 'From compact flats to large family homes, we adapt the same process — measure, design in 3D, itemise, execute in 45 days — to every property type.',
  },
};

/* ────────────────────────────────────────────────────────────────────────── */
/* Pricing (Kolkata baseline × city index)                                   */
/* ────────────────────────────────────────────────────────────────────────── */

export const BASE_PRICING: {
  key: string;
  label: string;
  from: number;
  to: number;
  serviceSlug: string;
}[] = [
  {
    key: 'kitchen',
    label: 'Modular kitchen',
    from: 140000,
    to: 450000,
    serviceSlug: 'modular-kitchen',
  },
  {
    key: 'bedroom',
    label: 'Bedroom (wardrobe, bed, ceiling)',
    from: 210000,
    to: 500000,
    serviceSlug: 'bedroom-interiors',
  },
  {
    key: 'living',
    label: 'Living room',
    from: 240000,
    to: 600000,
    serviceSlug: 'living-room-interiors',
  },
  {
    key: 'bathroom',
    label: 'Bathroom',
    from: 180000,
    to: 400000,
    serviceSlug: 'bathroom-interiors',
  },
  {
    key: '1bhk',
    label: '1BHK full home',
    from: 350000,
    to: 700000,
    serviceSlug: '1bhk-interior-design',
  },
  {
    key: '2bhk',
    label: '2BHK full home',
    from: 550000,
    to: 1200000,
    serviceSlug: '2bhk-interior-design',
  },
  {
    key: '3bhk',
    label: '3BHK full home',
    from: 800000,
    to: 1800000,
    serviceSlug: '3bhk-interior-design',
  },
  {
    key: '4bhk',
    label: '4BHK / duplex',
    from: 1400000,
    to: 3500000,
    serviceSlug: '4bhk-interior-design',
  },
  {
    key: 'villa',
    label: 'Villa / bungalow',
    from: 1800000,
    to: 8000000,
    serviceSlug: 'villa-interior-design',
  },
];

export type PriceRow = {
  key: string;
  label: string;
  from: number;
  to: number;
  serviceSlug: string;
};

export function cityPricing(city: CityData): PriceRow[] {
  return BASE_PRICING.map((row) => ({
    ...row,
    from: roundTo(
      row.from * city.priceIndex,
      row.from >= 1000000 ? 50000 : 10000,
    ),
    to: roundTo(row.to * city.priceIndex, row.to >= 1000000 ? 50000 : 10000),
  }));
}

export function priceRow(city: CityData, key: string): PriceRow {
  return cityPricing(city).find((r) => r.key === key)!;
}

/* ────────────────────────────────────────────────────────────────────────── */
/* City copy                                                                  */
/* ────────────────────────────────────────────────────────────────────────── */

export function cityTitle(city: CityData) {
  return `Interior Designers in ${city.name}`;
}

/** One title shape everywhere; "Best" is a self-awarded superlative we cannot substantiate. */
export function cityMetaTitle(city: CityData) {
  return `Interior Designers in ${city.name} | Silver Storey`;
}

/** Google shows about this much of a description before cutting it. */
const MAX_META_DESCRIPTION = 150;

/**
 * The city-unique clause (its neighbourhoods) leads, so the part a searcher
 * sees is never the boilerplate. Localities drop off until it fits.
 */
export function cityMetaDescription(city: CityData) {
  const k = priceRow(city, 'kitchen');
  for (let n = 3; n >= 1; n--) {
    const text = `Interior designers in ${city.name} — ${joinList(city.localities, n)}. Kitchens from ${formatINR(k.from)}, free 3D design, 45-day delivery, 10-year warranty.`;
    if (text.length <= MAX_META_DESCRIPTION || n === 1) return text;
  }
  return '';
}

/**
 * The pricing-table footnote: where the numbers come from, so a visitor can
 * tell a scaled price book from a local quote.
 */
export function cityPricingNote(city: CityData) {
  const source =
    city.slug === HQ_CITY_SLUG
      ? 'Figures are our Kolkata price book — the baseline every other city is scaled from.'
      : `Figures are our Kolkata price book scaled by ${city.name}’s cost index (${city.priceIndex}×).`;
  return `${source} Every quote is itemised; design and 3D visualisation are free.`;
}

export function cityIntro(city: CityData, state: StateData): string[] {
  const isHQ = city.slug === HQ_CITY_SLUG;
  const c = CLIMATE_GUIDANCE[city.climate];
  const locs = joinList(city.localities, 4);

  const opening = pick(
    [
      `Searching for interior designers in ${city.name}? Silver Storey designs and delivers turnkey home and office interiors across ${city.name} — from ${locs} — with complimentary 3D visualisation, an itemised transparent quote and delivery within 45 days of design approval.`,
      `Silver Storey is a premium interior design studio serving ${city.name}, ${state.name}. Whether you have just taken possession of an apartment in ${city.localities[0]} or are renovating a family home in ${city.localities[1] ?? city.localities[0]}, we handle everything from space planning and modular kitchens to lighting, furniture and styling — with free 3D designs and a 10-year warranty.`,
      `If you are looking for an interior designer in ${city.name} who will give you a fixed, itemised price and a finished home in 45 days, you are in the right place. Silver Storey works across ${locs}, designing full homes, modular kitchens, wardrobes and commercial spaces with complimentary 3D visualisation before a single board is cut.`,
    ],
    city.slug + ':open',
  );

  const context = `${city.housingNote} ${city.styleNote}`;

  const climate = `${city.name} has a ${c.label}. ${c.summary} That is why our ${city.name} specifications default to ${lowerName(c.materials[0])} and ${lowerName(c.materials[1])} — details that separate an interior that looks good on handover day from one that still looks good ten years later.`;

  const coverage = isHQ
    ? `Our head office and workshop are in Tangra, Kolkata, which means the shortest lead times, the most site visits and the deepest vendor network of any city we serve. Our founders, ${SITE.founders[0].name} and ${SITE.founders[1].name}, personally review every Kolkata project.`
    : pick(
        [
          `Headquartered in Kolkata with ${SITE.stats.yearsExperience} years of experience and ${SITE.stats.sqftTransformed} sq ft delivered, we run ${city.name} projects through a dedicated project manager, on-site supervision and weekly photo and video reports — so you always know exactly where your home stands. ${city.marketNote ?? ''}`.trim(),
          `We bring ${SITE.stats.yearsExperience} years of design and execution experience to ${city.name}. Consultations happen at your site or over video, designs are approved in 3D, and a dedicated project manager supervises execution with weekly progress reports. ${city.marketNote ?? ''}`.trim(),
        ],
        city.slug + ':cov',
      );

  return [opening, context, climate, coverage];
}

export function cityWhySection(city: CityData) {
  const c = CLIMATE_GUIDANCE[city.climate];
  const housing = city.housing.map((h) => HOUSING_GUIDANCE[h]);
  return {
    climateTitle: `Designing for ${city.name}’s ${c.label}`,
    climateSummary: c.summary,
    materials: c.materials,
    avoid: c.avoid,
    housingTitle: `Homes we design in ${city.name}`,
    housing,
  };
}

export function cityFaqs(city: CityData, state: StateData): FAQ[] {
  const p = cityPricing(city);
  const k = p.find((r) => r.key === 'kitchen')!;
  const two = p.find((r) => r.key === '2bhk')!;
  const three = p.find((r) => r.key === '3bhk')!;
  const c = CLIMATE_GUIDANCE[city.climate];
  const isHQ = city.slug === HQ_CITY_SLUG;
  const housingLabels = city.housing.map((h) => HOUSING_GUIDANCE[h].label);
  const near = nearbyCities(city, 3).map((n) => n.name);

  return [
    {
      question: `How much do interior designers in ${city.name} charge?`,
      answer: `Silver Storey prices ${city.name} projects on an itemised, transparent basis. Indicative starting costs in ${city.name}, ${state.name}: modular kitchens from ${formatINR(k.from)}, 2BHK full home interiors from ${formatINR(two.from)} and 3BHK full home interiors from ${formatINR(three.from)}. The consultation, site measurement and 3D visualisation are complimentary; you pay only for execution as per the quote you approve.`,
    },
    {
      question: `Which areas of ${city.name} does Silver Storey serve?`,
      answer: `We take up projects across ${city.name} including ${joinList(city.localities)}${near.length ? `, and in nearby cities such as ${joinList(near)}` : ''}.`,
    },
    {
      question: `How long does a full home interior project in ${city.name} take?`,
      answer: `Most ${city.name} homes are delivered within 45 days of final design approval. The design phase — consultation, measurement, estimate and 3D visualisation — typically takes 2–3 weeks before that. Timelines for villas or projects with civil changes are agreed in writing.`,
    },
    {
      question: `What materials do you recommend for homes in ${city.name}?`,
      answer: `${city.name} has a ${c.label}. ${c.summary} We recommend ${joinList(c.materials.slice(0, 3).map(lowerName))}, and we avoid ${joinList(c.avoid.map(lowerName))}.`,
    },
    {
      question: `Do you design ${joinList(housingLabels)} in ${city.name}?`,
      answer: `Yes. ${city.housingNote} ${HOUSING_GUIDANCE[city.housing[0]].text}`,
    },
    {
      question: `Is Silver Storey based in ${city.name}?`,
      answer: isHQ
        ? `Yes — our head office and manufacturing workshop are at ${SITE.address.street}, Kolkata ${SITE.address.postalCode}. You are welcome to visit by appointment.`
        : `No. ${serviceModelFor(city.state)}`,
    },
    {
      question: `Do I get to see the design before work starts in my ${city.name} home?`,
      answer: `Yes. After the free consultation and estimate we create complimentary 3D visualisations of every room. Execution begins only after you approve the design, materials and itemised quote.`,
    },
    {
      question: `What warranty do you offer on interiors in ${city.name}?`,
      answer: `Every Silver Storey project carries a 10-year warranty on modular components and workmanship. We use branded materials — Greenply, Hettich, Ebco, Asian Paints, Havells, Philips and Kohler — and the full warranty terms are published on our Terms & Conditions page.`,
    },
    {
      question: `Do you also do commercial and office interiors in ${city.name}?`,
      answer: `Yes. Alongside homes, we design offices, clinics, retail stores, cafés and hospitality spaces in ${city.name}, with fixed timelines aligned to your lease or opening date.`,
    },
    {
      question: `How do I start an interior design project in ${city.name}?`,
      answer: `Call or WhatsApp ${SITE.phoneDisplay}, email ${SITE.email}, or book a free 30-minute consultation online. We will schedule a site visit or video call, measure your space and share an itemised estimate within a few days.`,
    },
  ];
}

/* ────────────────────────────────────────────────────────────────────────── */
/* State copy                                                                 */
/* ────────────────────────────────────────────────────────────────────────── */

export function stateTitle(state: StateData) {
  return `Interior Designers in ${state.name}`;
}

/**
 * "Dadra and Nagar Haveli and Daman and Diu" would push the standard title
 * past the point where the metadata builder cuts it to "…Haveli and |
 * Silver Storey", so long names fall back to shorter shapes that still
 * carry the brand.
 */
export function stateMetaTitle(state: StateData) {
  const shapes = [
    `Interior Designers in ${state.name} | Silver Storey`,
    `Interiors in ${state.name} | Silver Storey`,
    `${state.name} | Silver Storey`,
  ];
  return shapes.find((t) => t.length <= 65) ?? shapes[shapes.length - 1];
}

/**
 * A hub with no city page beneath it used to render "interiors in  — free
 * 3D design"; it now says what is true: work there is taken up on request.
 */
export function stateMetaDescription(state: StateData) {
  const cities = citiesInState(state.slug);
  if (!cities.length) {
    const full = `Silver Storey takes up home and office interiors across ${state.name} on request — free 3D design, itemised pricing, 45-day delivery, 10-year warranty.`;
    // "Dadra and Nagar Haveli and Daman and Diu" alone is 40 characters.
    const brief = `Silver Storey takes up interiors in ${state.name} on request — free 3D design, 45-day delivery, 10-year warranty.`;
    return full.length <= MAX_META_DESCRIPTION ? full : brief;
  }
  // Goa's one city page is named Goa; its localities are the unique clause there.
  const names = cities.map((c) => c.name).filter((n) => n !== state.name);
  if (!names.length) names.push(...cities[0].localities.slice(0, 3));
  for (let n = Math.min(4, names.length); n >= 1; n--) {
    const listed =
      names.length > n
        ? `${names.slice(0, n).join(', ')} and more`
        : joinList(names);
    const text = `Interior designers in ${state.name} — ${listed}. Free 3D design, itemised pricing, 45-day delivery, 10-year warranty.`;
    if (text.length <= MAX_META_DESCRIPTION || n === 1) return text;
  }
  return '';
}

/**
 * The paragraph under "How we work in {state}": the service model plus, for
 * hubs without a city page, the plain statement that work is on request.
 */
export function stateHowWeWork(state: StateData): string {
  const cities = citiesInState(state.slug);
  const model = serviceModelFor(state.slug);
  if (!cities.length)
    return `We take up projects in ${state.name} on request; there is no dedicated city page yet. ${model}`;
  return model;
}

/**
 * The state-wide price band for a scope, from the price indices of the
 * cities we actually list there. A hub without cities falls back to the
 * span the dataset allows, so the sentence still describes real numbers.
 */
function statePriceBand(state: StateData, key: string): [number, number] {
  const base = BASE_PRICING.find((r) => r.key === key)!;
  const indices = citiesInState(state.slug).map((c) => c.priceIndex);
  const lo = indices.length ? Math.min(...indices) : 0.85;
  const hi = indices.length ? Math.max(...indices) : 1.2;
  const step = base.from >= 1000000 ? 50000 : 10000;
  return [roundTo(base.from * lo, step), roundTo(base.from * hi, step)];
}

function fromBand([lo, hi]: [number, number]) {
  return lo === hi
    ? `from ${formatINR(lo)}`
    : `between ${formatINR(lo)} and ${formatINR(hi)}`;
}

export function stateFaqs(state: StateData): FAQ[] {
  const cities = citiesInState(state.slug);
  const names = cities.map((c) => c.name);
  const isHome = state.slug === HQ_STATE_SLUG;
  const coverage =
    cities.length === 1 && cities[0].name === state.name
      ? `We have dedicated design coverage across ${state.name} — ${joinList(cities[0].localities, 4)} — and take up projects elsewhere in the state on request.`
      : names.length
        ? `We have dedicated design coverage for ${joinList(names)}, and take up projects in other towns across ${state.name} on request.`
        : `We take up projects across ${state.name} on request — contact us with your location for availability.`;
  return [
    {
      question: `Which cities in ${state.name} does Silver Storey serve?`,
      answer: coverage,
    },
    {
      question: `How much does interior design cost in ${state.name}?`,
      answer: `Costs vary by city and scope. Across ${state.name}, modular kitchens typically start ${fromBand(statePriceBand(state, 'kitchen'))}, 2BHK full home packages ${fromBand(statePriceBand(state, '2bhk'))}, and 3BHK packages ${fromBand(statePriceBand(state, '3bhk'))}. Every quote is itemised and the design and 3D visualisation are complimentary.`,
    },
    {
      question: `What should I consider when designing a home in ${state.name}?`,
      answer: state.designNotes.join(' '),
    },
    {
      question: `Is Silver Storey a local interior designer in ${state.name}?`,
      answer: isHome
        ? `Yes. ${SITE.serviceModel.hq}`
        : `Silver Storey is headquartered in Kolkata. ${SITE.serviceModel.outstation}`,
    },
    {
      question: `Do you offer a warranty on interiors in ${state.name}?`,
      answer: `Yes — every project carries a 10-year warranty on modular components and workmanship, using branded materials from Greenply, Hettich, Ebco, Asian Paints, Havells, Philips and Kohler.`,
    },
    {
      question: `How do I book a consultation in ${state.name}?`,
      answer: `Call or WhatsApp ${SITE.phoneDisplay}, email ${SITE.email}, or book a free 30-minute consultation online and we will arrange a site visit or video call.`,
    },
  ];
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Service × city copy                                                        */
/* ────────────────────────────────────────────────────────────────────────── */

/** Scale a Kolkata-baseline price to a city, rounded the way the price book is. */
export function cityPrice(baseINR: number, city: CityData): number {
  return roundTo(baseINR * city.priceIndex, baseINR >= 1000000 ? 50000 : 10000);
}

/** Who a service is for, in the words the page uses; drives every template branch. */
export function serviceAudience(category: string) {
  return category === 'commercial'
    ? {
        commercial: true,
        forWhom: 'for businesses',
        spaces: 'offices, retail and hospitality',
        // Fit-outs run to lease dates, not the 45-day residential promise.
        delivery: 'a fixed timeline aligned to your lease or opening date',
      }
    : {
        commercial: false,
        forWhom: 'for homes',
        spaces: 'homes',
        delivery: 'installation within 45 days of design approval',
      };
}

export function serviceCityIntro(opts: {
  serviceName: string;
  serviceShort: string;
  category: string;
  city: CityData;
  state: StateData;
  startingPriceINR?: number;
}): string[] {
  const { serviceName, serviceShort, city, state } = opts;
  const c = CLIMATE_GUIDANCE[city.climate];
  const who = serviceAudience(opts.category);
  const short = lowerName(serviceShort);
  const start = opts.startingPriceINR
    ? cityPrice(opts.startingPriceINR, city)
    : undefined;

  const p1 = pick(
    [
      `Looking for ${lowerName(serviceName)} in ${city.name}? Silver Storey delivers ${short} projects across ${joinList(city.localities, 4)} with complimentary 3D visualisation, an itemised quote${start ? ` (starting around ${formatINR(start)} in ${city.name})` : ''} and ${who.delivery}.`,
      `Silver Storey designs and installs ${short} ${who.forWhom} across ${city.name}, ${state.name} — from ${city.localities[0]} to ${city.localities[Math.min(3, city.localities.length - 1)]}. Every project starts with a free consultation and 3D design${start ? `, with ${city.name} pricing starting around ${formatINR(start)}` : ''}.`,
    ],
    `${city.slug}:${serviceShort}:1`,
  );

  // The housing notes describe homes; a fit-out page gets the commercial
  // brief instead of a paragraph about apartment towers.
  const housing = HOUSING_GUIDANCE[city.housing[0]].text;
  const p2 = who.commercial
    ? `We take up ${short} projects across ${city.name} — ${joinList(city.localities, 4)} — with ${who.delivery}, and coordinate acoustics, HVAC, data cabling and fire compliance from the first drawing so the fit-out hands over ready to occupy.`
    : `${city.housingNote} For ${short} in ${city.name} this means ${housing.charAt(0).toLowerCase()}${housing.slice(1)}`;

  const p3 = `Because ${city.name} has a ${c.label}, our ${short} specifications for the city use ${lowerName(c.materials[0])} and ${lowerName(c.materials[2])}, and avoid ${lowerName(c.avoid[0])}.${who.commercial ? '' : ` ${city.styleNote}`}`;

  return [p1, p2, p3];
}

export function serviceCityFaqs(opts: {
  serviceName: string;
  serviceShort: string;
  category: string;
  city: CityData;
  /** The service's own materials list, used on commercial pages. */
  materials?: string[];
  startingPriceINR?: number;
  typicalRangeINR?: [number, number];
  baseFaqs: FAQ[];
}): FAQ[] {
  const { serviceName, serviceShort, city } = opts;
  const c = CLIMATE_GUIDANCE[city.climate];
  const who = serviceAudience(opts.category);
  const short = lowerName(serviceShort);
  const range = opts.typicalRangeINR
    ? opts.typicalRangeINR.map((n) => cityPrice(n, city))
    : undefined;

  const local: FAQ[] = [
    {
      question: `How much does ${short} cost in ${city.name}?`,
      answer: range
        ? `In ${city.name}, Silver Storey ${short} projects typically range from ${formatINR(range[0])} to ${formatINR(range[1])} depending on size, finish grade and scope. We share an itemised estimate after a free site measurement, and the 3D design is complimentary.`
        : `Pricing in ${city.name} depends on size and scope. We share an itemised estimate after a free site measurement, and the 3D design is complimentary.`,
    },
    {
      question: `Which parts of ${city.name} do you cover for ${short}?`,
      answer: `We take up ${short} projects across ${joinList(city.localities)}.`,
    },
    {
      question: `What materials do you use for ${short} in ${city.name}?`,
      answer:
        who.commercial && opts.materials?.length
          ? `${city.name}’s ${c.label} calls for ${joinList(c.materials.slice(0, 2).map(lowerName))}. For fit-outs we specify ${joinList(opts.materials.map(lowerName))}, and avoid ${joinList(c.avoid.map(lowerName))}.`
          : `${city.name}’s ${c.label} calls for ${joinList(c.materials.slice(0, 3).map(lowerName))}. We avoid ${joinList(c.avoid.map(lowerName))}.`,
    },
  ];

  // Merge base service FAQs but avoid duplicating cost questions.
  const base = opts.baseFaqs.filter(
    (f) => !/cost|price|charge/i.test(f.question),
  );
  return [
    ...local,
    ...base.slice(0, 4),
    {
      question: `How do I get started with ${lowerName(serviceName)} in ${city.name}?`,
      answer: `Call or WhatsApp ${SITE.phoneDisplay}, email ${SITE.email}, or book a free consultation online. We will measure your space, share an itemised estimate and create 3D visualisations before any work begins.`,
    },
  ];
}
