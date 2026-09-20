'use client';

import React, { useActionState } from 'react';
import { loginAction, type LoginState } from '../actions';
import { Button, Card, Field, inputClass, Banner } from '@/components/admin/ui';

export default function LoginForm({
  next,
  configured,
}: {
  next?: string;
  configured: boolean;
}) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    loginAction,
    {},
  );

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-2xl font-bold tracking-tight text-black">
            Silver Storey
          </p>
          <p className="mt-1 text-xs tracking-[0.25em] text-black/45 uppercase">
            Content Manager
          </p>
        </div>

        {!configured && (
          <Banner tone="warn">
            The admin panel has not been configured yet. Follow{' '}
            <strong>ADMIN_SETUP.md</strong> to set <code>ADMIN_EMAIL</code>,{' '}
            <code>ADMIN_PASSWORD_HASH</code> and{' '}
            <code>ADMIN_SESSION_SECRET</code>.
          </Banner>
        )}

        <Card>
          <form action={formAction} className="space-y-5">
            {next && <input type="hidden" name="next" value={next} />}

            <Field label="Email" required>
              <input
                type="email"
                name="email"
                autoComplete="username"
                required
                className={inputClass}
                placeholder="you@example.com"
              />
            </Field>

            <Field label="Password" required>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                required
                className={inputClass}
                placeholder="••••••••"
              />
            </Field>

            {state.error && (
              <p
                className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
                role="alert"
              >
                {state.error}
              </p>
            )}

            <Button type="submit" disabled={pending} className="w-full">
              {pending ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
