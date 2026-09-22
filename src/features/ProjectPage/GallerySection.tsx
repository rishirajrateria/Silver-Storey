'use client';

import React from 'react';
import type { GalleryProject } from './gallery-types';

function GalleryCard({ project }: { project: GalleryProject }) {
  return (
    <div className="relative h-[55vh] w-65 shrink-0 overflow-hidden rounded-2xl shadow-lg sm:h-[60vh] sm:w-75 md:w-80">
      <img
        loading="lazy"
        decoding="async"
        src={project.image}
        alt={project.title}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 p-5">
        <h3 className="mb-1 text-lg leading-snug font-bold text-white">
          {project.title}
        </h3>
        <p className="text-sm leading-snug text-white/80">
          {project.description}
        </p>
      </div>
    </div>
  );
}

interface GallerySectionProps {
  /** Gallery items from the CMS. */
  projects: GalleryProject[];
  /** Admin-defined section heading — defaults to "Gallery" */
  title?: string;
}

export default function GallerySection({
  projects,
  title = 'Gallery',
}: GallerySectionProps) {
  return (
    <section className="overflow-hidden bg-[#f4f4f4] pt-8 pb-10">
      <h2 className="mb-10 text-center text-3xl font-semibold tracking-tight text-black sm:text-4xl md:text-5xl">
        {title}
      </h2>

      {/* Marquee wrapper — hover pauses the animation */}
      <div className="overflow-hidden">
        <div
          className="flex hover:[animation-play-state:paused]"
          style={{ animation: 'marquee 30s linear infinite' }}
        >
          {/* Copy 1 */}
          <div className="flex shrink-0 gap-6 pr-6">
            {projects.map((p) => (
              <GalleryCard key={p.id} project={p} />
            ))}
          </div>
          {/* Copy 2 — seamless loop */}
          <div className="flex shrink-0 gap-6 pr-6">
            {projects.map((p) => (
              <GalleryCard key={`clone-${p.id}`} project={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
