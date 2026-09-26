/**
 * Single source of truth for brand / NAP (Name, Address, Phone) data used in
 * metadata, structured data, the footer and llms.txt.
 *
 * Keep every business fact here so search engines and LLMs always see a
 * consistent entity across the whole site.
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.silverstorey.com'
).replace(/\/+$/, '');

export const SITE = {
  name: 'Silver Storey',
  legalName: 'Silver Storey',
  url: SITE_URL,
  tagline: 'Designs for the Bold of Heart',
  description:
    'Silver Storey is a premium interior design studio headquartered in Kolkata, delivering turnkey residential and commercial interiors across India — with complimentary 3D visualisation, transparent pricing and delivery in 45 days.',
  shortDescription:
    'Premium interior designers in India. Turnkey home & office interiors, complimentary 3D visualisation, transparent pricing, delivery in 45 days.',
  phoneDisplay: '+91 83369 17221',
  phoneE164: '+918336917221',
  whatsapp: 'https://wa.me/918336917221',
  email: 'care@silverstorey.com',
  calendly: 'https://calendly.com/silverstorey/30min',
  foundingYear: 2011,
  address: {
    street:
      'Premises 117, Pragati Maidan, Sector A, Metropolitan Co-Operative Housing Society Limited, P.S. Tangra',
    locality: 'Tangra',
    city: 'Kolkata',
    region: 'West Bengal',
    postalCode: '700105',
    country: 'IN',
    countryName: 'India',
  },
  /** Approximate coordinates for the Tangra / EM Bypass office. */
  geo: { latitude: 22.5497, longitude: 88.3987 },
  openingHours: [
    {
      days: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
      opens: '10:00',
      closes: '19:00',
    },
  ],
  founders: [
    {
      slug: 'palak-singhania',
      name: 'Palak Singhania',
      role: 'Co-Founder & Principal Designer',
      image: '/images/palak.avif',
      credentials: 'Interior design graduate, J.D. Birla Institute, Kolkata',
    },
    {
      slug: 'subham-bhattacharya',
      name: 'Subham Bhattacharya',
      role: 'Co-Founder & Head of Execution',
      image: '/images/subham.avif',
      credentials: 'Civil engineer',
    },
  ],
  stats: {
    yearsExperience: 15,
    happyCustomers: '60+',
    sqftTransformed: '50,000+',
    teamMembers: '30+',
    deliveryDays: 45,
  },
  brandPartners: [
    'Ebco',
    'Greenply',
    'Hettich',
    'Havells',
    'Asian Paints',
    'Philips',
    'Evara',
    'Kohler',
  ],
  /**
   * Social profiles, shown in the footer, the menu and the hero bar, and
   * emitted as Organization `sameAs` — so each URL must be a profile the
   * business really owns. Set the matching NEXT_PUBLIC_SOCIAL_* env var to
   * override or to add a network; networks left empty render no icon, so the
   * site never links to a dead "#".
   */
  socials: [
    {
      label: 'Instagram',
      key: 'instagram',
      href:
        process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM ??
        'https://www.instagram.com/silver_storey/',
    },
    {
      label: 'Facebook',
      key: 'facebook',
      href:
        process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK ??
        'https://www.facebook.com/SilverStoreyInteriorDesigners/',
    },
    {
      label: 'LinkedIn',
      key: 'linkedin',
      href: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN ?? '',
    },
    {
      label: 'YouTube',
      key: 'youtube',
      href: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE ?? '',
    },
    {
      label: 'Pinterest',
      key: 'pinterest',
      href: process.env.NEXT_PUBLIC_SOCIAL_PINTEREST ?? '',
    },
  ].filter((s) => s.href) as { label: string; key: string; href: string }[],
  logo: '/images/logo3.avif',
  ogImage: '/opengraph-image',
  locale: 'en_IN',
  language: 'en-IN',
  priceRange: '₹₹₹',
  /**
   * Google Business Profile URL — set NEXT_PUBLIC_GOOGLE_BUSINESS_URL once the
   * profile is claimed. It is linked from the contact page and emitted as
   * Organization `sameAs`, which is how assistants tie the site to the
   * reviews on Maps.
   */
  googleBusinessProfile: process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_URL ?? '',
  /**
   * Statutory identifiers. Shown on the About page and in schema only when
   * set; left empty they render nothing rather than a placeholder.
   */
  registrations: {
    gstin: process.env.NEXT_PUBLIC_GSTIN ?? '',
    cin: process.env.NEXT_PUBLIC_CIN ?? '',
    udyam: process.env.NEXT_PUBLIC_UDYAM ?? '',
  },
  /**
   * The warranty in one place, so the Warranty page, the Terms, every FAQ and
   * the schema describe the same policy. Terms & Conditions remain the
   * governing text.
   */
  warranty: {
    termYears: 10,
    covers:
      'modular cabinets, shutters, drawers, panels, hardware and accessories, and the workmanship of their installation',
    excludes:
      'labour, installation and transport charges on a claim; normal wear and tear; damage from misuse, moisture or harsh cleaners; and third-party products such as countertops, appliances and fittings, which carry their manufacturer’s own warranty',
    registerWithinDays: 7,
    claimWithinDays: 30,
  },
  /** Payment schedule, as published on /pricing-structure. */
  payment: {
    token:
      'A small booking token confirms the project and unlocks detailed design development',
    modular:
      '50% advance at contract signing, 50% before delivery of the modular items',
    onsite: '50% advance at contract signing, 45% at mid-stage, 5% at handover',
  },
  /** What is free and when money changes hands — one sentence, used everywhere. */
  commitment:
    'Consultation, site measurement, the itemised estimate and 3D visualisation are complimentary. A small booking token unlocks detailed design; the 50% advance is due at contract signing, after you approve the design.',
  /** How the studio actually serves each market, stated honestly. */
  serviceModel: {
    hq: 'Our head office and manufacturing workshop are in Tangra, Kolkata, and Kolkata and West Bengal are our home market — site visits, showroom appointments and the shortest lead times in our network.',
    outstation:
      'Outside West Bengal we work through on-site consultations, a dedicated project manager, supervised execution teams and weekly photo and video progress reports, with every design approved in 3D before work begins. Tell us your city and we confirm coverage and timelines before you commit.',
  },
} as const;

