import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/seo/PageShell';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import CTASection from '@/components/seo/CTASection';
import FAQSection from '@/components/seo/FAQSection';
import { PageHero, Prose } from '@/components/seo/Prose';
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

const PATH = '/compare';
const TITLE = 'Silver Storey vs Livspace, HomeLane & Others: How to Compare';
const DESCRIPTION =
  'Ten things to compare before choosing an interior brand: design fee, 3D before commitment, itemised quote, warranty, timeline, payment, and what to ask.';

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const { warranty, payment } = SITE;

/**
 * Only the Silver Storey column carries answers. We do not hold verified,
 * current data on any other brand's prices, warranties or terms, so the
 * other column is the question to put to them rather than a claim.
 */
const ROWS = [
  {
    what: 'Design fee',
    us: 'None. Consultation, site measurement, the itemised estimate and 3D visualisation are complimentary.',
    ask: 'Is there a design fee, and is it refunded against the project if I go ahead?',
  },
  {
    what: '3D before you commit',
    us: 'Every room is rendered in 3D and revised until you approve it — before the contract and before the 50% advance.',
    ask: 'Do I see 3D renders of my own home before I pay an advance, and how many revisions are included?',
  },
  {
    what: 'How the quote is written',
    us: 'Itemised: every unit, material, finish and site task is priced line by line, and the quote you sign is the amount you pay.',
    ask: 'Is the quote itemised or a rate per square foot, and what is excluded from it?',
  },
  {
    what: 'Who manufactures',
    us: `Our own workshop in ${SITE.address.locality}, ${SITE.address.city}, from the approved drawings.`,
    ask: 'Who makes the modular units — the brand’s own factory, or a vendor assigned to my order?',
  },
  {
    what: 'Who executes on site',
    us: 'Our execution teams under a dedicated project manager, with weekly photo and video progress reports.',
    ask: 'Who is on site — the brand’s employees or a subcontracted crew — and who is my single point of contact?',
  },
  {
    what: 'Warranty',
    us: `${warranty.termYears} years on ${warranty.covers}. Not covered: ${warranty.excludes}.`,
    ask: 'How long is the warranty, exactly which components does it cover, and what does a claim cost me?',
  },
  {
    what: 'Timeline',
    us: `Handover within ${SITE.stats.deliveryDays} days of design approval.`,
    ask: 'How many days from design approval to handover, and is that written into the contract?',
  },
  {
    what: 'Payment schedule',
    us: `${payment.token}. Modular work: ${payment.modular}. On-site work: ${payment.onsite}.`,
    ask: 'How much is due before I have seen and approved the design, and what are the later milestones?',
  },
  {
    what: 'Local presence',
    us: `Head office and workshop in ${SITE.address.locality}, ${SITE.address.city}; site visits and showroom appointments across Kolkata and West Bengal; outstation projects supervised with weekly reports.`,
    ask: 'Is there a studio or workshop I can visit near me, and who will I meet in person?',
  },
  {
    what: 'Track record',
    us: `Founded in ${SITE.foundingYear} by ${SITE.founders.map((f) => f.name).join(' and ')}; ${SITE.stats.yearsExperience} years of experience, ${SITE.stats.sqftTransformed} sq ft delivered.`,
    ask: 'How long has the company been operating, who runs it, and can I see completed projects?',
  },
];

