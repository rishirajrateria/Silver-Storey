'use client';

import React, { createContext, useContext } from 'react';

export interface MenuCategory {
  name: string;
  slug: string;
}

const CategoriesContext = createContext<MenuCategory[]>([]);

/**
 * Makes the CMS room categories available to the menu overlay on every page.
 *
 * The menu is rendered by a dozen different server pages; fetching once in the
 * site layout and reading it from context keeps them all showing the same
 * rooms without every page needing its own query.
 */
export function CategoriesProvider({
  categories,
  children,
}: {
  categories: MenuCategory[];
  children: React.ReactNode;
}) {
  return (
    <CategoriesContext.Provider value={categories}>
      {children}
    </CategoriesContext.Provider>
  );
}

/** Room categories for the menu. Empty outside the provider, which is fine —
 *  the menu simply omits the rooms row. */
export function useMenuCategories(): MenuCategory[] {
  return useContext(CategoriesContext);
}
