import type { CityData } from '@/lib/locations/types';

/**
 * Which programmatic pages are allowed into the search index.
 *
 * The site generates a page for every service in every tier-1/2 city — 949
 * of them — that share two-thirds of their text. Google treats that scale of
 * near-duplicate, location-swapped content as "doorway pages", and the
 * penalty lands on the whole domain, not just those URLs. So the pages stay
 * (they are genuinely useful to a visitor who lands on one) but only the
 * cities where the studio has real, provable presence are submitted for
 * indexing. The rest are `noindex,follow`: crawlable, link-passing, but not
 * competing as thin duplicates.
 *
 * Widen the set as real projects are delivered in a state — the list is
 * also overridable per deployment through NEXT_PUBLIC_INDEXED_SERVICE_CITY_STATES
 * (comma-separated state slugs) so no code change is needed.
 */
const DEFAULT_INDEXED_STATES = ['west-bengal'];

export const INDEXED_SERVICE_CITY_STATES: ReadonlySet<string> = new Set(
  (process.env.NEXT_PUBLIC_INDEXED_SERVICE_CITY_STATES ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean).length
    ? (process.env.NEXT_PUBLIC_INDEXED_SERVICE_CITY_STATES ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : DEFAULT_INDEXED_STATES,
);

/** Service × city pages: only for indexed states, and only tier-1/2 cities. */
export function isServiceCityIndexable(city: CityData): boolean {
  return city.tier <= 2 && INDEXED_SERVICE_CITY_STATES.has(city.state);
}

/**
 * City landing pages stay indexable everywhere: there are 159 of them, each
 * carries genuinely different housing, climate and locality content, and
 * that footprint is normal for a pan-India business.
 */
export function isCityIndexable(): boolean {
  return true;
}

/** A state hub with no city beneath it is a stub; keep it out of the index. */
export function isStateIndexable(cityCount: number): boolean {
  return cityCount > 0;
}

/** A room gallery with no photographs yet is an empty page. */
export function isGalleryCategoryIndexable(imageCount: number): boolean {
  return imageCount > 0;
}
