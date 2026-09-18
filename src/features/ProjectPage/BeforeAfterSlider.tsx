'use client';

import React, { useCallback, useRef, useState } from 'react';

/**
 * Drag-to-compare slider. The "after" image sits underneath; the "before"
 * image is clipped to the left of the handle. Works with mouse, touch and
 * keyboard (arrow keys on the range input).
 */
export default function BeforeAfterSlider({
  before,
  after,
  alt,
}: {
  before: string;
  after: string;
  alt: string;
}) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }, []);

  return (
    <div
      ref={ref}
      className="relative aspect-[16/10] w-full touch-none overflow-hidden rounded-2xl bg-black/10 select-none"
      onPointerDown={(e) => {
        dragging.current = true;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        setFromClientX(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && setFromClientX(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <img
        src={after}
        alt={`${alt} — after`}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${pos}%` }}
      >
        <img
          src={before}
          alt={`${alt} — before`}
          className="absolute inset-0 h-full w-full max-w-none object-cover"
          style={{ width: ref.current?.clientWidth ?? '100%' }}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div
        aria-hidden
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow"
        style={{ left: `calc(${pos}% - 1px)` }}
      >
        <span className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-lg">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M8 6l-5 6 5 6M16 6l5 6-5 6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      <span className="absolute top-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold tracking-wide text-white uppercase">
        Before
      </span>
      <span className="absolute top-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold tracking-wide text-white uppercase">
        After
      </span>

      <label className="sr-only" htmlFor="before-after-range">
        Compare before and after
      </label>
      <input
        id="before-after-range"
        type="range"
        min={0}
        max={100}
        value={Math.round(pos)}
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute inset-x-0 bottom-0 h-8 w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
