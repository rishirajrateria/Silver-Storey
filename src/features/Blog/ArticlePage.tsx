import React from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import type { Article } from '@/lib/blog/types';
import { CATEGORY_BY_SLUG, categoryPath } from '@/lib/blog/categories';
import { articlePath, articleReadMinutes, relatedArticles } from '@/lib/blog';
import PageShell from '@/components/seo/PageShell';
import FAQSection from '@/components/seo/FAQSection';
import CTASection from '@/components/seo/CTASection';
import { SITE } from '@/lib/seo/site';

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function CalendarIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

/**
 * Server-rendered article page for locally authored guides. Mirrors the
 * typography and layout of the CMS-driven BlogPostPage.
 */
export default function ArticlePage({
  article,
  projectPages = [],
}: {
  article: Article;
  projectPages?: { title: string; slug: string }[];
}) {
  const category = CATEGORY_BY_SLUG[article.category];
  const readTime = articleReadMinutes(article);
  const related = relatedArticles(article, 3);
  const toc = article.sections
    .filter((s) => s.heading && (s.level ?? 2) === 2)
    .map((s) => ({ id: slugify(s.heading!), text: s.heading! }));
  const authorInitial = article.author[0]?.toUpperCase() ?? 'S';

  return (
    <PageShell projectPages={projectPages}>
      <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-black/50 transition-colors hover:text-black"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Blog
        </Link>

        {category && (
          <Link
            href={categoryPath(category.slug)}
            className="mb-4 inline-block rounded-full bg-[#6b1a1a] px-3 py-1 text-xs font-semibold tracking-wide text-white uppercase"
          >
            {category.name}
          </Link>
        )}

        <h1 className="mb-4 text-3xl leading-tight font-bold text-black sm:text-4xl lg:text-5xl">
          {article.title}
        </h1>
        <p className="mb-8 text-base leading-relaxed text-black/50 sm:text-lg">
          {article.description}
        </p>

        <div className="mb-10 flex flex-wrap items-center gap-4 border-b border-black/10 pb-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black/10 text-sm font-semibold text-black">
              {authorInitial}
            </div>
            <span className="text-sm font-medium text-black">
              {article.author}
            </span>
          </div>
          <span className="flex items-center gap-1.5 text-sm text-black/45">
            <CalendarIcon />
            <time dateTime={article.publishedAt}>
              {dayjs(article.publishedAt).format('MMMM D, YYYY')}
            </time>
            {article.updatedAt && (
              <span className="text-black/35">
                · Updated {dayjs(article.updatedAt).format('MMM D, YYYY')}
              </span>
            )}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-black/45">
            <ClockIcon />
            {readTime} min read
          </span>
        </div>

        {article.keyTakeaways && article.keyTakeaways.length > 0 && (
          <aside
            className="mb-10 rounded-xl bg-white p-6 shadow-sm"
            aria-label="Key takeaways"
          >
            <h2 className="mb-3 text-sm font-semibold tracking-wide text-black/60 uppercase">
              Key takeaways
            </h2>
            <ul className="space-y-2">
              {article.keyTakeaways.map((k) => (
                <li
                  key={k}
                  className="flex items-start gap-2 text-sm text-black/75 sm:text-base"
                >
                  <span
                    aria-hidden
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6b1a1a]"
                  />
                  <span>{k}</span>
                </li>
              ))}
            </ul>
          </aside>
        )}

        {toc.length > 2 && (
          <nav
            className="mb-10 rounded-xl border border-black/10 p-5"
            aria-label="Table of contents"
          >
            <p className="mb-2 text-sm font-semibold text-black">
              In this article
            </p>
            <ol className="list-decimal space-y-1 pl-5 text-sm text-black/65">
              {toc.map((t) => (
                <li key={t.id}>
                  <a
                    href={`#${t.id}`}
                    className="underline-offset-2 hover:underline"
                  >
                    {t.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <article>
          {article.sections.map((s, i) => {
            const H = (s.level ?? 2) === 3 ? 'h3' : 'h2';
            const id = s.heading ? slugify(s.heading) : undefined;
            return (
              <section key={i}>
                {s.heading &&
                  (H === 'h2' ? (
                    <h2
                      id={id}
                      className="mt-10 mb-4 scroll-mt-24 text-2xl font-bold text-black"
                    >
                      {s.heading}
                    </h2>
                  ) : (
                    <h3
                      id={id}
                      className="mt-8 mb-3 scroll-mt-24 text-xl font-bold text-black"
                    >
                      {s.heading}
                    </h3>
                  ))}
                {s.paragraphs?.map((p) => (
                  <p
                    key={p.slice(0, 50)}
                    className="mb-5 text-base leading-relaxed text-black/75"
                  >
                    {p}
                  </p>
                ))}
                {s.bullets && (
                  <ul className="mb-5 list-disc pl-6 text-base leading-relaxed text-black/75">
                    {s.bullets.map((b) => (
                      <li key={b} className="mb-1.5">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
                {s.numbered && (
                  <ol className="mb-5 list-decimal pl-6 text-base leading-relaxed text-black/75">
                    {s.numbered.map((b) => (
                      <li key={b} className="mb-1.5">
                        {b}
                      </li>
                    ))}
                  </ol>
                )}
                {s.table && (
                  <div className="mb-6 overflow-x-auto rounded-xl bg-white shadow-sm">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-black text-white">
                        <tr>
                          {s.table.headers.map((h) => (
                            <th
                              key={h}
                              scope="col"
                              className="px-4 py-2.5 font-semibold"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/10">
                        {s.table.rows.map((r, ri) => (
                          <tr key={ri}>
                            {r.map((c, ci) => (
                              <td
                                key={ci}
                                className="px-4 py-2.5 text-black/75"
                              >
                                {c}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {s.callout && (
                  <blockquote className="my-6 border-l-4 border-[#6b1a1a] bg-white/60 py-3 pr-4 pl-5 text-black/70 italic">
                    {s.callout}
                  </blockquote>
                )}
              </section>
            );
          })}
        </article>

        {article.tags.length > 0 && (
          <p className="mt-10 flex flex-wrap gap-2 text-xs text-black/50">
            {article.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-white px-3 py-1 shadow-sm"
              >
                #{t}
              </span>
            ))}
          </p>
        )}

        <div className="mt-10 rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-black">About the author</p>
          <p className="mt-1 text-sm text-black/65">
            {article.author} — the designers, project managers and workshop team
            behind Silver Storey, a Kolkata-headquartered interior design studio
            with {SITE.stats.yearsExperience} years of experience and{' '}
            {SITE.stats.sqftTransformed} sq ft delivered across India.
          </p>
        </div>
      </div>

      {article.faqs && article.faqs.length > 0 && (
        <FAQSection faqs={article.faqs} title="Frequently asked questions" />
      )}

      {related.length > 0 && (
        <section
          className="mx-auto max-w-6xl px-6 py-10"
          aria-labelledby="related-title"
        >
          <h2
            id="related-title"
            className="mb-6 text-2xl font-bold tracking-tight text-black"
          >
            Related guides
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={articlePath(r.slug)}
                className="group flex flex-col rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="mb-2 text-xs font-semibold tracking-wide text-[#6b1a1a] uppercase">
                  {CATEGORY_BY_SLUG[r.category]?.name}
                </span>
                <span className="mb-2 text-base font-bold text-black group-hover:opacity-75">
                  {r.title}
                </span>
                <span className="line-clamp-2 text-sm text-black/50">
                  {r.description}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <CTASection
        title="Ready to plan your home?"
        subtitle="Get a free consultation, site measurement and 3D visualisation — then decide."
      />
    </PageShell>
  );
}
