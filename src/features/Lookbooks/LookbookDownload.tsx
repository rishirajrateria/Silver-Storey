'use client';

import React, { useState } from 'react';

/**
 * Email-gated download. The PDF URL is only returned by the API once the
 * visitor's details are saved, so the lookbook doubles as a lead magnet.
 */
export default function LookbookDownload({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company_website: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'ready' | 'error'>(
    'idle',
  );
  const [message, setMessage] = useState('');
  const [fileUrl, setFileUrl] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setMessage('');
    try {
      const res = await fetch('/api/lookbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, slug }),
      });
      const data = (await res.json()) as { error?: string; fileUrl?: string };
      if (!res.ok || !data.fileUrl)
        throw new Error(data.error || 'Could not unlock the download.');
      setFileUrl(data.fileUrl);
      setStatus('ready');
      // Open straight away; the button below stays as a fallback for popup blockers.
      window.open(data.fileUrl, '_blank', 'noopener');
    } catch (err) {
      setStatus('error');
      setMessage(
        err instanceof Error ? err.message : 'Could not unlock the download.',
      );
    }
  }

  const field =
    'w-full rounded-lg border border-black/15 bg-white px-3.5 py-2.5 text-sm text-black outline-none transition-colors focus:border-black/60';

  if (status === 'ready') {
    return (
      <div className="glass-panel rounded-2xl p-6 sm:p-8">
        <p className="mb-3 text-lg font-bold text-black">
          Your lookbook is ready
        </p>
        <p className="mb-5 text-sm text-black/60">
          If it did not open automatically, use the button below. A designer
          will also be in touch in case you would like to discuss any of the
          designs.
        </p>
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-bump inline-flex items-center justify-center rounded-full bg-black px-8 py-3 text-sm font-medium text-white"
        >
          Open {title} (PDF)
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="glass-panel rounded-2xl p-6 sm:p-8">
      <p className="mb-1 text-lg font-bold text-black">Download the lookbook</p>
      <p className="mb-5 text-sm text-black/60">
        Free PDF. Tell us where to send design ideas and we unlock it instantly.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          required
          placeholder="Your name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={field}
        />
        <input
          required
          type="tel"
          placeholder="Phone / WhatsApp"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className={field}
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={`${field} sm:col-span-2`}
        />
        <input
          type="text"
          name="company_website"
          value={form.company_website}
          onChange={(e) =>
            setForm({ ...form, company_website: e.target.value })
          }
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />
      </div>
      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn-bump mt-4 flex w-full items-center justify-center rounded-full bg-black px-8 py-3 text-sm font-medium text-white disabled:opacity-60 sm:w-auto"
      >
        {status === 'sending' ? 'Unlocking…' : 'Get the PDF'}
      </button>
      {message && (
        <p role="alert" className="mt-3 text-xs text-red-700">
          {message}
        </p>
      )}
      <p className="mt-3 text-[11px] text-black/45">
        We never share your details. You can ask us to delete them at any time.
      </p>
    </form>
  );
}
