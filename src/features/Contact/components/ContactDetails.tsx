import React from 'react';
import { SITE } from '@/lib/seo/site';

/** "Monday, Tuesday, …, Saturday" → "Monday – Saturday". */
function dayRange(days: readonly string[]): string {
  if (days.length <= 1) return days.join('');
  return `${days[0]} – ${days[days.length - 1]}`;
}

/**
 * The one visible NAP block: the same name, address, phone and hours the
 * LocalBusiness schema carries, so a crawler can match the two.
 */
export default function ContactDetails() {
  const { address } = SITE;
  return (
    <section
      className="mx-auto max-w-4xl px-6 pb-16 sm:pb-20"
      aria-labelledby="contact-details-title"
    >
      <h2
        id="contact-details-title"
        className="mb-6 text-2xl font-bold tracking-tight text-black sm:text-3xl"
      >
        Reach us directly
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <address className="glass-panel rounded-xl px-6 py-5 text-sm leading-relaxed text-black not-italic sm:text-base">
          <p className="mb-1 text-xs font-semibold tracking-[0.2em] text-[#6b1a1a] uppercase">
            Head office
          </p>
          <p className="font-semibold">{SITE.name}</p>
          <p>{address.street}</p>
          <p>
            {address.locality}, {address.city} {address.postalCode}
          </p>
          <p>
            {address.region}, {address.countryName}
          </p>
        </address>

        <div className="glass-panel rounded-xl px-6 py-5 text-sm leading-relaxed text-black sm:text-base">
          <p className="mb-1 text-xs font-semibold tracking-[0.2em] text-[#6b1a1a] uppercase">
            Phone, WhatsApp and email
          </p>
          <ul className="space-y-1">
            <li>
              Call{' '}
              <a
                href={`tel:${SITE.phoneE164}`}
                className="font-semibold underline underline-offset-2"
              >
                {SITE.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline underline-offset-2"
              >
                WhatsApp {SITE.phoneDisplay}
              </a>
            </li>
            <li>
              Email{' '}
              <a
                href={`mailto:${SITE.email}`}
                className="font-semibold underline underline-offset-2"
              >
                {SITE.email}
              </a>
            </li>
          </ul>
        </div>

        <div className="glass-panel rounded-xl px-6 py-5 text-sm leading-relaxed text-black sm:text-base">
          <p className="mb-1 text-xs font-semibold tracking-[0.2em] text-[#6b1a1a] uppercase">
            Opening hours
          </p>
          <ul>
            {SITE.openingHours.map((h) => (
              <li key={h.days.join()}>
                {dayRange(h.days)}: {h.opens} – {h.closes}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-black/60">
            Site visits and showroom appointments are booked in advance — call
            or WhatsApp us first.
          </p>
        </div>

        <div className="glass-panel rounded-xl px-6 py-5 text-sm leading-relaxed text-black sm:text-base">
          <p className="mb-1 text-xs font-semibold tracking-[0.2em] text-[#6b1a1a] uppercase">
            Book a consultation
          </p>
          <p>
            <a
              href={SITE.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline underline-offset-2"
            >
              Pick a 30-minute slot
            </a>{' '}
            for a free consultation over video or at your site.
          </p>
          {SITE.googleBusinessProfile && (
            <p className="mt-2">
              <a
                href={SITE.googleBusinessProfile}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline underline-offset-2"
              >
                Read our Google reviews
              </a>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
