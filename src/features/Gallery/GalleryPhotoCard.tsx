import React from 'react';
import type { CategoryImageData } from '@/lib/db/content';

/**
 * One gallery photograph, captioned the way the home page room cards are:
 * the price set large over the bottom of the image, the title on a dark pill
 * top-right, both lifted off the photo by a gradient rather than a separate
 * white strip beneath it.
 *
 * The gradient is what makes the text legible — a light photograph would
 * otherwise wash out white type — so it is painted whenever there is anything
 * to overlay, and skipped entirely on a photo with neither title nor price.
 */
export default function GalleryPhotoCard({
  image,
  categoryName,
}: {
  image: CategoryImageData;
  categoryName: string;
}) {
  const hasCaption = Boolean(image.title || image.price);

  return (
    <figure className="group relative aspect-4/5 overflow-hidden rounded-2xl bg-zinc-800 shadow-xl">
      <img
        src={image.imageUrl}
        alt={
          image.title
            ? `${image.title} — ${categoryName} interior by Silver Storey`
            : `${categoryName} interior by Silver Storey`
        }
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {hasCaption && (
        <>
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-br from-black/40 via-black/20 to-black/70"
          />

          <figcaption className="absolute inset-0 text-white">
            {image.title && (
              <span className="absolute top-3 right-3 max-w-[70%] truncate rounded-md bg-black/80 px-4 py-1.5 text-xs backdrop-blur-md">
                {image.title}
              </span>
            )}
            {image.price && (
              <span className="absolute bottom-4 left-4 block text-3xl font-light tracking-wide sm:text-4xl">
                {image.price}
              </span>
            )}
          </figcaption>
        </>
      )}
    </figure>
  );
}
