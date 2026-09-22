import React from 'react';
import Link from 'next/link';
import { Category } from '../types';

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
        <img
          loading="lazy"
          decoding="async"
          src={imageUrl}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
