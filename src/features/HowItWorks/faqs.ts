import type { FAQ } from '@/lib/seo/schema';
import { SITE } from '@/lib/seo/site';

/**
 * One list feeds both the FAQPage schema on the route and the visible
 * FAQSection, so the markup never claims an answer the page does not show.
 */
export const HOW_IT_WORKS_FAQS: FAQ[] = [
  {
    question: 'How long does a Silver Storey project take?',
    answer: `Your home is handed over within ${SITE.stats.deliveryDays} days of design approval. Modular units are manufactured in our ${SITE.address.city} workshop while site work proceeds in parallel, which is what keeps the timeline short. The design stage before approval depends on how quickly we agree the layout and finishes together.`,
  },
  {
    question: 'Is the 3D visualisation really free?',
    answer: `Yes. ${SITE.commitment}`,
  },
  {
    question: 'When do I pay?',
    answer: `${SITE.payment.token}. After you approve the design and sign the contract, modular work is paid ${SITE.payment.modular}, and on-site work is paid ${SITE.payment.onsite}.`,
  },
  {
    question: 'What if I want to change the design?',
    answer:
      'Before approval, change as much as you like — layouts, finishes and units are revised in 3D until you are happy, at no cost. After approval the drawings become the production set, so a later change is priced and agreed in writing before it is made.',
  },
  {
    question: 'Do you work outside Kolkata?',
    answer: SITE.serviceModel.outstation,
  },
  {
    question: 'What is a turnkey interior project?',
    answer:
      'One studio takes responsibility for the whole job — design, manufacturing, site work and handover — so you deal with one itemised quote and one project manager instead of a carpenter, an electrician and a painter separately. Every Silver Storey home is delivered this way.',
  },
];