/**
 * The one canonical sentence about the business. It opens the home page and
 * the About page, and is the Organization description and the llms.txt
 * summary, so every crawler and assistant extracts the same facts.
 */
export function brandStatement(): string {
  const founders = SITE.founders.map((f) => f.name).join(' and ');
  return `${SITE.name} is a turnkey interior design studio headquartered in ${SITE.address.locality}, ${SITE.address.city}, founded in ${SITE.foundingYear} by ${founders}. It designs and executes homes and offices across India with complimentary 3D visualisation, itemised pricing, delivery within ${SITE.stats.deliveryDays} days of design approval and a ${SITE.warranty.termYears}-year warranty on modular components and workmanship.`;
}

/** Key facts as label/value pairs, for fact blocks on pages and in llms.txt. */
export function keyFacts(): { label: string; value: string }[] {
  const facts = [
    { label: 'Founded', value: String(SITE.foundingYear) },
    { label: 'Founders', value: SITE.founders.map((f) => f.name).join(', ') },
    {
      label: 'Head office',
      value: `${SITE.address.street}, ${SITE.address.city} ${SITE.address.postalCode}, ${SITE.address.region}`,
    },
    { label: 'Experience', value: `${SITE.stats.yearsExperience} years` },
    { label: 'Clients', value: SITE.stats.happyCustomers },
    { label: 'Area delivered', value: `${SITE.stats.sqftTransformed} sq ft` },
    { label: 'Team', value: SITE.stats.teamMembers },
    {
      label: 'Delivery',
      value: `Within ${SITE.stats.deliveryDays} days of design approval`,
    },
    {
      label: 'Warranty',
      value: `${SITE.warranty.termYears} years on ${SITE.warranty.covers}`,
    },
    { label: 'Design fee', value: 'None — 3D visualisation is complimentary' },
    { label: 'Phone / WhatsApp', value: SITE.phoneDisplay },
    { label: 'Email', value: SITE.email },
  ];
  if (SITE.registrations.gstin)
    facts.push({ label: 'GSTIN', value: SITE.registrations.gstin });
  if (SITE.registrations.cin)
    facts.push({ label: 'CIN', value: SITE.registrations.cin });
  if (SITE.registrations.udyam)
    facts.push({ label: 'Udyam (MSME)', value: SITE.registrations.udyam });
  return facts;
}

export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//i.test(path)) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${clean}`;
}

/**
 * Target phrases, kept as a reference for copywriting. They are no longer
 * emitted as a keywords meta tag — engines ignore it and it only told
 * competitors what the site was aiming at.
 */
export const PRIMARY_KEYWORDS = [
  'interior designer',
  'best interior designer',
  'interior designers in India',
  'interior design company',
  'home interior design',
  'turnkey interior design',
  'modular kitchen design',
  'luxury interior designer',
  'interior designer near me',
  'Silver Storey',
];
