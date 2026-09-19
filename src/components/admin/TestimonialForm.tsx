'use client';

import React, { useActionState } from 'react';
import Link from 'next/link';
import { saveTestimonial, type ActionState } from '@/app/admin/content-actions';
import { Button, Card, Field, inputClass } from './ui';
import ImageField from './ImageField';

export interface TestimonialValues {
  id?: string;
  name?: string;
  location?: string;
  projectType?: string;
  rating?: number;
  quote?: string;
  imageUrl?: string;
  source?: string;
  sourceUrl?: string;
  order?: number;
  published?: boolean;
}

export default function TestimonialForm({
  values = {},
}: {
  values?: TestimonialValues;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    saveTestimonial,
    {},
  );

  return (
    <Card>
      <form action={formAction} className="space-y-6">
        {values.id && <input type="hidden" name="id" value={values.id} />}

        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
          Only add reviews clients actually gave you. Published testimonials are
          also emitted as Review/AggregateRating markup for Google, and
          fabricated reviews violate Google’s guidelines.
        </p>

        <div className="grid gap-6 sm:grid-cols-3">
          <Field label="Client name" required>
            <input
              name="name"
              defaultValue={values.name}
              required
              className={inputClass}
            />
          </Field>
          <Field label="Location" hint="e.g. New Town, Kolkata">
            <input
              name="location"
              defaultValue={values.location}
              className={inputClass}
            />
          </Field>
          <Field label="Project" hint="e.g. 3BHK full home">
            <input
              name="projectType"
              defaultValue={values.projectType}
              className={inputClass}
            />
          </Field>
        </div>

        <Field
          label="Quote"
          hint="Their words, lightly trimmed at most."
          required
        >
          <textarea
            name="quote"
            rows={4}
            defaultValue={values.quote}
            required
            className={inputClass}
          />
        </Field>

        <div className="grid gap-6 sm:grid-cols-3">
          <Field label="Rating (1–5)" required>
            <select
              name="rating"
              defaultValue={values.rating ?? 5}
              className={inputClass}
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} star{r > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Source">
            <select
              name="source"
              defaultValue={values.source ?? 'direct'}
              className={inputClass}
            >
              <option value="direct">Given directly to us</option>
              <option value="google">Google review</option>
              <option value="other">Other platform</option>
            </select>
          </Field>
          <Field label="Source link" hint="Optional — the public review URL.">
            <input
              name="sourceUrl"
              type="url"
              defaultValue={values.sourceUrl}
              className={inputClass}
            />
          </Field>
        </div>

        <ImageField
          name="imageUrl"
          label="Client photo (optional)"
          defaultValue={values.imageUrl}
          hint="Only with permission."
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
            {pending ? 'Saving…' : 'Save testimonial'}
          </Button>
          <Link
            href="/admin/testimonials"
            className="text-sm text-black/55 hover:text-black"
          >
            Cancel
          </Link>
        </div>
      </form>
    </Card>
  );
}
