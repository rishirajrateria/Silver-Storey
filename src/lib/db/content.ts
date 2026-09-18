import { cache } from 'react';
import { prisma, safeQuery } from './client';

/* ────────────────────────────── Types ────────────────────────────── */

export interface CategoryCard {
  id: string;
  name: string;
  price: string;
  imageUrl?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  youtubeId: string;
  description?: string;
}

export interface ProjectPageLink {
  title: string;
  slug: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  roomType?: string;
}

export interface GallerySectionData {
  id: string;
  title: string;
  images: GalleryItem[];
}

export interface ProjectPageData {
  id: string;
  title: string;
  slug: string;
  heroTitle: string;
  heroSubtitle?: string;
  heroImageUrl?: string;
  sections: GallerySectionData[];
  updatedAt: Date;
  /** Case-study fields — all optional. */
  summary?: string;
  location?: string;
  areaSqft?: number;
  budget?: string;
  durationDays?: number;
  propertyType?: string;
  style?: string;
  materials?: string;
  clientName?: string;
  clientQuote?: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
}

export interface BlogPostSummary {
  id: string;
  title: string;
  slug: string;
  description?: string;
  author?: string;
  category?: string;
  mainImageUrl?: string;
  publishedAt?: string;
}

export interface BlogPostFullData extends BlogPostSummary {
  body: string;
  updatedAt: string;
}

export interface TestimonialData {
  id: string;
  name: string;
  location?: string;
  projectType?: string;
  rating: number;
  quote: string;
  imageUrl?: string;
  source: string;
  sourceUrl?: string;
  createdAt: string;
}

export interface LookbookData {
  id: string;
  title: string;
  slug: string;
  description?: string;
  roomType?: string;
  fileUrl: string;
  coverImageUrl?: string;
  pages?: number;
  downloads: number;
  updatedAt: Date;
}

/** Slugs whose project pages are rendered by dedicated routes. */
export const RESIDENTIAL_SLUG = 'residential-projects';
export const COMMERCIAL_SLUG = 'commercial-projects';
/** Slug of the project page whose galleries feed /3d-visualisation. */
export const VISUALISATION_SLUG = '3d-visualisation';
/** Project pages rendered by dedicated routes rather than /projects/[slug]. */
export const RESERVED_PROJECT_SLUGS = [
  RESIDENTIAL_SLUG,
  COMMERCIAL_SLUG,
  VISUALISATION_SLUG,
];

/* ──────────────────────────── Categories ──────────────────────────── */

export const getCategories = cache(
  async (): Promise<CategoryCard[]> =>
    safeQuery(
      async () => {
        const rows = await prisma.category.findMany({
          where: { published: true },
          orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
        });
        return rows.map((c) => ({
          id: c.id,
          name: c.name,
          price: c.price,
          imageUrl: c.imageUrl ?? undefined,
        }));
      },
      [],
      'getCategories',
    ),
);

/* ────────────────────────────── Videos ────────────────────────────── */

export const getVideos = cache(
  async (): Promise<VideoItem[]> =>
    safeQuery(
      async () => {
        const rows = await prisma.video.findMany({
          where: { published: true },
          orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
        });
        return rows.map((v) => ({
          id: v.id,
          title: v.title,
          youtubeId: v.youtubeId,
          description: v.description ?? undefined,
        }));
      },
      [],
      'getVideos',
    ),
);

/* ─────────────────────────── Project pages ─────────────────────────── */

/**
 * Links for the menu overlay. Excludes the two slugs that have their own
 * top-level routes so they are not listed twice in navigation.
 */
export const getProjectPageLinks = cache(
  async (): Promise<ProjectPageLink[]> =>
    safeQuery(
      async () => {
        const rows = await prisma.projectPage.findMany({
          where: {
            published: true,
            slug: { notIn: RESERVED_PROJECT_SLUGS },
          },
          orderBy: [{ order: 'asc' }, { title: 'asc' }],
          select: { title: true, slug: true },
        });
        return rows;
      },
      [],
      'getProjectPageLinks',
    ),
);

/** Every published project page slug — used by generateStaticParams. */
export const getAllProjectSlugs = cache(
  async (): Promise<{ slug: string; updatedAt: Date }[]> =>
    safeQuery(
      async () =>
        prisma.projectPage.findMany({
          where: { published: true },
          select: { slug: true, updatedAt: true },
        }),
      [],
      'getAllProjectSlugs',
    ),
);

