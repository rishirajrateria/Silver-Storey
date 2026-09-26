import type { Stat, ProcessStep, ProcessPhase } from './types';
import { PROCESS_STEPS } from '@/lib/seo/process';
import { SITE } from '@/lib/seo/site';

export const QUOTE =
  'Our advice to those who have never worked with a designer, “We are here to make the process fun and simple for you! There is easy access these days to design tips and ideas, which is wonderful, but it can be stressful to try to incorporate that into your own space. Let the designer do that work and iron out details which you might not consider. We are happy to create space that are a reflection of you, forming comforting sentiments and place for the best memories to be made”';

// The same figures the schema and llms.txt publish, so the page never drifts.
export const stats: Stat[] = [
  { value: SITE.stats.happyCustomers, label: 'Happy Customers' },
  { value: SITE.stats.sqftTransformed, label: 'Square Feet Transformed' },
  { value: SITE.stats.teamMembers, label: 'Expert Team Members' },
  { value: String(SITE.stats.yearsExperience), label: 'Years of Experience' },
];

const [meet, estimate, token, visualise, approve, deliver] = PROCESS_STEPS;
const { warranty, payment } = SITE;

// ── Phase 1: Consultation and estimate ───────────────────────────────────────
const consultationSteps: ProcessStep[] = [
  {
    number: '01',
    title: meet.name,
    items: [
      { bold: 'Free consultation:', text: meet.text },
      {
        bold: 'Kolkata and beyond:',
        text: `We meet Kolkata clients at the site or in our ${SITE.address.locality} studio. Outside West Bengal we begin over video and confirm coverage and timelines before you commit to anything.`,
      },
    ],
  },
  {
    number: '02',
    title: estimate.name,
    items: [
      { bold: 'Line-by-line pricing:', text: estimate.text },
      { bold: 'No design fee:', text: SITE.commitment },
    ],
  },
  {
    number: '03',
    title: token.name,
    items: [
      { bold: 'Confirming the project:', text: token.text },
      {
        bold: 'The only payment before approval:',
        text: 'The token is the only money that changes hands before you approve the design. The 50% advance is due at contract signing, and the contract is signed only after you have signed off on the 3D design and the itemised quote.',
      },
    ],
  },
];

// ── Phase 2: Design and 3D approval ──────────────────────────────────────────
const designSteps: ProcessStep[] = [
  {
    number: '01',
    title: visualise.name,
    items: [
      { bold: 'See it before we build it:', text: visualise.text },
      {
        bold: 'Real materials:',
        text: `We render with the actual finishes, hardware and lighting we order from our brand partners — ${SITE.brandPartners.join(', ')} — so what you approve on screen is what we build.`,
      },
    ],
  },
  {
    number: '02',
    title: 'Revisions until it is right',
    items: [
      { bold: 'Refine with your designer:', text: approve.text },
      {
        bold: 'Change freely at this stage:',
        text: 'Layouts, finishes and units are revised in 3D at no cost until you are happy. Once the design is approved, the drawings become the production set, so we ask for changes before sign-off rather than after.',
      },
    ],
  },
  {
    number: '03',
    title: 'Approval and contract',
    items: [
      {
        bold: 'The approval gate:',
        text: 'Nothing is manufactured and no site work begins until you have approved the 3D design, the drawings, the materials and the itemised quote in writing.',
      },
      {
        bold: 'Payment schedule:',
        text: `Modular work: ${payment.modular}. On-site work: ${payment.onsite}.`,
      },
    ],
  },
];

// ── Phase 3: Manufacturing and execution ─────────────────────────────────────
const executionSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Manufactured in our workshop',
    items: [
      {
        bold: 'Our own workshop:',
        text: `Modular kitchens, wardrobes and storage are manufactured in our ${SITE.address.locality}, ${SITE.address.city} workshop from the approved drawings, while site work proceeds in parallel.`,
      },
      {
        bold: 'One point of contact:',
        text: 'A dedicated project manager answers for the whole scope — carpentry, electrical, painting and civil work — so you never coordinate vendors yourself.',
      },
    ],
  },
  {
    number: '02',
    title: 'Weekly progress reports',
    items: [
      {
        bold: 'You see every stage:',
        text: 'Your project manager sends weekly photo and video progress reports, so you follow the work whether you live next door or in another city.',
      },
      {
        bold: 'Supervised execution:',
        text: 'Our execution teams work from the approved drawings under the project manager, and every change on site is agreed with you in writing before it is made.',
      },
    ],
  },
  {
    number: '03',
    title: deliver.name,
    items: [
      { bold: 'The timeline:', text: deliver.text },
      {
        bold: 'Balance payments:',
        text: 'The balance on modular items is due before they leave the workshop; on-site work is settled 45% at mid-stage and 5% at handover.',
      },
    ],
  },
];

// ── Phase 4: Handover and warranty ───────────────────────────────────────────
const handoverSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Walkthrough and handover',
    items: [
      {
        bold: 'We check before you do:',
        text: 'We walk through the finished home with you, list every snag and close it before handover.',
      },
      {
        bold: 'Handover documents:',
        text: 'You receive the final drawings, the product details and the warranty terms for every component we installed.',
      },
    ],
  },
  {
    number: '02',
    title: `${warranty.termYears}-year warranty`,
    items: [
      {
        bold: 'What is covered:',
        text: `${warranty.termYears} years on ${warranty.covers}.`,
      },
      {
        bold: 'Registering and claiming:',
        text: `Register by calling ${SITE.phoneDisplay} within ${warranty.registerWithinDays} days of handover and lodge any claim within ${warranty.claimWithinDays} days of noticing a defect. A Silver Storey representative inspects and repairs on site or replaces the component.`,
      },
    ],
  },
  {
    number: '03',
    title: 'After you move in',
    items: [
      {
        bold: 'Not covered, in plain words:',
        text: `The warranty excludes ${warranty.excludes}.`,
      },
      {
        bold: 'Still one call away:',
        text: `For anything after handover, call or WhatsApp ${SITE.phoneDisplay} or email ${SITE.email}.`,
      },
    ],
  },
];

// ── All phases (in order) ─────────────────────────────────────────────────────
export const processPhases: ProcessPhase[] = [
  { heading: 'Consultation and estimate', steps: consultationSteps },
  { heading: 'Design and 3D approval', steps: designSteps },
  { heading: 'Manufacturing and execution', steps: executionSteps },
  { heading: 'Handover and warranty', steps: handoverSteps },
];
