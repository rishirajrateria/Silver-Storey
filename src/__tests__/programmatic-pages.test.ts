import { describe, it, expect } from 'vitest';
import {
  CITIES,
  CITY_BY_SLUG,
  STATES,
  NEARBY_MAX_KM,
  citiesInState,
  distanceKm,
  nearbyCities,
} from '@/lib/locations';
import {
  cityFaqs,
  cityMetaDescription,
  cityMetaTitle,
  cityPricingNote,
  lowerName,
  serviceCityFaqs,
  serviceCityIntro,
  serviceModelFor,
  stateHowWeWork,
  stateMetaDescription,
  stateMetaTitle,
} from '@/lib/locations/content';
import { STATE_BY_SLUG } from '@/lib/locations/states';
import { SITE } from '@/lib/seo/site';
import { getService } from '@/lib/services';

describe('nearby cities', () => {
  it('never lists a city beyond the cap as near', () => {
    for (const c of CITIES)
      for (const n of nearbyCities(c))
        expect(distanceKm(c, n)!, `${c.slug} → ${n.slug}`).toBeLessThanOrEqual(
          NEARBY_MAX_KM,
        );
  });

  it('keeps the curated order for neighbours that really are near', () => {
    const kolkata = CITY_BY_SLUG.kolkata;
    const slugs = nearbyCities(kolkata).map((n) => n.slug);
    expect(slugs.slice(0, 2)).toEqual(['howrah', 'barrackpore']);
    expect(slugs).not.toContain('siliguri');
    expect(slugs).toHaveLength(6);
  });

  it('never repeats a city or includes itself', () => {
    for (const c of CITIES) {
      const slugs = nearbyCities(c).map((n) => n.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
      expect(slugs).not.toContain(c.slug);
    }
  });

  it('does not list Howrah as a Kolkata neighbourhood — it has its own page', () => {
    expect(CITY_BY_SLUG.kolkata.localities).not.toContain('Howrah');
  });
});

describe('meta copy', () => {
  it('city titles fit the SERP and keep the brand', () => {
    for (const c of CITIES) {
      const t = cityMetaTitle(c);
      // 60 is the target; a 25-character official name (Chhatrapati
      // Sambhajinagar) cannot make it and must still stay under the
      // 65-character point where the metadata builder would shorten it.
      const cap = c.name.length > 22 ? 65 : 60;
      expect(t.length, c.slug).toBeLessThanOrEqual(cap);
      expect(t).toMatch(/\| Silver Storey$/);
      expect(t).not.toMatch(/best/i);
    }
  });

  it('city descriptions lead with the localities and fit in 150 chars', () => {
    for (const c of CITIES) {
      const d = cityMetaDescription(c);
      expect(d.length, c.slug).toBeLessThanOrEqual(150);
      expect(
        d.startsWith(`Interior designers in ${c.name} — ${c.localities[0]}`),
        c.slug,
      ).toBe(true);
      expect(d).toMatch(/Kitchens from ₹/);
    }
  });

  it('state hubs without a city still get a readable description', () => {
    for (const s of STATES) {
      const d = stateMetaDescription(s);
      expect(d, s.slug).not.toMatch(/in\s+—/);
      expect(d, s.slug).not.toMatch(/best/i);
      expect(d.length, s.slug).toBeLessThanOrEqual(155);
      const t = stateMetaTitle(s);
      expect(t.length, s.slug).toBeLessThanOrEqual(
        s.name.length > 22 ? 65 : 60,
      );
      expect(t).toMatch(/\| Silver Storey$/);
      if (!citiesInState(s.slug).length) expect(d).toMatch(/on request/);
    }
  });
});

describe('service model and pricing notes', () => {
  it('claims a home market only in West Bengal', () => {
    expect(serviceModelFor('west-bengal')).toBe(SITE.serviceModel.hq);
    expect(serviceModelFor('rajasthan')).toBe(SITE.serviceModel.outstation);
    expect(stateHowWeWork(STATE_BY_SLUG.lakshadweep)).toMatch(/on request/);
  });

  it('explains where the city prices come from', () => {
    expect(cityPricingNote(CITY_BY_SLUG.jaipur)).toMatch(/Jaipur’s cost index/);
    expect(cityPricingNote(CITY_BY_SLUG.kolkata)).not.toMatch(/scaled by/);
  });

  it('never renders a dangling "nearby cities such as"', () => {
    for (const c of CITIES) {
      const s = STATE_BY_SLUG[c.state];
      for (const f of cityFaqs(c, s))
        expect(f.answer).not.toMatch(/such as\s*\./);
    }
  });
});

describe('template text', () => {
  it('lower-cases names without mangling acronyms', () => {
    expect(lowerName('1BHK Interiors')).toBe('1BHK interiors');
    expect(lowerName('Modular Kitchen')).toBe('modular kitchen');
    expect(lowerName('BWP (boiling water proof) plywood or HDHMR')).toBe(
      'BWP (boiling water proof) plywood or HDHMR',
    );
    expect(lowerName('SS-304 hinges, channels')).toBe(
      'SS-304 hinges, channels',
    );
  });

  it('never says "for homes" on a commercial page', () => {
    const service = getService('commercial-office-interiors')!;
    for (const city of CITIES.filter((c) => c.tier <= 2)) {
      const state = STATE_BY_SLUG[city.state];
      const text = [
        ...serviceCityIntro({
          serviceName: service.name,
          serviceShort: service.shortName,
          category: service.category,
          city,
          state,
        }),
        ...serviceCityFaqs({
          serviceName: service.name,
          serviceShort: service.shortName,
          category: service.category,
          city,
          materials: service.materials,
          baseFaqs: service.faqs,
        }).map((f) => f.answer),
      ].join(' ');
      expect(text, city.slug).not.toMatch(
        /for homes|apartment towers|wardrobe/i,
      );
      expect(text, city.slug).not.toMatch(/within 45 days/);
    }
  });

  it('keeps BHK upper-case in service × city copy', () => {
    const service = getService('2bhk-interior-design')!;
    const city = CITY_BY_SLUG.pune;
    const text = serviceCityIntro({
      serviceName: service.name,
      serviceShort: service.shortName,
      category: service.category,
      city,
      state: STATE_BY_SLUG[city.state],
      startingPriceINR: service.startingPriceINR,
    }).join(' ');
    expect(text).toMatch(/2BHK interiors/);
    expect(text).not.toMatch(/bhk/);
  });
});
