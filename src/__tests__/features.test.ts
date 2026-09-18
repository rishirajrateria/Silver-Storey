import { describe, expect, it } from 'vitest';
import { computeEstimate, emi, SCOPES, FINISHES } from '@/lib/estimate';
import { normaliseAccessCode, TRACK_STEPS } from '@/lib/track';
import { isRoomType, roomLabel } from '@/lib/rooms';
import {
  testimonialsToReviews,
  testimonialsToSchema,
} from '@/lib/testimonials';
import { reviewsSchema } from '@/lib/seo/schema';

describe('estimate calculator', () => {
  it('matches the published starting price at essential finish in Kolkata', () => {
    const r = computeEstimate({
      scope: '2bhk',
      finish: 'essential',
      addOns: [],
      priceIndex: 1,
    });
    expect(r?.low).toBe(550000);
    expect(r!.high).toBeLessThan(1200000);
  });

  it('scales with the city price index and rounds to the price-book steps', () => {
    const kol = computeEstimate({
      scope: 'kitchen',
      finish: 'premium',
      addOns: [],
      priceIndex: 1,
    })!;
    const mum = computeEstimate({
      scope: 'kitchen',
      finish: 'premium',
      addOns: [],
      priceIndex: 1.2,
    })!;
    expect(mum.low).toBeGreaterThan(kol.low);
    expect(kol.low % 10000).toBe(0);
    expect(mum.high % 10000).toBe(0);
  });

  it('adds only add-ons valid for the scope group', () => {
    const base = computeEstimate({
      scope: 'kitchen',
      finish: 'essential',
      addOns: [],
      priceIndex: 1,
    })!;
    const withPainting = computeEstimate({
      scope: 'kitchen',
      finish: 'essential',
      addOns: ['painting'],
      priceIndex: 1,
    })!;
    const withCivil = computeEstimate({
      scope: 'kitchen',
      finish: 'essential',
      addOns: ['civil'],
      priceIndex: 1,
    })!;
    expect(withPainting.low).toBe(base.low); // painting is home-only
    expect(withCivil.low).toBeGreaterThan(base.low);
    expect(withCivil.breakdown).toHaveLength(2);
  });

  it('rejects unknown scope or finish', () => {
    expect(
      computeEstimate({
        scope: 'castle',
        finish: 'premium',
        addOns: [],
        priceIndex: 1,
      }),
    ).toBeNull();
    expect(
      computeEstimate({
        scope: '2bhk',
        finish: 'gold' as never,
        addOns: [],
        priceIndex: 1,
      }),
    ).toBeNull();
  });

  it('never produces a low above a high across every scope × finish', () => {
    for (const s of SCOPES)
      for (const f of FINISHES) {
        const r = computeEstimate({
          scope: s.key,
          finish: f.key,
          addOns: ['civil', 'loose'],
          priceIndex: 1.1,
        })!;
        expect(r.low).toBeLessThanOrEqual(r.high);
      }
  });

  it('computes a standard reducing-balance EMI', () => {
    // ₹10 L at 12% for 36 months ≈ ₹33,214
    expect(emi(1000000, 12, 36)).toBe(33214);
    expect(emi(1200000, 0, 12)).toBe(100000);
    expect(emi(0, 12, 36)).toBe(0);
  });
});

describe('client tracker', () => {
  it('normalises access codes typed loosely', () => {
    expect(normaliseAccessCode('ss 4k7q2m')).toBe('SS-4K7Q2M');
    expect(normaliseAccessCode('SS-4K7Q2M')).toBe('SS-4K7Q2M');
    expect(normaliseAccessCode('4k7q2m')).toBe('SS-4K7Q2M');
    expect(normaliseAccessCode('')).toBe('');
  });

  it('exposes the six process milestones', () => {
    expect(TRACK_STEPS).toHaveLength(6);
    expect(TRACK_STEPS[5].name).toMatch(/45 days/i);
  });
});

describe('room types', () => {
  it('validates and labels', () => {
    expect(isRoomType('kitchen')).toBe(true);
    expect(isRoomType('garage')).toBe(false);
    expect(roomLabel('living-room')).toBe('Living room');
  });
});

describe('testimonials → schema', () => {
  const rows = [
    {
      id: '1',
      name: 'A',
      rating: 5,
      quote: 'Great',
      source: 'direct',
      createdAt: '2026-01-02T00:00:00.000Z',
      location: 'Kolkata',
    },
    {
      id: '2',
      name: 'B',
      rating: 4,
      quote: 'Good',
      source: 'google',
      createdAt: '2026-02-02T00:00:00.000Z',
    },
    {
      id: '3',
      name: 'C',
      rating: 9,
      quote: 'Bogus',
      source: 'direct',
      createdAt: '2026-03-02T00:00:00.000Z',
    },
  ];

  it('drops out-of-range ratings and averages the rest', () => {
    const schema = reviewsSchema(testimonialsToSchema(rows)) as Record<
      string,
      unknown
    >;
    const agg = schema.aggregateRating as Record<string, unknown>;
    expect(agg.reviewCount).toBe(2);
    expect(agg.ratingValue).toBe(4.5);
    expect((schema.review as unknown[]).length).toBe(2);
  });

  it('returns null with no testimonials so no rating is ever invented', () => {
    expect(reviewsSchema([])).toBeNull();
  });

  it('builds the slider attribution line', () => {
    expect(testimonialsToReviews(rows)[0].author).toBe('A · Kolkata');
  });
});
