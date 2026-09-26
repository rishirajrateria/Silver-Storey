import React from 'react';
import Link from 'next/link';
import PageShell from '@/components/seo/PageShell';
import Breadcrumbs, { type Crumb } from '@/components/seo/Breadcrumbs';
import CTASection from '@/components/seo/CTASection';
import FAQSection from '@/components/seo/FAQSection';
import { SCOPES } from '@/lib/estimate';
import { BASE_PRICING, formatINR } from '@/lib/locations/content';
import { SERVICES, servicePath } from '@/lib/services';
import { SITE } from '@/lib/seo/site';
import { PRICING_FAQS } from './faqs';

const BULLET = (
  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full border border-black/70" />
);

/** The estimate scopes link to the matching service page via the price book. */
function scopeServicePath(key: string): string | undefined {
  const slug = BASE_PRICING.find((row) => row.key === key)?.serviceSlug;
  return slug ? servicePath(slug) : undefined;
}

/** Commercial work is quoted per sq ft; every other starting price is per scope. */
function servicePrice(service: (typeof SERVICES)[number]): string {
  const price = formatINR(service.startingPriceINR ?? 0);
  return service.category === 'commercial' ? `${price} / sq ft` : price;
}

const PRICED_SERVICES = SERVICES.filter((s) => s.startingPriceINR);

/**
 * A server component: the price tables and the payment schedule are the
 * substance of this page and must be in the HTML for crawlers that do not
 * run JavaScript. Only the floating controls (PageShell) are client-side.
 */
