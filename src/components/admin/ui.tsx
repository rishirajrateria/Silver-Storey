import React from 'react';
import Link from 'next/link';

/** Shared presentational pieces for the admin panel. */

export function AdminPageHeader({
  title,
  description,
  action,
  backHref,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  backHref?: string;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {backHref && (
          <Link
            href={backHref}
            className="mb-2 inline-flex items-center gap-1.5 text-sm text-black/50 transition-colors hover:text-black"
          >
            ← Back
          </Link>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm text-black/55">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function Card({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl bg-white p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
  required,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-black">
        {label}
        {required && <span className="text-[#6b1a1a]"> *</span>}
      </span>
      {children}
      {hint && (
        <span className="mt-1.5 block text-xs text-black/45">{hint}</span>
      )}
    </label>
  );
}

export const inputClass =
  'w-full rounded-lg border border-black/15 bg-white px-3.5 py-2.5 text-sm text-black outline-none transition-colors focus:border-black/60';

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger';
}) {
  const styles = {
    primary: 'bg-black text-white hover:opacity-85',
    secondary: 'border border-black/20 bg-white text-black hover:bg-black/5',
    danger: 'border border-red-300 bg-white text-red-700 hover:bg-red-50',
  }[variant];
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  children,
  variant = 'primary',
}: {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}) {
  const styles =
    variant === 'primary'
      ? 'bg-black text-white hover:opacity-85'
      : 'border border-black/20 bg-white text-black hover:bg-black/5';
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${styles}`}
    >
      {children}
    </Link>
  );
}

export function EmptyState({
  message,
  action,
}: {
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <Card className="text-center">
      <p className="mb-4 text-sm text-black/50">{message}</p>
      {action}
    </Card>
  );
}

export function Banner({
  tone = 'info',
  children,
}: {
  tone?: 'info' | 'warn' | 'error';
  children: React.ReactNode;
}) {
  const styles = {
    info: 'border-black/15 bg-white text-black/70',
    warn: 'border-amber-300 bg-amber-50 text-amber-900',
    error: 'border-red-300 bg-red-50 text-red-800',
  }[tone];
  return (
    <div
      className={`mb-6 rounded-xl border px-4 py-3 text-sm ${styles}`}
      role="status"
    >
      {children}
    </div>
  );
}

export function Badge({
  on,
  labels = ['Published', 'Draft'],
}: {
  on: boolean;
  labels?: [string, string];
}) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
        on ? 'bg-green-100 text-green-800' : 'bg-black/10 text-black/60'
      }`}
    >
      {on ? labels[0] : labels[1]}
    </span>
  );
}
