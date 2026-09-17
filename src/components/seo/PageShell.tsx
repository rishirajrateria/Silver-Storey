'use client';

import React, { useState } from 'react';
import HeroControls from '@/features/Hero/components/HeroControls';
import MenuOverlay from '@/features/Hero/components/MenuOverlay';

/**
 * Client wrapper that gives server-rendered SEO pages the same floating
 * controls and menu overlay as every other page on the site.
 */
export default function PageShell({
  children,
  projectPages = [],
  className = 'min-h-screen bg-[#f0efec]',
}: {
  children: React.ReactNode;
  projectPages?: { title: string; slug: string }[];
  className?: string;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className={className}>
      {children}
      <HeroControls onMenuClick={() => setIsMenuOpen(true)} />
      <MenuOverlay
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        projectPages={projectPages}
      />
    </div>
  );
}