const FAQS: FAQ[] = [
  {
    question: 'Is Silver Storey cheaper than Livspace or HomeLane?',
    answer:
      'We do not publish or track other brands’ prices, so we make no claim either way. What we publish is our own: starting prices by room and home size on the pricing page, an itemised quote for your scope, and no design fee. Ask any brand for an itemised quote for the same scope and finish grade, and compare line by line.',
  },
  {
    question:
      'What is the difference between an online interior brand and a studio like Silver Storey?',
    answer:
      'The words describe a business model, not quality. Online brands typically sell through a platform and a network of partner designers and vendors; a studio designs, manufactures and executes under one roof. The useful comparison is not the label but the answers to the questions on this page — who draws, who makes, who builds, what is warranted and when you pay.',
  },
  {
    question:
      'Why compare on warranty and manufacturing rather than price alone?',
    answer:
      'Because a quote is only comparable when the scope, materials, hardware brands, warranty and timeline behind it are the same. Two quotes that differ by a lakh may differ by far more once you add a design fee, a shorter warranty or extras that appear during execution.',
  },
  {
    question: 'Does Silver Storey work in the cities the online brands cover?',
    answer: SITE.serviceModel.outstation,
  },
  {
    question: 'How do I compare quotes fairly?',
    answer:
      'Give every brand the same brief — rooms, units, finish grade, brands of hardware and materials — and ask each for an itemised quote. Then put the answers to the ten questions on this page beside each other. A quote that cannot be itemised cannot be compared.',
  },
];

export default async function ComparePage() {
  const projectPages = await getProjectPageLinks();
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Compare', path: PATH },
  ];
  const jsonLd = graph(
    webPageSchema({ name: TITLE, description: DESCRIPTION, path: PATH }),
    breadcrumbSchema(crumbs),
    faqSchema(FAQS),
  );

  return (
    <PageShell projectPages={projectPages}>
      <main>
        <JsonLd data={jsonLd} />
        <PageHero
          eyebrow="Choosing an interior company"
          title="How Silver Storey compares with online interior brands"
          subtitle="Livspace, HomeLane, DesignCafe and similar platforms are one way to get a home done; a design-and-build studio is another. Here is what to compare — and what we answer — before you decide."
        >
          <Breadcrumbs items={crumbs} />
        </PageHero>

        <section className="mx-auto max-w-4xl px-6 pb-6">
          <Prose>
            <p>
              We are not going to tell you what another brand charges, how long
              its warranty runs or what its contract says — we do not hold that
              information, and it changes. What we can do is list the things
              that decide whether a project goes well, give you our own answer
              to each, and give you the question to put to anyone else you are
              considering.
            </p>
            <h2>What to compare</h2>
            <ol>
              {ROWS.map((row) => (
                <li key={row.what}>
                  <strong>{row.what}</strong>
                </li>
              ))}
            </ol>
          </Prose>
        </section>

        <section
          className="mx-auto max-w-6xl px-6 py-10"
          aria-labelledby="table-title"
        >
          <h2
            id="table-title"
            className="mb-6 text-2xl font-bold tracking-tight text-black sm:text-3xl"
          >
            Silver Storey&rsquo;s answers, and the question to ask any other
            brand
          </h2>
          <div className="glass-panel overflow-x-auto rounded-xl">
            <table className="w-full min-w-[42rem] text-left text-sm">
              <thead className="bg-black text-white">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    What to compare
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Silver Storey
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Ask any other brand
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10 align-top">
                {ROWS.map((row) => (
                  <tr key={row.what}>
                    <th
                      scope="row"
                      className="px-4 py-3 font-semibold text-black"
                    >
                      {row.what}
                    </th>
                    <td className="px-4 py-3 text-black/80">{row.us}</td>
                    <td className="px-4 py-3 text-black/60 italic">
                      {row.ask}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-black/60">
            Our starting prices are on the{' '}
            <Link
              href="/pricing-structure"
              className="underline underline-offset-2"
            >
              pricing page
            </Link>
            , the process on{' '}
            <Link href="/how-it-works" className="underline underline-offset-2">
              how it works
            </Link>{' '}
            and the policy in full on the{' '}
            <Link href="/warranty" className="underline underline-offset-2">
              warranty page
            </Link>
            .
          </p>
        </section>

        <FAQSection faqs={FAQS} />
        <CTASection
          title="Put the questions to us first"
          subtitle="Book a free consultation and ask every question on this page — the estimate and 3D design cost nothing."
        />
      </main>
    </PageShell>
  );
}
