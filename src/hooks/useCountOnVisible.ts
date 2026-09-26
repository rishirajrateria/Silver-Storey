import { useEffect, useRef, useState } from 'react';

/**
 * Counts up to `target` once the element scrolls into view.
 *
 * The figure starts AT the target, so the server markup — and anything that
 * never runs the script, which is every AI crawler — carries the real number.
 * The client winds it back to zero only once an observer exists to bring it
 * back, and not at all for people who asked their OS for less motion.
 */
export function useCountOnVisible<T extends HTMLElement = HTMLElement>(
  target: number,
  duration = 800,
) {
  const ref = useRef<T | null>(null);
  const [value, setValue] = useState(target);
  const [visible, setVisible] = useState(true);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    startedRef.current = false;
    let frame = 0;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            setVisible(true);
            const start = performance.now();
            const ease = (t: number) => 1 - Math.pow(1 - t, 3);

            const step = (now: number) => {
              const t = Math.min(1, (now - start) / duration);
              setValue(Math.round(ease(t) * target));
              if (t < 1) frame = requestAnimationFrame(step);
            };

            frame = requestAnimationFrame(step);
          }
        });
      },
      { threshold: 0.2 },
    );

    setVisible(false);
    setValue(0);
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target, duration]);

  return { ref, value, visible } as const;
}
