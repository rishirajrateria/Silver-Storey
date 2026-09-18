import React from 'react';

const rooms = [
  { label: '2 BHK', src: '/images/2bhk.avif' },
  { label: '3 BHK', src: '/images/3bhk.avif' },
  { label: '4 BHK', src: '/images/4bhk.avif' },
  { label: '5 BHK', src: '/images/5bhk.avif' },
] as const;

export default function RoomGallery() {
  return (
    <div className="mx-auto max-w-360 px-6 py-24 sm:py-32">
      {/* Header Row */}
      <div className="mb-20 flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-24">
        <h2 className="font-sans text-4xl leading-tight tracking-tight text-[#615147] sm:text-5xl lg:w-1/2">
          ESCAPE TO
          <br />
          TIMELESS LUXURY
        </h2>
        <div className="lg:w-1/2 lg:pl-16">
          <p className="mb-6 text-sm leading-relaxed font-medium text-black/70 sm:text-base">
            Use this space to promote the business, its products or its
            services. Help people become familiar with the business and its
            offerings, creating a sense of connection and trust.
          </p>
          <a
            href="/residential-projects"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-black uppercase transition-transform hover:translate-x-1"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            SEE OUR ROOMS
          </a>
        </div>
      </div>

      {/* Mobile marquee */}
      <div className="-mx-6 overflow-hidden sm:hidden">
        <div
          className="flex hover:[animation-play-state:paused]"
          style={{ animation: 'marquee 22s linear infinite' }}
        >
          <div className="flex shrink-0 gap-4 pr-4">
            {rooms.map((room) => (
              <div
                key={room.label}
                className="flex w-[200px] shrink-0 flex-col"
              >
                <h3 className="mb-3 font-sans text-base font-medium tracking-wide text-[#615147]">
                  {room.label}
                </h3>
                <div className="aspect-4/5 overflow-hidden rounded-xl shadow-sm">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={room.src}
                    alt={room.label}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex shrink-0 gap-4 pr-4">
            {rooms.map((room) => (
              <div
                key={`clone-${room.label}`}
                className="flex w-[200px] shrink-0 flex-col"
              >
                <h3 className="mb-3 font-serif text-base font-medium tracking-wide text-[#615147]">
                  {room.label}
                </h3>
                <div className="aspect-4/5 overflow-hidden rounded-xl shadow-sm">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={room.src}
                    alt={room.label}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Staggered Masonry Grid */}
      <div className="hidden grid-cols-2 items-start gap-4 sm:grid md:grid-cols-4 lg:gap-6">
        {/* 2 BHK */}
        <div className="flex flex-col pt-12">
          <h3 className="mb-4 font-sans text-xl font-medium tracking-wide text-[#615147]">
            2 BHK
          </h3>
          <div className="aspect-4/5 w-full overflow-hidden bg-black/5 text-center shadow-sm">
            <img
              loading="lazy"
              decoding="async"
              src="/images/2bhk.avif"
              alt="2 BHK"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* 3 BHK */}
        <div className="flex flex-col">
          <h3 className="mb-4 font-sans text-xl font-medium tracking-wide text-[#615147]">
            3 BHK
          </h3>
          <div className="aspect-2/3 w-full overflow-hidden bg-black/5 text-center shadow-sm">
            <img
              loading="lazy"
              decoding="async"
              src="/images/3bhk.avif"
              alt="3 BHK"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* 4 BHK */}
        <div className="flex flex-col pt-8">
          <div className="mb-4 flex items-center gap-4">
            <h3 className="font-sans text-xl font-medium tracking-wide text-[#615147]">
              4 BHK
            </h3>
          </div>
          <div className="aspect-square w-full overflow-hidden bg-black/5 text-center shadow-sm">
            <img
              loading="lazy"
              decoding="async"
              src="/images/4bhk.avif"
              alt="4 BHK"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* 5 BHK */}
        <div className="flex flex-col pt-4">
          <h3 className="mb-4 font-sans text-xl font-medium tracking-wide text-[#615147]">
            5 BHK
          </h3>
          <div className="aspect-square w-full overflow-hidden bg-black/5 text-center shadow-sm sm:aspect-4/5">
            <img
              loading="lazy"
              decoding="async"
              src="/images/5bhk.avif"
              alt="5 BHK"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
