import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/seo/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} — Interior Designers`,
    short_name: SITE.name,
    description: SITE.shortDescription,
    start_url: '/',
    display: 'standalone',
    background_color: '#ece5db',
    theme_color: '#000000',
    lang: 'en-IN',
    categories: ['business', 'lifestyle', 'shopping'],
    icons: [{ src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' }],
  };
}
