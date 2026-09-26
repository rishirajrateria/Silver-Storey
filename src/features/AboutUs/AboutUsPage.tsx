'use client';

import React, { useState } from 'react';
import HeroControls from '../Hero/components/HeroControls';
import MenuOverlay from '../Hero/components/MenuOverlay';
import ServicesSection from '../Hero/components/ServicesSection';
import HowItWorksSteps from '../HowItWorks/components/HowItWorksSteps';
import BrandsMarquee from '../Hero/components/BrandsMarquee';
import Testimonials from '../Hero/components/Testimonials';
import AboutFoundersSection from './components/AboutFoundersSection';
import AboutHero from './components/AboutHero';
import EstimatePopup from '@/components/EstimatePopup';
import AboutMission from './components/AboutMission';
import AboutProcess from './components/AboutProcess';
import type { Review } from '../Hero/types';
import { useSlider } from '../../hooks/useSlider';

export default function AboutUsPage({
  projectPages = [],
  reviews: cmsReviews,
}: {
  projectPages?: { title: string; slug: string }[];
  reviews?: Review[];
}) {
  // Only testimonials entered in the admin panel — no built-in stand-ins.
  const reviews = cmsReviews ?? [];
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentSlide, nextSlide, prevSlide, setCurrentSlide } = useSlider(
    reviews.length,
  );

  return (
    <div className="min-h-screen">
      <AboutHero />
      <AboutMission />
      <AboutProcess />

      {/* ── All Under One Roof ── */}
      <section className="bg-white px-6 py-20 sm:py-28">
        <ServicesSection />
      </section>

      {/* ── How it Works intro ── */}
      <section className="cursor-default px-6 py-20 text-center sm:py-28">
        <h2 className="mb-6 text-5xl font-bold tracking-tight text-black sm:text-6xl lg:text-7xl">
          How it Works&nbsp;!
        </h2>
        <p className="mx-auto mb-10 max-w-xl text-sm leading-relaxed font-medium text-black/60 sm:text-base">
          Transform your space effortlessly with our expert interior design
          services, tailored to reflect your unique style and vision
        </p>
        <EstimatePopup className="rounded-full border border-black/80 bg-transparent px-8 py-2.5 text-sm font-medium text-black transition-colors hover:bg-black hover:text-white">
          Get Free Estimate
        </EstimatePopup>
      </section>

      {/* ── Process step cards ── */}
      <HowItWorksSteps />

      {/* ── Brands marquee ── */}
      <BrandsMarquee />

      {/* ── Testimonials ── */}
      {reviews.length > 0 && (
        <Testimonials
          reviews={reviews}
          currentSlide={currentSlide}
          nextSlide={nextSlide}
          prevSlide={prevSlide}
          setCurrentSlide={setCurrentSlide}
        />
      )}

      {/* ── Founders ── */}
      <AboutFoundersSection />

      <HeroControls onMenuClick={() => setIsMenuOpen(true)} />
      <MenuOverlay
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        projectPages={projectPages}
      />
    </div>
  );
}
