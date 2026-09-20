'use client';

import React, { useActionState } from 'react';
import { saveBrochure, type ActionState } from '@/app/admin/content-actions';
import { Button, Card } from './ui';
import ImageField from './ImageField';

export default function BrochureForm({
  activeFilename,
  activeUrl,
}: {
  activeFilename?: string;
  activeUrl?: string;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    saveBrochure,
    {},
  );

  return (
    <Card>
      <form action={formAction} className="space-y-6">
        {activeFilename && (
          <p className="text-sm text-black/55">
            Currently active:{' '}
            <a
              href={activeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-black underline-offset-2 hover:underline"
            >
              {activeFilename}
            </a>
          </p>
        )}

        <ImageField
          name="fileUrl"
          label="Brochure PDF"
          kind="file"
          hint="PDF only, up to 25 MB. The newly uploaded file becomes the active brochure when you save."
          required
        />

        {state.error && (
          <p
            className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
            role="alert"
          >
            {state.error}
          </p>
        )}

        <Button type="submit" disabled={pending}>
          {pending ? 'Saving…' : 'Set as active brochure'}
        </Button>
      </form>
    </Card>
  );
}
