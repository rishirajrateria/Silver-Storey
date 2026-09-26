'use client';

import React from 'react';

export default function BookConsultation() {
  return (
    <div className="mx-auto max-w-360 cursor-default px-6 pt-24 pb-4 text-center sm:pt-32 md:pb-12">
      <h2 className="mb-4 text-4xl font-semibold tracking-wide sm:text-5xl lg:text-6xl">
        Book your free Consultation
      </h2>
      <p className="mb-8 text-sm font-medium text-black/70 sm:text-base">
        It&apos;s time to live your dreams!
      </p>
      <a
        href="https://calendly.com/silverstorey/30min"
        target="_blank"
        rel="noopener noreferrer"
        className="animate-bounce rounded-full border border-black bg-transparent px-8 py-2.5 text-sm font-medium transition-colors [animation-duration:1.8s] [animation-timing-function:ease-in-out] hover:bg-black hover:text-white"
      >
        Book Now
      </a>
    </div>
  );
}
