import type { NextConfig } from 'next';

const ONE_YEAR = 'public, max-age=31536000, immutable';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**.blob.vercel-storage.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
  },
  /**
   * The residential and commercial project landing pages were retired; their
   * work now lives in the room galleries. A permanent redirect keeps old
   * Google results, brochures and shared links working, and hands the pages'
   * existing ranking to /gallery rather than throwing it away on a 404.
   */
  async redirects() {
    return [
      // Crawlers and people try /sitemap.xml first; the split sitemaps live
      // behind an index, so send them there rather than to a 404.
      {
        source: '/sitemap.xml',
        destination: '/sitemap-index.xml',
        permanent: true,
      },
      {
        source: '/residential-projects',
        destination: '/gallery',
        permanent: true,
      },
      {
        source: '/commercial-projects',
        destination: '/gallery',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      // Static media in /public never changes without a new filename → cache for a year.
      {
        source: '/videos/:path*',
        headers: [{ key: 'Cache-Control', value: ONE_YEAR }],
      },
      {
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: ONE_YEAR }],
      },
      {
        source: '/:file(favicon.ico|home_logo.avif)',
        headers: [{ key: 'Cache-Control', value: ONE_YEAR }],
      },
      // Sitemaps, robots and llms.txt: cache at the edge for an hour.
      {
        source: '/:file(robots.txt|llms.txt|llms-full.txt|sitemap-index.xml)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400',
          },
        ],
      },
      {
        source: '/sitemap/:id.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400',
          },
        ],
      },
      // Security/perf hygiene headers on everything.
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
    ];
  },
};

export default nextConfig;
