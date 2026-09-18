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
