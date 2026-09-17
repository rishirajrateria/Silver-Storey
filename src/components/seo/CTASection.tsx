import React from 'react';
import { SITE } from '@/lib/seo/site';

export default function CTASection({
  title = 'Get a free consultation and 3D design',
  subtitle = 'Tell us about your space. We will measure, estimate and visualise it in 3D before you commit to anything.',
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="px-6 py-14 sm:py-20" aria-labelledby="cta-title">
      <div className="mx-auto max-w-5xl rounded-2xl bg-black px-6 py-12 text-center text-white sm:px-12 sm:py-16">
        <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-white/70 uppercase">
          Free consultation · 3D visualisation · 45-day delivery
        </p>
        <h2
          id="cta-title"
          className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl"
        >
          {title}
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-sm text-white/70 sm:text-base">
          {subtitle}
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <a
            href={`tel:${SITE.phoneE164}`}
            className="btn-bump flex w-full max-w-64 items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-medium text-black sm:w-auto"
          >
            Call {SITE.phoneDisplay}
          </a>
          <a
            href={SITE.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-bump flex w-full max-w-64 items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-medium text-black sm:w-auto"
          >
            WhatsApp us
          </a>
          <a
            href={SITE.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-bump flex w-full max-w-64 items-center justify-center rounded-full border border-white/80 px-8 py-3.5 text-sm font-medium text-white sm:w-auto"
          >
            Book free consultation
          </a>
        </div>
      </div>
    </section>
  );
}
