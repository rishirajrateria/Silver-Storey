'use client';

import React, { useState } from 'react';
import HeroControls from '../Hero/components/HeroControls';
import MenuOverlay from '../Hero/components/MenuOverlay';
import HowItWorksHero from './components/HowItWorksHero';
import HowItWorksSteps from './components/HowItWorksSteps';

export default function HowItWorksPage({
  projectPages = [],
}: {
  projectPages?: { title: string; slug: string }[];
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <HowItWorksHero />
      <HowItWorksSteps />
      <HeroControls onMenuClick={() => setIsMenuOpen(true)} />
      <MenuOverlay
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        projectPages={projectPages}
      />
    </div>
  );
}
