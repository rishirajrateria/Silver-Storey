import React from 'react';
import Link from 'next/link';
import PageShell from '@/components/seo/PageShell';
import Breadcrumbs, { type Crumb } from '@/components/seo/Breadcrumbs';
import CTASection from '@/components/seo/CTASection';
import { PageHero } from '@/components/seo/Prose';
import type { TestimonialData } from '@/lib/db/content';
import {
  averageRating,
  reviewMonth,
  reviewSourceLabel,
} from '@/lib/testimonials';
import { SITE } from '@/lib/seo/site';

function Stars({ rating }: { rating: number }) {
  const n = Math.min(5, Math.max(0, Math.round(rating)));
  return (
    <p
      className="text-sm tracking-[0.2em] text-[#6b1a1a]"
      aria-label={`${n} out of 5 stars`}
    >
      <span aria-hidden>{'★'.repeat(n) + '☆'.repeat(5 - n)}</span>
      <span className="ml-2 text-xs tracking-normal text-black/50">{n}/5</span>
    </p>
  );
}

function GoogleLink({ prominent = false }: { prominent?: boolean }) {
  if (!SITE.googleBusinessProfile) return null;
  return (
    <a
      href={SITE.googleBusinessProfile}
      target="_blank"
      rel="noopener noreferrer"
      className={
        prominent
          ? 'btn-bump inline-flex items-center justify-center rounded-full bg-black px-8 py-3.5 text-sm font-medium text-white'
          : 'underline underline-offset-2'
      }
    >
      See all reviews on Google
    </a>
  );
}

/**
 * Every review here is a row the studio entered in its admin panel. There is
 * deliberately no hard-coded fallback: an empty page is honest, an invented
 * quote is not.
 */
export default function ReviewsPage({
  rows,
  projectPages = [],
  crumbs,
}: {
  rows: TestimonialData[];
  projectPages?: { title: string; slug: string }[];
  crumbs: Crumb[];
}) {
  const avg = averageRating(rows);
  return (
    <PageShell projectPages={projectPages}>
      <main>
        <PageHero
          eyebrow="Client reviews"
          title="Silver Storey Reviews"
          subtitle={
            rows.length
              ? `What clients say about the homes and offices we designed and delivered${avg ? ` — ${rows.length} published ${rows.length === 1 ? 'review' : 'reviews'}, average ${avg} out of 5` : ''}.`
              : 'What clients say about the homes and offices we designed and delivered.'
          }
        >
          <Breadcrumbs items={crumbs} />
        </PageHero>

        {SITE.googleBusinessProfile && (
          <div className="mx-auto max-w-6xl px-6 pb-6">
            <GoogleLink prominent />
          </div>
        )}

        <section
          className="mx-auto max-w-6xl px-6 py-10"
          aria-labelledby="reviews-list-title"
        >
          <h2 id="reviews-list-title" className="sr-only">
            Published reviews
          </h2>
          {rows.length ? (
            <ul className="grid gap-4 sm:grid-cols-2">
              {rows.map((t) => {
                const meta = [t.location, t.projectType]
                  .filter(Boolean)
                  .join(' · ');
                return (
                  <li key={t.id}>
                    <article className="glass-panel flex h-full flex-col gap-4 rounded-xl px-6 py-5">
                      <Stars rating={t.rating} />
                      <blockquote className="grow text-base leading-relaxed text-black/80">
                        “{t.quote}”
                      </blockquote>
                      <footer className="text-sm text-black/60">
                        <p className="font-semibold text-black">{t.name}</p>
                        {meta && <p>{meta}</p>}
                        <p>
                          {t.sourceUrl ? (
                            <a
                              href={t.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer nofollow"
                              className="underline underline-offset-2"
                            >
                              {reviewSourceLabel(t.source)}
                            </a>
                          ) : (
                            reviewSourceLabel(t.source)
                          )}
                          {reviewMonth(t.createdAt) && (
                            <>
                              {' · '}
                              <time dateTime={t.createdAt.slice(0, 10)}>
                                {reviewMonth(t.createdAt)}
                              </time>
                            </>
                          )}
                        </p>
                      </footer>
                    </article>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="glass-panel rounded-xl px-6 py-10 text-center">
              <p className="text-lg font-semibold text-black">
                We publish reviews here as clients share them.
              </p>
              <p className="mx-auto mt-2 max-w-xl text-sm text-black/60 sm:text-base">
                Every review on this page is entered by the studio from a
                client&rsquo;s own words; none are written for us.
                {SITE.googleBusinessProfile && (
                  <>
                    {' '}
                    Until then, <GoogleLink />.
                  </>
                )}
              </p>
              <p className="mt-4 text-sm text-black/60">
                Meanwhile, see{' '}
                <Link href="/projects" className="underline underline-offset-2">
                  our completed projects
                </Link>
                .
              </p>
            </div>
          )}
        </section>

        <CTASection
          title="Talk to us about your home"
          subtitle="Free consultation, site measurement, itemised estimate and 3D visualisation before you commit to anything."
        />
      </main>
    </PageShell>
  );
}
