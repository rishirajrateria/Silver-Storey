import { SITE, absoluteUrl, brandStatement } from './site';
import { SERVICES, servicePath } from '@/lib/services';
import type { CityData, StateData } from '@/lib/locations/types';

type Schema = Record<string, unknown>;

export const ORG_ID = `${SITE.url}/#organization`;
export const WEBSITE_ID = `${SITE.url}/#website`;
export const LOCAL_BUSINESS_ID = `${SITE.url}/#localbusiness`;

export function founderId(founder: { slug: string }): string {
  return `${SITE.url}/about-us#${founder.slug}`;
}

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

function sameAs(): string[] {
  return [
    ...SITE.socials.map((s) => s.href),
    ...(SITE.googleBusinessProfile ? [SITE.googleBusinessProfile] : []),
  ];
}

function identifiers(): Schema[] {
  const ids: Schema[] = [];
  if (SITE.registrations.gstin)
    ids.push({
      '@type': 'PropertyValue',
      propertyID: 'GSTIN',
      value: SITE.registrations.gstin,
    });
  if (SITE.registrations.cin)
    ids.push({
      '@type': 'PropertyValue',
      propertyID: 'CIN',
      value: SITE.registrations.cin,
    });
  if (SITE.registrations.udyam)
    ids.push({
      '@type': 'PropertyValue',
      propertyID: 'Udyam',
      value: SITE.registrations.udyam,
    });
  return ids;
}

/**
 * One Person node per founder, with a stable @id that every page's
 * Organization.founder and the About page's author markup point at — instead
 * of three unlinked, id-less Person fragments per page.
 */
export function founderPersonSchemas(): Schema[] {
  return SITE.founders.map((f) => ({
    '@type': 'Person',
    '@id': founderId(f),
    name: f.name,
    jobTitle: f.role,
    image: absoluteUrl(f.image),
    url: absoluteUrl('/about-us'),
    worksFor: { '@id': ORG_ID },
    ...(f.credentials ? { description: f.credentials } : {}),
  }));
}

/** Services the studio sells, as Offers — built from the service catalogue. */
function makesOffer(): Schema[] {
  return SERVICES.map((s) => ({
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Service',
      name: s.name,
      url: absoluteUrl(servicePath(s)),
    },
    ...(s.startingPriceINR && s.category !== 'commercial'
      ? {
          priceSpecification: {
            '@type': 'PriceSpecification',
            priceCurrency: 'INR',
            minPrice: s.startingPriceINR,
          },
        }
      : {}),
  }));
}

export function organizationSchema(): Schema {
  const ids = identifiers();
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
    description: brandStatement(),
    slogan: SITE.tagline,
    foundingDate: String(SITE.foundingYear),
    foundingLocation: {
      '@type': 'Place',
      name: `${SITE.address.city}, ${SITE.address.region}, India`,
    },
    founder: SITE.founders.map((f) => ({ '@id': founderId(f) })),
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      minValue: parseInt(SITE.stats.teamMembers, 10) || undefined,
    },
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
    ...(ids.length ? { identifier: ids } : {}),
    ...(sameAs().length ? { sameAs: sameAs() } : {}),
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
        urlTemplate: `${SITE.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export type AreaServed =
  | {
      type: 'City';
      name: string;
      region?: string;
      geo?: { lat: number; lng: number };
    }
  | { type: 'State'; name: string }
  | { type: 'Country'; name: string };

/** A City/State/Country node for areaServed, with geo when the dataset has it. */
export function placeNode(a: AreaServed): Schema {
  if (a.type === 'City') {
    return {
      '@type': 'City',
      name: a.name,
      ...(a.region
        ? {
            containedInPlace: {
              '@type': 'State',
              name: a.region,
              containedInPlace: { '@type': 'Country', name: 'India' },
            },
          }
        : {}),
      ...(a.geo
        ? {
            geo: {
              '@type': 'GeoCoordinates',
              latitude: a.geo.lat,
              longitude: a.geo.lng,
            },
          }
        : {}),
    };
  }
  if (a.type === 'State') {
    return {
      '@type': 'State',
      name: a.name,
      containedInPlace: { '@type': 'Country', name: 'India' },
    };
  }
  return { '@type': 'Country', name: a.name };
}

/** Convenience: the dataset's city record as an AreaServed entry. */
export function cityArea(city: CityData, state?: StateData): AreaServed {
  return {
    type: 'City',
    name: city.name,
    region: state?.name,
    geo: city.geo,
  };
}

/**
 * The studio's ONE physical location — the Kolkata head office. Emitted on the
 * home, contact and services pages only. City pages must not use this: a
 * LocalBusiness "in Jaipur" carrying a Kolkata street address is exactly the
 * pattern Google's local-spam policy names. Cities are `areaServed` on a
 * Service instead (see `serviceSchema`).
 */
export function localBusinessSchema(opts?: {
  areaServed?: AreaServed[];
  description?: string;
}): Schema {
  return {
    '@type': [
      'HomeAndConstructionBusiness',
      'LocalBusiness',
      'ProfessionalService',
    ],
    '@id': LOCAL_BUSINESS_ID,
    name: SITE.name,
    alternateName: 'Silver Storey Interiors',
    description: opts?.description ?? brandStatement(),
    url: SITE.url,
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
    areaServed: (opts?.areaServed ?? [{ type: 'Country', name: 'India' }]).map(
      placeNode,
    ),
    parentOrganization: { '@id': ORG_ID },
    founder: SITE.founders.map((f) => ({ '@id': founderId(f) })),
    foundingDate: String(SITE.foundingYear),
    slogan: SITE.tagline,
    makesOffer: makesOffer(),
    ...(sameAs().length ? { sameAs: sameAs() } : {}),
  };
}

export function breadcrumbSchema(
  items: { name: string; path: string }[],
): Schema {
  const last = items[items.length - 1];
  return {
    '@type': 'BreadcrumbList',
    ...(last ? { '@id': `${absoluteUrl(last.path)}#breadcrumb` } : {}),
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

