'use client';

import React, { useRef, useState } from 'react';

/**
 * Image picker that uploads immediately and stores the resulting URL in a
 * hidden input, so the parent form submits a plain URL string.
 */
export default function ImageField({
  name,
  label,
  defaultValue = '',
  hint,
  kind = 'image',
  required,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  hint?: string;
  kind?: 'image' | 'file';
  required?: boolean;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setBusy(true);
    setError(null);
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('kind', kind);
      const res = await fetch('/api/admin/upload', { method: 'POST', body });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? 'Upload failed.');
      setUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-black">
        {label}
        {required && <span className="text-[#6b1a1a]"> *</span>}
      </span>

      <input type="hidden" name={name} value={url} />

      <div className="flex flex-wrap items-start gap-4">
        {url ? (
          kind === 'image' ? (
            <div className="relative h-24 w-32 overflow-hidden rounded-lg bg-black/5">
              <img src={url} alt="" className="h-full w-full object-cover" />
            </div>
          ) : (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-black/5 px-3 py-2 text-xs break-all text-black/70 underline-offset-2 hover:underline"
            >
              {url.split('/').pop()}
            </a>
          )
        ) : (
          <div className="flex h-24 w-32 items-center justify-center rounded-lg border border-dashed border-black/20 text-xs text-black/35">
            None
          </div>
        )}

        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept={kind === 'image' ? 'image/*' : 'application/pdf'}
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void upload(file);
            }}
            className="block w-full text-sm text-black/70 file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:opacity-85"
          />
          {busy && <span className="text-xs text-black/50">Uploading…</span>}
          {url && !busy && (
            <button
              type="button"
              onClick={() => setUrl('')}
              className="self-start text-xs text-red-700 underline-offset-2 hover:underline"
            >
              Remove
            </button>
          )}
          {error && <span className="text-xs text-red-700">{error}</span>}
        </div>
      </div>

      {hint && <span className="mt-2 block text-xs text-black/45">{hint}</span>}
    </div>
  );
}
