'use client';

import React, { useActionState } from 'react';
import dayjs from 'dayjs';
import { lookupProject, type TrackState } from '@/app/(site)/track/actions';
import { TRACK_STEPS, statusLabel } from '@/lib/track';
import { SITE } from '@/lib/seo/site';

const field =
  'w-full rounded-lg border border-black/15 bg-white px-3.5 py-2.5 text-base text-black outline-none transition-colors focus:border-black/60';

export default function TrackForm() {
  const [state, formAction, pending] = useActionState<TrackState, FormData>(
    lookupProject,
    {},
  );
  const p = state.project;

  if (p) {
    const done = p.status === 'completed';
    return (
      <div className="space-y-6">
        <div className="rounded-2xl bg-black p-6 text-white sm:p-8">
          <p className="mb-1 text-xs font-semibold tracking-[0.25em] text-white/60 uppercase">
            {statusLabel(p.status)}
          </p>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {p.title}
          </h2>
          <p className="mt-1 text-sm text-white/70">
            Hello {p.clientName}
            {p.city ? ` · ${p.city}` : ''}
          </p>
          <dl className="mt-5 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            {p.startDate && (
              <div>
                <dt className="text-white/50">Started</dt>
                <dd className="font-semibold">
                  {dayjs(p.startDate).format('D MMM YYYY')}
                </dd>
              </div>
            )}
            {p.expectedHandover && (
              <div>
                <dt className="text-white/50">
                  {done ? 'Handed over' : 'Expected handover'}
                </dt>
                <dd className="font-semibold">
                  {dayjs(p.expectedHandover).format('D MMM YYYY')}
                </dd>
              </div>
            )}
            {p.projectManager && (
              <div>
                <dt className="text-white/50">Project manager</dt>
                <dd className="font-semibold">{p.projectManager}</dd>
              </div>
            )}
            <div>
              <dt className="text-white/50">Stage</dt>
              <dd className="font-semibold">
                {done
                  ? 'Complete'
                  : `${p.currentStep} of ${TRACK_STEPS.length}`}
              </dd>
            </div>
          </dl>
        </div>

        <ol
          className="glass-panel rounded-2xl p-6 sm:p-8"
          aria-label="Project milestones"
        >
          {TRACK_STEPS.map((s, i) => {
            const reached = done || s.step <= p.currentStep;
            const current = !done && s.step === p.currentStep;
            return (
              <li key={s.step} className="relative flex gap-4 pb-6 last:pb-0">
                {i < TRACK_STEPS.length - 1 && (
                  <span
                    aria-hidden
                    className={`absolute top-8 left-[15px] h-full w-0.5 ${reached && (done || s.step < p.currentStep) ? 'bg-[#6b1a1a]' : 'bg-black/10'}`}
                  />
                )}
                <span
                  className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    reached
                      ? 'bg-[#6b1a1a] text-white'
                      : 'border border-black/15 bg-white text-black/40'
                  } ${current ? 'ring-4 ring-[#6b1a1a]/20' : ''}`}
                >
                  {reached && !current ? '✓' : s.step}
                </span>
                <div>
                  <p
                    className={`font-semibold ${reached ? 'text-black' : 'text-black/45'}`}
                  >
                    {s.name}
                    {current && (
                      <span className="ml-2 rounded-full bg-[#6b1a1a]/10 px-2 py-0.5 text-[11px] font-semibold text-[#6b1a1a]">
                        Current
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-sm text-black/55">{s.text}</p>
                </div>
              </li>
            );
          })}
        </ol>

        {p.notes && (
          <div className="glass-panel rounded-2xl p-6">
            <p className="mb-1 text-xs font-semibold tracking-[0.2em] text-black/50 uppercase">
              Note from your team
            </p>
            <p className="text-sm text-black/75">{p.notes}</p>
          </div>
        )}

        <div>
          <h3 className="mb-4 text-lg font-bold text-black">Updates</h3>
          {p.updates.length === 0 ? (
            <p className="glass-panel rounded-2xl p-6 text-sm text-black/55">
              No updates posted yet — your project manager will add photos and
              notes as work progresses.
            </p>
          ) : (
            <ul className="space-y-4">
              {p.updates.map((u) => (
                <li
                  key={u.id}
                  className="glass-panel overflow-hidden rounded-2xl"
                >
                  {u.imageUrl && (
                    <img
                      src={u.imageUrl}
                      alt={u.title}
                      loading="lazy"
                      decoding="async"
                      className="max-h-96 w-full object-cover"
                    />
                  )}
                  <div className="p-5">
                    <p className="text-xs text-black/45">
                      {dayjs(u.createdAt).format('D MMM YYYY, h:mm A')}
                      {u.step &&
                        ` · ${TRACK_STEPS[u.step - 1]?.name ?? `Step ${u.step}`}`}
                    </p>
                    <p className="mt-1 font-semibold text-black">{u.title}</p>
                    {u.body && (
                      <p className="mt-1 text-sm whitespace-pre-line text-black/70">
                        {u.body}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="text-sm text-black/55">
          Questions? Call or WhatsApp {SITE.phoneDisplay} — quote your project
          code.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="glass-panel rounded-2xl p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-black">
            Project code
          </span>
          <input
            name="accessCode"
            required
            placeholder="SS-XXXXXX"
            autoCapitalize="characters"
            autoComplete="off"
            className={`${field} font-mono tracking-widest uppercase`}
          />
          <span className="mt-1.5 block text-xs text-black/45">
            From your welcome message or your project manager.
          </span>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-black">
            Last 4 digits of your phone
          </span>
          <input
            name="phoneLast4"
            required
            inputMode="numeric"
            pattern="[0-9]{4}"
            maxLength={4}
            placeholder="••••"
            autoComplete="off"
            className={`${field} font-mono tracking-widest`}
          />
          <span className="mt-1.5 block text-xs text-black/45">
            The number registered on your project.
          </span>
        </label>
      </div>
      {state.error && (
        <p
          role="alert"
          className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="btn-bump mt-6 flex w-full items-center justify-center rounded-full bg-black px-8 py-3 text-sm font-medium text-white disabled:opacity-60 sm:w-auto"
      >
        {pending ? 'Looking up…' : 'View my project'}
      </button>
    </form>
  );
}
