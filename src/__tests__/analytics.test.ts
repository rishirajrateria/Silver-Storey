import { describe, it, expect } from 'vitest';
import { countryLabel, regionLabel } from '@/lib/analytics/regions';
import {
  classifySource,
  detectDevice,
  isBot,
  normalisePath,
  referrerHost,
} from '@/lib/analytics/classify';
import {
  buildPeriod,
  dayKeys,
  parseRange,
  percentChange,
} from '@/lib/analytics/range';
import { visitorHash } from '@/lib/analytics/visitor';
import {
  axisTicks,
  formatCompact,
  niceMax,
} from '@/components/admin/charts/format';

describe('bot detection', () => {
  it('rejects crawlers, AI bots and tooling', () => {
    for (const ua of [
      'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      'GPTBot/1.0',
      'ClaudeBot/1.0',
      'curl/8.4.0',
      'python-requests/2.31',
      'facebookexternalhit/1.1',
      'Mozilla/5.0 ... HeadlessChrome/120',
    ]) {
      expect(isBot(ua), ua).toBe(true);
    }
  });

  it('accepts real browsers', () => {
    expect(
      isBot(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) AppleWebKit/605.1.15 Safari/604.1',
      ),
    ).toBe(false);
    expect(
      isBot(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36',
      ),
    ).toBe(false);
  });

  it('treats a missing user agent as a bot', () => {
    expect(isBot(undefined)).toBe(true);
    expect(isBot('')).toBe(true);
  });
});

describe('device detection', () => {
  it('classifies phones, tablets and desktops', () => {
    expect(
      detectDevice('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) Mobile/15E148'),
    ).toBe('mobile');
    expect(
      detectDevice('Mozilla/5.0 (Linux; Android 13; SM-S918B) Mobile Safari'),
    ).toBe('mobile');
    expect(detectDevice('Mozilla/5.0 (iPad; CPU OS 17_0) Safari')).toBe(
      'tablet',
    );
    expect(
      detectDevice('Mozilla/5.0 (Linux; Android 13; SM-X710) Safari'),
    ).toBe('tablet');
    expect(
      detectDevice('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120'),
    ).toBe('desktop');
  });
});

describe('traffic source classification', () => {
  it('identifies search, social, referral and direct', () => {
    expect(
      classifySource('https://www.google.com/search?q=x', 'silverstorey.com'),
    ).toBe('organic');
    expect(classifySource('https://duckduckgo.com/', 'silverstorey.com')).toBe(
      'organic',
    );
    expect(
      classifySource('https://www.instagram.com/p/1', 'silverstorey.com'),
    ).toBe('social');
    expect(classifySource('https://t.co/abc', 'silverstorey.com')).toBe(
      'social',
    );
    expect(classifySource('https://houzz.in/ideas', 'silverstorey.com')).toBe(
      'referral',
    );
    expect(classifySource(null, 'silverstorey.com')).toBe('direct');
  });

  it('treats our own domain as internal navigation', () => {
    expect(
      classifySource('https://www.silverstorey.com/blog', 'silverstorey.com'),
    ).toBe('internal');
    expect(
      classifySource('https://silverstorey.com/blog', 'www.silverstorey.com'),
    ).toBe('internal');
  });

  it('stores only the hostname, never the full referring URL', () => {
    expect(referrerHost('https://www.google.com/search?q=secret+query')).toBe(
      'google.com',
    );
    expect(referrerHost('not a url')).toBeNull();
  });
});

describe('path normalisation', () => {
  it('strips query strings, fragments and trailing slashes', () => {
    expect(normalisePath('/blog/post?utm_source=x')).toBe('/blog/post');
    expect(normalisePath('/services/#pricing')).toBe('/services');
    expect(normalisePath('/')).toBe('/');
  });

  it('ignores assets, API and internal routes', () => {
    for (const p of [
      '/_next/static/x.js',
      '/api/track',
      '/favicon.ico',
      '/sitemap/0.xml',
      '/uploads/a.webp',
    ]) {
      expect(normalisePath(p), p).toBeNull();
    }
  });

  it('rejects malformed and oversized paths', () => {
    expect(normalisePath('https://evil.com/x')).toBeNull();
    expect(normalisePath('')).toBeNull();
    expect(normalisePath('/' + 'a'.repeat(600))).toBeNull();
  });
});

