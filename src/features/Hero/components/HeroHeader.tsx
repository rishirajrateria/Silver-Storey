'use client';

import React from 'react';
import { HERO_VIDEO, HERO_VIDEO_POSTER } from '../media';

export default function HeroHeader() {
  return (
    <>
      <video
        src={HERO_VIDEO}
        poster={HERO_VIDEO_POSTER ?? undefined}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex h-full -translate-y-24 transform flex-col items-center justify-center px-6 pt-20 text-center sm:-translate-y-28 sm:pt-24 md:-translate-y-32 md:pt-32">
        <div className="mb-6 flex -translate-y-2 transform flex-col items-center sm:-translate-y-3">
          <div className="h-16 w-16 overflow-hidden rounded-full sm:h-20 sm:w-20 md:h-20 md:w-20">
            <img
              src="images/home_logo.avif"
              alt="Silver Storey logo"
              className="h-full w-full origin-center scale-[0.78] transform object-cover"
              loading="eager"
            />
          </div>
          <div className="mt-0 pt-0 text-base font-light tracking-[0.16em] text-white sm:text-lg">
            Silver Storey
          </div>
        </div>

        <p className="mb-3 text-sm tracking-normal text-white/90 uppercase">
          INTRODUCING THE SILVER STOREY LIVING
        </p>

        <h1 className="font-regular max-w-4xl text-3xl leading-[1.08] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
          <span className="mb-2 block">India's Fastest Growing</span>
          <span className="block">Interior Design Brand</span>
        </h1>
      </div>
    </>
  );
}
