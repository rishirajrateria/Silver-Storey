import { SITE } from '@/lib/seo/site';
import type { Brand, Founder, StatItem } from './types';

export const categories = [
  { name: 'Bedroom', price: '2.1 L' },
  { name: 'Dining', price: '1 L' },
  { name: 'Kitchen', price: '1.4 L' },
  { name: 'Bathroom', price: '1.8 L' },
  { name: 'Living Room', price: '2.4 L' },
  { name: 'Office', price: '2 L' },
];

/** The home-page counters quote the same figures as every other surface. */
export const stats: StatItem[] = [
  { val: SITE.stats.happyCustomers, label: 'Happy Customers' },
  { val: SITE.stats.sqftTransformed, label: 'Sq ft Transformed' },
  { val: SITE.stats.teamMembers, label: 'Team Members' },
  { val: String(SITE.stats.yearsExperience), label: 'Years of Experience' },
];

export const processSteps = [
  {
    name: 'Meet our Expert',
    label: 'Meet our\nExpert',
    image: '/images/Meet%20our%20Expert.avif',
  },
  {
    name: 'Get free Estimate',
    label: 'Get free\nEstimate',
    image: '/images/Get%20free%20Estimate.avif',
  },
  {
    name: 'Initial Payment',
    label: 'Initial\nPayment',
    image: '/images/Initial%20Payment.avif',
  },
  {
    name: 'Get 3D Visualization',
    label: 'Get 3D\nVisualization',
    image: '/images/logo3.avif',
  },
  {
    name: 'Design Approval',
    label: 'Design\nApproval',
    image: '/images/Design%20Approval.avif',
  },
  {
    name: 'Delivery in 45 Days!',
    label: 'Delivery in\n45 Days!',
    image: '/images/Delivery%20in%2045%20Days!.avif',
  },
];

/**
 * Logo files for the partners in SITE.brandPartners, with each file's
 * intrinsic size so the marquee reserves the logo's width before it arrives.
 * A partner without a logo here is simply not shown.
 */
const BRAND_LOGOS: Record<string, Omit<Brand, 'name'>> = {
  Ebco: { image: '/images/ebco.avif', width: 1536, height: 1024 },
  Greenply: {
    image: '/images/download-Photoroom.avif',
    width: 369,
    height: 244,
  },
  Hettich: { image: '/images/hettich.avif', width: 1200, height: 900 },
  Havells: { image: '/images/Havells-logo.avif', width: 3840, height: 2160 },
  'Asian Paints': {
    image: '/images/asianpaints%20.avif',
    width: 860,
    height: 540,
  },
  Philips: { image: '/images/philips.avif', width: 2272, height: 880 },
  Evara: { image: '/images/evara%20.avif', width: 1254, height: 1254 },
  Kohler: {
    image: '/images/KohlerLogoImage-Photoroom.avif',
    width: 590,
    height: 397,
  },
};

export const brands: Brand[] = SITE.brandPartners.flatMap((name) => {
  const logo = BRAND_LOGOS[name];
  return logo ? [{ name, ...logo }] : [];
});

/** The founders as the home and About pages show them, from the one record in site.ts. */
export const founders: Founder[] = SITE.founders.map((f) => {
  const [firstName, ...rest] = f.name.split(' ');
  return {
    firstName,
    lastName: rest.join(' '),
    image: f.image,
    alt: f.name,
    role: f.role,
  };
});
