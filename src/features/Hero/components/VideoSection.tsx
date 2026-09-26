'use client';

import React, { useState } from 'react';
import type { VideoItem as CmsVideo } from '../../../lib/db/content';

interface VideoItem {
  id: string;
  title: string;
  youtubeId: string;
}

function VideoCard({
  title,
  youtubeId,
  isPlaying,
  onPlay,
}: VideoItem & { isPlaying: boolean; onPlay: () => void }) {
  const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeId}`;

  return (
    <div className="relative aspect-video w-72 shrink-0 overflow-hidden rounded-2xl bg-black shadow-lg sm:w-80 md:w-96">
      {isPlaying ? (
        <>
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
            className="h-full w-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title={title}
          />
          {/* Close button */}
          <button
            onClick={onPlay}
            className="absolute top-2 right-2 z-10 rounded-full bg-black/60 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-black/90"
            aria-label="Stop video"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="h-4 w-4"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </>
      ) : (
        <button
          onClick={onPlay}
          className="group relative h-full w-full cursor-pointer"
          aria-label={`Play ${title}`}
        >
          {/* Thumbnail — YouTube's hqdefault is always 480×360 */}
          <img
            loading="lazy"
            decoding="async"
            src={thumbnailUrl}
            alt={title}
            width={480}
            height={360}
            className="h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-95"
          />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-12 w-16 items-center justify-center rounded-xl bg-red-600 shadow-lg transition-transform group-hover:scale-110">
              <svg viewBox="0 0 24 24" fill="white" className="h-6 w-6">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          {/* Top bar — title + expand icon */}
          <div className="absolute top-0 left-0 flex w-full items-start justify-between bg-linear-to-b from-black/80 to-transparent p-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 overflow-hidden rounded-full">
                <img
                  loading="lazy"
                  decoding="async"
                  src="/images/home_logo.avif"
                  alt="Silver Storey"
                  width={78}
                  height={78}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="text-left">
                <p className="line-clamp-1 text-xs font-medium text-white">
                  {title}
                </p>
                <p className="text-xs text-white/70">Silver Storey</p>
              </div>
            </div>

            {/* Expand — opens YouTube in new tab */}
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="rounded-md bg-black/50 p-1.5 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/80 hover:text-white"
              aria-label="Open on YouTube"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
              >
                <path d="M15 3h6v6" />
                <path d="M10 14L21 3" />
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              </svg>
            </a>
          </div>

          {/* Bottom bar */}
          <div className="absolute bottom-0 left-0 flex w-full items-center justify-end bg-linear-to-t from-black/80 to-transparent p-3">
            <div className="flex items-center gap-1 rounded-sm bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
              Watch on <span className="ml-1 font-bold">YouTube</span>
            </div>
          </div>
        </button>
      )}
    </div>
  );
}

/**
 * A seamless marquee needs a second copy of the strip, so every film appears
 * twice. With fewer films than this the strip would be shorter than the
 * viewport and scroll past a gap, so the cards sit in a static row instead —
 * and nothing is ever repeated to pad the strip out.
 */
const MIN_FOR_MARQUEE = 3;

interface VideoSectionProps {
  videos?: CmsVideo[];
}

export default function VideoSection({ videos = [] }: VideoSectionProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);

  // No films published yet: the section says nothing rather than something
  // made up.
  if (videos.length === 0) return null;

  const items: VideoItem[] = videos.map((v) => ({
    id: v.id,
    title: v.title,
    youtubeId: v.youtubeId,
  }));

  function handlePlay(instanceId: string) {
    setPlayingId((prev) => (prev === instanceId ? null : instanceId));
  }

  const renderStrip = (copy: string) =>
    items.map((v) => {
      const instanceId = `${copy}-${v.id}`;
      return (
        <VideoCard
          key={instanceId}
          {...v}
          isPlaying={playingId === instanceId}
          onPlay={() => handlePlay(instanceId)}
        />
      );
    });

  return (
    <section className="overflow-hidden py-24 sm:py-32">
      <h2 className="mb-10 text-center text-3xl font-semibold tracking-tight text-black sm:text-4xl md:text-5xl">
        Our Projects
      </h2>

      {items.length >= MIN_FOR_MARQUEE ? (
        <div className="overflow-hidden">
          <div
            className="flex"
            style={{
              animation: 'marquee 30s linear infinite',
              animationPlayState: playingId ? 'paused' : 'running',
            }}
          >
            {/* Copy 1 */}
            <div className="flex shrink-0 gap-6 pr-6 pl-6">
              {renderStrip('orig')}
            </div>
            {/* Copy 2 — seamless loop */}
            <div className="flex shrink-0 gap-6 pr-6">
              {renderStrip('clone')}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-6 px-6">
          {renderStrip('orig')}
        </div>
      )}
    </section>
  );
}
