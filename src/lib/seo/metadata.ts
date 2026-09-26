import type { Metadata } from 'next';
import { SITE, absoluteUrl } from './site';

export { SITE };

export type BuildMetadataInput = {
  title: string;
  description: string;
  /** Path starting with `/`. Used for canonical + og:url. */
  path: string;
  /**
   * Accepted for call-site compatibility but no longer emitted: search
   * engines have ignored the keywords meta tag for years and it only
   * advertised the target phrases to competitors.
   */
  keywords?: string[];
  /** Absolute or site-relative image URL. Defaults to the dynamic OG image. */
  image?: string;
  /**
   * Real pixel dimensions of `image`. When omitted for a supplied image the
   * tags carry no size rather than a false 1200×630 claim; the generated OG
   * image is always 1200×630.
   */
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
};

/** Google shows roughly this many characters of a title on desktop. */
const MAX_TITLE = 65;
/** Descriptions past this are cut in the SERP; ours end on a sentence instead. */
const MAX_DESC = 155;

const BRAND_SUFFIX = /\s*[|–—-]\s*Silver Storey\s*$/i;

/** Cut at a word boundary, never mid-word. */
function cutAtWord(text: string, max: number): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max + 1);
  const lastSpace = slice.lastIndexOf(' ');
  return (
    lastSpace > max * 0.5 ? slice.slice(0, lastSpace) : text.slice(0, max)
  )
    .replace(/[\s,;:–—-]+$/, '')
    .trimEnd();
}

/**
 * Titles keep the brand. A long title used to be chopped at 70 characters
 * from the right, which turned "… – Silver Storey" into "… – Silver" on a
 * few hundred pages. Now the leading phrase is what gets shortened, at a
 * word boundary, and the brand suffix is re-attached whole.
 */
export function fitTitle(title: string): string {
  const clean = title.replace(/\s+/g, ' ').trim();
  if (clean.length <= MAX_TITLE) return clean;

  const hasBrand = BRAND_SUFFIX.test(clean);
  const lead = clean.replace(BRAND_SUFFIX, '');
  const suffix = hasBrand ? ' | Silver Storey' : '';
  const room = MAX_TITLE - suffix.length;

  // Prefer dropping a trailing "| secondary phrase" segment before cutting words.
  const segments = lead.split(/\s*[|–—]\s*/);
  while (segments.length > 1 && segments.join(' | ').length > room) {
    segments.pop();
  }
  const lead2 = segments.join(' | ');
  // Prefer ending before a joining word ("in", "and", "for", "of") so a place
  // name is never split; fall back to any word boundary.
  const phrase = lead2.slice(0, room + 1);
  const joiner = Math.max(
    ...[' in ', ' and ', ' for ', ' of ', ', ', ' & '].map((j) =>
      phrase.lastIndexOf(j),
    ),
  );
  const shortened =
    joiner > room * 0.5
      ? phrase.slice(0, joiner).trimEnd()
      : cutAtWord(lead2, room);
  return `${shortened}${suffix}`;
}

/**
 * Descriptions end on a sentence when one fits, otherwise at a word with an
 * ellipsis — never mid-word, and never so short the unique clause is lost.
 */
export function fitDescription(description: string): string {
  const clean = description.replace(/\s+/g, ' ').trim();
  if (clean.length <= MAX_DESC) return clean;

  const window = clean.slice(0, MAX_DESC);
  // A full stop only ends a sentence when followed by a space or the end —
  // "₹1.4 lakh" and "2.5 L" must not be cut to "₹1." and "2.".
  let sentenceEnd = -1;
  for (const m of window.matchAll(/[.!?](?=\s|$)/g))
    sentenceEnd = m.index ?? -1;
  // Keep the sentence cut only when it leaves most of the budget in use.
  if (sentenceEnd >= MAX_DESC * 0.6) {
    return clean.slice(0, sentenceEnd + 1).trim();
  }
  return `${cutAtWord(clean, MAX_DESC - 1)}…`;
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
    image,
    imageWidth,
    imageHeight,
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
  const finalTitle = fitTitle(title);
  const desc = fitDescription(description);

  const ogImage = image
    ? absoluteUrl(image)
    : absoluteUrl(
        `/api/og?title=${encodeURIComponent(title.replace(BRAND_SUFFIX, ''))}`,
      );
  // Only claim dimensions we know: the generated image is always 1200×630;
  // a supplied image carries what the caller measured, or nothing.
  const ogDims = image
    ? imageWidth && imageHeight
      ? { width: imageWidth, height: imageHeight }
      : {}
    : { width: 1200, height: 630 };

  return {
    // `absolute` bypasses the root layout's "%s | Silver Storey" template so
    // hand-crafted titles are never double-suffixed.
    title: { absolute: finalTitle },
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: finalTitle,
      description: desc,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      type,
      images: [{ url: ogImage, ...ogDims, alt: imageAlt ?? finalTitle }],
      ...(type === 'article'
        ? { publishedTime, modifiedTime, authors, section, tags }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: desc,
      images: [ogImage],
    },
    robots: noIndex
      ? // Unindexed pages still pass link equity to what they link to.
        { index: false, follow: true }
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
