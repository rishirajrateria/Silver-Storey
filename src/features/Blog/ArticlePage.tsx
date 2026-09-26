import React from 'react';
import Link from 'next/link';
import type { Article } from '@/lib/blog/types';
import { CATEGORY_BY_SLUG, categoryPath } from '@/lib/blog/categories';
import { articlePath, articleReadMinutes, relatedArticles } from '@/lib/blog';
import { citiesForArticle, servicesForArticle } from '@/lib/related';
import PageShell from '@/components/seo/PageShell';
import Breadcrumbs, { type Crumb } from '@/components/seo/Breadcrumbs';
import FAQSection from '@/components/seo/FAQSection';
import CTASection from '@/components/seo/CTASection';
import { SITE } from '@/lib/seo/site';
import ArticleMeta from './ArticleMeta';
import ArticleCrossLinks from './ArticleCrossLinks';

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Server-rendered article page for locally authored guides. Mirrors the
 * typography and layout of the CMS-driven BlogPostPage.
 */
export default function ArticlePage({
  article,
  crumbs,
  projectPages = [],
}: {
  article: Article;
  /** The same trail the route puts in BreadcrumbList schema. */
  crumbs: Crumb[];
  projectPages?: { title: string; slug: string }[];
}) {
  const category = CATEGORY_BY_SLUG[article.category];
  const readTime = articleReadMinutes(article);
  const related = relatedArticles(article, 3);
  const services = servicesForArticle(article);
  const cities = citiesForArticle(article);
  const toc = article.sections
    .filter((s) => s.heading && (s.level ?? 2) === 2)
    .map((s) => ({ id: slugify(s.heading!), text: s.heading! }));

  return (
    <PageShell projectPages={projectPages}>
      <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <Breadcrumbs items={crumbs} />

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

        <ArticleMeta
          author={article.author}
          publishedAt={article.publishedAt}
          updatedAt={article.updatedAt}
          readMinutes={readTime}
        />

        {article.keyTakeaways && article.keyTakeaways.length > 0 && (
          <aside
            className="glass-panel mb-10 rounded-xl p-6"
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
                  <div className="glass-panel mb-6 overflow-x-auto rounded-xl">
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
              <span key={t} className="glass-panel rounded-full px-3 py-1">
                #{t}
              </span>
            ))}
          </p>
        )}

        <div className="glass-panel mt-10 rounded-xl p-6">
          <p className="text-sm font-semibold text-black">About the author</p>
          <p className="mt-1 text-sm text-black/65">
            Written by the{' '}
            <Link href="/about-us" className="underline underline-offset-2">
              Silver Storey design team
            </Link>{' '}
            — the designers, project managers and workshop team behind Silver
            Storey, a {SITE.address.city}-headquartered interior design studio
            founded in {SITE.foundingYear}, with {SITE.stats.yearsExperience}{' '}
            years of experience and {SITE.stats.sqftTransformed} sq ft delivered
            across India.
          </p>
        </div>
      </div>

      {article.faqs && article.faqs.length > 0 && (
        <FAQSection faqs={article.faqs} title="Frequently asked questions" />
      )}

      <ArticleCrossLinks services={services} cities={cities} />

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
                className="glass-panel glass-lift group flex flex-col rounded-xl p-6"
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
