import React from 'react';
import Link from 'next/link';
import { requireSession } from '@/lib/auth';
import { prisma, isDatabaseConfigured, safeQuery } from '@/lib/db/client';
import AdminNav from '@/components/admin/AdminNav';
import { AdminPageHeader, Banner, Card } from '@/components/admin/ui';
import { isBlobConfigured } from '@/lib/storage';

export const dynamic = 'force-dynamic';

const SECTIONS = [
  {
    href: '/admin/categories',
    label: 'Categories',
    blurb: 'Room cards and starting prices on the home page.',
  },
  {
    href: '/admin/videos',
    label: 'Videos',
    blurb: 'YouTube videos in the home page carousel.',
  },
  {
    href: '/admin/projects',
    label: 'Project Pages',
    blurb: 'Gallery pages, including Residential and Commercial.',
  },
  {
    href: '/admin/blog',
    label: 'Blog',
    blurb: 'Articles, written in Markdown.',
  },
  {
    href: '/admin/brochure',
    label: 'Brochure',
    blurb: 'The downloadable PDF offered on the home page.',
  },
] as const;

export default async function AdminDashboard() {
  const session = await requireSession();

  const counts = await safeQuery(
    async () => {
      const [categories, videos, projects, posts, drafts, brochure] =
        await Promise.all([
          prisma.category.count(),
          prisma.video.count(),
          prisma.projectPage.count(),
          prisma.blogPost.count({ where: { published: true } }),
          prisma.blogPost.count({ where: { published: false } }),
          prisma.brochure.count({ where: { isActive: true } }),
        ]);
      return { categories, videos, projects, posts, drafts, brochure };
    },
    { categories: 0, videos: 0, projects: 0, posts: 0, drafts: 0, brochure: 0 },
    'dashboardCounts',
  );

  const stats = [
    { label: 'Categories', value: counts.categories },
    { label: 'Videos', value: counts.videos },
    { label: 'Project pages', value: counts.projects },
    { label: 'Published posts', value: counts.posts },
    { label: 'Draft posts', value: counts.drafts },
    { label: 'Active brochure', value: counts.brochure ? 'Yes' : 'None' },
  ];

  return (
    <>
      <AdminNav email={session.email} />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <AdminPageHeader
          title="Content"
          description="Everything editable on the Silver Storey website lives here. Changes go live immediately."
        />

        {!isDatabaseConfigured && (
          <Banner tone="warn">
            <strong>No database connected.</strong> Set{' '}
            <code>DATABASE_URL</code> and run{' '}
            <code>npx prisma migrate deploy</code>. See{' '}
            <strong>ADMIN_SETUP.md</strong>.
          </Banner>
        )}
        {!isBlobConfigured() && process.env.NODE_ENV === 'production' && (
          <Banner tone="warn">
            <strong>No blob storage connected.</strong> Add a Vercel Blob store
            and set <code>BLOB_READ_WRITE_TOKEN</code>, otherwise uploads will
            not persist.
          </Banner>
        )}

        <dl className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((s) => (
            <Card key={s.label} className="!p-5">
              <dt className="text-xs tracking-wide text-black/50 uppercase">
                {s.label}
              </dt>
              <dd className="mt-1 text-2xl font-bold text-black">{s.value}</dd>
            </Card>
          ))}
        </dl>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="flex flex-col rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="mb-1.5 text-lg font-bold text-black">
                {s.label}
              </span>
              <span className="text-sm text-black/55">{s.blurb}</span>
              <span className="mt-4 text-sm font-medium text-[#6b1a1a]">
                Manage →
              </span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
