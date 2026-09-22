import React from 'react';
import SiteFooter from '@/components/SiteFooter';
import Analytics from '@/components/Analytics';
import { CategoriesProvider } from '@/features/Gallery/CategoriesContext';
import { getCategories } from '@/lib/db/content';

/**
 * Layout for the public website. The marketing footer and the page-view
 * tracker belong here rather than in the root layout, so the admin panel does
 * not inherit them.
 *
 * Room categories are fetched once here and shared through context, so every
 * page's menu lists the same rooms without each one running its own query.
 */
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();

  return (
    <CategoriesProvider
      categories={categories.map(({ name, slug }) => ({ name, slug }))}
    >
      {children}
      <SiteFooter categories={categories} />
      <Analytics />
    </CategoriesProvider>
  );
}
