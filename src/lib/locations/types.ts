export type Region =
  | 'North'
  | 'South'
  | 'East'
  | 'West'
  | 'Central'
  | 'Northeast';

/**
 * Climate class drives the "materials & finishes" guidance on each page so the
 * advice is specific to the place rather than boilerplate.
 */
export type ClimateClass =
  | 'humid-coastal'
  | 'tropical-wet'
  | 'hot-dry'
  | 'composite'
  | 'cold-hill'
  | 'moderate';

export type HousingClass =
  | 'high-rise'
  | 'gated-villa'
  | 'independent'
  | 'heritage'
  | 'builder-floor'
  | 'row-house'
  | 'mixed';

export interface StateData {
  slug: string;
  name: string;
  kind: 'state' | 'ut';
  capital: string;
  region: Region;
  /** Full district list (text coverage; links only where a city page exists). */
  districts: string[];
  /** Two or three sentences that are genuinely specific to this state. */
  intro: string;
  /** State-specific design considerations. */
  designNotes: string[];
  /** Local language(s) our team communicates in beyond English/Hindi. */
  languages?: string[];
}

export interface CityData {
  slug: string;
  name: string;
  state: string;
  district?: string;
  tier: 1 | 2 | 3;
  aka?: string[];
  /** Real neighbourhoods/localities where projects are typically located. */
  localities: string[];
  landmarks?: string[];
  climate: ClimateClass;
  housing: HousingClass[];
  /** One or two sentences on the city's housing stock and buyer profile. */
  housingNote: string;
  /** One or two sentences on the local design sensibility / heritage. */
  styleNote: string;
  /** Optional note about local material markets, vendors or logistics. */
  marketNote?: string;
  /** Relative cost multiplier (1 = Kolkata baseline). Keep within 0.85–1.2. */
  priceIndex: number;
  /** Slugs of nearby cities for internal linking. */
  nearby: string[];
  /** Approximate coordinates for LocalBusiness.areaServed / GeoCircle. */
  geo?: { lat: number; lng: number };
}
