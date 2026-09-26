import React from 'react';
import Link from 'next/link';
import type { BlogPostFull } from './types';
import type { Article } from '@/lib/blog/types';
import { CATEGORY_BY_SLUG, categoryPath } from '@/lib/blog/categories';
import { articlePath } from '@/lib/blog';
import type { ServiceData } from '@/lib/services';
import type { CityData } from '@/lib/locations';
import Markdown from '@/components/Markdown';
import { markdownReadMinutes } from '@/lib/markdown';
import PageShell from '@/components/seo/PageShell';
import Breadcrumbs, { type Crumb } from '@/components/seo/Breadcrumbs';
import CTASection from '@/components/seo/CTASection';
import CmsImage from '@/features/Gallery/CmsImage';
import ArticleMeta from './ArticleMeta';
import ArticleCrossLinks from './ArticleCrossLinks';
import ShareButton from './ShareButton';

interface Props {
  post: BlogPostFull;
  /** The same trail the route puts in BreadcrumbList schema. */
  crumbs: Crumb[];
  services?: ServiceData[];
  cities?: CityData[];
  related?: Article[];
  projectPages?: { title: string; slug: string }[];
}

/**
 * A post written in the admin. Server-rendered like the built-in guides so
 * the byline, dates and cross-links are in the HTML; only the share button
 * runs in the browser.
 */
export default function BlogPostPage({
  post,
  crumbs,
  services = [],
  cities = [],
  related = [],
  projectPages = [],
}: Props) {
  const readTime = markdownReadMinutes(post.body ?? '');
  const category = post.category ? CATEGORY_BY_SLUG[post.category] : undefined;

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
          {post.title}
        </h1>

        {post.description && (
          <p className="mb-8 text-base leading-relaxed text-black/50 sm:text-lg">
            {post.description}
          </p>
        )}

        <ArticleMeta
          author={post.author}
          publishedAt={post.publishedAt}
          updatedAt={post.updatedAt}
          readMinutes={readTime}
        >
          <ShareButton title={post.title} />
        </ArticleMeta>

        {post.mainImageUrl && (
          <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-xl bg-zinc-100">
            <CmsImage
              src={post.mainImageUrl}
              alt={post.title}
              sizes="(max-width: 768px) 100vw, 768px"
              preload
            />
          </div>
        )}

        {post.body && post.body.trim().length > 0 && (
          <article>
            <Markdown source={post.body} />
          </article>
        )}
      </div>

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
