import type { FAQ } from '@/lib/seo/schema';
import { formatINR } from '@/lib/locations/content';
import { SERVICE_BY_SLUG } from '@/lib/services';
import { SITE } from '@/lib/seo/site';

/** Starting price of a service, formatted — read from the catalogue, never typed. */
export function startingPrice(slug: string): string {
  return formatINR(SERVICE_BY_SLUG[slug]?.startingPriceINR ?? 0);
}

/**
 * One list feeds both the FAQPage schema on the route and the visible
 * FAQSection. Figures come from the service catalogue so the answers can
 * never disagree with the tables above them.
 */
export const PRICING_FAQS: FAQ[] = [
  {
    question: 'Is there a design fee?',
    answer: `No. ${SITE.commitment}`,
  },
  {
    question: 'What are the starting prices?',
    answer: `At the Kolkata baseline: dining room from ${startingPrice('dining-room-interiors')}, modular kitchen from ${startingPrice('modular-kitchen')}, bathroom from ${startingPrice('bathroom-interiors')}, home office from ${startingPrice('home-office-interiors')}, bedroom from ${startingPrice('bedroom-interiors')} and living room from ${startingPrice('living-room-interiors')}. Full 2BHK homes start at ${startingPrice('2bhk-interior-design')} and 3BHK homes at ${startingPrice('3bhk-interior-design')}.`,
  },
  {
    question: 'Are there hidden charges?',
    answer:
      'No. The itemised quote you approve is the amount you pay; any change requested later is priced and approved in writing before it is done.',
  },
  {
    question: 'What payment schedule do you follow?',
    answer: `${SITE.payment.token}. Modular work: ${SITE.payment.modular}. On-site work: ${SITE.payment.onsite}.`,
  },
  {
    question: 'Why is the price a range rather than a rate per square foot?',
    answer:
      'Because we price the itemised scope — the number of units, their sizes, the finish grade and the site work — not the carpet area. Two homes of the same size can differ by lakhs depending on how much storage and civil work they need, so a per-sq-ft rate would overcharge one or hide extras from the other. The range shows where Essential, Premium and Luxury finishes fall.',
  },
  {
    question: 'Do the prices change outside Kolkata?',
    answer:
      'The tables are the Kolkata baseline. Other cities run at roughly 0.85 to 1.2 times these figures by our published city index, which the estimate calculator and each city page apply automatically.',
  },
];
