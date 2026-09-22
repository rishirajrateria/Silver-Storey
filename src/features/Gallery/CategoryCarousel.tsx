'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { CategoryImageData } from '@/lib/db/content';
import GalleryPhotoCard from './GalleryPhotoCard';

/**
 * A horizontal strip of photos for one category.
 *
 * Scroll-snap does the work, so the strip stays usable by touch, trackpad and
 * keyboard with no JavaScript; the arrows are an enhancement that hide
 * themselves when there is nothing to scroll to.
 */
export default function CategoryCarousel({
  images,
  name,
}: {
  images: CategoryImageData[];
  name: string;
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 1);
    // A sub-pixel gap is normal at the far end, so allow a little slack.
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    sync();
    const el = trackRef.current;
    if (!el) return;
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => observer.disconnect();
  }, [sync]);

  const scrollBy = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  if (images.length === 0) return null;

  return (
    <div className="relative">
      <ul
        ref={trackRef}
        onScroll={sync}
        className="flex snap-x snap-mandatory [scrollbar-width:none] list-none gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((image) => (
          <li
            key={image.id}
            className="w-64 shrink-0 snap-start sm:w-72 md:w-80"
          >
            <GalleryPhotoCard image={image} categoryName={name} />
          </li>
        ))}
      </ul>

      {!atStart && (
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label={`Scroll ${name} photos left`}
          className="glass absolute top-1/2 -left-2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-black transition-transform hover:scale-105 sm:flex"
        >
          ←
        </button>
      )}
      {!atEnd && (
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label={`Scroll ${name} photos right`}
          className="glass absolute top-1/2 -right-2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-black transition-transform hover:scale-105 sm:flex"
        >
          →
        </button>
      )}
    </div>
  );
}
