/**
 * Project-page slugs that are not served at /projects/<slug>.
 *
 * Kept in their own module, free of any database import, so the admin forms
 * (client components) can share one source of truth with the server without
 * pulling Prisma into the browser bundle.
 */

/** Slug of the project page whose galleries feed /3d-visualisation. */
export const VISUALISATION_SLUG = '3d-visualisation';

/**
 * Project pages that no longer have a public page of their own. The
 * residential and commercial landing pages were retired in favour of the room
 * galleries; `/residential-projects` and `/commercial-projects` now redirect
 * to `/gallery` (see next.config.ts). The CMS rows are left untouched, but
 * nothing renders them, so they stay out of the menu and the sitemap and are
 * not resurrected at /projects/<slug>.
 */
export const RETIRED_PROJECT_SLUGS = [
  'residential-projects',
  'commercial-projects',
];

/** Project pages that /projects/[slug] must not render. */
export const RESERVED_PROJECT_SLUGS = [
  VISUALISATION_SLUG,
  ...RETIRED_PROJECT_SLUGS,
];
