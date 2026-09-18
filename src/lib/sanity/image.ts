import imageUrlBuilder from '@sanity/image-url';
import { sanityClient } from './client';

const builder = imageUrlBuilder(sanityClient);

// Uses the builder's own inferred parameter type — avoids deep-import path issues
export function urlFor(source: Parameters<typeof builder.image>[0]) {
  // auto('format') lets Sanity's CDN serve WebP/AVIF to browsers that support it.
  return builder.image(source).auto('format');
}
