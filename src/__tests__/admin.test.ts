import { describe, it, expect } from 'vitest';
import { slugify, uniqueSlug } from '@/lib/admin/slug';
import { validateUpload, MAX_IMAGE_BYTES } from '@/lib/storage';

describe('slug helpers', () => {
  it('slugifies titles', () => {
    expect(slugify('Residential Projects')).toBe('residential-projects');
    expect(slugify('  3BHK Interiors — Kolkata!  ')).toBe(
      '3bhk-interiors-kolkata',
    );
    expect(slugify('Café & Bar')).toBe('cafe-bar');
  });

  it('never produces leading or trailing hyphens', () => {
    expect(slugify('--hello--')).toBe('hello');
    expect(slugify('!!!')).toBe('');
  });

  it('de-duplicates against existing slugs', () => {
    expect(uniqueSlug('Kitchen', [])).toBe('kitchen');
    expect(uniqueSlug('Kitchen', ['kitchen'])).toBe('kitchen-2');
    expect(uniqueSlug('Kitchen', ['kitchen', 'kitchen-2'])).toBe('kitchen-3');
  });

  it('falls back to a usable slug for unusable input', () => {
    expect(uniqueSlug('###', [])).toBe('page');
  });
});

describe('upload validation', () => {
  it('accepts supported images', () => {
    expect(
      validateUpload({ type: 'image/jpeg', size: 1000 }, 'image'),
    ).toBeNull();
    expect(
      validateUpload({ type: 'image/webp', size: 1000 }, 'image'),
    ).toBeNull();
  });

  it('rejects unsupported types, including scripts disguised as uploads', () => {
    expect(validateUpload({ type: 'text/html', size: 100 }, 'image')).toMatch(
      /Unsupported/,
    );
    expect(
      validateUpload({ type: 'application/javascript', size: 100 }, 'image'),
    ).toMatch(/Unsupported/);
    expect(validateUpload({ type: 'image/png', size: 100 }, 'file')).toMatch(
      /Unsupported/,
    );
  });

  it('rejects oversized and empty files', () => {
    expect(
      validateUpload({ type: 'image/png', size: MAX_IMAGE_BYTES + 1 }, 'image'),
    ).toMatch(/too large/);
    expect(validateUpload({ type: 'image/png', size: 0 }, 'image')).toMatch(
      /empty/,
    );
  });

  it('accepts a PDF only for the file kind', () => {
    expect(
      validateUpload({ type: 'application/pdf', size: 5000 }, 'file'),
    ).toBeNull();
    expect(
      validateUpload({ type: 'application/pdf', size: 5000 }, 'image'),
    ).toMatch(/Unsupported/);
  });
});
