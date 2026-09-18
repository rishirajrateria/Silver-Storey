import 'server-only';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile, unlink } from 'node:fs/promises';
import path from 'node:path';

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8 MB
export const MAX_FILE_BYTES = 25 * 1024 * 1024; // 25 MB (brochure PDFs)

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
] as const;

export const ALLOWED_FILE_TYPES = ['application/pdf'] as const;

export type UploadKind = 'image' | 'file';

export interface UploadResult {
  url: string;
  filename: string;
}

/** Vercel Blob is used when its token is present; otherwise local disk. */
export function isBlobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function safeName(original: string): string {
  const ext = path.extname(original).toLowerCase().slice(0, 10);
  const base = path
    .basename(original, path.extname(original))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return `${base || 'upload'}-${randomUUID().slice(0, 8)}${ext}`;
}

export function validateUpload(
  file: { type: string; size: number },
  kind: UploadKind,
): string | null {
  const allowed: readonly string[] =
    kind === 'image' ? ALLOWED_IMAGE_TYPES : ALLOWED_FILE_TYPES;
  const max = kind === 'image' ? MAX_IMAGE_BYTES : MAX_FILE_BYTES;

  if (!allowed.includes(file.type)) {
    return `Unsupported file type "${file.type || 'unknown'}". Allowed: ${allowed.join(', ')}.`;
  }
  if (file.size > max) {
    return `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum is ${max / 1024 / 1024} MB.`;
  }
  if (file.size === 0) return 'File is empty.';
  return null;
}

/**
 * Stores an upload and returns its public URL.
 *
 * Production (Vercel): Vercel Blob, served from its own CDN.
 * Local development: written to public/uploads, served by Next.js.
 */
export async function storeUpload(
  file: File,
  kind: UploadKind,
): Promise<UploadResult> {
  const filename = safeName(file.name || (kind === 'image' ? 'image' : 'file'));

  if (isBlobConfigured()) {
    const { put } = await import('@vercel/blob');
    const blob = await put(`silver-storey/${filename}`, file, {
      access: 'public',
      addRandomSuffix: false,
      contentType: file.type,
      cacheControlMaxAge: 31536000,
    });
    return { url: blob.url, filename };
  }

  const dir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(dir, { recursive: true });
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), bytes);
  return { url: `/uploads/${filename}`, filename };
}

/** Best-effort delete; never throws, since a missing file is not an error. */
export async function deleteUpload(url: string): Promise<void> {
  try {
    if (url.startsWith('/uploads/')) {
      await unlink(
        path.join(
          process.cwd(),
          'public',
          url.replace('/uploads/', 'uploads/'),
        ),
      );
      return;
    }
    if (isBlobConfigured() && url.includes('blob.vercel-storage.com')) {
      const { del } = await import('@vercel/blob');
      await del(url);
    }
  } catch (error) {
    console.error('[storage] delete failed:', error);
  }
}
