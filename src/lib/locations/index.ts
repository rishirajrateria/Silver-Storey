import type { CityData, StateData } from './types';
import { STATES, STATE_BY_SLUG } from './states';
import { EAST_CITIES } from './cities/east';
import { NORTH_CITIES } from './cities/north';
import { WEST_CITIES } from './cities/west';
import { SOUTH_CITIES } from './cities/south';
import { CENTRAL_CITIES } from './cities/central';
import { NORTHEAST_CITIES } from './cities/northeast';

export type { CityData, StateData } from './types';
export { STATES, STATE_BY_SLUG } from './states';

export const CITIES: CityData[] = [
  ...EAST_CITIES,
  ...NORTH_CITIES,
  ...WEST_CITIES,
  ...SOUTH_CITIES,
  ...CENTRAL_CITIES,
  ...NORTHEAST_CITIES,
];

export const CITY_BY_SLUG: Record<string, CityData> = Object.fromEntries(
  CITIES.map((c) => [c.slug, c]),
);

export function getState(slug: string): StateData | undefined {
  return STATE_BY_SLUG[slug];
}

export function getCity(slug: string): CityData | undefined {
  return CITY_BY_SLUG[slug];
}

/** City must belong to the state segment in the URL, else treat as 404. */
export function getCityInState(stateSlug: string, citySlug: string) {
  const state = getState(stateSlug);
  const city = getCity(citySlug);
  if (!state || !city || city.state !== state.slug) return null;
  return { state, city };
}

export function citiesInState(stateSlug: string): CityData[] {
  return CITIES.filter((c) => c.state === stateSlug).sort(
    (a, b) => a.tier - b.tier || a.name.localeCompare(b.name),
  );
}

export function nearbyCities(city: CityData, limit = 6): CityData[] {
  const list = city.nearby
    .map((s) => CITY_BY_SLUG[s])
    .filter((c): c is CityData => Boolean(c) && c.slug !== city.slug);
  if (list.length >= limit) return list.slice(0, limit);
  // top up with other cities from the same state
  const extra = citiesInState(city.state).filter(
    (c) => c.slug !== city.slug && !list.some((l) => l.slug === c.slug),
  );
  return [...list, ...extra].slice(0, limit);
}

export const TIER1_CITIES = CITIES.filter((c) => c.tier === 1);
export const TIER2_CITIES = CITIES.filter((c) => c.tier === 2);
/** Cities that also get service-specific landing pages. */
export const SERVICE_CITIES = CITIES.filter((c) => c.tier <= 2);

export function statePath(state: StateData | string) {
  const slug = typeof state === 'string' ? state : state.slug;
  return `/interior-designers/${slug}`;
}

export function cityPath(city: CityData) {
  return `/interior-designers/${city.state}/${city.slug}`;
}

export const REGIONS = [
  'North',
  'South',
  'East',
  'West',
  'Central',
  'Northeast',
] as const;

export function statesByRegion() {
  return REGIONS.map((region) => ({
    region,
    states: STATES.filter((s) => s.region === region).sort((a, b) =>
      a.name.localeCompare(b.name),
    ),
  }));
}

/** District has a dedicated city page if a city in that state declares it. */
export function cityForDistrict(stateSlug: string, district: string) {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, '');
  const d = norm(district);
  return citiesInState(stateSlug).find(
    (c) =>
      (c.district &&
        (norm(c.district) === d ||
          norm(c.district).includes(d) ||
          d.includes(norm(c.district)))) ||
      norm(c.name) === d,
  );
}
