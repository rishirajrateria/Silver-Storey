import { cache } from 'react';
import { sanityClient } from './client';
import { allProjectPagesQuery } from './queries';

export type ProjectPageLink = { title: string; slug: string };

/** Menu links for CMS project pages; memoised per request and never throws. */
export const getProjectPages = cache(async (): Promise<ProjectPageLink[]> => {
  try {
    const pages =
      await sanityClient.fetch<ProjectPageLink[]>(allProjectPagesQuery);
    return (pages ?? []).filter((p) => Boolean(p?.slug));
  } catch {
    return [];
  }
});
