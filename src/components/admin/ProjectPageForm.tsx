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
  summary?: string;
  location?: string;
  areaSqft?: number;
  budget?: string;
  durationDays?: number;
  propertyType?: string;
  style?: string;
  materials?: string;
  clientName?: string;
  clientQuote?: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
}

/** Slugs the site renders through dedicated routes. */
const RESERVED = [
  'residential-projects',
  'commercial-projects',
  '3d-visualisation',
];

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

        <details
          className="rounded-xl border border-black/15 p-5"
          open={Boolean(
            values.summary || values.location || values.clientQuote,
          )}
        >
          <summary className="cursor-pointer text-sm font-semibold text-black">
            Case study details (optional)
          </summary>
          <p className="mt-2 mb-5 text-xs text-black/45">
            Fill these in to turn a plain gallery into a case study: a facts
            bar, the story, materials, a before/after slider and a client quote
            appear above the gallery. Leave blank for a plain gallery.
          </p>
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-3">
              <Field label="Location" hint="e.g. New Town, Kolkata">
                <input
                  name="location"
                  defaultValue={values.location}
                  className={inputClass}
                />
              </Field>
              <Field label="Property type" hint="e.g. 3BHK apartment">
                <input
                  name="propertyType"
                  defaultValue={values.propertyType}
                  className={inputClass}
                />
              </Field>
              <Field label="Style" hint="e.g. Warm minimal">
                <input
                  name="style"
                  defaultValue={values.style}
                  className={inputClass}
                />
              </Field>
              <Field label="Area (sq ft)">
                <input
                  type="number"
                  name="areaSqft"
                  min={0}
                  defaultValue={values.areaSqft ?? ''}
                  className={inputClass}
                />
              </Field>
              <Field label="Budget" hint='Free text, e.g. "₹12 L" or "₹8–10 L"'>
                <input
                  name="budget"
                  defaultValue={values.budget}
                  className={inputClass}
                />
              </Field>
              <Field label="Delivered in (days)">
                <input
                  type="number"
                  name="durationDays"
                  min={0}
                  defaultValue={values.durationDays ?? ''}
                  className={inputClass}
                />
              </Field>
            </div>
            <Field
              label="The story (Markdown)"
              hint="The brief, the challenge and what we did. Headings with ##, lists with -."
            >
              <textarea
                name="summary"
                rows={8}
                defaultValue={values.summary}
                className={`${inputClass} font-mono text-xs`}
              />
            </Field>
            <Field
              label="Materials & brands"
              hint="Comma-separated, e.g. Greenply BWP, Hettich hardware, Asian Paints Royale"
            >
              <input
                name="materials"
                defaultValue={values.materials}
                className={inputClass}
              />
            </Field>
            <div className="grid gap-6 sm:grid-cols-2">
              <ImageField
                name="beforeImageUrl"
                label="Before photo"
                defaultValue={values.beforeImageUrl}
                hint="Same angle as the after photo for the slider."
              />
              <ImageField
                name="afterImageUrl"
                label="After photo"
                defaultValue={values.afterImageUrl}
              />
            </div>
            <div className="grid gap-6 sm:grid-cols-[1fr_2fr]">
              <Field label="Client name" hint="With their permission.">
                <input
                  name="clientName"
                  defaultValue={values.clientName}
                  className={inputClass}
                />
              </Field>
              <Field
                label="Client quote"
                hint="Their own words — never invent one."
              >
                <textarea
                  name="clientQuote"
                  rows={2}
                  defaultValue={values.clientQuote}
                  className={inputClass}
                />
              </Field>
            </div>
          </div>
        </details>

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
