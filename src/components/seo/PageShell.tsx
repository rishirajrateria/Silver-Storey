'use client';

import React, { useState } from 'react';
import HeroControls from '@/features/Hero/components/HeroControls';
import MenuOverlay from '@/features/Hero/components/MenuOverlay';

/**
 * Client wrapper that gives server-rendered SEO pages the same floating
 * controls and menu overlay as every other page on the site. The page
 * content is the document's `main` landmark, so pages built on the shell
 * must not render one of their own.
 */
export default function PageShell({
  children,
  projectPages = [],
  className = 'min-h-screen',
}: {
  children: React.ReactNode;
  projectPages?: { title: string; slug: string }[];
  className?: string;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className={className}>
      <main>{children}</main>
      <HeroControls onMenuClick={() => setIsMenuOpen(true)} />
      <MenuOverlay
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        projectPages={projectPages}
      />
    </div>
  );
}
