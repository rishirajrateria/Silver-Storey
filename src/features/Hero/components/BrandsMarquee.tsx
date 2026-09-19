'use client';

import React from 'react';
import { brands } from '../constants';

export default function BrandsMarquee() {
  return (
    <div className="relative cursor-default bg-white pb-32 text-center">
      {/* Convex White Wave Divider */}
      <div className="pointer-events-none absolute top-0 left-0 w-full translate-y-[-99%] overflow-hidden leading-none">
        <svg
          className="relative block h-15 w-full sm:h-25 md:h-35"
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,160 C480,0 960,0 1440,160 Z" fill="#ffffff" />
        </svg>
      </div>

      <h3 className="mb-12 text-xl font-light tracking-wide sm:mb-16 sm:text-2xl md:text-3xl">
        Our Preferred Global Brands
      </h3>

      {/* Brands Marquee */}
      <div className="overflow-hidden">
        <div
          className="flex hover:[animation-play-state:paused]"
          style={{ animation: 'marquee 25s linear infinite' }}
        >
          {/* Copy 1 */}
          <div className="flex shrink-0 items-center gap-12 pr-12">
            {brands.map((brand) => (
              <img
                loading="lazy"
                decoding="async"
                key={brand.name}
                src={brand.image}
                alt={brand.name}
                className="h-16 w-auto object-contain sm:h-20 md:h-24"
              />
            ))}
          </div>
          {/* Copy 2 — seamless loop */}
          <div className="flex shrink-0 items-center gap-12 pr-12">
            {brands.map((brand) => (
              <img
                loading="lazy"
                decoding="async"
                key={`clone-${brand.name}`}
                src={brand.image}
                alt={brand.name}
                className="h-16 w-auto object-contain sm:h-20 md:h-24"
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
