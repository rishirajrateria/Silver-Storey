import { SITE, absoluteUrl } from './site';

type Schema = Record<string, unknown>;

export const ORG_ID = `${SITE.url}/#organization`;
export const WEBSITE_ID = `${SITE.url}/#website`;
export const LOCAL_BUSINESS_ID = `${SITE.url}/#localbusiness`;

function postalAddress(): Schema {
  return {
    '@type': 'PostalAddress',
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.city,
    addressRegion: SITE.address.region,
    postalCode: SITE.address.postalCode,
    addressCountry: SITE.address.country,
  };
}

function openingHoursSpecification(): Schema[] {
  return SITE.openingHours.map((h) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: h.days,
    opens: h.opens,
    closes: h.closes,
  }));
}

export function organizationSchema(): Schema {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl(SITE.logo),
    },
    image: absoluteUrl(SITE.ogImage),
    description: SITE.description,
    slogan: SITE.tagline,
    foundingDate: String(SITE.foundingYear),
    founder: SITE.founders.map((f) => ({
      '@type': 'Person',
      name: f.name,
      jobTitle: f.role,
      image: absoluteUrl(f.image),
    })),
    email: SITE.email,
    telephone: SITE.phoneE164,
    address: postalAddress(),
    areaServed: { '@type': 'Country', name: 'India' },
    knowsAbout: [
      'Interior design',
      'Modular kitchen design',
      'Residential interior design',
      'Commercial interior design',
      'Turnkey interior projects',
      '3D interior visualisation',
      'Space planning',
      'Custom furniture and carpentry',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: SITE.phoneE164,
        contactType: 'customer service',
        email: SITE.email,
        areaServed: 'IN',
        availableLanguage: ['English', 'Hindi', 'Bengali'],
      },
    ],
    ...(SITE.socials.length ? { sameAs: SITE.socials.map((s) => s.href) } : {}),
  };
}

export function websiteSchema(): Schema {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE.url,
    name: SITE.name,
    description: SITE.shortDescription,
    publisher: { '@id': ORG_ID },
    inLanguage: SITE.language,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE.url}/blog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export type AreaServed =
  | { type: 'City'; name: string; region?: string }
  | { type: 'State'; name: string }
  | { type: 'Country'; name: string };

export function localBusinessSchema(opts?: {
  id?: string;
  areaServed?: AreaServed[];
  url?: string;
  name?: string;
  description?: string;
}): Schema {
  const areaServed = (
    opts?.areaServed ?? [{ type: 'Country', name: 'India' }]
  ).map((a) =>
    a.type === 'City'
      ? {
          '@type': 'City',
          name: a.name,
          ...(a.region
            ? { containedInPlace: { '@type': 'State', name: a.region } }
            : {}),
        }
      : { '@type': a.type, name: a.name },
  );

  return {
    '@type': [
      'HomeAndConstructionBusiness',
      'LocalBusiness',
      'ProfessionalService',
    ],
    '@id': opts?.id ?? LOCAL_BUSINESS_ID,
    name: opts?.name ?? SITE.name,
    alternateName: 'Silver Storey Interiors',
    description: opts?.description ?? SITE.description,
    url: opts?.url ?? SITE.url,
    image: absoluteUrl(SITE.ogImage),
    logo: absoluteUrl(SITE.logo),
    telephone: SITE.phoneE164,
    email: SITE.email,
    priceRange: SITE.priceRange,
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, Bank Transfer, UPI, Credit Card, Debit Card',
    address: postalAddress(),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE.geo.latitude,
      longitude: SITE.geo.longitude,
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `Silver Storey ${SITE.address.street} ${SITE.address.city} ${SITE.address.postalCode}`,
    )}`,
    openingHoursSpecification: openingHoursSpecification(),
    areaServed,
    parentOrganization: { '@id': ORG_ID },
    founder: SITE.founders.map((f) => ({ '@type': 'Person', name: f.name })),
    slogan: SITE.tagline,
    makesOffer: SERVICE_OFFERS.map((s) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: s.name,
        url: absoluteUrl(s.path),
      },
      ...(s.startingPriceINR
        ? {
            priceSpecification: {
              '@type': 'PriceSpecification',
              price: s.startingPriceINR,
              priceCurrency: 'INR',
              minPrice: s.startingPriceINR,
            },
          }
        : {}),
    })),
    ...(SITE.socials.length ? { sameAs: SITE.socials.map((s) => s.href) } : {}),
  };
}

/** Compact service list reused in LocalBusiness.makesOffer and llms.txt. */
export const SERVICE_OFFERS: {
  name: string;
  path: string;
  startingPriceINR?: number;
}[] = [
  { name: 'Full Home Interior Design', path: '/services/full-home-interiors' },
  {
    name: 'Modular Kitchen Design',
    path: '/services/modular-kitchen',
    startingPriceINR: 140000,
  },
  {
    name: 'Living Room Interior Design',
    path: '/services/living-room-interiors',
    startingPriceINR: 240000,
  },
  {
    name: 'Bedroom Interior Design',
    path: '/services/bedroom-interiors',
    startingPriceINR: 210000,
  },
  {
    name: 'Bathroom Interior Design',
    path: '/services/bathroom-interiors',
    startingPriceINR: 180000,
  },
  {
    name: 'Dining Room Interior Design',
    path: '/services/dining-room-interiors',
    startingPriceINR: 100000,
  },
  {
    name: 'Home Office Interior Design',
    path: '/services/home-office-interiors',
    startingPriceINR: 200000,
  },
  {
    name: 'Commercial & Office Interior Design',
    path: '/services/commercial-office-interiors',
  },
];

export function breadcrumbSchema(
  items: { name: string; path: string }[],
): Schema {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export type FAQ = { question: string; answer: string };

export function faqSchema(faqs: FAQ[]): Schema {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export function serviceSchema(opts: {
  name: string;
  description: string;
  path: string;
  serviceType?: string;
  areaServed?: AreaServed[];
  startingPriceINR?: number;
  image?: string;
}): Schema {
  return {
    '@type': 'Service',
    '@id': `${absoluteUrl(opts.path)}#service`,
    name: opts.name,
    serviceType: opts.serviceType ?? 'Interior Design',
    description: opts.description,
    url: absoluteUrl(opts.path),
    provider: { '@id': LOCAL_BUSINESS_ID },
    brand: { '@id': ORG_ID },
    ...(opts.image ? { image: absoluteUrl(opts.image) } : {}),
    areaServed: (opts.areaServed ?? [{ type: 'Country', name: 'India' }]).map(
      (a) => ({
        '@type': a.type,
        name: a.name,
      }),
    ),
    ...(opts.startingPriceINR
      ? {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'INR',
            price: opts.startingPriceINR,
            priceSpecification: {
              '@type': 'PriceSpecification',
              priceCurrency: 'INR',
              minPrice: opts.startingPriceINR,
            },
            availability: 'https://schema.org/InStock',
            url: absoluteUrl(opts.path),
          },
        }
      : {}),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Interior design services',
      itemListElement: SERVICE_OFFERS.map((s) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: s.name,
          url: absoluteUrl(s.path),
        },
      })),
    },
  };
}

