'use client';

import React, { useActionState, useState } from 'react';
import Link from 'next/link';
import { saveLookbook, type ActionState } from '@/app/admin/content-actions';
import { Button, Card, Field, inputClass } from './ui';
import ImageField from './ImageField';
import { ROOM_TYPES } from '@/lib/rooms';
import { slugify } from '@/lib/admin/slug';

export interface LookbookValues {
  id?: string;
  title?: string;
  slug?: string;
  description?: string;
  roomType?: string;
  fileUrl?: string;
  coverImageUrl?: string;
  pages?: number;
  order?: number;
  published?: boolean;
}

export default function LookbookForm({
  values = {},
}: {
  values?: LookbookValues;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    saveLookbook,
    {},
  );
  const [title, setTitle] = useState(values.title ?? '');
  const [slug, setSlug] = useState(values.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(Boolean(values.slug));
  const effectiveSlug = slugTouched ? slugify(slug) : slugify(title);

  return (
    <Card>
      <form action={formAction} className="space-y-6">
        {values.id && <input type="hidden" name="id" value={values.id} />}

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Title" required hint='e.g. "Modular Kitchens 2026"'>
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
            required
            hint={`Lives at /lookbooks/${effectiveSlug || '…'}`}
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
        </div>

        <Field
          label="Description"
          hint="One or two sentences shown on the card and used as the meta description."
        >
          <textarea
            name="description"
            rows={3}
            defaultValue={values.description}
            className={inputClass}
          />
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <ImageField
            name="fileUrl"
            label="Lookbook PDF"
            kind="file"
            defaultValue={values.fileUrl}
            hint="PDF only, up to 25 MB."
            required
          />
          <ImageField
            name="coverImageUrl"
            label="Cover image"
            defaultValue={values.coverImageUrl}
            hint="Landscape, roughly 1200×900."
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <Field label="Room / theme">
            <select
              name="roomType"
              defaultValue={values.roomType ?? ''}
              className={inputClass}
            >
              <option value="">Any</option>
              {ROOM_TYPES.map((r) => (
                <option key={r.key} value={r.key}>
                  {r.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Pages">
            <input
              type="number"
              name="pages"
              min={1}
              defaultValue={values.pages ?? ''}
              className={inputClass}
            />
          </Field>
          <Field label="Display order" hint="Lower numbers appear first.">
            <input
              type="number"
              name="order"
              defaultValue={values.order ?? 0}
              className={inputClass}
            />
          </Field>
        </div>

        <label className="flex items-center gap-2.5">
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
            {pending ? 'Saving…' : 'Save lookbook'}
          </Button>
          <Link
            href="/admin/lookbooks"
            className="text-sm text-black/55 hover:text-black"
          >
            Cancel
          </Link>
        </div>
      </form>
    </Card>
  );
}
