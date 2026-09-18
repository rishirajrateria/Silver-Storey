export interface BlogCategory {
  slug: string;
  name: string;
  description: string;
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    slug: 'cost-guides',
    name: 'Interior Design Cost Guides',
    description:
      'Transparent, itemised cost guides for kitchens, wardrobes, full homes and commercial spaces in India.',
  },
  {
    slug: 'design-ideas',
    name: 'Design Ideas & Trends',
    description:
      'Room-by-room inspiration, colour palettes, layouts and the trends we actually recommend.',
  },
  {
    slug: 'materials-finishes',
    name: 'Materials & Finishes',
    description:
      'Plywood vs. HDHMR, laminate vs. acrylic, stone, hardware and everything that decides how long an interior lasts.',
  },
  {
    slug: 'modular-kitchen',
    name: 'Modular Kitchen',
    description:
      'Layouts, storage, appliances and costs for Indian modular kitchens.',
  },
  {
    slug: 'vastu-wellbeing',
    name: 'Vastu & Wellbeing',
    description:
      'Vastu-aligned planning, natural light, air quality and calm, healthy homes.',
  },
  {
    slug: 'planning-process',
    name: 'Planning & Process',
    description:
      'How to hire a designer, read a quote, plan a timeline and avoid the common mistakes.',
  },
  {
    slug: 'commercial',
    name: 'Commercial Interiors',
    description:
      'Offices, retail, cafés and clinics — design that earns its keep.',
  },
  {
    slug: 'city-guides',
    name: 'City Guides',
    description:
      'Local design considerations, material markets and costs for Indian cities.',
  },
];

export const CATEGORY_BY_SLUG: Record<string, BlogCategory> =
  Object.fromEntries(BLOG_CATEGORIES.map((c) => [c.slug, c]));

export function categoryPath(slug: string) {
  return `/blog/category/${slug}`;
}
