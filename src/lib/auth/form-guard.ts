import 'server-only';
import type { NextRequest } from 'next/server';

/**
 * Shared protections for public write endpoints (contact, estimate,
 * lookbook). No CAPTCHA — a honeypot field, a per-IP rate limit and basic
 * validation stop the vast majority of automated spam without adding
 * friction for real visitors.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 6;
const hits = new Map<string, { count: number; resetAt: number }>();

export function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

/** Returns a reason string when the request should be rejected. */
export function checkFormRateLimit(ip: string): string | null {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return null;
  }
  entry.count += 1;
  if (entry.count > MAX_PER_WINDOW) {
    return 'Too many submissions from this connection. Please try again in a few minutes.';
  }
  return null;
}

/**
 * The honeypot is an input that real browsers leave empty (it is visually
 * hidden and excluded from autofill). Bots fill every field.
 */
export const HONEYPOT_FIELD = 'company_website';

export function isHoneypotTripped(body: Record<string, unknown>): boolean {
  const value = body[HONEYPOT_FIELD];
  return typeof value === 'string' && value.trim() !== '';
}

const PHONE_RE = /^\+?[0-9 ()-]{7,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validPhone(phone: string): boolean {
  return PHONE_RE.test(phone) && phone.replace(/\D/g, '').length >= 7;
}

export function validEmail(email: string): boolean {
  return EMAIL_RE.test(email) && email.length <= 254;
}

/** Trims and caps a string field. */
export function clean(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

/** Contact-form notifications go here; defaults to the care@ address. */
export function contactRecipient(): string {
  return process.env.CONTACT_TO_EMAIL || 'care@silverstorey.com';
}

/** Same as clientIp() for server actions, which only have `headers()`. */
export function clientIpFromHeaders(h: Headers): string {
  return (
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    h.get('x-real-ip') ||
    'unknown'
  );
}
