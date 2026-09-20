import type { Metadata } from 'next';
import Link from 'next/link';
import { TIER1_CITIES, cityPath } from '@/lib/locations';
import { SERVICES, servicePath } from '@/lib/services';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="min-h-screen px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-[#6b1a1a] uppercase">
          404
        </p>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-black sm:text-5xl">
          We couldn’t find that page
        </h1>
        <p className="mx-auto mb-10 max-w-xl text-base text-black/60">
          The link may be outdated. Here are some useful places to go next.
        </p>
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white"
          >
            Home
          </Link>
          <Link
            href="/interior-designers"
            className="rounded-full border border-black/80 px-6 py-2.5 text-sm font-medium text-black"
          >
            Interior designers by city
          </Link>
          <Link
            href="/services"
            className="rounded-full border border-black/80 px-6 py-2.5 text-sm font-medium text-black"
          >
            Services
          </Link>
          <Link
            href="/blog"
            className="rounded-full border border-black/80 px-6 py-2.5 text-sm font-medium text-black"
          >
            Blog
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-black/80 px-6 py-2.5 text-sm font-medium text-black"
          >
            Contact
          </Link>
        </div>
        <div className="grid gap-8 text-left sm:grid-cols-2">
          <div className="glass-panel rounded-xl p-6">
            <h2 className="mb-3 text-sm font-semibold tracking-wide text-black/60 uppercase">
              Popular cities
            </h2>
            <ul className="space-y-1.5 text-sm">
              {TIER1_CITIES.slice(0, 10).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={cityPath(c)}
                    className="text-black underline-offset-2 hover:underline"
                  >
                    Interior Designers in {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-panel rounded-xl p-6">
            <h2 className="mb-3 text-sm font-semibold tracking-wide text-black/60 uppercase">
              Services
            </h2>
            <ul className="space-y-1.5 text-sm">
              {SERVICES.slice(0, 10).map((s) => (
                <li key={s.slug}>
                  <Link
                    href={servicePath(s)}
                    className="text-black underline-offset-2 hover:underline"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
