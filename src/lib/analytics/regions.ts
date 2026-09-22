/**
 * Edge networks report the visitor's state as an ISO 3166-2 subdivision code
 * ("WB"), which is useless in a dashboard. India is the market that matters
 * here, so its 28 states and 8 union territories are spelled out; anywhere
 * else keeps its raw code, which still groups correctly and reads acceptably
 * next to the country column.
 */
const INDIAN_SUBDIVISIONS: Record<string, string> = {
  AN: 'Andaman and Nicobar Islands',
  AP: 'Andhra Pradesh',
  AR: 'Arunachal Pradesh',
  AS: 'Assam',
  BR: 'Bihar',
  CH: 'Chandigarh',
  CT: 'Chhattisgarh',
  // Reported as DH since the 2020 merger; DN and DD are the retired codes.
  DH: 'Dadra and Nagar Haveli and Daman and Diu',
  DN: 'Dadra and Nagar Haveli and Daman and Diu',
  DD: 'Dadra and Nagar Haveli and Daman and Diu',
  DL: 'Delhi',
  GA: 'Goa',
  GJ: 'Gujarat',
  HP: 'Himachal Pradesh',
  HR: 'Haryana',
  JH: 'Jharkhand',
  JK: 'Jammu and Kashmir',
  KA: 'Karnataka',
  KL: 'Kerala',
  LA: 'Ladakh',
  LD: 'Lakshadweep',
  MH: 'Maharashtra',
  ML: 'Meghalaya',
  MN: 'Manipur',
  MP: 'Madhya Pradesh',
  MZ: 'Mizoram',
  NL: 'Nagaland',
  OR: 'Odisha',
  PB: 'Punjab',
  PY: 'Puducherry',
  RJ: 'Rajasthan',
  SK: 'Sikkim',
  TG: 'Telangana',
  TN: 'Tamil Nadu',
  TR: 'Tripura',
  UP: 'Uttar Pradesh',
  UT: 'Uttarakhand',
  WB: 'West Bengal',
};

/**
 * Turns a stored region code into something readable.
 *
 * Accepts the bare code ("WB") and the prefixed form ("IN-WB"), because edge
 * providers differ on which they send. A code that is not Indian, or not
 * recognised, comes back as it was.
 */
export function regionLabel(
  region: string | null | undefined,
  country?: string | null,
): string {
  if (!region) return '—';

  const raw = region.trim().toUpperCase();
  const [prefix, suffix] = raw.includes('-') ? raw.split('-', 2) : [null, raw];

  // Only resolve against the Indian table when the code really is Indian:
  // "WB" is West Bengal in India and Western Bahr el Ghazal in South Sudan.
  const isIndian =
    prefix === 'IN' ||
    (!prefix && (!country || country.toUpperCase() === 'IN'));

  if (isIndian && INDIAN_SUBDIVISIONS[suffix])
    return INDIAN_SUBDIVISIONS[suffix];
  return region;
}

/**
 * "IN" → "India". Intl ships the full country table with the runtime, so this
 * needs no data of its own and stays correct as names change.
 */
export function countryLabel(country: string | null | undefined): string {
  if (!country) return '—';
  const code = country.trim().toUpperCase();
  if (code.length !== 2) return country;
  try {
    return (
      new Intl.DisplayNames(['en'], { type: 'region' }).of(code) ?? country
    );
  } catch {
    return country;
  }
}
