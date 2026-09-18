import React from 'react';
import Link from 'next/link';
import { logoutAction } from '@/app/admin/actions';

const LINKS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/leads', label: 'Enquiries' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/videos', label: 'Videos' },
  { href: '/admin/projects', label: 'Project Pages' },
  { href: '/admin/blog', label: 'Blog' },
  { href: '/admin/brochure', label: 'Brochure' },
];

export default function AdminNav({ email }: { email: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-6 py-3">
        <Link
          href="/admin"
          className="text-sm font-bold tracking-tight text-black"
        >
          Silver Storey <span className="font-normal text-black/40">CMS</span>
        </Link>

        <nav
          className="flex flex-wrap items-center gap-x-4 gap-y-2"
          aria-label="Admin sections"
        >
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-black/60 transition-colors hover:text-black"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <Link
            href="/"
            target="_blank"
            className="text-sm text-black/50 transition-colors hover:text-black"
          >
            View site ↗
          </Link>
          <span className="hidden text-xs text-black/40 sm:inline">
            {email}
          </span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-full border border-black/20 px-4 py-1.5 text-sm font-medium text-black transition-colors hover:bg-black/5"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
