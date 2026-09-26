import type { TestimonialData } from '@/lib/db/content';
import type { Review } from '@/features/Hero/types';

/** Shape the slider expects: quote + attribution line. */
export function testimonialsToReviews(rows: TestimonialData[]): Review[] {
  return rows.map((t) => ({
    text: t.quote,
    author: [t.name, t.location, t.projectType].filter(Boolean).join(' · '),
  }));
}

/** Only rows with a valid 1–5 rating feed Review/AggregateRating markup. */
export function testimonialsToSchema(rows: TestimonialData[]) {
  return rows
    .filter((t) => t.rating >= 1 && t.rating <= 5)
    .map((t) => ({
      name: t.name,
      rating: t.rating,
      quote: t.quote,
      date: t.createdAt.slice(0, 10),
    }));
}

/** Average of the valid ratings, to one decimal; null when there are none. */
export function averageRating(rows: TestimonialData[]): number | null {
  const rated = testimonialsToSchema(rows);
  if (!rated.length) return null;
  const sum = rated.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / rated.length) * 10) / 10;
}

/** "2026-09-26T10:00:00.000Z" → "September 2026". Day-level precision is noise. */
export function reviewMonth(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });
}

/** Where a review came from, in the reader's words rather than the CMS key. */
export function reviewSourceLabel(source: string): string {
  switch (source) {
    case 'google':
      return 'Google review';
    case 'direct':
      return 'Shared with the studio';
    default:
      return 'Client review';
  }
}
