import React from 'react';
import { SITE, brandStatement } from '@/lib/seo/site';
import { founders } from '../constants';

// The founding sentence only — the intro higher up the page already carries
// the delivery and warranty clause — followed by where the work is done.
const ABOUT = `${brandStatement().split('. ')[0]}. ${SITE.serviceModel.hq}`;

function FounderCard({
  founder,
  nameClass,
}: {
  founder: (typeof founders)[number];
  nameClass: string;
}) {
  return (
    <>
      <div className="aspect-4/5 w-full overflow-hidden rounded-3xl bg-black/5 shadow-md">
        <img
          loading="lazy"
          decoding="async"
          src={founder.image}
          alt={founder.alt}
          width={624}
          height={624}
          className="h-full w-full object-cover"
        />
      </div>
      <div className={nameClass}>
        {founder.firstName}
        <br />
        {founder.lastName}
      </div>
      <p className="mt-2 text-sm text-black/60">{founder.role}</p>
    </>
  );
}

export default function FoundersSection({
  brochureUrl,
}: {
  brochureUrl?: string;
}) {
  return (
    <div className="cursor-default bg-white pt-0 pb-16 text-center sm:pb-24">
      <h2 className="mb-12 text-3xl font-light tracking-wide text-black sm:mb-16 sm:text-4xl">
        Our Creative Founders
      </h2>

      {/* Mobile marquee */}
      <div className="overflow-hidden sm:hidden">
        <div
          className="flex hover:[animation-play-state:paused]"
          style={{ animation: 'marquee 30s linear infinite' }}
        >
          {(['orig', 'clone'] as const).map((copy) => (
            <div key={copy} className="flex shrink-0 gap-6 pr-6">
              {[...founders, ...founders, ...founders, ...founders].map(
                (founder, i) => (
                  <div
                    key={`${copy}-${i}`}
                    className="flex w-[220px] shrink-0 flex-col items-center"
                  >
                    <FounderCard
                      founder={founder}
                      nameClass="mt-4 text-center text-base leading-tight font-bold text-black"
                    />
                  </div>
                ),
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop grid */}
      <div className="mx-auto hidden max-w-280 px-6 sm:block">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-8 md:gap-16">
          {founders.map((founder) => (
            <div key={founder.alt} className="flex flex-col items-center">
              <div className="w-full max-w-md transition-transform hover:scale-[1.01]">
                <FounderCard
                  founder={founder}
                  nameClass="mt-6 text-lg leading-tight font-bold text-black sm:text-xl md:text-2xl"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-4xl px-6">
        <p className="text-sm leading-relaxed font-medium text-black/70 sm:text-base">
          {ABOUT}
        </p>

        {/* Only offer the brochure when there is one to give. */}
        {brochureUrl && (
          <div className="mt-10">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto mb-8 h-8 w-8 text-black"
              aria-hidden="true"
            >
              <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
              <line x1="16" y1="8" x2="2" y2="22" />
              <line x1="17.5" y1="15" x2="9" y2="6.5" />
            </svg>

            <h2 className="font-regular -tracking-tightest mb-8 text-4xl text-black sm:text-5xl lg:text-6xl">
              Download Brochure
            </h2>

            <a
              href={brochureUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="rounded-full border border-black/80 bg-transparent px-8 py-2.5 text-sm font-medium text-black transition-colors hover:bg-black hover:text-white"
            >
              Download
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
