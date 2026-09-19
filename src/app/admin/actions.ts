'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import {
  endSession,
  isAdminConfigured,
  startSession,
  verifyCredentials,
} from '@/lib/auth';
import { checkRateLimit, clearRateLimit } from '@/lib/auth/rate-limit';

export interface LoginState {
  error?: string;
}

/** Only allow relative paths, so `?next=` cannot be used as an open redirect. */
function safeNext(value: FormDataEntryValue | null): string {
  const next = typeof value === 'string' ? value : '';
  return next.startsWith('/') && !next.startsWith('//') ? next : '/admin';
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!isAdminConfigured()) {
    return {
      error:
        'Admin panel is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD_HASH and ADMIN_SESSION_SECRET (see ADMIN_SETUP.md).',
    };
  }

  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const next = safeNext(formData.get('next'));

  if (!email || !password) {
    return { error: 'Enter your email and password.' };
  }

  const headerList = await headers();
  const ip =
    headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headerList.get('x-real-ip') ||
    'unknown';

  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    return {
      error: `Too many attempts. Try again in ${Math.ceil(limit.retryAfterSeconds / 60)} minute(s).`,
    };
  }

  const verified = await verifyCredentials(email, password);
  if (!verified) return { error: 'Incorrect email or password.' };

  clearRateLimit(ip);
  await startSession(verified);
  redirect(next);
}

export async function logoutAction(): Promise<void> {
  await endSession();
  redirect('/admin/login');
}
