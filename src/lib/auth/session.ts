import 'server-only';
import { SignJWT, jwtVerify } from 'jose';

export const SESSION_COOKIE = 'ss_admin_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours
const ISSUER = 'silver-storey-cms';

export interface SessionPayload {
  email: string;
  /** Issued-at, seconds since epoch. */
  iat?: number;
  exp?: number;
}

function secretKey(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      'ADMIN_SESSION_SECRET must be set to a random string of at least 32 characters. Generate one with: openssl rand -base64 32',
    );
  }
  return new TextEncoder().encode(secret);
}

/** True when the admin panel has been configured with credentials. */
export function isAdminConfigured(): boolean {
  return Boolean(
    process.env.ADMIN_EMAIL &&
    process.env.ADMIN_PASSWORD_HASH &&
    process.env.ADMIN_SESSION_SECRET &&
    process.env.ADMIN_SESSION_SECRET.length >= 32,
  );
}

export async function createSessionToken(email: string): Promise<string> {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(secretKey());
}

/** Verifies a session token; returns null for any invalid or expired token. */
export async function verifySessionToken(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { issuer: ISSUER });
    if (typeof payload.email !== 'string') return null;
    return { email: payload.email, iat: payload.iat, exp: payload.exp };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: SESSION_MAX_AGE_SECONDS,
};
