'use client';

import React, { useActionState } from 'react';
import Link from 'next/link';
import {
  saveClientProject,
  type ActionState,
} from '@/app/admin/content-actions';
import { Button, Card, Field, inputClass } from './ui';
import { PROJECT_STATUSES, TRACK_STEPS } from '@/lib/track';

export interface ClientProjectValues {
  id?: string;
  accessCode?: string;
  clientName?: string;
  phoneLast4?: string;
  title?: string;
  city?: string;
  currentStep?: number;
  status?: string;
  startDate?: string;
  expectedHandover?: string;
  projectManager?: string;
  notes?: string;
}

export default function ClientProjectForm({
  values = {},
}: {
  values?: ClientProjectValues;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    saveClientProject,
    {},
  );

  return (
    <Card>
      <form action={formAction} className="space-y-6">
        {values.id && <input type="hidden" name="id" value={values.id} />}

        {values.accessCode && (
          <div className="rounded-lg bg-black px-4 py-3 text-white">
            <p className="text-xs tracking-[0.2em] text-white/60 uppercase">
              Project code — share with the client
            </p>
            <p className="mt-1 font-mono text-2xl font-bold tracking-widest">
              {values.accessCode}
            </p>
            <p className="mt-1 text-xs text-white/60">
              They log in at /track with this code and the last four digits of
              their phone.
            </p>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Client name" required>
            <input
              name="clientName"
              defaultValue={values.clientName}
              required
              className={inputClass}
            />
          </Field>
          <Field
            label="Last 4 digits of client phone"
            required
            hint="Their second login factor."
          >
            <input
              name="phoneLast4"
              defaultValue={values.phoneLast4}
              required
              inputMode="numeric"
              pattern="[0-9]{4}"
              maxLength={4}
              className={`${inputClass} font-mono tracking-widest`}
            />
          </Field>
          <Field
            label="Project title"
            required
            hint='e.g. "3BHK at Urbana, New Town"'
          >
            <input
              name="title"
              defaultValue={values.title}
              required
              className={inputClass}
            />
          </Field>
          <Field label="City">
            <input
              name="city"
              defaultValue={values.city}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <Field label="Current step" required>
            <select
              name="currentStep"
              defaultValue={values.currentStep ?? 1}
              className={inputClass}
            >
              {TRACK_STEPS.map((s) => (
                <option key={s.step} value={s.step}>
                  {s.step}. {s.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Status">
            <select
              name="status"
              defaultValue={values.status ?? 'active'}
              className={inputClass}
            >
              {PROJECT_STATUSES.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Project manager">
            <input
              name="projectManager"
              defaultValue={values.projectManager}
              className={inputClass}
            />
          </Field>
          <Field label="Start date">
            <input
              type="date"
              name="startDate"
              defaultValue={values.startDate}
              className={inputClass}
            />
          </Field>
          <Field label="Expected handover">
            <input
              type="date"
              name="expectedHandover"
              defaultValue={values.expectedHandover}
              className={inputClass}
            />
          </Field>
        </div>

        <Field
          label="Note to client"
          hint="Shown at the top of their tracker, e.g. next site visit."
        >
          <textarea
            name="notes"
            rows={2}
            defaultValue={values.notes}
            className={inputClass}
          />
        </Field>

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
            {pending
              ? 'Saving…'
              : values.id
                ? 'Save project'
                : 'Create project & generate code'}
          </Button>
          <Link
            href="/admin/client-projects"
            className="text-sm text-black/55 hover:text-black"
          >
            Cancel
          </Link>
        </div>
      </form>
    </Card>
  );
}
