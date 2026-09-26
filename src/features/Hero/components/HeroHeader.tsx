'use client';

import React, { useEffect, useRef } from 'react';
import { SITE } from '@/lib/seo/site';
import { HERO_VIDEO, HERO_VIDEO_POSTER, HERO_VIDEO_WEBM } from '../media';

const TAGLINE = `Turnkey home and office interiors with complimentary 3D visualisation, itemised pricing and delivery within ${SITE.stats.deliveryDays} days of design approval.`;

export default function HeroHeader() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Someone who asked their OS for less motion, or their browser to save
  // data, keeps the poster frame instead of a looping clip. Everyone else
  // gets an explicit play(): React applies `muted` as a property only after
  // hydration, so a browser that already tried to autoplay the server markup
  // may have refused it as un-muted and will not retry on its own.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection?.saveData === true;
    if (reduceMotion || saveData) {
      video.removeAttribute('autoplay');
      video.pause();
      return;
    }
    video.muted = true;
    video.play().catch(() => {});
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        poster={HERO_VIDEO_POSTER}
        preload="metadata"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      >
        <source src={HERO_VIDEO_WEBM} type="video/webm" />
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex h-full -translate-y-24 transform flex-col items-center justify-center px-6 pt-20 text-center sm:-translate-y-28 sm:pt-24 md:-translate-y-32 md:pt-32">
        <div className="mb-6 flex -translate-y-2 transform flex-col items-center sm:-translate-y-3">
          <div className="h-16 w-16 overflow-hidden rounded-full sm:h-20 sm:w-20 md:h-20 md:w-20">
            <img
              src="/images/home_logo.avif"
              alt="Silver Storey logo"
              width={78}
              height={78}
              className="h-full w-full origin-center scale-[0.78] transform object-cover"
              loading="eager"
            />
          </div>
          <div className="mt-0 pt-0 text-base font-light tracking-[0.16em] text-white sm:text-lg">
            {SITE.name}
          </div>
        </div>

        <p className="mb-3 text-sm tracking-normal text-white/90 uppercase">
          INTRODUCING THE SILVER STOREY LIVING
        </p>

        <h1 className="font-regular max-w-4xl text-3xl leading-[1.08] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
          Interior Designers in Kolkata{' '}
          <span className="block">&amp; Across India</span>
        </h1>

        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
          {TAGLINE}
        </p>
      </div>
    </>
  );
}