export const getProjectPage = cache(
  async (slug: string): Promise<ProjectPageData | null> =>
    safeQuery(
      async () => {
        const page = await prisma.projectPage.findFirst({
          where: { slug, published: true },
          include: {
            sections: {
              orderBy: { order: 'asc' },
              include: { images: { orderBy: { order: 'asc' } } },
            },
          },
        });
        if (!page) return null;
        return {
          id: page.id,
          title: page.title,
          slug: page.slug,
          heroTitle: page.heroTitle,
          heroSubtitle: page.heroSubtitle ?? undefined,
          heroImageUrl: page.heroImageUrl ?? undefined,
          updatedAt: page.updatedAt,
          summary: page.summary ?? undefined,
          location: page.location ?? undefined,
          areaSqft: page.areaSqft ?? undefined,
          budget: page.budget ?? undefined,
          durationDays: page.durationDays ?? undefined,
          propertyType: page.propertyType ?? undefined,
          style: page.style ?? undefined,
          materials: page.materials ?? undefined,
          clientName: page.clientName ?? undefined,
          clientQuote: page.clientQuote ?? undefined,
          beforeImageUrl: page.beforeImageUrl ?? undefined,
          afterImageUrl: page.afterImageUrl ?? undefined,
          sections: page.sections.map((s) => ({
            id: s.id,
            title: s.title,
            images: s.images.map((i) => ({
              id: i.id,
              title: i.title,
              description: i.description ?? '',
              imageUrl: i.imageUrl,
              roomType: i.roomType ?? undefined,
            })),
          })),
        };
      },
      null,
      `getProjectPage(${slug})`,
    ),
);

/* ────────────────────────────── Blog ────────────────────────────── */

function toSummary(p: {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  author: string | null;
  category: string | null;
  mainImageUrl: string | null;
  publishedAt: Date | null;
}): BlogPostSummary {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description ?? undefined,
    author: p.author ?? undefined,
    category: p.category ?? undefined,
    mainImageUrl: p.mainImageUrl ?? undefined,
    publishedAt: p.publishedAt?.toISOString(),
  };
}

export const getBlogPosts = cache(
  async (): Promise<BlogPostSummary[]> =>
    safeQuery(
      async () => {
        const rows = await prisma.blogPost.findMany({
          where: { published: true },
          orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            author: true,
            category: true,
            mainImageUrl: true,
            publishedAt: true,
          },
        });
        return rows.map(toSummary);
      },
      [],
      'getBlogPosts',
    ),
);

export const getBlogPost = cache(
  async (slug: string): Promise<BlogPostFullData | null> =>
    safeQuery(
      async () => {
        const post = await prisma.blogPost.findFirst({
          where: { slug, published: true },
        });
        if (!post) return null;
        return {
          ...toSummary(post),
          body: post.body,
          updatedAt: post.updatedAt.toISOString(),
        };
      },
      null,
      `getBlogPost(${slug})`,
    ),
);

/* ───────────────────────────── Brochure ───────────────────────────── */

export const getBrochureUrl = cache(
  async (): Promise<string | undefined> =>
    safeQuery(
      async () => {
        const row = await prisma.brochure.findFirst({
          where: { isActive: true },
          orderBy: { updatedAt: 'desc' },
        });
        return row?.fileUrl;
      },
      undefined,
      'getBrochureUrl',
    ),
);

/* ─────────────────────────── Testimonials ─────────────────────────── */

export const getTestimonials = cache(
  async (): Promise<TestimonialData[]> =>
    safeQuery(
      async () => {
        const rows = await prisma.testimonial.findMany({
          where: { published: true },
          orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
        });
        return rows.map((t) => ({
          id: t.id,
          name: t.name,
          location: t.location ?? undefined,
          projectType: t.projectType ?? undefined,
          rating: t.rating,
          quote: t.quote,
          imageUrl: t.imageUrl ?? undefined,
          source: t.source,
          sourceUrl: t.sourceUrl ?? undefined,
          createdAt: t.createdAt.toISOString(),
        }));
      },
      [],
      'getTestimonials',
    ),
);

/* ───────────────────────────── Lookbooks ───────────────────────────── */

function toLookbook(l: {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  roomType: string | null;
  fileUrl: string;
  coverImageUrl: string | null;
  pages: number | null;
  downloads: number;
  updatedAt: Date;
}): LookbookData {
  return {
    id: l.id,
    title: l.title,
    slug: l.slug,
    description: l.description ?? undefined,
    roomType: l.roomType ?? undefined,
    fileUrl: l.fileUrl,
    coverImageUrl: l.coverImageUrl ?? undefined,
    pages: l.pages ?? undefined,
    downloads: l.downloads,
    updatedAt: l.updatedAt,
  };
}

export const getLookbooks = cache(
  async (): Promise<LookbookData[]> =>
    safeQuery(
      async () =>
        (
          await prisma.lookbook.findMany({
            where: { published: true },
            orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
          })
        ).map(toLookbook),
      [],
      'getLookbooks',
    ),
);

export const getLookbook = cache(
  async (slug: string): Promise<LookbookData | null> =>
    safeQuery(
      async () => {
        const row = await prisma.lookbook.findFirst({
          where: { slug, published: true },
        });
        return row ? toLookbook(row) : null;
      },
      null,
      `getLookbook(${slug})`,
    ),
);
