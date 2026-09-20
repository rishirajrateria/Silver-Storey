'use client';

import React, { useActionState } from 'react';
import Link from 'next/link';
import { saveCategory, type ActionState } from '@/app/admin/content-actions';
import { Button, Card, Field, inputClass } from './ui';
import ImageField from './ImageField';

export interface CategoryValues {
  id?: string;
  name?: string;
  price?: string;
  imageUrl?: string;
  order?: number;
  published?: boolean;
}

export default function CategoryForm({
  values = {},
}: {
  values?: CategoryValues;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    saveCategory,
    {},
  );

  return (
    <Card>
      <form action={formAction} className="space-y-6">
        {values.id && <input type="hidden" name="id" value={values.id} />}

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Name" hint="Shown on the card — e.g. Bedroom." required>
            <input
              name="name"
              defaultValue={values.name}
              required
              className={inputClass}
            />
          </Field>
          <Field
            label="Starting price"
            hint='Free text, e.g. "2.1 L".'
            required
          >
            <input
              name="price"
              defaultValue={values.price}
              required
              className={inputClass}
            />
          </Field>
        </div>

        <ImageField
          name="imageUrl"
          label="Background image"
          defaultValue={values.imageUrl}
          hint="Portrait images work best (roughly 400×500)."
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Display order" hint="Lower numbers appear first.">
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
            {pending ? 'Saving…' : 'Save category'}
          </Button>
          <Link
            href="/admin/categories"
            className="text-sm text-black/55 hover:text-black"
          >
            Cancel
          </Link>
        </div>
      </form>
    </Card>
  );
}
