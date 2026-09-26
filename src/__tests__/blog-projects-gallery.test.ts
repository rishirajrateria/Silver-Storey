import { describe, expect, it } from 'vitest';
import {
  MIN_DESCRIPTION,
  projectDescription,
  summaryExcerpt,
} from '@/features/ProjectPage/description';
import { isOptimisable } from '@/features/Gallery/image-policy';
import { bylineFor } from '@/features/Blog/ArticleMeta';
import { cmsPostAsArticle } from '@/lib/blog/cms-article';
import { ARTICLES } from '@/lib/blog';
import { servicesForArticle } from '@/lib/related';

describe('project page descriptions', () => {
  const story =
    '## The brief\n\nA young family wanted a warm, minimal home that hides the clutter of daily life behind flush panels and keeps the living room free for the children.\n\n## The design\n\nMore text.';

  it('excerpts the story without fusing the heading into the first sentence', () => {
    const text = summaryExcerpt(story, 80);
    expect(text.startsWith('A young family')).toBe(true);
    expect(text.endsWith('…')).toBe(true);
    expect(text.length).toBeLessThanOrEqual(81);
    // Cut on a word, never mid-word.
    expect(text.slice(0, -1)).not.toMatch(/\s$/);
  });

  it('treats a label-sized hero subtitle as no description at all', () => {
    const d = projectDescription({
      title: 'Urbana 3BHK',
      heroSubtitle: '3BHK',
      summary: story,
    });
    expect(d.startsWith('A young family')).toBe(true);
    expect(d.length).toBeGreaterThanOrEqual(MIN_DESCRIPTION);
  });

  it('keeps a hero subtitle that is a real sentence', () => {
    const sentence =
      'A warm, minimal three-bedroom apartment in New Town, delivered in 42 days.';
    expect(
      projectDescription({ title: 'Urbana 3BHK', heroSubtitle: sentence }),
    ).toBe(sentence);
  });

  it('falls back to one honest sentence when the page has no story yet', () => {
    const d = projectDescription({
      title: 'Luxury Villas',
      heroSubtitle: 'villas',
      location: 'Rajarhat',
    });
    expect(d).toContain('Luxury Villas in Rajarhat');
    expect(d).toContain('Silver Storey');
    expect(d.length).toBeGreaterThanOrEqual(MIN_DESCRIPTION);
  });
});

describe('CMS image optimisation policy', () => {
  it('optimises same-origin uploads and the configured blob host only', () => {
    expect(isOptimisable('/uploads/kitchen.jpg')).toBe(true);
    expect(isOptimisable('/images/3bhk.avif')).toBe(true);
    expect(
      isOptimisable('https://abc123.public.blob.vercel-storage.com/k.jpg'),
    ).toBe(true);
  });

  it('serves generated OG cards and unknown hosts as-is', () => {
    expect(isOptimisable('/api/og?title=Hello')).toBe(false);
    expect(isOptimisable('https://cdn.sanity.io/images/p/d/x.jpg')).toBe(false);
    expect(
      isOptimisable('http://abc.public.blob.vercel-storage.com/k.jpg'),
    ).toBe(false);
    expect(isOptimisable('not a url')).toBe(false);
  });
});

describe('blog authorship', () => {
  it('every built-in guide carries the house byline', () => {
    expect(ARTICLES.length).toBeGreaterThan(0);
    for (const a of ARTICLES) expect(a.author).toBe('Silver Storey');
  });

  it('shows the team for house bylines and the name for a real author', () => {
    expect(bylineFor(undefined)).toBe('the Silver Storey design team');
    expect(bylineFor('Silver Storey')).toBe('the Silver Storey design team');
    expect(bylineFor('Silver Storey Editorial Team')).toBe(
      'the Silver Storey design team',
    );
    expect(bylineFor('Palak Singhania')).toBe('Palak Singhania');
  });
});

describe('CMS posts as articles', () => {
  it('lets a CMS post find its related services from title and category', () => {
    const post = cmsPostAsArticle({
      title: 'Modular kitchen ideas for small flats',
      slug: 'modular-kitchen-ideas-small-flats',
      category: 'modular-kitchen',
    });
    expect(post.tags).toEqual([]);
    const services = servicesForArticle(post);
    expect(services.length).toBeGreaterThan(0);
    expect(services[0].slug).toBe('modular-kitchen');
  });
});