export default function PricingPage({
  projectPages = [],
  crumbs,
}: {
  projectPages?: { title: string; slug: string }[];
  crumbs: Crumb[];
}) {
  return (
    <PageShell projectPages={projectPages}>
      <div>
        {/* ── Hero ── */}
        <section
          className="flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center sm:pt-32 sm:pb-20"
          style={{
            background:
              'linear-gradient(to bottom, rgba(20, 18, 16, 0.8) 0%, rgba(50, 45, 40, 0.5) 40%, #f2efea 85%, #f4f1ed 100%)',
          }}
        >
          {/* Logo */}
          <div className="mb-4 w-16 sm:w-20">
            <img
              src="/images/home_logo.avif"
              alt="Silver Storey logo"
              className="h-auto w-full object-contain"
            />
          </div>

          {/* Brand name */}
          <p className="mb-3 text-sm font-light tracking-[0.25em] text-black/80 sm:text-base">
            Silver Storey&apos;s
          </p>

          {/* Page title */}
          <h1 className="mb-5 text-4xl leading-tight font-bold tracking-tight text-black sm:text-5xl md:text-6xl lg:text-7xl">
            Interior Design Prices &amp; Payment Schedule
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-black/60 sm:text-base">
            Published starting prices by room and home size, an itemised quote
            for every project, and a payment schedule you can read before you
            call us.
          </p>
        </section>

        {/* ── Content ── */}
        <div>
          <section className="mx-auto max-w-4xl px-6 pb-24 sm:px-10 sm:pb-32 lg:px-8">
            <Breadcrumbs items={crumbs} />

            {/* Intro */}
            <p className="mb-10 text-base leading-relaxed text-black sm:mb-12 sm:text-lg">
              At Silver Storey, we pride ourselves on transparency and
              flexibility when it comes to our pricing. Our structured payment
              plans ensure clarity and confidence for our clients throughout the
              project. Below are our starting prices, followed by the detailed
              payment structures for our Modular and On-Site Job services.
            </p>

            {/* ── Commitment ── */}
            <p className="glass-panel mb-10 rounded-xl px-6 py-5 text-base leading-relaxed font-medium text-black sm:mb-12">
              {SITE.commitment}
            </p>

            {/* ── Starting prices by scope ── */}
            <div className="mb-10 sm:mb-12">
              <h2 className="mb-2 text-base font-bold text-black sm:text-lg">
                Starting prices by room and home size
              </h2>
              <p className="mb-6 text-sm leading-relaxed text-black sm:text-base">
                Kolkata baseline; other cities ×0.85–1.2 by our published city
                index. The range runs from an Essential finish (BWP ply,
                laminate shutters, standard hardware) to Luxury (veneer, stone,
                glass and bespoke joinery). Every quote is itemised.
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
                    {SCOPES.map((scope) => {
                      const href = scopeServicePath(scope.key);
                      return (
                        <tr key={scope.key}>
                          <td className="px-5 py-3 text-black">
                            {href ? (
                              <Link
                                href={href}
                                className="underline-offset-2 hover:underline"
                              >
                                {scope.label}
                              </Link>
                            ) : (
                              scope.label
                            )}
                          </td>
                          <td className="px-5 py-3 font-semibold text-[#6b1a1a]">
                            {formatINR(scope.from)}
                          </td>
                          <td className="hidden px-5 py-3 text-black/60 sm:table-cell">
                            {formatINR(scope.from)} – {formatINR(scope.to)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-sm text-black/60">
                Want a figure for your own home?{' '}
                <Link href="/estimate" className="underline underline-offset-2">
                  Use the estimate calculator
                </Link>
                , which applies your city&apos;s index and finish grade.
              </p>
            </div>

            {/* ── Service starting prices ── */}
            <div className="mb-10 sm:mb-12">
              <h2 className="mb-2 text-base font-bold text-black sm:text-lg">
                Starting prices by service
              </h2>
              <p className="mb-6 text-sm leading-relaxed text-black sm:text-base">
                Indicative starting prices at the Kolkata baseline; the service
                page for each explains what is included.
              </p>
              <div className="glass-panel overflow-hidden rounded-xl">
                <table className="w-full text-left text-sm sm:text-base">
                  <thead className="bg-black text-white">
                    <tr>
                      <th scope="col" className="px-5 py-3 font-semibold">
                        Service
                      </th>
                      <th scope="col" className="px-5 py-3 font-semibold">
                        Starting from
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/10">
                    {PRICED_SERVICES.map((service) => (
                      <tr key={service.slug}>
                        <td className="px-5 py-3 text-black">
                          <Link
                            href={servicePath(service)}
                            className="underline-offset-2 hover:underline"
                          >
                            {service.name}
                          </Link>
                        </td>
                        <td className="px-5 py-3 font-semibold whitespace-nowrap text-[#6b1a1a]">
                          {servicePrice(service)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Modular Projects ── */}
            <div className="mb-10 sm:mb-12">
              <h2 className="mb-2 text-base font-bold text-black sm:text-lg">
                Modular Projects
              </h2>
              <p className="mb-6 text-sm leading-relaxed text-black sm:text-base">
                For our modular projects, we follow a straightforward payment
                plan that ensures both parties are committed and the project
                progresses smoothly. Design and 3D visualisation are
                complimentary and come before the contract; the payment stages
                are as follows:
              </p>

              <ol className="space-y-6">
                {/* Stage 1 */}
                <li className="ml-4">
                  <p className="mb-2 text-sm font-normal text-black sm:text-base">
                    1.&nbsp;<strong>50% Advance Payment:</strong>
                  </p>
                  <ul className="ml-6 list-none space-y-2">
                    <li className="flex gap-2 text-sm text-black sm:text-base">
                      {BULLET}
                      <span>
                        This payment confirms your order and allows us to begin
                        manufacturing the approved design. It covers the initial
                        costs of materials and production setup.
                      </span>
                    </li>
                    <li className="flex gap-2 text-sm text-black sm:text-base">
                      {BULLET}
                      <span>
                        Payment is due upon signing the contract and before
                        production begins.
                      </span>
                    </li>
                  </ul>
                </li>

                {/* Stage 2 */}
                <li className="ml-4">
                  <p className="mb-2 text-sm font-normal text-black sm:text-base">
                    2.&nbsp;
                    <strong>50% Before Delivery of Modular Items:</strong>
                  </p>
                  <ul className="ml-6 list-none space-y-2">
                    <li className="flex gap-2 text-sm text-black sm:text-base">
                      {BULLET}
                      <span>
                        The remaining balance is due before the delivery of the
                        modular items to your site.
                      </span>
                    </li>
                    <li className="flex gap-2 text-sm text-black sm:text-base">
                      {BULLET}
                      <span>
                        This payment ensures that all items are fully paid for
                        before they leave our facility, allowing us to deliver
                        high-quality, custom-designed pieces tailored to your
                        specifications.
                      </span>
                    </li>
                    <li className="flex gap-2 text-sm text-black sm:text-base">
                      {BULLET}
                      <span>
                        Payment must be made once the manufacturing is completed
                        and before the items are shipped to the project
                        location.
                      </span>
                    </li>
                  </ul>
                </li>
              </ol>
            </div>

            {/* ── On-Site Jobs ── */}
            <div className="mb-10 sm:mb-12">
              <h2 className="mb-2 text-base font-bold text-black sm:text-lg">
                On-Site Jobs
              </h2>
              <p className="mb-6 text-sm leading-relaxed text-black sm:text-base">
                For our on-site jobs, we have devised a comprehensive payment
                plan to align with the different stages of the project. This
                phased approach ensures that the project is funded appropriately
                at each critical milestone. The payment stages are as follows:
              </p>

              <ol className="space-y-6">
                {/* Stage 1 */}
                <li className="ml-4">
                  <p className="mb-2 text-sm font-normal text-black sm:text-base">
                    1.&nbsp;<strong>50% Advance Payment:</strong>
                  </p>
                  <ul className="ml-6 list-none space-y-2">
                    <li className="flex gap-2 text-sm text-black sm:text-base">
                      {BULLET}
                      <span>
                        This payment confirms your booking and allows us to
                        schedule the team and purchase the necessary materials
                        for the approved design.
                      </span>
                    </li>
                    <li className="flex gap-2 text-sm text-black sm:text-base">
                      {BULLET}
                      <span>
                        Payment is due upon signing the contract and before the
                        commencement of any on-site work.
                      </span>
                    </li>
                  </ul>
                </li>

                {/* Stage 2 */}
                <li className="ml-4">
                  <p className="mb-2 text-sm font-normal text-black sm:text-base">
                    2.&nbsp;<strong>45% Mid-Stage Payment:</strong>
                  </p>
                  <ul className="ml-6 list-none space-y-2">
                    <li className="flex gap-2 text-sm text-black sm:text-base">
                      {BULLET}
                      <span>
                        This payment is due at the mid-point of the project,
                        once significant progress has been made, such as the
                        completion of foundational work or major structural
                        changes.
                      </span>
                    </li>
                    <li className="flex gap-2 text-sm text-black sm:text-base">
                      {BULLET}
                      <span>
                        This stage ensures that the project continues smoothly,
                        with all necessary resources allocated to maintain
                        momentum.
                      </span>
                    </li>
                  </ul>
                </li>

                {/* Stage 3 */}
                <li className="ml-4">
                  <p className="mb-2 text-sm font-normal text-black sm:text-base">
                    3.&nbsp;<strong>5% Handover Payment:</strong>
                  </p>
                  <ul className="ml-6 list-none space-y-2">
                    <li className="flex gap-2 text-sm text-black sm:text-base">
                      {BULLET}
                      <span>
                        The final payment is due upon the successful completion
                        and handover of the project.
                      </span>
                    </li>
                    <li className="flex gap-2 text-sm text-black sm:text-base">
                      {BULLET}
                      <span>
                        This stage ensures that all final touches, quality
                        checks, and client satisfaction have been addressed
                        before the project is officially closed.
                      </span>
                    </li>
                    <li className="flex gap-2 text-sm text-black sm:text-base">
                      {BULLET}
                      <span>
                        Payment is made once you are fully satisfied with the
                        completed work and all contractual obligations have been
                        met.
                      </span>
                    </li>
                  </ul>
                </li>
              </ol>
            </div>

            {/* ── Additional Information ── */}
            <div className="mb-10 sm:mb-12">
              <h2 className="mb-4 text-base font-bold text-black sm:text-lg">
                Additional Information
              </h2>
              <ul className="space-y-3">
                <li className="flex gap-2 text-sm text-black sm:text-base">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-black/80" />
                  <span>
                    <strong>Flexible Payment Options:</strong> We understand
                    that each project is unique, and we are open to discussing
                    flexible payment options that suit your financial planning
                    and project needs.
                  </span>
                </li>
                <li className="flex gap-2 text-sm text-black sm:text-base">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-black/80" />
                  <span>
                    <strong>Secure Transactions:</strong> All payments can be
                    made via secure online transfers, bank deposits, or other
                    agreed-upon methods to ensure your peace of mind.
                  </span>
                </li>
                <li className="flex gap-2 text-sm text-black sm:text-base">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-black/80" />
                  <span>
                    <strong>Transparent Invoicing:</strong> Detailed invoices
                    and payment receipts will be provided at each stage,
                    ensuring complete transparency and record-keeping.
                  </span>
                </li>
              </ul>
            </div>

            {/* ── Closing paragraph ── */}
            <p className="text-sm leading-relaxed text-black sm:text-base">
              We are committed to providing exceptional service and quality
              craftsmanship. Our structured payment plans are designed to
              reflect our commitment to your project and to ensure a smooth,
              hassle-free experience from start to finish. If you have any
              questions or need further clarification, please do not hesitate to{' '}
              <Link href="/contact" className="underline underline-offset-2">
                contact us
              </Link>
              .
            </p>
          </section>
        </div>

        <FAQSection faqs={PRICING_FAQS} />
        <CTASection
          title="Get an itemised quote for your home"
          subtitle="Free consultation, site measurement, estimate and 3D visualisation — you pay only after you approve the design."
        />
      </div>
    </PageShell>
  );
}
