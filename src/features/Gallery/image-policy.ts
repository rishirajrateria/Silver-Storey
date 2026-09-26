/**
 * Hosts the image optimiser is allowed to fetch from — the same list as
 * `images.remotePatterns` in next.config.ts. A photo from anywhere else (a
 * Sanity CDN URL left over from the migration, a link pasted into the admin)
 * is served untouched rather than crashing the page with an
 * "unconfigured host" error.
 */
const OPTIMISED_HOSTS = [/\.blob\.vercel-storage\.com$/i];

export function isOptimisable(src: string): boolean {
  // Same-origin files are fine; the generated OG cards are already sized.
  if (src.startsWith('/')) return !src.startsWith('/api/');
  try {
    const { protocol, hostname } = new URL(src);
    return (
      protocol === 'https:' && OPTIMISED_HOSTS.some((h) => h.test(hostname))
    );
  } catch {
    return false;
  }
}
