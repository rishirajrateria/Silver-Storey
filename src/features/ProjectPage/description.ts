import { markdownToPlainText } from '@/lib/markdown';
import { SITE } from '@/lib/seo/site';

/** Shorter than this and a description is a label ("3BHK"), not a summary. */
export const MIN_DESCRIPTION = 60;

/**
 * The opening of a case study as plain prose. Headings are dropped first so
 * "## The brief" does not fuse with the sentence after it, and the cut lands
 * on a word.
 */
export function summaryExcerpt(summary: string | undefined, max = 200): string {
  if (!summary) return '';
  const text = markdownToPlainText(summary.replace(/^#{1,6}\s.*$/gm, ''));
  if (text.length <= max) return text;
  const window = text.slice(0, max + 1);
  const lastSpace = window.lastIndexOf(' ');
  const cut =
    lastSpace > max / 2 ? window.slice(0, lastSpace) : text.slice(0, max);
  return `${cut.replace(/[\s,;:–—-]+$/, '')}…`;
}

/**
 * Meta and schema description for a project page. The hero sub-line is used
 * when it is a real sentence; the admin often fills it with a fragment like
 * "3BHK" that reads as a label, so anything that short falls through to the
 * story, and failing that to one honest sentence built from the studio's
 * own facts.
 */
export function projectDescription(page: {
  title: string;
  heroSubtitle?: string;
  summary?: string;
  location?: string;
}): string {
  const subtitle = page.heroSubtitle?.trim() ?? '';
  if (subtitle.length >= MIN_DESCRIPTION) return subtitle;
  const excerpt = summaryExcerpt(page.summary);
  if (excerpt.length >= MIN_DESCRIPTION) return excerpt;
  const where = page.location ? ` in ${page.location}` : '';
  return `${page.title}${where} — an interior design project designed and delivered by ${SITE.name}, with complimentary 3D visualisation, itemised pricing and a ${SITE.warranty.termYears}-year warranty on modular components and workmanship.`;
}
