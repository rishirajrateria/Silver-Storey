import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/seo/PageShell';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import FAQSection from '@/components/seo/FAQSection';
import CTASection from '@/components/seo/CTASection';
import { PageHero, Prose, FeatureList } from '@/components/seo/Prose';
import JsonLd from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import {
  breadcrumbSchema,
  faqSchema,
  graph,
  webPageSchema,
  type FAQ,
} from '@/lib/seo/schema';
import { SITE } from '@/lib/seo/site';
import { getProjectPageLinks } from '@/lib/db/content';

export const revalidate = 3600;

const PATH = '/warranty';
const TITLE = '10-Year Interior Warranty | Silver Storey';
const DESCRIPTION =
  'What Silver Storey’s 10-year warranty covers on modular kitchens, wardrobes and storage, plus on-site work (painting, false ceiling, electrical, plumbing), how to register and how to claim.';

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  keywords: [
    'interior design warranty',
    'modular kitchen warranty 10 years',
    'wardrobe warranty',
    'Silver Storey warranty',
  ],
});

/** Plain-language summary of the coverage table in the Terms & Conditions. */
const COVERAGE = [
  {
    item: 'Modular cabinets, shutters, drawers and panels',
    term: '10 years',
    claim: '100% replacement, free of cost',
  },
  {
    item: 'Hardware and accessories (hinges, channels, baskets, handles)',
    term: '10 years',
    claim: '100% replacement, free of cost',
  },
  {
    item: 'Painting (where painted area exceeds 500 sq ft)',
    term: 'As per on-site services policy',
    claim: 'Replacement paint and rectification of the affected portion',
  },
  {
    item: 'Gypsum false ceiling (where area exceeds 150 sq ft)',
    term: '6 months on standard gypsum',
    claim: 'Repair and re-application in the affected portion',
  },
  {
    item: 'Electrical work (where value exceeds ₹50,000)',
    term: 'As per on-site services policy',
    claim: 'Replacement material and labour to set right the failure',
  },
  {
    item: 'Plumbing work (where value exceeds ₹50,000)',
    term: 'As per on-site services policy',
    claim: 'Replacement or rectification, free of charge',
  },
  {
    item: 'Décor, appliances, lighting, fittings and furnishings',
    term: 'Manufacturer’s warranty',
    claim: 'Processed with the brand on your behalf',
  },
];

const FAQS: FAQ[] = [
  {
    question: 'How do I register my warranty?',
    answer: `Call ${SITE.phoneDisplay} within 7 days of handover (or of moving in, whichever is earlier) and share your project details. Registration within this window is what activates the policy.`,
  },
  {
    question: 'How do I make a claim?',
    answer: `Notify us by phone or email within 7 days of noticing a defect, and lodge the claim within 30 days of discovering it. A Silver Storey representative inspects the issue and decides whether to repair on site or replace the component.`,
  },
  {
    question: 'What is not covered?',
    answer:
      'Natural wear and tear, damage from rough handling or misuse, continuous contact with water or high moisture, harsh cleaning chemicals, alterations by third parties, natural calamities and vandalism. Countertops, appliances and fixtures supplied by other brands carry their own manufacturer warranties.',
  },
  {
    question: 'Does the warranty transfer if I sell the home?',
    answer:
      'No. Coverage applies while the product is owned by the original purchaser and remains in its original installed position.',
  },
  {
    question: 'Does a replacement restart the 10 years?',
    answer:
      'No. A replaced part is covered for the remainder of the original term; the total never exceeds 10 years from the date of possession.',
  },
];

export default async function WarrantyPage() {
  const projectPages = await getProjectPageLinks();
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Warranty', path: PATH },
  ];
  const jsonLd = graph(
    webPageSchema({ name: TITLE, description: DESCRIPTION, path: PATH }),
    breadcrumbSchema(crumbs),
    faqSchema(FAQS),
  );

  return (
    <PageShell projectPages={projectPages}>
      <JsonLd data={jsonLd} />
      <PageHero
        eyebrow="Peace of mind, in writing"
        title="Our 10-Year Warranty"
        subtitle="Every modular kitchen, wardrobe and storage unit we build is covered for ten years — cabinets, shutters, drawers, panels, hardware and accessories, replaced free of cost. Here is exactly what that means."
      >
        <Breadcrumbs items={crumbs} />
      </PageHero>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="glass-panel overflow-hidden rounded-xl">
          <table className="w-full text-left text-sm sm:text-base">
            <thead className="bg-black text-white">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">
                  What is covered
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Term
                </th>
                <th
                  scope="col"
                  className="hidden px-5 py-3 font-semibold sm:table-cell"
                >
                  Claim
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {COVERAGE.map((row) => (
                <tr key={row.item}>
                  <td className="px-5 py-3 text-black">{row.item}</td>
                  <td className="px-5 py-3 font-semibold whitespace-nowrap text-[#6b1a1a]">
                    {row.term}
                  </td>
                  <td className="hidden px-5 py-3 text-black/60 sm:table-cell">
                    {row.claim}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-black/50">
          Summary only. The{' '}
          <Link
            href="/terms-conditions"
            className="underline underline-offset-2"
          >
            full Terms &amp; Conditions
          </Link>{' '}
          govern every claim.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-10">
        <Prose>
          <h2>Why we can offer ten years</h2>
          <p>
            Our modular units are manufactured in our own Kolkata workshop from
            BWP (boiling-water-proof) plywood with Hettich and Ebco hardware,
            and installed by our own teams rather than subcontractors. Because
            we control every step — materials, machining, edge-banding,
            installation — we know exactly how the product behaves over a
            decade, and we stand behind it.
          </p>
          <h2>How it works</h2>
        </Prose>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <FeatureList
            title="Registering"
            columns={1}
            items={[
              `Call ${SITE.phoneDisplay} within 7 days of handover`,
              'Share your project reference and contact details',
              'Keep your handover documents — they identify your components',
            ]}
          />
          <FeatureList
            title="Claiming"
            columns={1}
            items={[
              'Tell us within 7 days of noticing a defect',
              'Lodge the claim within 30 days of discovery',
              'A representative inspects and repairs on site or replaces the part',
            ]}
          />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-10">
        <Prose>
          <h2>Keeping your warranty valid</h2>
          <ul>
            <li>
              Use the units for normal domestic purposes and keep them in their
              original position.
            </li>
            <li>
              Avoid continuous water contact and harsh or abrasive cleaners on
              shutters and panels.
            </li>
            <li>
              Do not modify, re-drill or relocate units without Silver Storey.
            </li>
            <li>
              Ask us before any third-party electrical or plumbing work near
              modular units.
            </li>
          </ul>
          <p>
            Countertops, appliances, sanitaryware and lighting are covered by
            their manufacturers (Kohler, Havells, Philips and others); we
            coordinate those claims for you.
          </p>
        </Prose>
      </section>

      <FAQSection faqs={FAQS} />
      <CTASection
        title="Design once, enjoy for decades"
        subtitle="Free consultation, 3D design and an itemised quote — with the warranty written into it."
      />
    </PageShell>
  );
}
