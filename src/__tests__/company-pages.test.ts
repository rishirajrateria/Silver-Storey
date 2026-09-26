import { describe, expect, it } from 'vitest';
import { processPhases, stats } from '@/features/AboutUs/constants';
import { HOW_IT_WORKS_FAQS } from '@/features/HowItWorks/faqs';
import { PRICING_FAQS, startingPrice } from '@/features/Pricing/faqs';
import { SERVICE_BY_SLUG } from '@/lib/services';
import { PROCESS_STEPS } from '@/lib/seo/process';
import { SITE } from '@/lib/seo/site';
import {
  averageRating,
  reviewMonth,
  reviewSourceLabel,
} from '@/lib/testimonials';
import type { TestimonialData } from '@/lib/db/content';

describe('about page process copy', () => {
  const sentences = processPhases.flatMap((phase) =>
    phase.steps.flatMap((step) => step.items.map((i) => i.text)),
  );

  it('describes the studio, not a designer-training checklist', () => {
    const text = sentences.join(' ');
    // The old copy addressed a trainee designer ("your own design fees").
    expect(text).not.toMatch(/If this visit is for a client/);
    expect(text).not.toMatch(/your own design fees/i);
    expect(text).not.toMatch(/the client's|the client’s/i);
  });

  it('is built on the published six steps and the SITE facts', () => {
    const text = sentences.join(' ');
    for (const step of PROCESS_STEPS) expect(text).toContain(step.text);
    expect(text).toContain(SITE.commitment);
    expect(text).toContain(SITE.payment.modular);
    expect(text).toContain(String(SITE.warranty.termYears));
    expect(text).toContain(SITE.phoneDisplay);
  });

  it('keeps the four stats in step with SITE.stats', () => {
    expect(stats.map((s) => s.value)).toEqual([
      SITE.stats.happyCustomers,
      SITE.stats.sqftTransformed,
      SITE.stats.teamMembers,
      String(SITE.stats.yearsExperience),
    ]);
  });
});

describe('shared FAQ lists', () => {
  it('every answer is non-empty and the outstation FAQ quotes the service model', () => {
    for (const faq of [...HOW_IT_WORKS_FAQS, ...PRICING_FAQS]) {
      expect(faq.question.length).toBeGreaterThan(10);
      expect(faq.answer.length).toBeGreaterThan(20);
    }
    const outstation = HOW_IT_WORKS_FAQS.find((f) =>
      /outside Kolkata/i.test(f.question),
    );
    expect(outstation?.answer).toBe(SITE.serviceModel.outstation);
  });

  it('pricing answers quote the catalogue rather than typed figures', () => {
    expect(startingPrice('modular-kitchen')).toBe('₹1.4 L');
    expect(startingPrice('3bhk-interior-design')).toBe('₹8 L');
    const prices = PRICING_FAQS.find((f) =>
      /starting prices/i.test(f.question),
    )!;
    for (const slug of [
      'modular-kitchen',
      'bedroom-interiors',
      '2bhk-interior-design',
    ]) {
      expect(SERVICE_BY_SLUG[slug]).toBeDefined();
      expect(prices.answer).toContain(startingPrice(slug));
    }
  });
});

describe('review helpers', () => {
  const row = (rating: number): TestimonialData => ({
    id: String(rating),
    name: 'A',
    rating,
    quote: 'q',
    source: 'direct',
    createdAt: '2026-09-26T05:00:00.000Z',
  });

  it('averages only valid ratings and returns null for none', () => {
    expect(averageRating([])).toBeNull();
    expect(averageRating([row(5), row(4), row(0)])).toBe(4.5);
  });

  it('formats the month and labels the source for readers', () => {
    expect(reviewMonth('2026-09-26T05:00:00.000Z')).toBe('September 2026');
    expect(reviewMonth('not a date')).toBe('');
    expect(reviewSourceLabel('google')).toBe('Google review');
    expect(reviewSourceLabel('anything-else')).toBe('Client review');
  });
});
