import React from 'react';

export default function HowItWorksHero() {
  return (
    <section className="cursor-default px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
          {/* Left — text */}
          <div className="flex flex-col items-start lg:w-[42%]">
            <h1 className="mb-6 text-5xl leading-tight font-bold tracking-tight text-black sm:text-6xl lg:text-7xl">
              How it Works&nbsp;!
            </h1>
            <p className="mb-10 max-w-md text-sm leading-relaxed font-medium text-black/60 sm:text-base">
              Transform your space effortlessly with our expert interior design
              services, tailored to reflect your unique style and vision
            </p>
            <button className="rounded-full border border-black/80 bg-transparent px-8 py-2.5 text-sm font-medium text-black transition-colors hover:bg-black hover:text-white">
              Get More Details
            </button>
          </div>

          {/* Right — video placeholder */}
          <div className="relative w-full overflow-hidden rounded-2xl shadow-lg lg:w-[58%]">
            <div className="relative aspect-video w-full bg-black">
              <img
                src="/images/4bhk.avif"
                alt="How it works video"
                className="h-full w-full object-cover opacity-85"
              />
              {/* Play button */}
              <button
                aria-label="Play video"
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/90 bg-black/20 backdrop-blur-sm transition-transform hover:scale-110">
                  <svg
                    viewBox="0 0 24 24"
                    fill="white"
                    className="ml-1 h-6 w-6"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
