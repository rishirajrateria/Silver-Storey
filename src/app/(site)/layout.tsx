import React from 'react';
import SiteFooter from '@/components/SiteFooter';
import Analytics from '@/components/Analytics';

/**
 * Layout for the public website. The marketing footer and the page-view
 * tracker belong here rather than in the root layout, so the admin panel does
 * not inherit them.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <SiteFooter />
      <Analytics />
    </>
  );
}
