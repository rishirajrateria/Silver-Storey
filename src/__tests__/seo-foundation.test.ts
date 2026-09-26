import { describe, expect, it } from 'vitest';
import { buildMetadata, fitDescription, fitTitle } from '@/lib/seo/metadata';
import {
  articleSchema,
  founderId,
  founderPersonSchemas,
  localBusinessSchema,
  organizationSchema,
  serviceSchema,
  websiteSchema,
} from '@/lib/seo/schema';
import { SITE, SITE_URL, brandStatement, keyFacts } from '@/lib/seo/site';
import {
  isGalleryCategoryIndexable,
  isServiceCityIndexable,
  isStateIndexable,
} from '@/lib/seo/indexing';
import { buildLlmsTxt, buildLlmsFullTxt } from '@/lib/seo/llms';
import { CITY_BY_SLUG } from '@/lib/locations';
import {
  articlesForService,
  citiesForArticle,
  servicesForArticle,
} from '@/lib/related';
import { ARTICLES } from '@/lib/blog';
import { SERVICES } from '@/lib/services';

describe('titles keep the brand', () => {
  it('leaves short titles alone', () => {
    expect(fitTitle('Modular Kitchen in Kolkata | Silver Storey')).toBe(
      'Modular Kitchen in Kolkata | Silver Storey',
    );
  });

  it('shortens the leading phrase, never the brand', () => {
    // The old clamp turned this into "…Design – Silver".
    const t = fitTitle(
      'Full Home Interiors in Thiruvananthapuram | Full Home Interior Design – Silver Storey',
    );
    expect(t.length).toBeLessThanOrEqual(65);
    expect(t.endsWith('Silver Storey')).toBe(true);
    expect(t).not.toMatch(/– Silver$/);
    expect(t.startsWith('Full Home Interiors in Thiruvananthapuram')).toBe(
      true,
    );
  });

  it('never cuts mid-word when there is no brand suffix', () => {
    const t = fitTitle(
      'Interior Design Cost in India (2026): Room-by-Room Price Guide for Every Home',
    );
    expect(t.length).toBeLessThanOrEqual(65);
    expect(t).not.toMatch(/\s$/);
    expect(t.split(' ').every((w) => w.length > 0)).toBe(true);
  });
});

describe('descriptions end on a sentence', () => {
  it('keeps a sentence boundary when one fits', () => {
    const d = fitDescription(
      'Modular Kitchen Design in Pune, Maharashtra from ₹1.5 L. Free 3D design, itemised pricing, branded materials, 45-day delivery and a 10-year warranty. Serving Koregaon Park, Baner and Kothrud.',
    );
    expect(d.length).toBeLessThanOrEqual(155);
    expect(d.endsWith('.')).toBe(true);
    expect(d).not.toContain('…');
  });

  it('falls back to a word boundary with an ellipsis', () => {
    const d = fitDescription('word '.repeat(60).trim());
    expect(d.length).toBeLessThanOrEqual(155);
    expect(d.endsWith('…')).toBe(true);
    expect(d).not.toMatch(/wor…$/);
  });

  it('no longer emits a keywords meta tag or a false image size', () => {
    const m = buildMetadata({
      title: 'x',
      description: 'y',
      path: '/p',
      keywords: ['a'],
      image: '/uploads/cover.avif',
    });
    expect(m.keywords).toBeUndefined();
    const img = (m.openGraph as { images: { width?: number }[] }).images[0];
    expect(img.width).toBeUndefined();
    const gen = buildMetadata({ title: 'x', description: 'y', path: '/p' });
    const genImg = (gen.openGraph as { images: { width?: number }[] })
      .images[0];
    expect(genImg.width).toBe(1200);
  });
});

