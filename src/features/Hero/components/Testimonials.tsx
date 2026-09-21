'use client';

import React from 'react';
import type { Review } from '../types';

export default function Testimonials({
  reviews,
  currentSlide,
  nextSlide,
  prevSlide,
  setCurrentSlide,
}: {
  reviews: Review[];
  currentSlide: number;
  nextSlide: (e: React.MouseEvent) => void;
  prevSlide: (e: React.MouseEvent) => void;
  setCurrentSlide: (i: number) => void;
}) {
  return (
    <div className="relative cursor-default bg-white pt-0 pb-24 sm:pb-32">
      <div className="mx-auto max-w-360 px-6 text-center">
        <p className="mb-2 text-sm font-medium text-black/60">
          Happy Customers
        </p>
        <h2 className="mb-16 text-4xl font-bold tracking-tight text-black sm:text-5xl">
          What they&apos;re saying
        </h2>

        <div className="relative w-full">
          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            className="absolute top-[45%] left-2 z-10 -translate-y-1/2 p-2 text-black transition-colors hover:text-black sm:left-4 md:left-6 lg:left-10"
            aria-label="Previous review"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Review Text */}
          <div className="mx-auto max-w-5xl px-12 sm:px-16">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {reviews.map((review, idx) => (
                  <div key={idx} className="w-full shrink-0 px-4">
                    <p className="mx-auto max-w-4xl text-xl font-light text-black/90 sm:text-2xl md:text-[1.75rem] md:leading-normal">
                      {review.text}
                    </p>
                    <p className="mt-12 text-sm font-semibold text-black/80">
                      {review.author}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            className="absolute top-[45%] right-2 z-10 -translate-y-1/2 p-2 text-black transition-colors hover:text-black sm:right-4 md:right-6 lg:right-10"
            aria-label="Next review"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dots */}
        {/* The dot stays 6px; the button around it is 24px so it can
            actually be tapped. */}
        <div className="mt-12 flex justify-center">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.preventDefault();
                setCurrentSlide(idx);
              }}
              className="flex h-6 w-6 items-center justify-center"
              aria-label={`Go to slide ${idx + 1}`}
            >
              <span
                className={`block h-1.5 w-1.5 rounded-full transition-colors ${
                  currentSlide === idx
                    ? 'bg-[#f95738]'
                    : 'bg-black/10 hover:bg-black/20'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
