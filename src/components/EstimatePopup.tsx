'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/** Matches the server's honeypot field name in lib/auth/form-guard.ts. */
const HONEYPOT_FIELD = 'company_website';

type Status = 'idle' | 'sending' | 'done';

/**
 * "Get free estimate" — one phone field and nothing else.
 *
 * The full calculator still lives at /estimate for people who want to play
 * with numbers; this is for the far larger group who just want a call back,
 * and every field removed from it is an enquiry gained.
 */
export default function EstimatePopup({
  children,
  className,
}: {
  /** The trigger's label — styled by the caller so it fits where it sits. */
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Escape closes, and the page behind must not scroll while it is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    inputRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Returning focus to the button is what keyboard and screen-reader users
  // need in order not to lose their place on the page.
  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    setError('');

    const form = e.currentTarget;
    const honeypot = (
      form.elements.namedItem(HONEYPOT_FIELD) as HTMLInputElement | null
    )?.value;

    try {
      const res = await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          sourcePath: window.location.pathname,
          [HONEYPOT_FIELD]: honeypot ?? '',
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error || 'Could not send. Please try again.');
        setStatus('idle');
        return;
      }
      setStatus('done');
    } catch {
      setError('Could not send. Please check your connection.');
      setStatus('idle');
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setStatus('idle');
          setError('');
          setPhone('');
          setOpen(true);
        }}
        className={className}
      >
        {children}
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="estimate-popup-title"
          >
            <div
              aria-hidden
              onClick={close}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <div className="relative w-full max-w-sm rounded-2xl bg-white p-7 shadow-2xl">
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full text-black/40 transition-colors hover:bg-black/5 hover:text-black"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  className="h-4 w-4"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>

              {status === 'done' ? (
                <div className="py-4 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                  </div>
                  <h2
                    id="estimate-popup-title"
                    className="mb-1 text-xl font-bold tracking-tight text-black"
                  >
                    Thank you
                  </h2>
                  <p className="text-sm text-black/60">
                    We have your number and will call you shortly.
                  </p>
                </div>
              ) : (
                <>
                  <h2
                    id="estimate-popup-title"
                    className="mb-1 text-xl font-bold tracking-tight text-black"
                  >
                    Get a free estimate
                  </h2>
                  <p className="mb-5 text-sm text-black/55">
                    Leave your number and we will call you back.
                  </p>

                  <form onSubmit={submit} noValidate>
                    {/* Hidden from people, irresistible to bots. */}
                    <input
                      type="text"
                      name={HONEYPOT_FIELD}
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden
                      className="absolute left-[-9999px] h-0 w-0 opacity-0"
                    />

                    <label htmlFor="estimate-popup-phone" className="sr-only">
                      Phone number
                    </label>
                    <input
                      ref={inputRef}
                      id="estimate-popup-phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Your phone number"
                      className="w-full rounded-xl border border-black/15 px-4 py-3 text-base text-black outline-none focus:border-black"
                    />

                    {error && (
                      <p role="alert" className="mt-2 text-sm text-[#a11]">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="mt-4 w-full rounded-xl bg-black py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                    >
                      {status === 'sending' ? 'Sending…' : 'Request call back'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
