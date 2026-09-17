import { describe, it, expect } from 'vitest';
import { CITIES, STATES, STATE_BY_SLUG, CITY_BY_SLUG } from '@/lib/locations';
import { SERVICES } from '@/lib/services';

describe('location dataset integrity', () => {
  it('has unique state and city slugs', () => {
    expect(new Set(STATES.map((s) => s.slug)).size).toBe(STATES.length);
    expect(new Set(CITIES.map((c) => c.slug)).size).toBe(CITIES.length);
  });

  it('covers all 28 states and 8 union territories', () => {
    expect(STATES.filter((s) => s.kind === 'state')).toHaveLength(28);
    expect(STATES.filter((s) => s.kind === 'ut')).toHaveLength(8);
  });

  it('every city belongs to a known state', () => {
    for (const c of CITIES)
      expect(STATE_BY_SLUG[c.state], c.slug).toBeDefined();
  });

  it('every nearby reference resolves to a real city', () => {
    for (const c of CITIES) {
      for (const n of c.nearby)
        expect(CITY_BY_SLUG[n], `${c.slug} → ${n}`).toBeDefined();
    }
  });

  it('city slugs never collide with their state slug (avoids /x/x URLs)', () => {
    for (const c of CITIES) expect(c.slug === c.state, c.slug).toBe(false);
  });

  it('every city has enough content to avoid thin pages', () => {
    for (const c of CITIES) {
      expect(c.localities.length, c.slug).toBeGreaterThanOrEqual(5);
      expect(c.housingNote.length, c.slug).toBeGreaterThan(60);
      expect(c.styleNote.length, c.slug).toBeGreaterThan(40);
      expect(c.priceIndex).toBeGreaterThanOrEqual(0.85);
      expect(c.priceIndex).toBeLessThanOrEqual(1.2);
    }
  });

  it('every state has districts and unique intro copy', () => {
    const intros = new Set<string>();
    for (const s of STATES) {
      expect(s.districts.length, s.slug).toBeGreaterThan(0);
      expect(s.intro.length, s.slug).toBeGreaterThan(150);
      intros.add(s.intro);
    }
    expect(intros.size).toBe(STATES.length);
  });
});

describe('service catalogue integrity', () => {
  it('has unique slugs and valid related links', () => {
    const slugs = new Set(SERVICES.map((s) => s.slug));
    expect(slugs.size).toBe(SERVICES.length);
    for (const s of SERVICES)
      for (const r of s.related)
        expect(slugs.has(r), `${s.slug} → ${r}`).toBe(true);
  });
});
