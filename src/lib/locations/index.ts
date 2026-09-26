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

/**
 * Anything further than this is not "near" by any reading a visitor or a
 * search engine would accept. The curated lists were written for link
 * equity and paired Nagpur with Pune (620 km) and Kolkata with Siliguri
 * (460 km); the cap applies to them as well.
 */
export const NEARBY_MAX_KM = 250;

/** Great-circle distance between two cities, in km; undefined without coordinates. */
export function distanceKm(a: CityData, b: CityData): number | undefined {
  if (!a.geo || !b.geo) return undefined;
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = rad(b.geo.lat - a.geo.lat);
  const dLng = rad(b.geo.lng - a.geo.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.geo.lat)) *
      Math.cos(rad(b.geo.lat)) *
      Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

/**
 * Cities genuinely near `city`: the curated list first, then the rest of the
 * dataset by distance, every one within NEARBY_MAX_KM. Same-state cities
 * come before other states at the top-up stage, and a same-state city whose
 * distance cannot be computed is the only thing allowed in without a
 * measurement. The list may be short for isolated cities — Leh, Srinagar —
 * which is the honest answer.
 */
export function nearbyCities(city: CityData, limit = 6): CityData[] {
  const within = (other: CityData) => {
    const d = distanceKm(city, other);
    return d !== undefined && d <= NEARBY_MAX_KM;
  };
  const byDistance = (a: CityData, b: CityData) =>
    (distanceKm(city, a) ?? Infinity) - (distanceKm(city, b) ?? Infinity);

  const picked: CityData[] = [];
  const add = (c: CityData) => {
    if (c.slug !== city.slug && !picked.some((p) => p.slug === c.slug))
      picked.push(c);
  };

  city.nearby
    .map((s) => CITY_BY_SLUG[s])
    .filter((c): c is CityData => Boolean(c) && within(c))
    .forEach(add);

  if (picked.length < limit) {
    const rest = CITIES.filter(within).sort(byDistance);
    rest.filter((c) => c.state === city.state).forEach(add);
    rest.forEach(add);
  }

  if (picked.length < limit) {
    citiesInState(city.state)
      .filter((c) => distanceKm(city, c) === undefined)
      .forEach(add);
  }

  return picked.slice(0, limit);
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
