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

export function cityMetaTitle(city: CityData) {
  const variants = [
    `Interior Designers in ${city.name} | Best Home & Office Interiors`,
    `Best Interior Designers in ${city.name} – Silver Storey`,
    `Interior Designers in ${city.name} | 3D Design, 45-Day Delivery`,
  ];
  return pick(variants, city.slug);
}

export function cityMetaDescription(city: CityData, state: StateData) {
  const k = priceRow(city, 'kitchen');
  return `Interior designers in ${city.name}, ${state.name}. Turnkey home & office interiors across ${joinList(city.localities, 3)}. Free 3D design, kitchens from ${formatINR(k.from)}, 45-day delivery, 10-year warranty.`;
}

export function cityIntro(city: CityData, state: StateData): string[] {
  const isHQ = city.slug === 'kolkata';
  const c = CLIMATE_GUIDANCE[city.climate];
  const locs = joinList(city.localities, 4);

  const opening = pick(
    [
      `Searching for the best interior designers in ${city.name}? Silver Storey designs and delivers turnkey home and office interiors across ${city.name} — from ${locs} — with complimentary 3D visualisation, an itemised transparent quote and delivery within 45 days of design approval.`,
      `Silver Storey is a premium interior design studio serving ${city.name}, ${state.name}. Whether you have just taken possession of an apartment in ${city.localities[0]} or are renovating a family home in ${city.localities[1] ?? city.localities[0]}, we handle everything from space planning and modular kitchens to lighting, furniture and styling — with free 3D designs and a 10-year warranty.`,
      `If you are looking for an interior designer in ${city.name} who will give you a fixed, itemised price and a finished home in 45 days, you are in the right place. Silver Storey works across ${locs}, designing full homes, modular kitchens, wardrobes and commercial spaces with complimentary 3D visualisation before a single board is cut.`,
    ],
    city.slug + ':open',
  );

  const context = `${city.housingNote} ${city.styleNote}`;

  const climate = `${city.name} has a ${c.label}. ${c.summary} That is why our ${city.name} specifications default to ${c.materials[0].toLowerCase()} and ${c.materials[1].toLowerCase()} — details that separate an interior that looks good on handover day from one that still looks good ten years later.`;

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
  const isHQ = city.slug === 'kolkata';
  const housingLabels = city.housing.map((h) => HOUSING_GUIDANCE[h].label);

  return [
    {
      question: `How much do interior designers in ${city.name} charge?`,
      answer: `Silver Storey prices ${city.name} projects on an itemised, transparent basis. Indicative starting costs in ${city.name}, ${state.name}: modular kitchens from ${formatINR(k.from)}, 2BHK full home interiors from ${formatINR(two.from)} and 3BHK full home interiors from ${formatINR(three.from)}. The consultation, site measurement and 3D visualisation are complimentary; you pay only for execution as per the quote you approve.`,
    },
    {
      question: `Which areas of ${city.name} does Silver Storey serve?`,
      answer: `We take up projects across ${city.name} including ${joinList(city.localities)}${city.nearby.length ? `, and in nearby cities such as ${joinList(nearbyCities(city, 3).map((n) => n.name))}` : ''}.`,
    },
    {
      question: `How long does a full home interior project in ${city.name} take?`,
      answer: `Most ${city.name} homes are delivered within 45 days of final design approval. The design phase — consultation, measurement, estimate and 3D visualisation — typically takes 2–3 weeks before that. Timelines for villas or projects with civil changes are agreed in writing.`,
    },
    {
      question: `What materials do you recommend for homes in ${city.name}?`,
      answer: `${city.name} has a ${c.label}. ${c.summary} We recommend ${joinList(c.materials.slice(0, 3).map((m) => m.toLowerCase()))}, and we avoid ${joinList(c.avoid.map((a) => a.toLowerCase()))}.`,
    },
    {
      question: `Do you design ${joinList(housingLabels)} in ${city.name}?`,
      answer: `Yes. ${city.housingNote} ${HOUSING_GUIDANCE[city.housing[0]].text}`,
    },
    {
      question: `Is Silver Storey based in ${city.name}?`,
      answer: isHQ
        ? `Yes — our head office and manufacturing workshop are at ${SITE.address.street}, Kolkata ${SITE.address.postalCode}. You are welcome to visit by appointment.`
        : `Silver Storey is headquartered in Kolkata and serves ${city.name} through on-site consultations, a dedicated project manager and supervised execution teams. Design approvals happen in 3D and we share weekly photo and video progress reports, so distance never affects quality or communication.`,
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

export function stateMetaTitle(state: StateData) {
  return `Interior Designers in ${state.name} | Silver Storey`;
}

export function stateMetaDescription(state: StateData) {
  const cities = citiesInState(state.slug);
  const names = cities.slice(0, 4).map((c) => c.name);
  return `Best interior designers in ${state.name}. Silver Storey delivers turnkey home & commercial interiors in ${joinList(names)}${cities.length > 4 ? ' and more' : ''} — free 3D design, transparent pricing, 45-day delivery, 10-year warranty.`;
}

export function stateFaqs(state: StateData): FAQ[] {
  const cities = citiesInState(state.slug);
  const names = cities.map((c) => c.name);
  const isHome = state.slug === 'west-bengal';
  return [
    {
      question: `Which cities in ${state.name} does Silver Storey serve?`,
      answer: names.length
        ? `We have dedicated design coverage for ${joinList(names)}, and take up projects in other towns across ${state.name} on request.`
        : `We take up projects across ${state.name} on request — contact us with your location for availability.`,
    },
    {
      question: `How much does interior design cost in ${state.name}?`,
      answer: `Costs vary by city and scope. Across ${state.name}, modular kitchens typically start between ${formatINR(120000)} and ${formatINR(170000)}, 2BHK full home packages between ${formatINR(480000)} and ${formatINR(680000)}, and 3BHK packages between ${formatINR(700000)} and ${formatINR(980000)}. Every quote is itemised and the design and 3D visualisation are complimentary.`,
    },
    {
      question: `What should I consider when designing a home in ${state.name}?`,
      answer: state.designNotes.join(' '),
    },
    {
      question: `Is Silver Storey a local interior designer in ${state.name}?`,
      answer: isHome
        ? `Yes. Our head office and workshop are in Tangra, Kolkata, and ${state.name} is our home market.`
        : `Silver Storey is headquartered in Kolkata and serves ${state.name} through on-site consultations, a dedicated project manager and supervised execution teams, with 3D approvals and weekly progress reports.`,
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

export function serviceCityIntro(opts: {
  serviceName: string;
  serviceShort: string;
  city: CityData;
  state: StateData;
  startingPriceINR?: number;
}): string[] {
  const { serviceName, serviceShort, city, state } = opts;
  const c = CLIMATE_GUIDANCE[city.climate];
  const start = opts.startingPriceINR
    ? roundTo(
        opts.startingPriceINR * city.priceIndex,
        opts.startingPriceINR >= 1000000 ? 50000 : 10000,
      )
    : undefined;

  const p1 = pick(
    [
      `Looking for ${serviceName.toLowerCase()} in ${city.name}? Silver Storey delivers ${serviceShort.toLowerCase()} projects across ${joinList(city.localities, 4)} with complimentary 3D visualisation, an itemised quote${start ? ` (starting around ${formatINR(start)} in ${city.name})` : ''} and installation within 45 days of design approval.`,
      `Silver Storey designs and installs ${serviceShort.toLowerCase()} for homes across ${city.name}, ${state.name} — from ${city.localities[0]} to ${city.localities[Math.min(3, city.localities.length - 1)]}. Every project starts with a free consultation and 3D design${start ? `, with ${city.name} pricing starting around ${formatINR(start)}` : ''}.`,
    ],
    `${city.slug}:${serviceShort}:1`,
  );

  const p2 = `${city.housingNote} For ${serviceShort.toLowerCase()} in ${city.name} this means ${HOUSING_GUIDANCE[city.housing[0]].text.charAt(0).toLowerCase()}${HOUSING_GUIDANCE[city.housing[0]].text.slice(1)}`;

  const p3 = `Because ${city.name} has a ${c.label}, our ${serviceShort.toLowerCase()} specifications for the city use ${c.materials[0].toLowerCase()} and ${c.materials[2].toLowerCase()}, and avoid ${c.avoid[0].toLowerCase()}. ${city.styleNote}`;

  return [p1, p2, p3];
}

export function serviceCityFaqs(opts: {
  serviceName: string;
  serviceShort: string;
  city: CityData;
  startingPriceINR?: number;
  typicalRangeINR?: [number, number];
  baseFaqs: FAQ[];
}): FAQ[] {
  const { serviceName, serviceShort, city } = opts;
  const c = CLIMATE_GUIDANCE[city.climate];
  const idx = city.priceIndex;
  const range = opts.typicalRangeINR
    ? [
        roundTo(
          opts.typicalRangeINR[0] * idx,
          opts.typicalRangeINR[0] >= 1000000 ? 50000 : 10000,
        ),
        roundTo(
          opts.typicalRangeINR[1] * idx,
          opts.typicalRangeINR[1] >= 1000000 ? 50000 : 10000,
        ),
      ]
    : undefined;

  const local: FAQ[] = [
    {
      question: `How much does ${serviceShort.toLowerCase()} cost in ${city.name}?`,
      answer: range
        ? `In ${city.name}, Silver Storey ${serviceShort.toLowerCase()} projects typically range from ${formatINR(range[0])} to ${formatINR(range[1])} depending on size, finish grade and scope. We share an itemised estimate after a free site measurement, and the 3D design is complimentary.`
        : `Pricing in ${city.name} depends on size and scope. We share an itemised estimate after a free site measurement, and the 3D design is complimentary.`,
    },
    {
      question: `Which parts of ${city.name} do you cover for ${serviceShort.toLowerCase()}?`,
      answer: `We take up ${serviceShort.toLowerCase()} projects across ${joinList(city.localities)}.`,
    },
    {
      question: `What materials do you use for ${serviceShort.toLowerCase()} in ${city.name}?`,
      answer: `${city.name}’s ${c.label} calls for ${joinList(c.materials.slice(0, 3).map((m) => m.toLowerCase()))}. We avoid ${joinList(c.avoid.map((a) => a.toLowerCase()))}.`,
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
      question: `How do I get started with ${serviceName.toLowerCase()} in ${city.name}?`,
      answer: `Call or WhatsApp ${SITE.phoneDisplay}, email ${SITE.email}, or book a free consultation online. We will measure your space, share an itemised estimate and create 3D visualisations before any work begins.`,
    },
  ];
}
