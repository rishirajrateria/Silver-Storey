/** Converts a title into a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);
}

/** Appends -2, -3, … until the slug is unique among `taken`. */
export function uniqueSlug(base: string, taken: string[]): string {
  const slug = slugify(base) || 'page';
  if (!taken.includes(slug)) return slug;
  let n = 2;
  while (taken.includes(`${slug}-${n}`)) n++;
  return `${slug}-${n}`;
}
