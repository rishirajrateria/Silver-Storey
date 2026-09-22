import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/seo/site';
import {
  STATES,
  CITIES,
  SERVICE_CITIES,
  cityPath,
  statePath,
} from '@/lib/locations';
import {
  SERVICES,
  SERVICES_WITH_CITY_PAGES,
  servicePath,
  serviceCityPath,
} from '@/lib/services';
import {
  getAllBlogItems,
  BLOG_CATEGORIES,
  categoryPath,
  articlePath,
} from '@/lib/blog';
import {
  getAllProjectSlugs,
  getCategories,
  getLookbooks,
  RESERVED_PROJECT_SLUGS,
} from '@/lib/db/content';

/**
 * Split sitemaps:
 *   /sitemap/0.xml — core pages, services, CMS projects
 *   /sitemap/1.xml — states and cities
 *   /sitemap/2.xml — service × city pages
 *   /sitemap/3.xml — blog posts and categories
 * An index is served at /sitemap-index.xml.
 */
export async function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];
}

const BUILD_DATE = new Date();

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const id = Number(await props.id);

  if (id === 0) {
    const core: MetadataRoute.Sitemap = [
      {
        url: absoluteUrl('/'),
        lastModified: BUILD_DATE,
        changeFrequency: 'weekly',
        priority: 1,
      },
      {
        url: absoluteUrl('/interior-designers'),
        lastModified: BUILD_DATE,
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: absoluteUrl('/gallery'),
        lastModified: BUILD_DATE,
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: absoluteUrl('/services'),
        lastModified: BUILD_DATE,
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: absoluteUrl('/estimate'),
        lastModified: BUILD_DATE,
        changeFrequency: 'monthly',
        priority: 0.9,
      },
      {
        url: absoluteUrl('/3d-visualisation'),
        lastModified: BUILD_DATE,
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: absoluteUrl('/lookbooks'),
        lastModified: BUILD_DATE,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: absoluteUrl('/warranty'),
        lastModified: BUILD_DATE,
        changeFrequency: 'yearly',
        priority: 0.6,
      },
      {
        url: absoluteUrl('/track'),
        lastModified: BUILD_DATE,
        changeFrequency: 'yearly',
        priority: 0.3,
      },
      {
        url: absoluteUrl('/about-us'),
        lastModified: BUILD_DATE,
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: absoluteUrl('/how-it-works'),
        lastModified: BUILD_DATE,
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: absoluteUrl('/pricing-structure'),
        lastModified: BUILD_DATE,
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: absoluteUrl('/residential-projects'),
        lastModified: BUILD_DATE,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: absoluteUrl('/commercial-projects'),
        lastModified: BUILD_DATE,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: absoluteUrl('/contact'),
        lastModified: BUILD_DATE,
        changeFrequency: 'yearly',
        priority: 0.6,
      },
      {
        url: absoluteUrl('/blog'),
        lastModified: BUILD_DATE,
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: absoluteUrl('/terms-conditions'),
        lastModified: BUILD_DATE,
        changeFrequency: 'yearly',
        priority: 0.3,
      },
    ];
    const services = SERVICES.map((s) => ({
      url: absoluteUrl(servicePath(s)),
      lastModified: BUILD_DATE,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    }));
    const projects = (await getAllProjectSlugs())
      .filter(({ slug }) => !RESERVED_PROJECT_SLUGS.includes(slug))
      .map(({ slug, updatedAt }) => ({
        url: absoluteUrl(`/projects/${slug}`),
        lastModified: updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));
    const lookbooks = (await getLookbooks()).map((l) => ({
      url: absoluteUrl(`/lookbooks/${l.slug}`),
      lastModified: l.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
    const gallery = (await getCategories()).map((category) => ({
      url: absoluteUrl(`/gallery/${category.slug}`),
      lastModified: BUILD_DATE,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
    return [...core, ...services, ...projects, ...lookbooks, ...gallery];
  }

  if (id === 1) {
    return [
      ...STATES.map((s) => ({
        url: absoluteUrl(statePath(s)),
        lastModified: BUILD_DATE,
        changeFrequency: 'monthly' as const,
        priority: 0.75,
      })),
      ...CITIES.map((c) => ({
        url: absoluteUrl(cityPath(c)),
        lastModified: BUILD_DATE,
        changeFrequency: 'monthly' as const,
        priority: c.tier === 1 ? 0.9 : c.tier === 2 ? 0.8 : 0.7,
      })),
    ];
  }

  if (id === 2) {
    return SERVICES_WITH_CITY_PAGES.flatMap((s) =>
      SERVICE_CITIES.map((c) => ({
        url: absoluteUrl(serviceCityPath(s, c.slug)),
        lastModified: BUILD_DATE,
        changeFrequency: 'monthly' as const,
        priority: c.tier === 1 ? 0.7 : 0.6,
      })),
    );
  }

  const items = await getAllBlogItems();
  return [
    ...BLOG_CATEGORIES.map((c) => ({
      url: absoluteUrl(categoryPath(c.slug)),
      lastModified: BUILD_DATE,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
    ...items.map((i) => ({
      url: absoluteUrl(articlePath(i.slug)),
      lastModified: i.publishedAt ? new Date(i.publishedAt) : BUILD_DATE,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
