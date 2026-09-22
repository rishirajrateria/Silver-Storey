import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import PageShell from '@/components/seo/PageShell';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import CTASection from '@/components/seo/CTASection';
import { PageHero } from '@/components/seo/Prose';
import JsonLd from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, graph, webPageSchema } from '@/lib/seo/schema';
import CategoryCarousel from '@/features/Gallery/CategoryCarousel';
import { getCategoriesWithImages, getProjectPageLinks } from '@/lib/db/content';

export const revalidate = 300;

const PATH = '/gallery';
const TITLE = 'Interior Design Gallery — Room by Room | Silver Storey';
const DESCRIPTION =
  'Browse finished Silver Storey interiors room by room — bedrooms, kitchens, living rooms, bathrooms and more — each with starting prices, from our projects across India.';

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  keywords: [
    'interior design gallery',
    'home interior photos india',
    'bedroom interior design images',
    'modular kitchen gallery',
    'living room design gallery',
  ],
});

export default async function GalleryPage() {
  const [categories, projectPages] = await Promise.all([
    getCategoriesWithImages(),
    getProjectPageLinks(),
  ]);

  const withPhotos = categories.filter((c) => c.images.length > 0);
  const totalPhotos = categories.reduce((sum, c) => sum + c.images.length, 0);

  return (
    <PageShell projectPages={projectPages}>
      <JsonLd
        id="gallery-jsonld"
        data={graph(
          webPageSchema({ name: TITLE, description: DESCRIPTION, path: PATH }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Gallery', path: PATH },
          ]),
        )}
      />

      <div className="mx-auto max-w-6xl px-6 pt-8">
        <Breadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'Gallery', path: PATH },
          ]}
        />
      </div>

      <PageHero
        eyebrow="Our work"
        title="Interior design gallery"
        subtitle={
          totalPhotos > 0
            ? `${totalPhotos} photographs from delivered projects, grouped by room. Every price is a starting point — the final figure depends on size, materials and finishes.`
            : 'Photographs from delivered projects, grouped by room.'
        }
      />

      {categories.length === 0 ? (
        <p className="mx-auto max-w-6xl px-6 py-16 text-black/60">
          The gallery is being put together. In the meantime, see our{' '}
          <Link href="/residential-projects" className="underline">
            residential
          </Link>{' '}
          and{' '}
          <Link href="/commercial-projects" className="underline">
            commercial
          </Link>{' '}
          projects.
        </p>
      ) : (
        <div className="mx-auto max-w-6xl space-y-16 px-6 py-8">
          {withPhotos.map((category) => (
            <section
              key={category.id}
              aria-labelledby={`room-${category.slug}`}
            >
              <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <h2
                    id={`room-${category.slug}`}
                    className="text-2xl font-semibold tracking-tight text-black sm:text-3xl"
                  >
                    {category.name}
                  </h2>
                  <p className="mt-1 text-sm text-black/55">
                    From {category.price} · {category.images.length}{' '}
                    {category.images.length === 1 ? 'photo' : 'photos'}
                  </p>
                </div>
                <Link
                  href={`/gallery/${category.slug}`}
                  className="text-sm font-medium text-[#6b1a1a] hover:underline"
                >
                  All {category.name} photos →
                </Link>
              </div>
              <CategoryCarousel images={category.images} name={category.name} />
            </section>
          ))}

          {withPhotos.length === 0 && (
            <p className="text-black/60">
              Photographs are being added room by room. The rooms we cover are
              listed below.
            </p>
          )}

          {/* Rooms without photos still deserve a way in — their page carries
              the starting price and links on to the rest. */}
          <nav aria-label="All rooms">
            <h2 className="mb-4 text-xs font-semibold tracking-[0.2em] text-[#6b1a1a] uppercase">
              All rooms
            </h2>
            <ul className="grid list-none gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/gallery/${category.slug}`}
                    className="glass-lift flex items-baseline justify-between gap-3 rounded-xl bg-white px-4 py-3.5 transition-transform hover:scale-[1.01]"
                  >
                    <span className="font-medium text-black">
                      {category.name}
                    </span>
                    <span className="text-sm text-black/55">
                      {category.price} onwards
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      <CTASection
        title="Want your room to look like this?"
        subtitle="Share your floor plan and we will send a 3D visualisation and an itemised quote, free."
      />
    </PageShell>
  );
}
