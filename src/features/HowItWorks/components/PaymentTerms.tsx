import React from 'react';
import Link from 'next/link';
import { FeatureList } from '@/components/seo/Prose';
import { SITE } from '@/lib/seo/site';

const MILESTONES = [
  { title: 'Booking token', text: SITE.payment.token },
  { title: 'Modular work', text: SITE.payment.modular },
  { title: 'On-site work', text: SITE.payment.onsite },
];

/** What costs nothing and when money changes hands, from the one SITE sentence. */
export default function PaymentTerms() {
  return (
    <section
      id="payment"
      className="mx-auto max-w-6xl scroll-mt-24 px-6 py-14 sm:py-20"
      aria-labelledby="payment-title"
    >
      <h2
        id="payment-title"
        className="mb-3 text-2xl font-bold tracking-tight text-black sm:text-3xl"
      >
        What is free and when you pay
      </h2>
      <p className="mb-8 max-w-3xl text-base leading-relaxed text-black/70 sm:text-lg">
        {SITE.commitment}
      </p>
      <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        <FeatureList
          title="Complimentary, before any commitment"
          columns={1}
          items={[
            'Consultation at your site or over video',
            'Site measurement',
            'Itemised estimate — every unit, material and finish priced',
            '3D visualisation of every room',
          ]}
        />
        <div>
          <h3 className="mb-3 text-lg font-bold text-black">
            Payment milestones
          </h3>
          <dl className="grid gap-3 sm:grid-cols-3">
            {MILESTONES.map((m) => (
              <div key={m.title} className="glass-panel rounded-xl px-5 py-4">
                <dt className="mb-1 text-sm font-semibold text-black">
                  {m.title}
                </dt>
                <dd className="text-sm leading-relaxed text-black/65">
                  {m.text}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm text-black/55">
            Starting prices by room and home size, and the full schedule, are on
            the{' '}
            <Link
              href="/pricing-structure"
              className="underline underline-offset-2"
            >
              pricing page
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