describe('visitor hashing', () => {
  const ip = '203.0.113.9';
  const ua = 'Mozilla/5.0 Chrome/120';

  it('is stable for the same visitor within a day', () => {
    const day = new Date('2026-09-18T10:00:00Z');
    expect(visitorHash(ip, ua, day)).toBe(
      visitorHash(ip, ua, new Date('2026-09-18T23:59:00Z')),
    );
  });

  it('changes the next day, so visitors cannot be tracked across days', () => {
    expect(visitorHash(ip, ua, new Date('2026-09-18T10:00:00Z'))).not.toBe(
      visitorHash(ip, ua, new Date('2026-09-19T10:00:00Z')),
    );
  });

  it('separates different visitors and never reveals the inputs', () => {
    const day = new Date('2026-09-18T10:00:00Z');
    const hash = visitorHash(ip, ua, day);
    expect(hash).not.toBe(visitorHash('198.51.100.4', ua, day));
    expect(hash).toHaveLength(32);
    expect(hash).not.toContain(ip);
  });
});

describe('date ranges', () => {
  it('accepts only the supported ranges', () => {
    expect(parseRange('7')).toBe(7);
    expect(parseRange('90')).toBe(90);
    expect(parseRange('999')).toBe(30);
    expect(parseRange(undefined)).toBe(30);
  });

  it('builds a window of exactly N days with a matching previous window', () => {
    const p = buildPeriod(7, new Date('2026-09-18T12:00:00Z'));
    expect(dayKeys(p)).toHaveLength(7);
    expect(dayKeys(p)[0]).toBe('2026-09-12');
    expect(dayKeys(p)[6]).toBe('2026-09-18');
    // previous window ends immediately before the current one begins
    expect(p.previousTo.getTime()).toBeLessThan(p.from.getTime());
    expect(p.previousFrom.toISOString().slice(0, 10)).toBe('2026-09-05');
  });

  it('handles percentage change including the zero baseline', () => {
    expect(percentChange(150, 100)).toBe(50);
    expect(percentChange(50, 100)).toBe(-50);
    expect(percentChange(0, 0)).toBe(0);
    expect(percentChange(10, 0)).toBeNull();
  });
});

describe('axis helpers', () => {
  it('rounds the axis maximum to a clean value', () => {
    expect(niceMax(7)).toBe(10);
    expect(niceMax(23)).toBe(50);
    expect(niceMax(1400)).toBe(2000);
    expect(niceMax(0)).toBe(4);
  });

  it('produces evenly spaced ticks starting at zero', () => {
    expect(axisTicks(100)).toEqual([0, 25, 50, 75, 100]);
  });

  it('formats compact numbers', () => {
    expect(formatCompact(950)).toBe('950');
    expect(formatCompact(12500)).toMatch(/12\.5/);
  });
});

describe('region labels', () => {
  it('spells out Indian subdivision codes', () => {
    expect(regionLabel('WB', 'IN')).toBe('West Bengal');
    expect(regionLabel('mh', 'IN')).toBe('Maharashtra');
    expect(regionLabel('DH', 'IN')).toBe(
      'Dadra and Nagar Haveli and Daman and Diu',
    );
  });

  it('accepts the prefixed form edge networks sometimes send', () => {
    expect(regionLabel('IN-KA', null)).toBe('Karnataka');
  });

  it('does not claim a code is Indian when the country says otherwise', () => {
    // WB is West Bengal in India and Western Bahr el Ghazal in South Sudan.
    expect(regionLabel('WB', 'SS')).toBe('WB');
  });

  it('passes through codes it does not know, and handles missing values', () => {
    expect(regionLabel('DXB', 'AE')).toBe('DXB');
    expect(regionLabel(null)).toBe('—');
    expect(regionLabel('')).toBe('—');
  });
});

describe('country labels', () => {
  it('spells out ISO country codes', () => {
    expect(countryLabel('IN')).toBe('India');
    expect(countryLabel('ae')).toBe('United Arab Emirates');
  });

  it('leaves anything that is not a two-letter code alone', () => {
    expect(countryLabel('Nowhere')).toBe('Nowhere');
    expect(countryLabel(null)).toBe('—');
  });
});
