'use client';

import React, { useState } from 'react';
import HeroControls from '../Hero/components/HeroControls';
import MenuOverlay from '../Hero/components/MenuOverlay';

export default function PricingPage({
  projectPages = [],
}: {
  projectPages?: { title: string; slug: string }[];
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
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
          Pricing Structure
        </h1>

        {/* Subtitle */}
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-black/60 sm:text-base">
          Transform your space effortlessly with our expert interior design
          services, tailored to reflect your unique style and vision.
        </p>
      </section>

      {/* ── Content ── */}
      <div>
        <section className="mx-auto max-w-4xl px-6 pb-24 sm:px-10 sm:pb-32 lg:px-8">
          {/* Intro */}
          <p className="mb-10 text-base leading-relaxed text-black sm:mb-12 sm:text-lg">
            At Silver Storey, we pride ourselves on transparency and flexibility
            when it comes to our pricing. Our structured payment plans ensure
            clarity and confidence for our clients throughout the project. Below
            are the detailed pricing structures for our Modular and On-Site Job
            services.
          </p>

          {/* ── Modular Projects ── */}
          <div className="mb-10 sm:mb-12">
            <h2 className="mb-2 text-base font-bold text-black sm:text-lg">
              Modular Projects
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-black sm:text-base">
              For our modular projects, we follow a straightforward payment plan
              that ensures both parties are committed and the project progresses
              smoothly. The payment stages are as follows:
            </p>

            <ol className="space-y-6">
              {/* Stage 1 */}
              <li className="ml-4">
                <p className="mb-2 text-sm font-normal text-black sm:text-base">
                  1.&nbsp;<strong>50% Advance Payment:</strong>
                </p>
                <ul className="ml-6 list-none space-y-2">
                  <li className="flex gap-2 text-sm text-black sm:text-base">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full border border-black/70" />
                    <span>
                      This initial payment secures your booking and allows us to
                      begin the design and manufacturing process. It covers the
                      initial costs of materials, design, and production setup.
                    </span>
                  </li>
                  <li className="flex gap-2 text-sm text-black sm:text-base">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full border border-black/70" />
                    <span>
                      Payment is due upon signing the contract and before the
                      commencement of any design or production work.
                    </span>
                  </li>
                </ul>
              </li>

              {/* Stage 2 */}
              <li className="ml-4">
                <p className="mb-2 text-sm font-normal text-black sm:text-base">
                  2.&nbsp;<strong>50% Before Delivery of Modular Items:</strong>
                </p>
                <ul className="ml-6 list-none space-y-2">
                  <li className="flex gap-2 text-sm text-black sm:text-base">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full border border-black/70" />
                    <span>
                      The remaining balance is due before the delivery of the
                      modular items to your site.
                    </span>
                  </li>
                  <li className="flex gap-2 text-sm text-black sm:text-base">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full border border-black/70" />
                    <span>
                      This payment ensures that all items are fully paid for
                      before they leave our facility, allowing us to deliver
                      high-quality, custom-designed pieces tailored to your
                      specifications.
                    </span>
                  </li>
                  <li className="flex gap-2 text-sm text-black sm:text-base">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full border border-black/70" />
                    <span>
                      Payment must be made once the manufacturing is completed
                      and before the items are shipped to the project location.
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
              For our on-site jobs, we have devised a comprehensive payment plan
              to align with the different stages of the project. This phased
              approach ensures that the project is funded appropriately at each
              critical milestone. The payment stages are as follows:
            </p>

            <ol className="space-y-6">
              {/* Stage 1 */}
              <li className="ml-4">
                <p className="mb-2 text-sm font-normal text-black sm:text-base">
                  1.&nbsp;<strong>50% Advance Payment:</strong>
                </p>
                <ul className="ml-6 list-none space-y-2">
                  <li className="flex gap-2 text-sm text-black sm:text-base">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full border border-black/70" />
                    <span>
                      This initial payment secures your booking and allows us to
                      begin planning, designing, and purchasing necessary
                      materials.
                    </span>
                  </li>
                  <li className="flex gap-2 text-sm text-black sm:text-base">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full border border-black/70" />
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
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full border border-black/70" />
                    <span>
                      This payment is due at the mid-point of the project, once
                      significant progress has been made, such as the completion
                      of foundational work or major structural changes.
                    </span>
                  </li>
                  <li className="flex gap-2 text-sm text-black sm:text-base">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full border border-black/70" />
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
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full border border-black/70" />
                    <span>
                      The final payment is due upon the successful completion
                      and handover of the project.
                    </span>
                  </li>
                  <li className="flex gap-2 text-sm text-black sm:text-base">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full border border-black/70" />
                    <span>
                      This stage ensures that all final touches, quality checks,
                      and client satisfaction have been addressed before the
                      project is officially closed.
                    </span>
                  </li>
                  <li className="flex gap-2 text-sm text-black sm:text-base">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full border border-black/70" />
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
                  <strong>Flexible Payment Options:</strong> We understand that
                  each project is unique, and we are open to discussing flexible
                  payment options that suit your financial planning and project
                  needs.
                </span>
              </li>
              <li className="flex gap-2 text-sm text-black sm:text-base">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-black/80" />
                <span>
                  <strong>Secure Transactions:</strong> All payments can be made
                  via secure online transfers, bank deposits, or other
                  agreed-upon methods to ensure your peace of mind.
                </span>
              </li>
              <li className="flex gap-2 text-sm text-black sm:text-base">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-black/80" />
                <span>
                  <strong>Transparent Invoicing:</strong> Detailed invoices and
                  payment receipts will be provided at each stage, ensuring
                  complete transparency and record-keeping.
                </span>
              </li>
            </ul>
          </div>

          {/* ── Closing paragraph ── */}
          <p className="text-sm leading-relaxed text-black sm:text-base">
            We are committed to providing exceptional service and quality
            craftsmanship. Our structured payment plans are designed to reflect
            our commitment to your project and to ensure a smooth, hassle-free
            experience from start to finish. If you have any questions or need
            further clarification, please do not hesitate to contact us.
          </p>
        </section>
      </div>

      <HeroControls onMenuClick={() => setIsMenuOpen(true)} />
      <MenuOverlay
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        projectPages={projectPages}
      />
    </div>
  );
}
