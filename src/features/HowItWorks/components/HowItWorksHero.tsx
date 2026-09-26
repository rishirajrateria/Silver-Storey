import React from 'react';
import Breadcrumbs, { type Crumb } from '@/components/seo/Breadcrumbs';
import { SITE } from '@/lib/seo/site';

export default function HowItWorksHero({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <section className="cursor-default px-6 pt-12 pb-20 sm:pt-16 sm:pb-28">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs items={crumbs} />
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
          {/* Left — text */}
          <div className="flex flex-col items-start lg:w-[42%]">
            <h1 className="mb-6 text-5xl leading-tight font-bold tracking-tight text-black sm:text-6xl lg:text-7xl">
              How It Works: Our 6-Step Process
            </h1>
            <p className="mb-10 max-w-md text-sm leading-relaxed font-medium text-black/60 sm:text-base">
              Six steps from a free consultation to handover within{' '}
              {SITE.stats.deliveryDays} days of design approval — with every
              room approved in 3D before anything is built.
            </p>
            <a
              href="#process"
              className="rounded-full border border-black/80 bg-transparent px-8 py-2.5 text-sm font-medium text-black transition-colors hover:bg-black hover:text-white"
            >
              Read the six steps
            </a>
          </div>

          {/* Right — image */}
          <div className="relative w-full overflow-hidden rounded-2xl shadow-lg lg:w-[58%]">
            <div className="relative aspect-video w-full bg-black">
              <img
                src="/images/4bhk.avif"
                alt="A Silver Storey 4BHK interior after handover"
                className="h-full w-full object-cover opacity-85"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
