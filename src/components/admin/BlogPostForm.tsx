'use client';

import React, { useActionState, useState } from 'react';
import Link from 'next/link';
import { saveBlogPost, type ActionState } from '@/app/admin/content-actions';
import { Button, Card, Field, inputClass } from './ui';
import ImageField from './ImageField';
import Markdown from '@/components/Markdown';
import { slugify } from '@/lib/admin/slug';
import { markdownReadMinutes, markdownWordCount } from '@/lib/markdown';

export interface BlogPostValues {
  id?: string;
  title?: string;
  slug?: string;
  description?: string;
  author?: string;
  category?: string;
  mainImageUrl?: string;
  body?: string;
  published?: boolean;
  publishedAt?: string;
}

const MARKDOWN_HELP = `## Heading
Paragraph text with **bold**, *italic*, \`code\` and [a link](/services).

- Bullet one
- Bullet two

1. Numbered one
2. Numbered two

> A pull quote.

| Column | Value |
| --- | --- |
| Kitchen | ₹1.4 L |`;

export default function BlogPostForm({
  values = {},
  categories,
}: {
  values?: BlogPostValues;
  categories: { slug: string; name: string }[];
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    saveBlogPost,
    {},
  );
  const [title, setTitle] = useState(values.title ?? '');
  const [slug, setSlug] = useState(values.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(Boolean(values.slug));
  const [body, setBody] = useState(values.body ?? '');
  const [preview, setPreview] = useState(false);

  const effectiveSlug = slugTouched ? slugify(slug) : slugify(title);

  return (
    <Card>
      <form action={formAction} className="space-y-6">
        {values.id && <input type="hidden" name="id" value={values.id} />}

        <Field label="Title" required>
          <input
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={inputClass}
          />
        </Field>

        <Field
          label="URL slug"
          hint={`The post will live at /blog/${effectiveSlug || '…'}`}
          required
        >
          <input
            name="slug"
            value={slugTouched ? slug : effectiveSlug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            required
            className={inputClass}
          />
        </Field>

        <Field
          label="Excerpt"
          hint="Shown on the blog listing card and used as the meta description. Around 150 characters works best."
        >
          <textarea
            name="description"
            defaultValue={values.description}
            rows={3}
            className={inputClass}
          />
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Author">
            <input
              name="author"
              defaultValue={values.author ?? 'Silver Storey Editorial Team'}
              className={inputClass}
            />
          </Field>
          <Field label="Category">
            <select
              name="category"
              defaultValue={values.category ?? ''}
              className={inputClass}
            >
              <option value="">— None —</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <ImageField
          name="mainImageUrl"
          label="Cover image"
          defaultValue={values.mainImageUrl}
          hint="Landscape, roughly 16:10. Used on the listing card and social shares."
        />

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-medium text-black">
              Body (Markdown)
            </span>
            <div className="flex items-center gap-3 text-xs text-black/45">
              <span>
                {markdownWordCount(body)} words · {markdownReadMinutes(body)}{' '}
                min read
              </span>
              <button
                type="button"
                onClick={() => setPreview((p) => !p)}
                className="rounded-full border border-black/20 px-3 py-1 font-medium text-black transition-colors hover:bg-black/5"
              >
                {preview ? 'Edit' : 'Preview'}
              </button>
            </div>
          </div>

          <input type="hidden" name="body" value={body} />

          {preview ? (
            <div className="min-h-[24rem] rounded-lg border border-black/15 bg-[#f0efec] p-6">
              {body.trim() ? (
                <Markdown source={body} />
              ) : (
                <p className="text-sm text-black/40">Nothing to preview yet.</p>
              )}
            </div>
          ) : (
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={20}
              spellCheck
              placeholder={MARKDOWN_HELP}
              className={`${inputClass} font-mono text-[13px] leading-relaxed`}
            />
          )}
          <span className="mt-1.5 block text-xs text-black/45">
            Markdown: <code>##</code> heading, <code>**bold**</code>,{' '}
            <code>*italic*</code>, <code>- bullet</code>,{' '}
            <code>1. numbered</code>, <code>&gt; quote</code>,{' '}
            <code>[link](/path)</code>, <code>![alt](image-url)</code> and pipe
            tables.
          </span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label="Publish date"
            hint="Leave blank to use the moment you publish."
          >
            <input
              type="datetime-local"
              name="publishedAt"
              defaultValue={values.publishedAt}
              className={inputClass}
            />
          </Field>
          <label className="flex items-center gap-2.5 self-end pb-2.5">
            <input
              type="checkbox"
              name="published"
              defaultChecked={values.published ?? false}
              className="h-4 w-4 rounded border-black/30"
            />
            <span className="text-sm font-medium text-black">
              Published (visible on the website)
            </span>
          </label>
        </div>

        {state.error && (
          <p
            className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
            role="alert"
          >
            {state.error}
          </p>
        )}

        <div className="flex items-center gap-3 border-t border-black/10 pt-5">
          <Button type="submit" disabled={pending}>
            {pending ? 'Saving…' : 'Save post'}
          </Button>
          <Link
            href="/admin/blog"
            className="text-sm text-black/55 hover:text-black"
          >
            Cancel
          </Link>
        </div>
      </form>
    </Card>
  );
}
