import type { NextConfig } from 'next';

const ONE_YEAR = 'public, max-age=31536000, immutable';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
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
