import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Category } from '../types';

// The card is 176px wide, 224px from the `sm` breakpoint (see the marquee in
// Hero.tsx), so the browser never fetches a wider rendition than that.
const CARD_SIZES = '(min-width: 640px) 224px, 176px';

/**
 * Only same-origin uploads and Vercel Blob are on the optimiser's allow-list
 * (next.config.ts). Anything else is served as-is rather than crashing the
 * page on an unexpected host.
 */
function canOptimise(url: string) {
  return (
    url.startsWith('/') ||
    /^https:\/\/[^/]+\.blob\.vercel-storage\.com\//.test(url)
  );
}

export default function CategoryCard(props: Category) {
  const { name, price, imageUrl, slug } = props;

  // A card without a slug predates the gallery and stays a plain tile.
  const Wrapper = slug ? Link : 'div';
  const wrapperProps = slug
    ? {
        href: `/gallery/${slug}`,
        'aria-label': `${name} interior design gallery`,
      }
    : {};

  return (
    <Wrapper
      {...(wrapperProps as { href: string })}
      className="group relative block h-56 w-full overflow-hidden rounded-2xl bg-zinc-800 shadow-xl sm:h-64 md:h-72"
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes={CARD_SIZES}
          unoptimized={!canOptimise(imageUrl)}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-linear-to-br from-black/40 via-black/20 to-black/70" />
      <div className="absolute top-3 right-3 rounded-md bg-black/80 px-4 py-1.5 text-xs text-white backdrop-blur-md">
        {name}
      </div>
      <div className="absolute bottom-4 left-4 text-white">
        <div className="text-3xl font-light tracking-wide sm:text-4xl">
          {price}
        </div>
        <div className="text-base font-light sm:text-lg">Onwards</div>
      </div>
    </Wrapper>
  );
}
