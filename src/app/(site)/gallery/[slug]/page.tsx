import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageShell from '@/components/seo/PageShell';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import CTASection from '@/components/seo/CTASection';
import { PageHero } from '@/components/seo/Prose';
import JsonLd from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, graph, webPageSchema } from '@/lib/seo/schema';
import { absoluteUrl } from '@/lib/seo/site';
import CategoryStrip from '@/features/Gallery/CategoryStrip';
import GalleryPhotoCard from '@/features/Gallery/GalleryPhotoCard';
import {
  getCategories,
  getCategoryBySlug,
  getProjectPageLinks,
} from '@/lib/db/content';

export const revalidate = 300;

/**
 * Categories are CMS rows that the owner adds and renames, so the paths are
 * generated at request time and cached, rather than fixed at build time.
 */
export const dynamicParams = true;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

function describe(name: string, price: string, count: number): string {
  const photos =
    count > 0
      ? `${count} ${count === 1 ? 'photograph' : 'photographs'} of finished ${name.toLowerCase()} interiors`
      : `Finished ${name.toLowerCase()} interiors`;
  return `${photos} by Silver Storey, from ${price} onwards. Turnkey design and execution across India, with 3D visualisation and a 10-year warranty.`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) {
    return buildMetadata({
      title: 'Room not found | Silver Storey',
      description: 'This gallery page is no longer available.',
      path: `/gallery/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `${category.name} Interior Design — Photos & Prices | Silver Storey`,
    description: describe(
      category.name,
      category.price,
      category.images.length,
    ),
    path: `/gallery/${category.slug}`,
    image: category.imageUrl ?? category.images[0]?.imageUrl,
    imageAlt: `${category.name} interior design by Silver Storey`,
    keywords: [
      `${category.name.toLowerCase()} interior design`,
      `${category.name.toLowerCase()} design ideas`,
      `${category.name.toLowerCase()} interior cost`,
    ],
  });
}

export default async function CategoryGalleryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [category, categories, projectPages] = await Promise.all([
    getCategoryBySlug(slug),
    getCategories(),
    getProjectPageLinks(),
  ]);

  if (!category) notFound();

  const path = `/gallery/${category.slug}`;
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/gallery' },
    { name: category.name, path },
  ];

  return (
    <PageShell projectPages={projectPages}>
      <JsonLd
        id="category-gallery-jsonld"
        data={graph(
          webPageSchema({
            name: `${category.name} Interior Design`,
            description: describe(
              category.name,
              category.price,
              category.images.length,
            ),
            path,
          }),
          breadcrumbSchema(crumbs),
          // An ImageGallery only when there are genuinely images to list.
          ...(category.images.length > 0
            ? [
                {
                  '@type': 'ImageGallery' as const,
                  name: `${category.name} interior design gallery`,
                  url: absoluteUrl(path),
                  image: category.images.map((image) => ({
                    '@type': 'ImageObject' as const,
                    contentUrl: absoluteUrl(image.imageUrl),
                    ...(image.title ? { name: image.title } : {}),
                  })),
                },
              ]
            : []),
        )}
      />

      <div className="mx-auto max-w-6xl px-6 pt-8">
        <Breadcrumbs items={crumbs} />
      </div>

      <PageHero
        eyebrow={`From ${category.price}`}
        title={`${category.name} interior design`}
        subtitle={describe(
          category.name,
          category.price,
          category.images.length,
        )}
      />

      <div className="mx-auto max-w-6xl px-6">
        {category.images.length === 0 ? (
          <p className="py-8 text-black/60">
            Photographs of our {category.name.toLowerCase()} work are being
            added. In the meantime, browse the{' '}
            <Link href="/gallery" className="underline">
              full gallery
            </Link>{' '}
            or{' '}
            <Link href="/estimate" className="underline">
              price your own {category.name.toLowerCase()}
            </Link>
            .
          </p>
        ) : (
          <ul className="grid list-none gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {category.images.map((image) => (
              <li key={image.id}>
                <GalleryPhotoCard image={image} categoryName={category.name} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <CategoryStrip categories={categories} currentSlug={category.slug} />

      <CTASection
        title={`Planning a ${category.name.toLowerCase()}?`}
        subtitle={`Tell us the measurements and we will send a 3D visualisation and an itemised quote — free, and yours to keep.`}
      />
    </PageShell>
  );
}