export function articleSchema(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  wordCount?: number;
  keywords?: string[];
  section?: string;
}): Schema {
  return {
    '@type': 'BlogPosting',
    '@id': `${absoluteUrl(opts.path)}#article`,
    headline: opts.title,
    description: opts.description,
    url: absoluteUrl(opts.path),
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(opts.path) },
    image: opts.image ? absoluteUrl(opts.image) : absoluteUrl(SITE.ogImage),
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    author: {
      '@type': opts.authorName ? 'Person' : 'Organization',
      name: opts.authorName ?? SITE.name,
      ...(opts.authorName ? {} : { '@id': ORG_ID }),
    },
    publisher: { '@id': ORG_ID },
    inLanguage: SITE.language,
    isAccessibleForFree: true,
    ...(opts.wordCount ? { wordCount: opts.wordCount } : {}),
    ...(opts.keywords?.length ? { keywords: opts.keywords.join(', ') } : {}),
    ...(opts.section ? { articleSection: opts.section } : {}),
  };
}

export function webPageSchema(opts: {
  name: string;
  description: string;
  path: string;
  type?:
    | 'WebPage'
    | 'AboutPage'
    | 'ContactPage'
    | 'CollectionPage'
    | 'FAQPage'
    | 'ItemPage';
  primaryImage?: string;
  datePublished?: string;
  dateModified?: string;
}): Schema {
  return {
    '@type': opts.type ?? 'WebPage',
    '@id': `${absoluteUrl(opts.path)}#webpage`,
    url: absoluteUrl(opts.path),
    name: opts.name,
    description: opts.description,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    inLanguage: SITE.language,
    ...(opts.primaryImage
      ? {
          primaryImageOfPage: {
            '@type': 'ImageObject',
            url: absoluteUrl(opts.primaryImage),
          },
        }
      : {}),
    ...(opts.datePublished ? { datePublished: opts.datePublished } : {}),
    ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
  };
}

export function itemListSchema(opts: {
  name: string;
  items: { name: string; path: string }[];
}): Schema {
  return {
    '@type': 'ItemList',
    name: opts.name,
    numberOfItems: opts.items.length,
    itemListElement: opts.items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      url: absoluteUrl(it.path),
    })),
  };
}

export function howToSchema(opts: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
  totalTime?: string;
}): Schema {
  return {
    '@type': 'HowTo',
    name: opts.name,
    description: opts.description,
    ...(opts.totalTime ? { totalTime: opts.totalTime } : {}),
    step: opts.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

/** Wraps multiple schema nodes into a single JSON-LD graph. */
export function graph(...nodes: (Schema | null | undefined | false)[]): Schema {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.filter(Boolean),
  };
}
