import React from 'react';
import Link from 'next/link';
import ProcessStepCard from './ProcessStepCard';
import { processSteps } from '../constants';

export default function WarrantySection() {
  return (
    <div className="relative mt-8">
      {/* Process Steps Grid */}
      <div className="relative mx-auto max-w-360 px-4 sm:px-8 md:px-16 lg:px-48">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 lg:gap-6">
          {processSteps.map((step) => (
            <ProcessStepCard
              key={step.name}
              name={step.name}
              label={step.label}
              image={step.image}
            />
          ))}
        </div>
      </div>

      {/* Features & Warranty Section */}
      <div className="mx-auto mt-16 max-w-360 px-6 pt-16 pb-8 text-center hover:cursor-default sm:pt-20 sm:pb-10">
        <h2 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
          10 Years of Warranty !
        </h2>
        <Link
          href="/how-it-works"
          className="rounded-full border border-black bg-transparent px-8 py-2.5 text-sm font-medium text-black transition-colors hover:bg-black hover:text-white"
        >
          How It Works
        </Link>
      </div>

      <div className="relative mt-12 flex flex-col items-center justify-center gap-12 lg:flex-row lg:items-center lg:gap-8">
        {/* Left Texts */}
        <div className="flex w-full flex-col justify-center gap-24 text-center lg:w-1/3 lg:py-0 lg:text-center">
          <div>
            <h3 className="mb-3 text-lg font-semibold tracking-wide">
              Experience 3D Visualization
            </h3>
            <p className="text-sm font-medium text-black/70">
              Experience 3D visualization of your <br /> project before it
              begins.
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-lg font-semibold tracking-wide">
              Guarantee 45 Days Delivery
            </h3>
            <p className="text-sm font-medium text-black/70">
              We ensure your order is delivered within <br />
              45 days period.**
            </p>
          </div>
        </div>

        {/* Center Laptop */}
        <div className="relative w-full max-w-[260px] sm:max-w-sm md:max-w-md lg:w-1/3 lg:max-w-none">
          <div className="relative aspect-16/10 overflow-hidden rounded-t-xl border-4 border-b-8 border-black bg-black shadow-2xl sm:rounded-t-2xl sm:border-6 sm:border-b-12 md:rounded-t-3xl md:border-8 md:border-b-14">
            <img
              loading="lazy"
              decoding="async"
              src="/images/laptop.avif"
              alt="Interior preview screen"
              width={755}
              height={483}
              className="h-full w-full object-cover"
            />
          </div>
          {/* Laptop Base */}
          <div className="mx-auto h-3 w-[115%] -translate-x-[6%] rounded-t-sm rounded-b-xl bg-black sm:h-4 md:h-3"></div>
        </div>

        {/* Right Texts */}
        <div className="flex w-full flex-col justify-center gap-24 text-center lg:w-1/3 lg:py-0 lg:text-center">
          <div>
            <h3 className="mb-3 text-lg font-semibold tracking-wide">
              Price Match Guarantee
            </h3>
            <p className="text-sm font-medium text-black/70">
              At the end of your Project , You pay exactly <br />
              what we quote initially**
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-lg font-semibold tracking-wide">
              Transparency In Every Step
            </h3>
            <p className="text-sm font-medium text-black/70">
              Complete transparency throughout <br />
              the entire process.
            </p>
          </div>
        </div>
      </div>

      {/* The ** above promise a footnote; this is it. */}
      <p className="mx-auto mt-12 max-w-3xl px-6 text-center text-xs leading-relaxed text-black/55">
        ** Delivery counted from final design approval and site readiness; the
        quote is fixed once you approve the design and scope — changes you
        request are quoted separately. See the{' '}
        <Link
          href="/terms-conditions"
          className="underline underline-offset-2 hover:text-black"
        >
          Terms &amp; Conditions
        </Link>
        .
      </p>
    </div>
  );
}
