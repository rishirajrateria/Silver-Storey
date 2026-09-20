import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import {
  SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
  verifySessionToken,
  type SessionPayload,
} from './session';

export { isAdminConfigured, SESSION_COOKIE } from './session';

/** Current admin session, or null when signed out. */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

/**
 * Server-side guard for admin pages. `proxy.ts` blocks unauthenticated
 * requests at the edge of the app; this is the authoritative check that runs
 * where the page is actually rendered.
 */
export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  return session;
}

/** Constant-time-ish credential check. Returns null when credentials fail. */
export async function verifyCredentials(
  email: string,
  password: string,
): Promise<string | null> {
  const expectedEmail = process.env.ADMIN_EMAIL;
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!expectedEmail || !hash) return null;

  const emailMatches =
    email.trim().toLowerCase() === expectedEmail.trim().toLowerCase();

  // Always run bcrypt so a wrong email is not measurably faster than a wrong
  // password, which would let an attacker enumerate the admin address.
  const passwordMatches = await bcrypt.compare(password, hash);

  return emailMatches && passwordMatches ? expectedEmail : null;
}

export async function startSession(email: string): Promise<void> {
  const token = await createSessionToken(email);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, sessionCookieOptions);
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}
