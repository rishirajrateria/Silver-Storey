import React, { Suspense } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { requireSession } from '@/lib/auth';
import { prisma, isDatabaseConfigured, safeQuery } from '@/lib/db/client';
import { getDashboardData, getRecentLeads } from '@/lib/analytics/queries';
import { parseRange } from '@/lib/analytics/range';
import AdminNav from '@/components/admin/AdminNav';
import { AdminPageHeader, Banner, Card } from '@/components/admin/ui';
import RangeFilter from '@/components/admin/RangeFilter';
import StatTile from '@/components/admin/charts/StatTile';
import TrafficChart from '@/components/admin/charts/TrafficChart';
import BarList from '@/components/admin/charts/BarList';
import DeviceBar from '@/components/admin/charts/DeviceBar';
import { isBlobConfigured } from '@/lib/storage';

export const dynamic = 'force-dynamic';

const SOURCE_LABELS: Record<string, string> = {
  organic: 'Search engines',
  direct: 'Direct',
  referral: 'Other websites',
  social: 'Social media',
};

const CMS_SECTIONS = [
  {
    href: '/admin/categories',
    label: 'Categories',
    blurb: 'Home page room cards and prices',
  },
  {
    href: '/admin/videos',
    label: 'Videos',
    blurb: 'Home page YouTube carousel',
  },
  {
    href: '/admin/projects',
    label: 'Project Pages',
    blurb: 'Gallery pages and their sections',
  },
  {
    href: '/admin/blog',
    label: 'Blog',
    blurb: 'Articles, written in Markdown',
  },
  {
    href: '/admin/testimonials',
    label: 'Testimonials',
    blurb: 'Real client reviews shown on the home and about pages',
  },
  {
    href: '/admin/lookbooks',
    label: 'Lookbooks',
    blurb: 'Downloadable PDF catalogues that capture leads',
  },
  {
    href: '/admin/client-projects',
    label: 'Client Projects',
    blurb: 'Progress tracker your clients log into',
  },
  { href: '/admin/brochure', label: 'Brochure', blurb: 'The downloadable PDF' },
] as const;

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const session = await requireSession();
  const { range } = await searchParams;
  const days = parseRange(range);

  const [data, leads, contentCounts] = await Promise.all([
    getDashboardData(days),
    getRecentLeads(5),
    safeQuery(
      async () => {
        const [categories, videos, projects, posts, drafts] = await Promise.all(
          [
            prisma.category.count(),
            prisma.video.count(),
            prisma.projectPage.count(),
            prisma.blogPost.count({ where: { published: true } }),
            prisma.blogPost.count({ where: { published: false } }),
          ],
        );
        return { categories, videos, projects, posts, drafts };
      },
      { categories: 0, videos: 0, projects: 0, posts: 0, drafts: 0 },
      'dashboard content counts',
    ),
  ]);

  return (
    <>
      <AdminNav email={session.email} />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <AdminPageHeader
          title="Dashboard"
          description={`Traffic, enquiries and content for silverstorey.com — last ${days} days.`}
          action={
            <Suspense fallback={null}>
              <RangeFilter current={days} />
            </Suspense>
          }
        />

        {!isDatabaseConfigured && (
          <Banner tone="warn">
            <strong>No database connected.</strong> Set{' '}
            <code>DATABASE_URL</code> and run{' '}
            <code>npx prisma migrate deploy</code>. See{' '}
            <strong>ADMIN_SETUP.md</strong>.
          </Banner>
        )}
        {isDatabaseConfigured && !data.hasData && (
          <Banner>
            No visits recorded yet. Analytics start collecting as soon as the
            site is deployed with this build — no tracking script or third-party
            account needed.
          </Banner>
        )}
        {!isBlobConfigured() && process.env.NODE_ENV === 'production' && (
          <Banner tone="warn">
            <strong>No blob storage connected.</strong> Add a Vercel Blob store
            and set <code>BLOB_READ_WRITE_TOKEN</code>, otherwise uploads will
            not persist.
          </Banner>
        )}

        {/* KPI row */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {data.kpis.map((kpi) => (
            <StatTile key={kpi.label} kpi={kpi} rangeDays={days} />
          ))}
        </div>

        {/* Traffic */}
        <Card className="mb-8">
          <h2 className="mb-1 text-lg font-bold text-black">
            Visitors and page views
          </h2>
          <p className="mb-5 text-sm text-black/50">
            Daily totals. Visitors are counted without cookies, using a hash
            that resets each day.
          </p>
          <TrafficChart data={data.series} />
        </Card>

        {/* Pages + sources */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="mb-1 text-lg font-bold text-black">Top pages</h2>
            <p className="mb-5 text-sm text-black/50">
              Which pages people actually land on — the clearest read on whether
              the location and service pages are working.
            </p>
            <BarList rows={data.topPages} labelHeading="Page" linkLabels />
          </Card>

          <Card>
            <h2 className="mb-1 text-lg font-bold text-black">
              Where visitors come from
            </h2>
            <p className="mb-5 text-sm text-black/50">
              Search engines climbing here is the signal that the SEO work is
              landing.
            </p>
            <BarList
              rows={data.sources.map((s) => ({
                ...s,
                label: SOURCE_LABELS[s.label] ?? s.label,
              }))}
              labelHeading="Source"
            />
          </Card>
        </div>

        {/* Devices + countries */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="mb-1 text-lg font-bold text-black">Devices</h2>
            <p className="mb-5 text-sm text-black/50">
              Most Indian interior-design traffic is mobile — worth checking
              before design changes.
            </p>
            <DeviceBar rows={data.devices} />
          </Card>

          <Card>
            <h2 className="mb-1 text-lg font-bold text-black">Countries</h2>
            <p className="mb-5 text-sm text-black/50">
              Useful for spotting NRI enquiry demand from the Gulf, UK and US.
            </p>
            <BarList
              rows={data.countries}
              labelHeading="Country"
              emptyMessage="No country data yet."
            />
          </Card>
        </div>

        {/* Leads */}
        <Card className="mb-8 !p-0">
          <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
            <div>
              <h2 className="text-lg font-bold text-black">Latest enquiries</h2>
              <p className="text-sm text-black/50">
                Every contact-form submission is saved here.
              </p>
            </div>
            <Link
              href="/admin/leads"
              className="text-sm font-medium text-black underline-offset-2 hover:underline"
            >
              All enquiries →
            </Link>
          </div>
          {leads.length === 0 ? (
            <p className="px-6 py-8 text-sm text-black/40">No enquiries yet.</p>
          ) : (
            <ul className="divide-y divide-black/10">
              {leads.map((lead) => (
                <li
                  key={lead.id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-1 px-6 py-3.5"
                >
                  <span className="font-medium text-black">{lead.name}</span>
                  <a
                    href={`tel:${lead.phone}`}
                    className="text-sm text-black/60 underline-offset-2 hover:underline"
                  >
                    {lead.phone}
                  </a>
                  {lead.projectType && (
                    <span className="text-sm text-black/45">
                      {lead.projectType}
                    </span>
                  )}
                  <span className="ml-auto text-xs text-black/40">
                    {dayjs(lead.createdAt).format('D MMM, h:mm A')}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* CMS */}
        <h2 className="mb-1 text-lg font-bold text-black">Content</h2>
        <p className="mb-5 text-sm text-black/50">
          {contentCounts.categories} categories · {contentCounts.videos} videos
          · {contentCounts.projects} project pages · {contentCounts.posts}{' '}
          published posts
          {contentCounts.drafts > 0 && ` · ${contentCounts.drafts} drafts`}
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CMS_SECTIONS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="flex flex-col rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="mb-1.5 text-base font-bold text-black">
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
