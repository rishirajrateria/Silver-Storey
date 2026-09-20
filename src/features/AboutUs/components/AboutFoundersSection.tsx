import React from 'react';
import { founders } from '../../Hero/constants';

const bios: Record<string, string> = {
  'Palak Singhania':
    'With over 9 years of experience, she holds a degree from the J.D Birla Institute creating bespoke designs. Known for her sophisticated use of natural light, innovative space planning and unique designing emphasizing sustainable and timeless design principles. Artist and designer Palak Singhania has professionally transformed a variety of spaces, including residential and commercial. She loves how, \u2018No two projects are the same\u2019. She is a distinguished Interior Designer known for her unique blend of modern minimalism and classic elegance.',
  'Subham Bhattacharya':
    'Subham Bhattacharya, a distinguished Civil Engineer and seasoned entrepreneur, has carved a remarkable niche in the realms of construction. His journey is characterised by a blend of technical expertise, leadership acumen, and entrepreneurial spirit. Upon graduation, Subham embarked on his professional journey, initially gaining practical experience with leading construction firms. His roles exposed him to diverse facets of project execution to site management, fostering a deep understanding of the industry.',
};

export default function AboutFoundersSection() {
  return (
    <div className="cursor-default bg-neutral-300 pt-16 pb-16 text-center sm:pt-24 sm:pb-24">
      <h2 className="mb-12 text-3xl font-light tracking-wide text-black sm:mb-16 sm:text-4xl">
        Our Creative Founders
      </h2>

      {/* Mobile marquee — names only, same as FoundersSection */}
      <div className="overflow-hidden sm:hidden">
        <div
          className="flex hover:[animation-play-state:paused]"
          style={{ animation: 'marquee 30s linear infinite' }}
        >
          {/* Copy 1 */}
          <div className="flex shrink-0 gap-6 pr-6">
            {[...founders, ...founders, ...founders, ...founders].map(
              (founder, i) => (
                <div
                  key={i}
                  className="flex w-[220px] shrink-0 flex-col items-center"
                >
                  <div className="aspect-4/5 w-full overflow-hidden rounded-3xl bg-black/5 shadow-md">
                    <img
                      loading="lazy"
                      decoding="async"
                      src={founder.image}
                      alt={founder.alt}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="mt-4 text-center text-base leading-tight font-bold text-black">
                    {founder.firstName}
                    <br />
                    {founder.lastName}
                  </div>
                </div>
              ),
            )}
          </div>
          {/* Copy 2 — seamless loop */}
          <div className="flex shrink-0 gap-6 pr-6">
            {[...founders, ...founders, ...founders, ...founders].map(
              (founder, i) => (
                <div
                  key={`clone-${i}`}
                  className="flex w-[220px] shrink-0 flex-col items-center"
                >
                  <div className="aspect-4/5 w-full overflow-hidden rounded-3xl bg-black/5 shadow-md">
                    <img
                      loading="lazy"
                      decoding="async"
                      src={founder.image}
                      alt={founder.alt}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="mt-4 text-center text-base leading-tight font-bold text-black">
                    {founder.firstName}
                    <br />
                    {founder.lastName}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Desktop grid — with bio text */}
      <div className="mx-auto hidden max-w-280 px-6 sm:block">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-8 md:gap-16">
          {founders.map((founder) => (
            <div key={founder.alt} className="flex flex-col items-center">
              <div className="aspect-4/5 w-full max-w-md overflow-hidden rounded-3xl bg-black/5 shadow-md transition-transform hover:scale-[1.01]">
                <img
                  loading="lazy"
                  decoding="async"
                  src={founder.image}
                  alt={founder.alt}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-6 text-lg leading-tight font-bold text-black sm:text-xl md:text-2xl">
                {founder.firstName} {founder.lastName}
              </div>
              {bios[founder.alt] && (
                <p className="mt-4 max-w-md text-sm leading-relaxed font-medium text-black/70 sm:text-base">
                  {bios[founder.alt]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
