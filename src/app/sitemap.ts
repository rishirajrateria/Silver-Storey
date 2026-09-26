import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/seo/site';
import {
  isGalleryCategoryIndexable,
  isServiceCityIndexable,
  isStateIndexable,
} from '@/lib/seo/indexing';
import {
  STATES,
  CITIES,
  SERVICE_CITIES,
  cityPath,
  statePath,
  citiesInState,
} from '@/lib/locations';
import {
  SERVICES,
  SERVICES_WITH_CITY_PAGES,
  servicePath,
  serviceCityPath,
} from '@/lib/services';
import {
  getAllBlogItems,
  ARTICLE_BY_SLUG,
  BLOG_CATEGORIES,
  categoryPath,
  articlePath,
} from '@/lib/blog';
import {
  getAllProjectSlugs,
  getCategoriesWithImages,
  getLookbooks,
  RESERVED_PROJECT_SLUGS,
} from '@/lib/db/content';

/**
 * Split sitemaps:
 *   /sitemap/0.xml — core pages, services, CMS projects, lookbooks, galleries
 *   /sitemap/1.xml — states and cities
 *   /sitemap/2.xml — service × city pages (indexable states only)
 *   /sitemap/3.xml — blog posts and categories
 * An index is served at /sitemap-index.xml (and /sitemap.xml redirects to it).
 *
 * `lastModified` is set only where a real edit date exists — CMS rows, blog
 * articles. A build timestamp on every URL told Google the whole site changed
 * every deploy, which is the fastest way to have the signal ignored.
 * Anything `noindex` is left out: a sitemap is a list of pages to index.
 */
export async function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];
}

type Entry = MetadataRoute.Sitemap[number];

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const id = Number(await props.id);

  if (id === 0) {
    const core: Entry[] = [
      { url: absoluteUrl('/'), changeFrequency: 'weekly', priority: 1 },
      {
        url: absoluteUrl('/interior-designers'),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: absoluteUrl('/services'),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: absoluteUrl('/estimate'),
        changeFrequency: 'monthly',
        priority: 0.9,
      },
      {
        url: absoluteUrl('/gallery'),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: absoluteUrl('/pricing-structure'),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: absoluteUrl('/3d-visualisation'),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      { url: absoluteUrl('/blog'), changeFrequency: 'weekly', priority: 0.8 },
      {
        url: absoluteUrl('/projects'),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: absoluteUrl('/lookbooks'),
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: absoluteUrl('/about-us'),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: absoluteUrl('/how-it-works'),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: absoluteUrl('/reviews'),
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: absoluteUrl('/turnkey-interiors'),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: absoluteUrl('/compare'),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: absoluteUrl('/warranty'),
        changeFrequency: 'yearly',
        priority: 0.6,
      },
      {
        url: absoluteUrl('/contact'),
        changeFrequency: 'yearly',
        priority: 0.6,
      },
      {
        url: absoluteUrl('/privacy-policy'),
        changeFrequency: 'yearly',
        priority: 0.3,
      },
      {
        url: absoluteUrl('/terms-conditions'),
        changeFrequency: 'yearly',
        priority: 0.3,
      },
    ];
    const services: Entry[] = SERVICES.map((s) => ({
      url: absoluteUrl(servicePath(s)),
      changeFrequency: 'monthly',
      priority: 0.85,
    }));
    const projects: Entry[] = (await getAllProjectSlugs())
      .filter(({ slug }) => !RESERVED_PROJECT_SLUGS.includes(slug))
      .map(({ slug, updatedAt }) => ({
        url: absoluteUrl(`/projects/${slug}`),
        lastModified: updatedAt,
        changeFrequency: 'monthly',
        priority: 0.6,
      }));
    const lookbooks: Entry[] = (await getLookbooks()).map((l) => ({
      url: absoluteUrl(`/lookbooks/${l.slug}`),
      lastModified: l.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.6,
    }));
    const gallery: Entry[] = (await getCategoriesWithImages())
      .filter((c) => isGalleryCategoryIndexable(c.images.length))
      .map((category) => ({
        url: absoluteUrl(`/gallery/${category.slug}`),
        changeFrequency: 'monthly',
        priority: 0.7,
      }));
    return [...core, ...services, ...projects, ...lookbooks, ...gallery];
  }

  if (id === 1) {
    return [
      ...STATES.filter((s) =>
        isStateIndexable(citiesInState(s.slug).length),
      ).map(
        (s): Entry => ({
          url: absoluteUrl(statePath(s)),
          changeFrequency: 'monthly',
          priority: 0.75,
        }),
      ),
      ...CITIES.map(
        (c): Entry => ({
          url: absoluteUrl(cityPath(c)),
          changeFrequency: 'monthly',
          priority: c.tier === 1 ? 0.9 : c.tier === 2 ? 0.8 : 0.7,
        }),
      ),
    ];
  }

  if (id === 2) {
    const cities = SERVICE_CITIES.filter(isServiceCityIndexable);
    return SERVICES_WITH_CITY_PAGES.flatMap((s) =>
      cities.map(
        (c): Entry => ({
          url: absoluteUrl(serviceCityPath(s, c.slug)),
          changeFrequency: 'monthly',
          priority: c.tier === 1 ? 0.7 : 0.6,
        }),
      ),
    );
  }

  const items = await getAllBlogItems();
  return [
    ...BLOG_CATEGORIES.map(
      (c): Entry => ({
        url: absoluteUrl(categoryPath(c.slug)),
        changeFrequency: 'weekly',
        priority: 0.6,
      }),
    ),
    ...items.map((i): Entry => {
      const local = ARTICLE_BY_SLUG[i.slug];
      const modified = local?.updatedAt ?? local?.publishedAt ?? i.publishedAt;
      return {
        url: absoluteUrl(articlePath(i.slug)),
        ...(modified ? { lastModified: new Date(modified) } : {}),
        changeFrequency: 'monthly',
        priority: 0.7,
      };
    }),
  ];
}
