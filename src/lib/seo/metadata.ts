import type { Metadata } from 'next';
import { SITE, absoluteUrl, PRIMARY_KEYWORDS } from './site';

export { SITE };

export type BuildMetadataInput = {
  title: string;
  description: string;
  /** Path starting with `/`. Used for canonical + og:url. */
  path: string;
  keywords?: string[];
  /** Absolute or site-relative image URL. Defaults to the dynamic OG image. */
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
};

const MAX_TITLE = 70;
const MAX_DESC = 158;

function clamp(text: string, max: number, ellipsis = true): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  const base = cut.slice(0, lastSpace > 20 ? lastSpace : max - 1).trimEnd();
  return ellipsis ? `${base}…` : base;
}

/**
 * Builds a complete, consistent `Metadata` object (title, description,
 * canonical, Open Graph, Twitter, robots) for any page.
 */
export function buildMetadata(input: BuildMetadataInput): Metadata {
  const {
    title,
    description,
    path,
    keywords = [],
    image,
    imageAlt,
    type = 'website',
    noIndex = false,
    publishedTime,
    modifiedTime,
    authors,
    section,
    tags,
  } = input;

  const url = absoluteUrl(path);
  const ogImage = image
    ? absoluteUrl(image)
    : absoluteUrl(
        `/api/og?title=${encodeURIComponent(title.replace(/\s*[|–-]\s*Silver Storey\s*$/i, ''))}`,
      );
  const desc = clamp(description, MAX_DESC);

  return {
    // `absolute` bypasses the root layout's "%s | Silver Storey" template so
    // hand-crafted titles are never double-suffixed.
    title: { absolute: clamp(title, MAX_TITLE, false) },
    description: desc,
    keywords: Array.from(new Set([...keywords, ...PRIMARY_KEYWORDS])),
    alternates: { canonical: url },
    openGraph: {
      title,
      description: desc,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: imageAlt ?? title,
        },
      ],
      ...(type === 'article'
        ? { publishedTime, modifiedTime, authors, section, tags }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
  };
}
