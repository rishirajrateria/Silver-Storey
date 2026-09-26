import React from 'react';
import Link from 'next/link';
import PageShell from '@/components/seo/PageShell';
import CTASection from '@/components/seo/CTASection';
import FAQSection from '@/components/seo/FAQSection';
import type { Crumb } from '@/components/seo/Breadcrumbs';
import HowItWorksHero from './components/HowItWorksHero';
import HowItWorksSteps from './components/HowItWorksSteps';
import PaymentTerms from './components/PaymentTerms';
import ProcessDetail from './components/ProcessDetail';
import { HOW_IT_WORKS_FAQS } from './faqs';
import { SITE } from '@/lib/seo/site';

/**
 * A server component: the process text, payment terms and FAQ are what this
 * page exists to say, so they must be in the HTML rather than hydrated in.
 * Only the floating controls (inside PageShell) are client-side.
 */
export default function HowItWorksPage({
  projectPages = [],
  crumbs,
}: {
  projectPages?: { title: string; slug: string }[];
  crumbs: Crumb[];
}) {
  return (
    <PageShell projectPages={projectPages}>
      <div>
        <HowItWorksHero crumbs={crumbs} />
        <HowItWorksSteps />
        <ProcessDetail />
        <PaymentTerms />

        <section
          className="mx-auto max-w-6xl px-6 py-14 sm:py-20"
          aria-labelledby="turnkey-title"
        >
          <h2
            id="turnkey-title"
            className="mb-3 text-2xl font-bold tracking-tight text-black sm:text-3xl"
          >
            What is a turnkey project?
          </h2>
          <p className="max-w-3xl text-base leading-relaxed text-black/70 sm:text-lg">
            A turnkey interior project is one where a single studio designs the
            space, manufactures and installs everything in it and hands over a
            finished home — you turn the key and move in. Silver Storey works
            only this way: one itemised quote, one project manager, one{' '}
            {SITE.warranty.termYears}-year warranty.{' '}
            <Link
              href="/turnkey-interiors"
              className="underline underline-offset-2"
            >
              Read what a turnkey project includes, costs and how it compares
              with hiring a contractor
            </Link>
            .
          </p>
        </section>

        <FAQSection faqs={HOW_IT_WORKS_FAQS} />
        <CTASection />
      </div>
    </PageShell>
  );
}