/**
 * A Service the studio delivers somewhere. `provider` points at the
 * Organization node the root layout puts on every page, so the reference
 * always resolves; the catalogue of every other service lives on the
 * LocalBusiness node rather than being repeated on a thousand pages.
 */
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
    provider: { '@id': ORG_ID },
    brand: { '@id': ORG_ID },
    ...(opts.image ? { image: absoluteUrl(opts.image) } : {}),
    areaServed: (opts.areaServed ?? [{ type: 'Country', name: 'India' }]).map(
      placeNode,
    ),
    ...(opts.startingPriceINR
      ? {
          offers: {
            '@type': 'Offer',
            url: absoluteUrl(opts.path),
            priceCurrency: 'INR',
            priceSpecification: {
              '@type': 'PriceSpecification',
              priceCurrency: 'INR',
              minPrice: opts.startingPriceINR,
              description: 'Indicative starting price; every quote is itemised',
            },
          },
        }
      : {}),
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
  // A house byline ("Silver Storey", "Editorial Team") is the organisation,
  // not a person; only a real name becomes a Person.
  const isHouse =
    !opts.authorName ||
    /silver storey|editorial|team/i.test(opts.authorName ?? '');
  const founder = SITE.founders.find((f) => f.name === opts.authorName);
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
    author: isHouse
      ? { '@id': ORG_ID }
      : founder
        ? { '@id': founderId(founder) }
        : { '@type': 'Person', name: opts.authorName },
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
  /** Set when the page also emits breadcrumbSchema for the same path. */
  hasBreadcrumb?: boolean;
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
    ...(opts.hasBreadcrumb !== false
      ? { breadcrumb: { '@id': `${absoluteUrl(opts.path)}#breadcrumb` } }
      : {}),
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

export function imageGallerySchema(opts: {
  name: string;
  path: string;
  images: { url: string; caption?: string }[];
}): Schema | null {
  if (!opts.images.length) return null;
  return {
    '@type': 'ImageGallery',
    '@id': `${absoluteUrl(opts.path)}#gallery`,
    name: opts.name,
    url: absoluteUrl(opts.path),
    image: opts.images.slice(0, 50).map((i) => ({
      '@type': 'ImageObject',
      contentUrl: absoluteUrl(i.url),
      ...(i.caption ? { caption: i.caption } : {}),
    })),
  };
}

/** A YouTube video the studio published, for the videos on the home page. */
export function videoObjectSchema(video: {
  title: string;
  youtubeId: string;
  description?: string;
  uploadDate: string;
}): Schema {
  return {
    '@type': 'VideoObject',
    name: video.title,
    description: video.description ?? `${video.title} — ${SITE.name}`,
    thumbnailUrl: `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`,
    embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
    contentUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`,
    uploadDate: video.uploadDate,
    publisher: { '@id': ORG_ID },
  };
}

/**
 * Review + AggregateRating for the Organization. Only ever fed from real,
 * published testimonials entered in the admin panel — never fabricated.
 */
export function reviewsSchema(
  reviews: {
    name: string;
    rating: number;
    quote: string;
    date?: string;
  }[],
): Schema | null {
  if (!reviews.length) return null;
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: Math.round(avg * 10) / 10,
      bestRating: 5,
      worstRating: 1,
      reviewCount: reviews.length,
    },
    review: reviews.slice(0, 10).map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.name },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: r.quote,
      ...(r.date ? { datePublished: r.date } : {}),
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
