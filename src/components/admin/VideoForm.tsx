'use client';

import React, { useActionState } from 'react';
import Link from 'next/link';
import { saveVideo, type ActionState } from '@/app/admin/content-actions';
import { Button, Card, Field, inputClass } from './ui';

export interface VideoValues {
  id?: string;
  title?: string;
  youtubeId?: string;
  description?: string;
  order?: number;
  published?: boolean;
}

export default function VideoForm({ values = {} }: { values?: VideoValues }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    saveVideo,
    {},
  );

  return (
    <Card>
      <form action={formAction} className="space-y-6">
        {values.id && <input type="hidden" name="id" value={values.id} />}

        <Field label="Title" required>
          <input
            name="title"
            defaultValue={values.title}
            required
            className={inputClass}
          />
        </Field>

        <Field
          label="YouTube link or video ID"
          hint="Paste the full YouTube URL — the ID is extracted automatically."
          required
        >
          <input
            name="youtubeId"
            defaultValue={values.youtubeId}
            required
            className={inputClass}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </Field>

        <Field label="Short description">
          <textarea
            name="description"
            defaultValue={values.description}
            rows={3}
            className={inputClass}
          />
        </Field>

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
            {pending ? 'Saving…' : 'Save video'}
          </Button>
          <Link
            href="/admin/videos"
            className="text-sm text-black/55 hover:text-black"
          >
            Cancel
          </Link>
        </div>
      </form>
    </Card>
  );
}
