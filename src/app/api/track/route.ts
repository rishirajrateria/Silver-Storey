import { NextResponse, type NextRequest } from 'next/server';
import { prisma, isDatabaseConfigured } from '@/lib/db/client';
import {
  classifySource,
  detectDevice,
  isBot,
  normalisePath,
  referrerHost,
} from '@/lib/analytics/classify';
import { visitorHash } from '@/lib/analytics/visitor';

export const runtime = 'nodejs';

/**
 * Edge city headers arrive percent-encoded. A malformed value would throw
 * inside decodeURIComponent and lose the whole page view, so it falls back to
 * the raw string.
 */
function decodeHeader(value: string | null): string | null {
  if (!value) return null;
  try {
    const decoded = decodeURIComponent(value).trim();
    return decoded || null;
  } catch {
    return value.trim() || null;
  }
}

/**
 * POST /api/track — records one page view.
 *
 * Always returns 204 so a tracking failure is invisible to visitors and can
 * never break a page. Bots are dropped before they reach the database.
 */
export async function POST(request: NextRequest) {
  const noContent = new NextResponse(null, { status: 204 });
  if (!isDatabaseConfigured) return noContent;

  try {
    const userAgent = request.headers.get('user-agent') ?? '';
    if (isBot(userAgent)) return noContent;

    const body = (await request.json().catch(() => ({}))) as {
      path?: string;
      referrer?: string;
    };

    const path = normalisePath(body.path ?? '');
    if (!path) return noContent;

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const selfHost = request.headers.get('host');
    const source = classifySource(body.referrer, selfHost);
    // Internal navigation still counts as a view, but keeps its original source
    // attribution rather than listing our own domain as a referrer.
    const referrer = source === 'internal' ? null : referrerHost(body.referrer);

    await prisma.pageView.create({
      data: {
        path,
        referrer,
        source: source === 'internal' ? 'direct' : source,
        device: detectDevice(userAgent),
        country:
          request.headers.get('x-vercel-ip-country') ??
          request.headers.get('cf-ipcountry') ??
          null,
        region:
          request.headers.get('x-vercel-ip-country-region') ??
          request.headers.get('cf-region-code') ??
          null,
        // Vercel percent-encodes city names, so "New%20Delhi" would otherwise
        // be stored and displayed verbatim.
        city: decodeHeader(
          request.headers.get('x-vercel-ip-city') ??
            request.headers.get('cf-ipcity'),
        ),
        visitorHash: visitorHash(ip, userAgent),
      },
    });
  } catch (error) {
    console.error('[track] failed:', error);
  }

  return noContent;
}
