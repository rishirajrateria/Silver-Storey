'use client';

import { useState, useEffect, useRef } from 'react';

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Counts up to `target` over `duration` ms once the returned `ref` element
 * enters the viewport. The animation runs only once.
 *
 * The displayed value starts AT the target: the server-rendered HTML (and any
 * crawler that reads it without running JavaScript) carries the real figure,
 * and the count-up is only a flourish that plays once the element is on
 * screen.
 */
export function useCountUp(target: number, duration = 2000) {
  const [value, setValue] = useState(target);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();

          const tick = (now: number) => {
            const t = Math.min((now - startTime) / duration, 1);
            setValue(Math.floor(easeOutCubic(t) * target));
            if (t < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { value, ref };
}
