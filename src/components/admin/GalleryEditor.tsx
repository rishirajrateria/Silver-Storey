'use client';

import React, { useCallback, useState } from 'react';
import { ROOM_TYPES } from '@/lib/rooms';

export interface EditorImage {
  key: string;
  title: string;
  description: string;
  imageUrl: string;
  roomType?: string;
}
export interface EditorSection {
  key: string;
  title: string;
  images: EditorImage[];
}

const newKey = () => Math.random().toString(36).slice(2, 10);

export const emptySection = (): EditorSection => ({
  key: newKey(),
  title: '',
  images: [],
});

/**
 * Builds the nested gallery structure (sections → images) and serialises it
 * into a hidden input, which the server action parses and validates.
 */
export default function GalleryEditor({
  name,
  initial,
}: {
  name: string;
  initial: EditorSection[];
}) {
  const [sections, setSections] = useState<EditorSection[]>(
    initial.length ? initial : [emptySection()],
  );

  const update = useCallback(
    (sectionKey: string, patch: Partial<EditorSection>) => {
      setSections((prev) =>
        prev.map((s) => (s.key === sectionKey ? { ...s, ...patch } : s)),
      );
    },
    [],
  );

  const updateImage = useCallback(
    (sectionKey: string, imageKey: string, patch: Partial<EditorImage>) => {
      setSections((prev) =>
        prev.map((s) =>
          s.key === sectionKey
            ? {
                ...s,
                images: s.images.map((i) =>
                  i.key === imageKey ? { ...i, ...patch } : i,
                ),
              }
            : s,
        ),
      );
    },
    [],
  );

  const move = (index: number, delta: number) => {
    setSections((prev) => {
      const next = [...prev];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const moveImage = (sectionKey: string, index: number, delta: number) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.key !== sectionKey) return s;
        const images = [...s.images];
        const target = index + delta;
        if (target < 0 || target >= images.length) return s;
        [images[index], images[target]] = [images[target], images[index]];
        return { ...s, images };
      }),
    );
  };

  async function uploadInto(sectionKey: string, files: FileList) {
    for (const file of Array.from(files)) {
      const key = newKey();
      setSections((prev) =>
        prev.map((s) =>
          s.key === sectionKey
            ? {
                ...s,
                images: [
                  ...s.images,
                  {
                    key,
                    title: file.name.replace(/\.[^.]+$/, ''),
                    description: '',
                    imageUrl: '',
                    roomType: '',
                  },
                ],
              }
            : s,
        ),
      );
      try {
        const body = new FormData();
        body.append('file', file);
        body.append('kind', 'image');
        const res = await fetch('/api/admin/upload', { method: 'POST', body });
        const data = (await res.json()) as { url?: string; error?: string };
        if (!res.ok || !data.url)
          throw new Error(data.error ?? 'Upload failed');
        updateImage(sectionKey, key, { imageUrl: data.url });
      } catch {
        // Drop the placeholder if its upload failed.
        setSections((prev) =>
          prev.map((s) =>
            s.key === sectionKey
              ? { ...s, images: s.images.filter((i) => i.key !== key) }
              : s,
          ),
        );
      }
    }
  }

  const serialised = JSON.stringify(
    sections
      .filter((s) => s.title.trim())
      .map((s) => ({
        title: s.title,
        images: s.images
          .filter((i) => i.imageUrl)
          .map((i) => ({
            title: i.title,
            description: i.description,
            imageUrl: i.imageUrl,
            roomType: i.roomType || null,
          })),
      })),
  );

  return (
    <div>
      <input type="hidden" name={name} value={serialised} />

      <div className="space-y-5">
        {sections.map((section, sIndex) => (
          <div
            key={section.key}
            className="rounded-xl border border-black/15 p-5"
          >
            <div className="mb-4 flex items-center gap-3">
              <input
                value={section.title}
                onChange={(e) => update(section.key, { title: e.target.value })}
                placeholder="Section title — e.g. Living Room Designs"
                className="flex-1 rounded-lg border border-black/15 px-3.5 py-2.5 text-sm font-medium outline-none focus:border-black/60"
              />
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(sIndex, -1)}
                  disabled={sIndex === 0}
                  aria-label="Move section up"
                  className="rounded px-2 py-1 text-black/50 hover:bg-black/5 disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(sIndex, 1)}
                  disabled={sIndex === sections.length - 1}
                  aria-label="Move section down"
                  className="rounded px-2 py-1 text-black/50 hover:bg-black/5 disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSections((prev) =>
                      prev.filter((s) => s.key !== section.key),
                    )
                  }
                  className="ml-1 rounded px-2 py-1 text-sm text-red-700 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            </div>

            {section.images.length > 0 && (
              <ul className="mb-4 space-y-3">
                {section.images.map((image, iIndex) => (
                  <li
                    key={image.key}
                    className="flex gap-3 rounded-lg bg-black/[0.03] p-3"
                  >
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-black/10">
                      {image.imageUrl ? (
                        <img
                          src={image.imageUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] text-black/40">
                          Uploading…
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        value={image.title}
                        onChange={(e) =>
                          updateImage(section.key, image.key, {
                            title: e.target.value,
                          })
                        }
                        placeholder="Card title"
                        className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/60"
                      />
                      <input
                        value={image.description}
                        onChange={(e) =>
                          updateImage(section.key, image.key, {
                            description: e.target.value,
                          })
                        }
                        placeholder="Card description (optional)"
                        className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-black/60"
                      />
                      <select
                        value={image.roomType ?? ''}
                        onChange={(e) =>
                          updateImage(section.key, image.key, {
                            roomType: e.target.value,
                          })
                        }
                        aria-label="Room type"
                        className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-black/60"
                      >
                        <option value="">
                          Room type (for the filter) — optional
                        </option>
                        {ROOM_TYPES.map((r) => (
                          <option key={r.key} value={r.key}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveImage(section.key, iIndex, -1)}
                        disabled={iIndex === 0}
                        aria-label="Move image up"
                        className="rounded px-2 text-black/50 hover:bg-black/5 disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(section.key, iIndex, 1)}
                        disabled={iIndex === section.images.length - 1}
                        aria-label="Move image down"
                        className="rounded px-2 text-black/50 hover:bg-black/5 disabled:opacity-30"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          update(section.key, {
                            images: section.images.filter(
                              (i) => i.key !== image.key,
                            ),
                          })
                        }
                        className="mt-1 text-xs text-red-700 hover:underline"
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                if (e.target.files?.length)
                  void uploadInto(section.key, e.target.files);
                e.target.value = '';
              }}
              className="block text-sm text-black/70 file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:opacity-85"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setSections((prev) => [...prev, emptySection()])}
        className="mt-4 rounded-full border border-black/20 px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-black/5"
      >
        + Add gallery section
      </button>
    </div>
  );
}
