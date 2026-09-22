'use client';

import React, { useRef, useState } from 'react';

export interface EditorCategoryImage {
  key: string;
  imageUrl: string;
  title: string;
  price: string;
  /** True while the file is still uploading, so the row can show progress. */
  uploading?: boolean;
}

const newKey = () => Math.random().toString(36).slice(2, 10);

/**
 * The photo list for one category's gallery page.
 *
 * Pictures upload as soon as they are chosen — several at once — and each row
 * carries an optional title and price. The whole list is serialised into a
 * hidden input, which `saveCategory` parses, so the surrounding form stays a
 * plain server action with no client-side submit handling.
 */
export default function CategoryImagesEditor({
  name,
  initial,
}: {
  name: string;
  initial: EditorCategoryImage[];
}) {
  const [images, setImages] = useState<EditorCategoryImage[]>(initial);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const patch = (key: string, next: Partial<EditorCategoryImage>) =>
    setImages((prev) =>
      prev.map((i) => (i.key === key ? { ...i, ...next } : i)),
    );

  const remove = (key: string) =>
    setImages((prev) => prev.filter((i) => i.key !== key));

  const move = (index: number, delta: number) =>
    setImages((prev) => {
      const target = index + delta;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  async function upload(files: FileList) {
    setError(null);
    for (const file of Array.from(files)) {
      const key = newKey();
      // Show the row straight away, named after the file, so picking twenty
      // photos gives immediate feedback rather than a frozen page.
      setImages((prev) => [
        ...prev,
        {
          key,
          imageUrl: '',
          title: file.name.replace(/\.[^.]+$/, ''),
          price: '',
          uploading: true,
        },
      ]);
      try {
        const body = new FormData();
        body.append('file', file);
        body.append('kind', 'image');
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body,
        });
        const data = (await res.json()) as { url?: string; error?: string };
        if (!res.ok || !data.url)
          throw new Error(data.error ?? 'Upload failed.');
        patch(key, { imageUrl: data.url, uploading: false });
      } catch (err) {
        // A failed upload drops its row rather than leaving an empty card
        // that would silently vanish on save.
        setImages((prev) => prev.filter((i) => i.key !== key));
        setError(err instanceof Error ? err.message : 'Upload failed.');
      }
    }
    if (fileRef.current) fileRef.current.value = '';
  }

  const serialised = JSON.stringify(
    images
      .filter((i) => i.imageUrl)
      .map((i) => ({
        imageUrl: i.imageUrl,
        title: i.title.trim() || null,
        price: i.price.trim() || null,
      })),
  );

  return (
    <div>
      <input type="hidden" name={name} value={serialised} />

      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="block text-sm font-medium text-black">
            Gallery photos
          </span>
          <span className="text-xs text-black/50">
            Shown on this category&rsquo;s own page. Title and price are
            optional on each photo.
          </span>
        </div>
        <label className="cursor-pointer rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/85">
          Add photos
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && upload(e.target.files)}
          />
        </label>
      </div>

      {error && (
        <p
          className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      )}

      {images.length === 0 ? (
        <p className="rounded-xl border border-dashed border-black/20 px-4 py-8 text-center text-sm text-black/45">
          No photos yet. The category still appears on the site — its page just
          shows no gallery.
        </p>
      ) : (
        <ul className="list-none space-y-3">
          {images.map((image, index) => (
            <li
              key={image.key}
              className="flex flex-wrap items-start gap-4 rounded-xl border border-black/15 p-4"
            >
              <div className="h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-black/5">
                {image.imageUrl ? (
                  <img
                    src={image.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-xs text-black/40">
                    {image.uploading ? 'Uploading…' : '—'}
                  </span>
                )}
              </div>

              <div className="grid min-w-55 flex-1 gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-xs text-black/55">
                    Title
                  </span>
                  <input
                    value={image.title}
                    onChange={(e) =>
                      patch(image.key, { title: e.target.value })
                    }
                    placeholder="e.g. Walnut wardrobe wall"
                    className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/60"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs text-black/55">
                    Price
                  </span>
                  <input
                    value={image.price}
                    onChange={(e) =>
                      patch(image.key, { price: e.target.value })
                    }
                    placeholder='e.g. "1.2 L" or "On request"'
                    className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/60"
                  />
                </label>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label={`Move ${image.title || 'photo'} up`}
                  className="rounded px-2 py-1 text-black/50 hover:bg-black/5 disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === images.length - 1}
                  aria-label={`Move ${image.title || 'photo'} down`}
                  className="rounded px-2 py-1 text-black/50 hover:bg-black/5 disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => remove(image.key)}
                  aria-label={`Remove ${image.title || 'photo'}`}
                  className="rounded px-2 py-1 text-sm text-[#6b1a1a] hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
