import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/seo/PageShell';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import CTASection from '@/components/seo/CTASection';
import FAQSection from '@/components/seo/FAQSection';
import LinkGrid from '@/components/seo/LinkGrid';
import { PageHero, Prose, FeatureList } from '@/components/seo/Prose';
import JsonLd from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import {
  breadcrumbSchema,
  faqSchema,
  graph,
  howToSchema,
  webPageSchema,
  type FAQ,
} from '@/lib/seo/schema';
import { PROCESS_STEPS } from '@/lib/seo/process';
import { SITE } from '@/lib/seo/site';
import { ADD_ONS, SCOPES } from '@/lib/estimate';
import { formatINR } from '@/lib/locations/content';
import { SERVICE_BY_SLUG, servicePath } from '@/lib/services';
import { getProjectPageLinks } from '@/lib/db/content';

export const revalidate = 3600;

const PATH = '/turnkey-interiors';
const TITLE = 'What Is a Turnkey Interior Project? | Silver Storey';
const DESCRIPTION = `A turnkey interior project is one where a single studio designs, manufactures, installs and hands over a finished home. What it includes, what it costs (2BHK from ${formatINR(SCOPES.find((s) => s.key === '2bhk')?.from ?? 0)}) and how it differs from hiring a contractor.`;

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const FULL_HOME = SERVICE_BY_SLUG['full-home-interiors'];
const { warranty } = SITE;
const civilAddOn = ADD_ONS.find((a) => a.key === 'civil');

const DEFINITION = `A turnkey interior project is one where a single studio takes responsibility for everything between an empty shell and a finished, furnished home — design, manufacturing, site work, installation and handover — so that you turn the key and move in. Instead of hiring a designer, a carpenter, an electrician and a painter separately, you sign one itemised quote with one company that answers for the whole result.`;

/** The other ways to get a home done, described as models — no rival named. */
const ALTERNATIVES = [
  {
    model: 'Turnkey with Silver Storey',
    design: 'Complimentary 3D design of every room before you commit',
    quote: 'One itemised quote for design, manufacturing and site work',
    who: 'One project manager; our workshop and our execution teams',
    warranty: `${warranty.termYears} years on modular components and workmanship`,
  },
  {
    model: 'Hiring a contractor directly',
    design: 'Usually no drawings or renders — you describe, they build',
    quote:
      'Often a lump sum or a rate per square foot; extras appear as work proceeds',
    who: 'You coordinate the contractor and any separate vendors yourself',
    warranty: 'Whatever you negotiate, usually verbal',
  },
  {
    model: 'Architect or designer only',
    design: 'Drawings and renders, usually for a design fee',
    quote:
      'Design fee plus a separate contractor’s quote you must obtain and compare',
    who: 'You appoint and pay the contractor; the designer may supervise for a fee',
    warranty: 'Depends on the contractor you choose',
  },
  {
    model: 'Doing it yourself',
    design: 'Your own layouts and references',
    quote:
      'Many small quotes from carpenters, electricians, painters and shops',
    who: 'You manage every trade, every delivery and every snag',
    warranty: 'Product warranties only, from each shop',
  },
];

const FAQS: FAQ[] = [
  {
    question: 'What does “turnkey” mean in interior design?',
    answer:
      'That one company delivers the finished home — design, manufacturing, installation and site work — and you take possession of a completed space rather than coordinating trades yourself. The phrase comes from being handed the key to a finished home.',
  },
  {
    question: 'What is included in a Silver Storey turnkey project?',
    answer: `${FULL_HOME.includes.join('; ')}. Everything is listed line by line in the itemised quote, and nothing outside that quote is charged.`,
  },
  {
    question: 'How much does a turnkey home interior cost?',
    answer: `At the Kolkata baseline, ${SCOPES.filter((s) => s.group === 'home')
      .map(
        (s) =>
          `a ${s.label.toLowerCase()} runs ${formatINR(s.from)} to ${formatINR(s.to)}`,
      )
      .join(
        ', ',
      )}, depending on finish grade and scope. Other cities are ×0.85–1.2 by our published city index.`,
  },
  {
    question: 'How long does a turnkey project take?',
    answer: `Handover is within ${SITE.stats.deliveryDays} days of design approval. Modular units are manufactured in our ${SITE.address.city} workshop while site work proceeds in parallel; the design stage before approval depends on how quickly we agree layouts and finishes.`,
  },
  {
    question: 'Is a turnkey project more expensive than hiring a contractor?',
    answer:
      'Not necessarily, and the comparison is rarely like for like: a contractor’s lump sum usually excludes design, 3D, hardware brands and a written warranty, and extras arrive as the work proceeds. Our quote is itemised so you can compare each line — units, materials, finishes, site work — against any other estimate for the same scope.',
  },
];

