'use client';

import React, { useActionState, useEffect, useRef } from 'react';
import {
  addProjectUpdate,
  type ActionState,
} from '@/app/admin/content-actions';
import { Button, Card, Field, inputClass } from './ui';
import ImageField from './ImageField';
import { TRACK_STEPS } from '@/lib/track';

export default function ProjectUpdateForm({
  clientProjectId,
  currentStep,
}: {
  clientProjectId: string;
  currentStep: number;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    addProjectUpdate,
    {},
  );
  const formRef = useRef<HTMLFormElement>(null);
  // Remount the image picker after a successful post so it clears.
  const [resetKey, setResetKey] = React.useState(0);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      setResetKey((k) => k + 1);
    }
  }, [state]);

  return (
    <Card>
      <h2 className="mb-1 text-lg font-bold text-black">Post an update</h2>
      <p className="mb-5 text-sm text-black/55">
        Appears instantly on the client’s tracker.
      </p>
      <form ref={formRef} action={formAction} className="space-y-5">
        <input type="hidden" name="clientProjectId" value={clientProjectId} />
        <Field label="Title" required hint='e.g. "Kitchen carcasses installed"'>
          <input name="title" required className={inputClass} />
        </Field>
        <Field label="Details">
          <textarea name="body" rows={3} className={inputClass} />
        </Field>
        <ImageField
          key={resetKey}
          name="imageUrl"
          label="Site photo (optional)"
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Milestone" hint="Tag the update to a step.">
            <select
              name="step"
              defaultValue={currentStep}
              className={inputClass}
            >
              <option value="">None</option>
              {TRACK_STEPS.map((s) => (
                <option key={s.step} value={s.step}>
                  {s.step}. {s.name}
                </option>
              ))}
            </select>
          </Field>
          <label className="flex items-center gap-2.5 self-end pb-2.5">
            <input
              type="checkbox"
              name="advance"
              className="h-4 w-4 rounded border-black/30"
            />
            <span className="text-sm font-medium text-black">
              Move the project to this milestone
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
        {state.ok && !state.error && (
          <p
            className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800"
            role="status"
          >
            Update posted.
          </p>
        )}
        <Button type="submit" disabled={pending}>
          {pending ? 'Posting…' : 'Post update'}
        </Button>
      </form>
    </Card>
  );
}