describe('entity graph', () => {
  it('links founders by stable ids from the organisation', () => {
    const org = organizationSchema() as { founder: { '@id': string }[] };
    const people = founderPersonSchemas() as { '@id': string }[];
    expect(org.founder.map((f) => f['@id'])).toEqual(
      people.map((p) => p['@id']),
    );
    expect(founderId(SITE.founders[0])).toBe(
      `${SITE_URL}/about-us#${SITE.founders[0].slug}`,
    );
  });

  it('the local business is the Kolkata head office, with absolute ids', () => {
    const lb = localBusinessSchema() as {
      '@id': string;
      address: { addressLocality: string };
      makesOffer: unknown[];
    };
    expect(lb['@id']).toBe(`${SITE_URL}/#localbusiness`);
    expect(lb.address.addressLocality).toBe('Kolkata');
    expect(lb.makesOffer.length).toBe(SERVICES.length);
  });

  it('a service in a city names the city, its state and the provider that exists on every page', () => {
    const city = CITY_BY_SLUG.jaipur;
    const s = serviceSchema({
      name: 'Modular kitchen in Jaipur',
      description: 'd',
      path: '/services/modular-kitchen/jaipur',
      areaServed: [
        { type: 'City', name: city.name, region: 'Rajasthan', geo: city.geo },
      ],
    }) as {
      provider: { '@id': string };
      areaServed: { name: string; containedInPlace?: { name: string } }[];
    };
    expect(s.provider['@id']).toBe(`${SITE_URL}/#organization`);
    expect(s.areaServed[0].name).toBe('Jaipur');
    expect(s.areaServed[0].containedInPlace?.name).toBe('Rajasthan');
  });

  it('house bylines are the organisation, not a person', () => {
    const a = articleSchema({
      title: 't',
      description: 'd',
      path: '/blog/x',
      authorName: 'Silver Storey Editorial Team',
    }) as { author: { '@id'?: string; '@type'?: string } };
    expect(a.author['@id']).toBe(`${SITE_URL}/#organization`);
  });

  it('site search points at the real search page', () => {
    const w = websiteSchema() as {
      potentialAction: { target: { urlTemplate: string } };
    };
    expect(w.potentialAction.target.urlTemplate).toContain('/search?q=');
  });
});

describe('indexing policy', () => {
  it('indexes service×city pages only in the home state by default', () => {
    expect(isServiceCityIndexable(CITY_BY_SLUG.kolkata)).toBe(true);
    expect(isServiceCityIndexable(CITY_BY_SLUG.howrah)).toBe(true);
    expect(isServiceCityIndexable(CITY_BY_SLUG.pune)).toBe(false);
  });

  it('keeps empty hubs and galleries out', () => {
    expect(isStateIndexable(0)).toBe(false);
    expect(isStateIndexable(1)).toBe(true);
    expect(isGalleryCategoryIndexable(0)).toBe(false);
  });
});

describe('facts an assistant can quote', () => {
  it('the brand statement carries who, where and since when', () => {
    const s = brandStatement();
    expect(s).toContain(String(SITE.foundingYear));
    expect(s).toContain('Kolkata');
    expect(s).toContain(SITE.founders[0].name);
    expect(s).toContain('10-year warranty');
  });

  it('key facts omit registrations that are not set', () => {
    const labels = keyFacts().map((f) => f.label);
    expect(labels).toContain('Founded');
    if (!SITE.registrations.gstin) expect(labels).not.toContain('GSTIN');
  });

  it('llms.txt states prices, warranty and payment; the full file carries article text', () => {
    const short = buildLlmsTxt(new Date('2026-09-26'));
    expect(short).toContain('Last updated: 2026-09-26');
    expect(short).toContain('## What it costs');
    expect(short).toContain('## Warranty');
    expect(short).toContain(SITE.payment.modular);
    const full = buildLlmsFullTxt(new Date('2026-09-26'));
    expect(full).toContain('# Articles');
    expect(full).toContain(ARTICLES[0].title);
    expect(full.length).toBeGreaterThan(short.length * 3);
  });
});

describe('related content', () => {
  it('kitchen guides reach the kitchen service and back', () => {
    const kitchen = SERVICES.find((s) => s.slug === 'modular-kitchen')!;
    const guides = articlesForService(kitchen);
    expect(guides.length).toBeGreaterThan(0);
    expect(servicesForArticle(guides[0]).map((s) => s.slug)).toContain(
      'modular-kitchen',
    );
  });

  it('a Kolkata article points at the Kolkata page', () => {
    const kol = ARTICLES.find((a) => /kolkata/i.test(a.title));
    if (kol)
      expect(citiesForArticle(kol).map((c) => c.slug)).toContain('kolkata');
  });
});
