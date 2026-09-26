import React from 'react';
import { PROCESS_STEPS } from '@/lib/seo/process';

/**
 * The six steps in full, as plain server HTML. The text is the same list the
 * route emits as HowTo schema, so what a crawler is told matches what a
 * visitor can read.
 */
export default function ProcessDetail() {
  return (
    <section
      id="process"
      className="mx-auto max-w-6xl scroll-mt-24 px-6 py-14 sm:py-20"
      aria-labelledby="process-title"
    >
      <h2
        id="process-title"
        className="mb-3 text-2xl font-bold tracking-tight text-black sm:text-3xl"
      >
        The six steps, in detail
      </h2>
      <p className="mb-8 max-w-2xl text-sm text-black/55 sm:text-base">
        Every Silver Storey project, whether a single kitchen or a full villa,
        follows the same six steps in the same order.
      </p>
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PROCESS_STEPS.map((step, i) => (
          <li key={step.name} className="glass-panel rounded-xl px-6 py-5">
            <p className="mb-2 text-xs font-semibold tracking-[0.25em] text-[#6b1a1a] uppercase">
              Step {i + 1}
            </p>
            <h3 className="mb-2 text-lg font-bold text-black">{step.name}</h3>
            <p className="text-sm leading-relaxed text-black/70 sm:text-base">
              {step.text}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
