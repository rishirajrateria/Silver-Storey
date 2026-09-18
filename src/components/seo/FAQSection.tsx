import React from 'react';
import type { FAQ } from '@/lib/seo/schema';

export default function FAQSection({
  title = 'Frequently asked questions',
  faqs,
  id = 'faq',
}: {
  title?: string;
  faqs: FAQ[];
  id?: string;
}) {
  if (!faqs.length) return null;
  return (
    <section
      id={id}
      className="mx-auto max-w-4xl px-6 py-14 sm:py-20"
      aria-labelledby={`${id}-title`}
    >
      <h2
        id={`${id}-title`}
        className="mb-8 text-2xl font-bold tracking-tight text-black sm:text-3xl"
      >
        {title}
      </h2>
      <div className="divide-y divide-black/10 rounded-xl bg-white shadow-sm">
        {faqs.map((f) => (
          <details key={f.question} className="group px-6 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-black">
              <span>{f.question}</span>
              <span
                aria-hidden
                className="shrink-0 text-xl leading-none text-black/40 transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-black/65 sm:text-base">
              {f.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
