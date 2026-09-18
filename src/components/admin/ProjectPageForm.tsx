'use client';

import React, { useActionState, useState } from 'react';
import Link from 'next/link';
import { saveProjectPage, type ActionState } from '@/app/admin/content-actions';
import { Button, Card, Field, inputClass } from './ui';
import ImageField from './ImageField';
import GalleryEditor, { type EditorSection } from './GalleryEditor';
import { slugify } from '@/lib/admin/slug';

export interface ProjectPageValues {
  id?: string;
  title?: string;
  slug?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImageUrl?: string;
  order?: number;
  published?: boolean;
  sections?: EditorSection[];
}

/** Slugs the site renders through dedicated routes. */
const RESERVED = ['residential-projects', 'commercial-projects'];

export default function ProjectPageForm({
  values = {},
}: {
  values?: ProjectPageValues;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    saveProjectPage,
    {},
  );
  const [title, setTitle] = useState(values.title ?? '');
  const [slug, setSlug] = useState(values.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(Boolean(values.slug));

  const effectiveSlug = slugTouched ? slugify(slug) : slugify(title);
  const isReserved = RESERVED.includes(effectiveSlug);

  return (
    <Card>
      <form action={formAction} className="space-y-6">
        {values.id && <input type="hidden" name="id" value={values.id} />}

        <Field
          label="Page title"
          hint="Used in the admin list and the site menu."
          required
        >
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
          hint={
            isReserved
              ? `Reserved slug — this page will render at /${effectiveSlug} instead of /projects/${effectiveSlug}.`
              : `The page will live at /projects/${effectiveSlug || '…'}`
          }
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

        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label="Hero heading — line 1"
            hint='e.g. "Residential"'
            required
          >
            <input
              name="heroTitle"
              defaultValue={values.heroTitle}
              required
              className={inputClass}
            />
          </Field>
          <Field label="Hero heading — line 2" hint='e.g. "designs"'>
            <input
              name="heroSubtitle"
              defaultValue={values.heroSubtitle}
              className={inputClass}
            />
          </Field>
        </div>

        <ImageField
          name="heroImageUrl"
          label="Hero background image"
          defaultValue={values.heroImageUrl}
          hint="Wide, landscape image (roughly 1920×1080)."
        />

        <div>
          <span className="mb-1.5 block text-sm font-medium text-black">
            Gallery sections
          </span>
          <p className="mb-3 text-xs text-black/45">
            Each section is a titled row of image cards. Upload several images
            at once; they are added in the order selected.
          </p>
          <GalleryEditor name="sections" initial={values.sections ?? []} />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label="Display order"
            hint="Controls the order in the site menu."
          >
            <input
              type="number"
              name="order"
              defaultValue={values.order ?? 0}
              className={inputClass}
            />
          </Field>
          <label className="flex items-center gap-2.5 self-end pb-2.5">
            <input
              type="checkbox"
              name="published"
              defaultChecked={values.published ?? true}
              className="h-4 w-4 rounded border-black/30"
            />
            <span className="text-sm font-medium text-black">
              Visible on the website
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
            {pending ? 'Saving…' : 'Save page'}
          </Button>
          <Link
            href="/admin/projects"
            className="text-sm text-black/55 hover:text-black"
          >
            Cancel
          </Link>
        </div>
      </form>
    </Card>
  );
}
