import React from 'react';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { SITE, brandStatement } from '@/lib/seo/site';
import { SERVICE_BY_SLUG, servicePath } from '@/lib/services';
import { brands, founders, stats } from '@/features/Hero/constants';
import { services } from '@/features/Hero/icons';
import HeroHeader from '@/features/Hero/components/HeroHeader';
import HomeIntro from '@/features/Hero/components/HomeIntro';
import StatsGrid from '@/features/Hero/components/StatsGrid';
import VideoSection from '@/features/Hero/components/VideoSection';
import MenuOverlay from '@/features/Hero/components/MenuOverlay';
import FoundersSection from '@/features/Hero/components/FoundersSection';
import CategoryCard from '@/features/Hero/components/CategoryCard';

/** Visible text of a markup string, the way a crawler that runs no JS sees it. */
function textOf(html: string) {
  return html
    .replace(/<!--.*?-->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

const video = (i: number) => ({
  id: `v${i}`,
  title: `Film ${i}`,
  youtubeId: `yt-${i}`,
  createdAt: '2025-01-01T00:00:00.000Z',
});

describe('home page facts come from site.ts', () => {
  it('quotes the stats block and nothing else', () => {
    expect(stats.map((s) => s.val)).toEqual([
      SITE.stats.happyCustomers,
      SITE.stats.sqftTransformed,
      SITE.stats.teamMembers,
      String(SITE.stats.yearsExperience),
    ]);
    expect(stats.map((s) => s.label)).toEqual([
      'Happy Customers',
      'Sq ft Transformed',
      'Team Members',
      'Years of Experience',
    ]);
  });

  it('shows one logo per listed brand partner, sized for layout', () => {
    expect(brands.map((b) => b.name)).toEqual([...SITE.brandPartners]);
    for (const b of brands) {
      expect(b.width).toBeGreaterThan(0);
      expect(b.height).toBeGreaterThan(0);
    }
  });

  it('names the founders and their roles from the site record', () => {
    expect(founders.map((f) => f.alt)).toEqual(
      SITE.founders.map((f) => f.name),
    );
    expect(founders.map((f) => f.role)).toEqual(
      SITE.founders.map((f) => f.role),
    );
  });

  it('links every service tile to a page that exists', () => {
    for (const s of services) {
      if (s.href === '/services') continue;
      const slug = s.href.replace('/services/', '');
      expect(SERVICE_BY_SLUG[slug], s.href).toBeDefined();
      expect(servicePath(slug)).toBe(s.href);
    }
  });
});

describe('home page server markup', () => {
  it('has one keyword-bearing h1 and no unverifiable superlative', () => {
    const html = renderToStaticMarkup(<HeroHeader />);
    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(textOf(html)).toContain(
      'Interior Designers in Kolkata & Across India',
    );
    expect(html).not.toMatch(/Fastest Growing/i);
    expect(html).toContain('poster="/videos/hero-poster.jpg"');
    expect(html).toContain('preload="metadata"');
    expect(html.match(/<source /g)).toHaveLength(2);
    expect(html).toContain('src="/images/home_logo.avif"');
    expect(html).not.toContain('src="images/');
  });

  it('carries the real figures before any script runs', () => {
    const html = renderToStaticMarkup(<StatsGrid items={stats} />);
    const text = textOf(html);
    expect(text).toContain('60+ Happy Customers');
    expect(text).toContain('50,000+ Sq ft Transformed');
    expect(text).toContain('30+ Team Members');
    expect(text).toContain('15 Years of Experience');
    expect(text).not.toMatch(/\b0\b/);
  });

  it('renders the brand statement and body links in the intro', () => {
    const html = renderToStaticMarkup(<HomeIntro />);
    const text = textOf(html);
    expect(text).toContain(brandStatement());
    expect(text).toContain(SITE.serviceModel.hq);
    expect(text).toContain('Outside West Bengal, we work through');
    for (const href of [
      '/services',
      '/pricing-structure',
      '/gallery',
      '/interior-designers/west-bengal/kolkata',
      '/estimate',
      '/projects',
      '/blog',
    ]) {
      expect(html).toContain(`href="${href}"`);
    }
    for (const label of ['Founded', 'Experience', 'Clients', 'Delivery'])
      expect(text).toContain(label);
  });

  it('keeps the primary navigation in the HTML while the menu is closed', () => {
    const html = renderToStaticMarkup(
      <MenuOverlay
        isOpen={false}
        onClose={() => {}}
        categories={[{ name: 'Kitchen', slug: 'kitchen' }]}
      />,
    );
    expect(html).toMatch(/<nav aria-label="Primary" hidden=""/);
    expect(html).not.toContain('role="dialog"');
    for (const href of ['/services', '/estimate', '/about-us', '/contact'])
      expect(html).toContain(`href="${href}"`);
    expect(html).toContain('href="/gallery/kitchen"');
    expect(html).toContain('href="/interior-designers/west-bengal/kolkata"');
  });

  it('opens as the same dialog with the same links', () => {
    const html = renderToStaticMarkup(
      <MenuOverlay isOpen onClose={() => {}} categories={[]} />,
    );
    expect(html).toContain('role="dialog"');
    expect(html).toContain('<nav aria-label="Primary">');
    expect(html).not.toContain('hidden=""');
    expect(html).toContain('href="/services"');
  });

  it('shows no videos rather than a placeholder, and repeats none more than twice', () => {
    expect(renderToStaticMarkup(<VideoSection videos={[]} />)).toBe('');
    expect(renderToStaticMarkup(<VideoSection />)).not.toContain('dQw4w9WgXcQ');

    const one = renderToStaticMarkup(<VideoSection videos={[video(1)]} />);
    expect(one.match(/vi\/yt-1\//g)).toHaveLength(1);

    const four = renderToStaticMarkup(
      <VideoSection videos={[1, 2, 3, 4].map(video)} />,
    );
    for (const i of [1, 2, 3, 4])
      expect(four.match(new RegExp(`vi/yt-${i}/`, 'g'))).toHaveLength(2);
  });

  it('describes the studio under the founders and offers a brochure only when there is one', () => {
    const without = renderToStaticMarkup(<FoundersSection />);
    expect(without).not.toContain('This is the space');
    expect(without).not.toContain('Download Brochure');
    expect(without).not.toContain('href="#"');
    expect(textOf(without)).toContain(SITE.serviceModel.hq);
    expect(textOf(without)).toContain(`founded in ${SITE.foundingYear}`);

    const withUrl = renderToStaticMarkup(
      <FoundersSection brochureUrl="/uploads/brochure.pdf" />,
    );
    expect(withUrl).toContain('Download Brochure');
    expect(withUrl).toContain('href="/uploads/brochure.pdf"');
  });

  it('serves category photos through next/image with a sizes hint', () => {
    const html = renderToStaticMarkup(
      <CategoryCard
        name="Kitchen"
        price="1.4 L"
        slug="kitchen"
        imageUrl="/uploads/kitchen.webp"
      />,
    );
    expect(html).toContain('href="/gallery/kitchen"');
    expect(html).toContain('sizes="(min-width: 640px) 224px, 176px"');
    expect(html).toMatch(/srcset=/i);
    expect(html).toContain('/_next/image?url=%2Fuploads%2Fkitchen.webp');
  });
});
