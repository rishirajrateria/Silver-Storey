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

/**
 * Largest dimension kept for uploaded images. Sanity's CDN used to resize on
 * the fly (e.g. `.width(640).height(800)`); since we serve files directly, we
 * do the equivalent once, at upload time, so a 6 MB phone photo does not end
 * up on the home page.
 */
const MAX_IMAGE_DIMENSION = 2000;
const WEBP_QUALITY = 82;

/**
 * Re-encodes an image to WebP, bounded to MAX_IMAGE_DIMENSION, without
 * enlarging smaller images. Returns the original bytes unchanged if the image
 * cannot be processed (e.g. an unusual encoding), so an upload never fails
 * purely because optimisation did.
 */
async function optimiseImage(file: File): Promise<{
  body: Buffer | File;
  contentType: string;
  extension: string | null;
}> {
  try {
    const sharp = (await import('sharp')).default;
    const input = Buffer.from(await file.arrayBuffer());
    const output = await sharp(input, { animated: file.type === 'image/gif' })
      .rotate() // honour EXIF orientation before stripping metadata
      .resize({
        width: MAX_IMAGE_DIMENSION,
        height: MAX_IMAGE_DIMENSION,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

    // Keep the original if re-encoding made it bigger (already-optimised files).
    if (output.byteLength >= input.byteLength) {
      return { body: file, contentType: file.type, extension: null };
    }
    return { body: output, contentType: 'image/webp', extension: '.webp' };
  } catch (error) {
    console.error('[storage] image optimisation skipped:', error);
    return { body: file, contentType: file.type, extension: null };
  }
}

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
  let filename = safeName(file.name || (kind === 'image' ? 'image' : 'file'));
  let body: Buffer | File = file;
  let contentType = file.type;

  if (kind === 'image') {
    const optimised = await optimiseImage(file);
    body = optimised.body;
    contentType = optimised.contentType;
    if (optimised.extension) {
      filename = filename.replace(/\.[^.]*$/, '') + optimised.extension;
    }
  }

  if (isBlobConfigured()) {
    const { put } = await import('@vercel/blob');
    const blob = await put(`silver-storey/${filename}`, body, {
      access: 'public',
      addRandomSuffix: false,
      contentType,
      cacheControlMaxAge: 31536000,
    });
    return { url: blob.url, filename };
  }

  const dir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(dir, { recursive: true });
  const bytes =
    body instanceof File ? Buffer.from(await body.arrayBuffer()) : body;
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