export default async function TurnkeyPage() {
  const projectPages = await getProjectPageLinks();
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Turnkey interiors', path: PATH },
  ];
  const jsonLd = graph(
    webPageSchema({ name: TITLE, description: DESCRIPTION, path: PATH }),
    breadcrumbSchema(crumbs),
    howToSchema({
      name: 'How a Silver Storey turnkey interior project runs',
      description: 'Six steps from a free consultation to handover.',
      steps: PROCESS_STEPS,
      totalTime: 'P45D',
    }),
    faqSchema(FAQS),
  );

  return (
    <PageShell projectPages={projectPages}>
      <main>
        <JsonLd data={jsonLd} />
        <PageHero
          eyebrow="Definition"
          title="What Is a Turnkey Interior Project?"
        >
          <Breadcrumbs items={crumbs} />
        </PageHero>

        <section className="mx-auto max-w-4xl px-6 pb-6">
          <Prose>
            <p className="text-lg text-black sm:text-xl">{DEFINITION}</p>
            <p>
              Every Silver Storey home is delivered this way. This page sets out
              what that includes, what it does not, how it compares with the
              other ways of getting a home done, what it costs and how long it
              takes.
            </p>
          </Prose>
        </section>

        <section
          className="mx-auto max-w-6xl px-6 py-10"
          aria-labelledby="included-title"
        >
          <h2
            id="included-title"
            className="mb-6 text-2xl font-bold tracking-tight text-black sm:text-3xl"
          >
            What is included
          </h2>
          <div className="grid gap-8 lg:grid-cols-[3fr_2fr]">
            <FeatureList
              title={`In a ${FULL_HOME.shortName.toLowerCase()} project`}
              items={[...FULL_HOME.includes]}
            />
            <div>
              <h3 className="mb-3 text-lg font-bold text-black">What is not</h3>
              <ul className="space-y-3 text-sm text-black/70 sm:text-base">
                <li>
                  <strong className="text-black">Third-party products</strong> —
                  countertops, appliances and fittings are supplied by their
                  brands and carry the manufacturer&rsquo;s own warranty, not
                  ours.
                </li>
                {civilAddOn && (
                  <li>
                    <strong className="text-black">{civilAddOn.label}</strong> —
                    quoted as separate line items when you want them, so a home
                    that needs none does not pay for them.
                  </li>
                )}
                <li>
                  <strong className="text-black">
                    Anything not on the quote
                  </strong>{' '}
                  — the itemised quote you approve is the whole price. A change
                  requested later is priced and agreed in writing before it is
                  done.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section
          className="mx-auto max-w-6xl px-6 py-10"
          aria-labelledby="compare-title"
        >
          <h2
            id="compare-title"
            className="mb-3 text-2xl font-bold tracking-tight text-black sm:text-3xl"
          >
            How it differs from a contractor, an architect or doing it yourself
          </h2>
          <p className="mb-6 max-w-2xl text-sm text-black/55 sm:text-base">
            The models differ in who draws, who quotes, who executes and who
            stands behind the result.
          </p>
          <div className="glass-panel overflow-x-auto rounded-xl">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead className="bg-black text-white">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Model
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Design
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Quote
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Who does the work
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Warranty
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10 align-top">
                {ALTERNATIVES.map((row) => (
                  <tr key={row.model}>
                    <th
                      scope="row"
                      className="px-4 py-3 font-semibold text-black"
                    >
                      {row.model}
                    </th>
                    <td className="px-4 py-3 text-black/70">{row.design}</td>
                    <td className="px-4 py-3 text-black/70">{row.quote}</td>
                    <td className="px-4 py-3 text-black/70">{row.who}</td>
                    <td className="px-4 py-3 text-black/70">{row.warranty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section
          className="mx-auto max-w-6xl px-6 py-10"
          aria-labelledby="process-title"
        >
          <h2
            id="process-title"
            className="mb-6 text-2xl font-bold tracking-tight text-black sm:text-3xl"
          >
            The Silver Storey process
          </h2>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PROCESS_STEPS.map((step, i) => (
              <li key={step.name} className="glass-panel rounded-xl px-6 py-5">
                <p className="mb-2 text-xs font-semibold tracking-[0.25em] text-[#6b1a1a] uppercase">
                  Step {i + 1}
                </p>
                <h3 className="mb-2 text-lg font-bold text-black">
                  {step.name}
                </h3>
                <p className="text-sm leading-relaxed text-black/70">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-black/60">
            Each step is explained in full on{' '}
            <Link href="/how-it-works" className="underline underline-offset-2">
              how it works
            </Link>
            .
          </p>
        </section>

        <section
          className="mx-auto max-w-5xl px-6 py-10"
          aria-labelledby="cost-title"
        >
          <h2
            id="cost-title"
            className="mb-3 text-2xl font-bold tracking-tight text-black sm:text-3xl"
          >
            What a turnkey project costs
          </h2>
          <p className="mb-6 max-w-2xl text-sm text-black/55 sm:text-base">
            Kolkata baseline, from an Essential to a Luxury finish; other cities
            ×0.85–1.2 by our published city index. {SITE.commitment}
          </p>
          <div className="glass-panel overflow-hidden rounded-xl">
            <table className="w-full text-left text-sm sm:text-base">
              <thead className="bg-black text-white">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Scope
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Starting from
                  </th>
                  <th
                    scope="col"
                    className="hidden px-5 py-3 font-semibold sm:table-cell"
                  >
                    Typical range
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {SCOPES.map((scope) => (
                  <tr key={scope.key}>
                    <td className="px-5 py-3 text-black">{scope.label}</td>
                    <td className="px-5 py-3 font-semibold text-[#6b1a1a]">
                      {formatINR(scope.from)}
                    </td>
                    <td className="hidden px-5 py-3 text-black/60 sm:table-cell">
                      {formatINR(scope.from)} – {formatINR(scope.to)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-black/60">
            The full payment schedule is on the{' '}
            <Link
              href="/pricing-structure"
              className="underline underline-offset-2"
            >
              pricing page
            </Link>
            ; for your own home, use the{' '}
            <Link href="/estimate" className="underline underline-offset-2">
              estimate calculator
            </Link>
            .
          </p>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-10">
          <Prose>
            <h2>Timeline</h2>
            <p>
              Handover is within {SITE.stats.deliveryDays} days of design
              approval. That is possible because modular units are manufactured
              in our {SITE.address.locality}, {SITE.address.city} workshop while
              painting, ceiling, electrical and civil work proceed on site, and
              because nothing starts until the design is fully approved — there
              is no waiting on decisions mid-project.
            </p>
            <h2>Warranty</h2>
            <p>
              Every turnkey project carries our {warranty.termYears}-year
              warranty on {warranty.covers}. Register within{' '}
              {warranty.registerWithinDays} days of handover and lodge any claim
              within {warranty.claimWithinDays} days of noticing a defect. Not
              covered: {warranty.excludes}. The{' '}
              <Link href="/warranty">warranty page</Link> and the{' '}
              <Link href="/terms-conditions">Terms</Link> have the detail.
            </p>
          </Prose>
        </section>

        <FAQSection faqs={FAQS} />

        <LinkGrid
          id="next"
          title="Where to next"
          columns={4}
          items={[
            { name: FULL_HOME.name, path: servicePath(FULL_HOME) },
            { name: 'Prices and payment schedule', path: '/pricing-structure' },
            { name: 'Estimate calculator', path: '/estimate' },
            { name: 'How it works', path: '/how-it-works' },
          ]}
        />

        <CTASection
          title="Start your turnkey project"
          subtitle="Free consultation, site measurement, itemised estimate and 3D visualisation — before you commit to anything."
        />
      </main>
    </PageShell>
  );
}
