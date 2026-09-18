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
      name: 'Palak Singhania',
      role: 'Co-Founder & Principal Designer',
      image: '/images/palak.avif',
    },
    {
      name: 'Subham Bhattacharya',
      role: 'Co-Founder & Head of Execution',
      image: '/images/subham.avif',
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
   * Social profiles. Fill these in (or set the NEXT_PUBLIC_SOCIAL_* env vars)
   * and they appear in Organization `sameAs`, the menu, the social bar and
   * llms.txt. Icons for networks without a URL are not rendered, so the site
   * never links to a dead "#".
   */
  socials: [
    {
      label: 'Instagram',
      key: 'instagram',
      href: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM ?? '',
    },
    {
      label: 'Facebook',
      key: 'facebook',
      href: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK ?? '',
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
  language: 'en',
  priceRange: '₹₹₹',
} as const;

export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//i.test(path)) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${clean}`;
}

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
