export interface Review {
  text: string;
  author: string;
}

export interface Category {
  name: string;
  price: string;
  /** Uploaded image URL — optional, falls back to a plain background */
  imageUrl?: string;
  /** Links the card to /gallery/<slug>; absent on the hardcoded fallbacks. */
  slug?: string;
}

export interface StatItem {
  val: string;
  label: string;
}

export interface ProcessStep {
  name: string;
  label: string;
  image: string;
}

export interface Brand {
  name: string;
  image: string;
  /** Intrinsic pixel size of the logo file, so space is reserved before it loads. */
  width: number;
  height: number;
}

export interface Founder {
  firstName: string;
  lastName: string;
  image: string;
  alt: string;
  role: string;
}

export interface ProcessStepIconItem {
  name: string;
  icon: React.ReactNode;
}

export interface Service {
  name: string;
  image: string;
  /** The service page the tile leads to, or the catalogue when none maps cleanly. */
  href: string;
}
