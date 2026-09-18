'use client';

import React, { useState } from 'react';
import { reviews, stats } from './constants';
import HeroHeader from './components/HeroHeader';
import HeroControls from './components/HeroControls';
import CategoryCard from './components/CategoryCard';
import StatsGrid from './components/StatsGrid';
import MenuOverlay from './components/MenuOverlay';
import WarrantySection from './components/WarrantySection';
import VideoSection from './components/VideoSection';
import ServicesSection from './components/ServicesSection';
import RoomGallery from './components/RoomGallery';
import BookConsultation from './components/BookConsultation';
import BrandsMarquee from './components/BrandsMarquee';
import Testimonials from './components/Testimonials';
import FoundersSection from './components/FoundersSection';
import Footer from './components/Footer';
import { useSlider } from '../../hooks/useSlider';
import type { Category } from './types';
import type { VideoItem } from '../../lib/db/content';

interface HeroProps {
  /** Category cards — from the CMS; falls back to hardcoded constants */
  categories?: Category[];
  /** YouTube videos — from the CMS; an empty array shows static placeholders */
  videos?: VideoItem[];
  /** Project pages from the CMS — added to the nav menu automatically */
  projectPages?: { title: string; slug: string }[];
  /** Brochure PDF download URL from the CMS */
  brochureUrl?: string;
}

export default function Hero({
  categories = [],
  videos = [],
  projectPages = [],
  brochureUrl,
}: HeroProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentSlide, nextSlide, prevSlide, setCurrentSlide } = useSlider(
    reviews.length,
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="relative h-screen w-full overflow-hidden">
        <HeroHeader />
        <HeroControls onMenuClick={() => setIsMenuOpen(true)} />
        <MenuOverlay
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          projectPages={projectPages}
        />
      </header>

      {/* Main Content Section added below the Hero header */}
      <div className="bg-[#e9e4df] pt-16 text-black">
        {/* 1. Category Price Cards — full-width marquee on all screens */}
        <div className="overflow-hidden">
          <div
            className="flex hover:[animation-play-state:paused]"
            style={{ animation: 'marquee 25s linear infinite' }}
          >
            {(['orig', 'clone'] as const).map((copy) => {
              const filled =
                categories.length > 0
                  ? Array.from(
                      { length: Math.ceil(6 / categories.length) },
                      () => categories,
                    ).flat()
                  : [];
              return (
                <div
                  key={copy}
                  className={`flex shrink-0 gap-4 pr-4 ${
                    copy === 'orig' ? 'pl-6' : ''
                  }`}
                >
                  {filled.map((cat, i) => (
                    <div key={`${copy}-${i}`} className="w-44 shrink-0 sm:w-56">
                      <CategoryCard {...cat} />
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Stats Counters */}
        <div className="mx-auto max-w-360 px-6 py-24 sm:py-32">
          <StatsGrid items={stats} />
        </div>

        {/* 3 & 4. Process Steps + Warranty Features */}
        <WarrantySection />

        {/* 5. Youtube Videos Section */}
        <VideoSection videos={videos} />

        {/* 6, 7, 8. All Under One Roof + Room Gallery + Book Consultation */}
        <div className="relative pt-16 pb-32 sm:pb-40">
          <ServicesSection />
          <RoomGallery />
          <BookConsultation />
        </div>

        {/* 9. Global Brands Section */}
        <BrandsMarquee />

        {/* 10. Testimonials Slideshow Section */}
        <Testimonials
          reviews={reviews}
          currentSlide={currentSlide}
          nextSlide={nextSlide}
          prevSlide={prevSlide}
          setCurrentSlide={setCurrentSlide}
        />

        {/* 11. Our Creative Founders Section */}
        <FoundersSection brochureUrl={brochureUrl} />
      </div>

      {/* 12. Footer Section */}
      <Footer />
    </div>
  );
}
