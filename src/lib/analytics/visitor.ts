import 'server-only';
import { createHash } from 'node:crypto';

/**
 * Builds a per-visitor identifier that is stable within a day and unlinkable
 * across days.
 *
 * The hash mixes a per-day salt with the IP and user agent. Neither value is
 * stored, the digest is truncated, and the salt changes at midnight UTC — so
 * the same person tomorrow is an entirely different hash. This is what lets us
 * count unique visitors without cookies or consent banners.
 */
export function visitorHash(
  ip: string,
  userAgent: string,
  date: Date = new Date(),
): string {
  const day = date.toISOString().slice(0, 10);
  const secret =
    process.env.ANALYTICS_SALT ??
    process.env.ADMIN_SESSION_SECRET ??
    'silver-storey';
  return createHash('sha256')
    .update(`${day}:${secret}:${ip}:${userAgent}`)
    .digest('hex')
    .slice(0, 32);
}
