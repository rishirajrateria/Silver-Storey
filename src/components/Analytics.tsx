'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * First-party page-view tracker. No cookies and no local storage, so it needs
 * no consent banner. Fires once per path change and never blocks rendering.
 */
export default function Analytics() {
  const pathname = usePathname();
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    // Guard against React re-running the effect for the same path.
    if (lastSent.current === pathname) return;
    lastSent.current = pathname;

    // Never record admin activity as site traffic.
    if (pathname.startsWith('/admin')) return;

    const payload = JSON.stringify({
      path: pathname,
      referrer: document.referrer || undefined,
    });

    const send = () => {
      try {
        const blob = new Blob([payload], { type: 'application/json' });
        // sendBeacon survives the page being closed mid-request.
        if (navigator.sendBeacon?.('/api/track', blob)) return;
      } catch {
        // fall through to fetch
      }
      void fetch('/api/track', {
        method: 'POST',
        body: payload,
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      }).catch(() => {});
    };

    // Yield to the browser so tracking never competes with rendering.
    const idle = (
      window as Window &
        typeof globalThis & {
          requestIdleCallback?: (
            cb: () => void,
            opts?: { timeout: number },
          ) => number;
          cancelIdleCallback?: (id: number) => void;
        }
    ).requestIdleCallback;

    if (typeof idle === 'function') {
      const id = idle(send, { timeout: 2000 });
      return () => {
        (
          window as Window & { cancelIdleCallback?: (id: number) => void }
        ).cancelIdleCallback?.(id);
      };
    }

    const timer = window.setTimeout(send, 400);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}
