import React from 'react';
import Link from 'next/link';
import { requireSession } from '@/lib/auth';
import { prisma, safeQuery } from '@/lib/db/client';
import AdminNav from '@/components/admin/AdminNav';
import {
  AdminPageHeader,
  Badge,
  Card,
  EmptyState,
  LinkButton,
} from '@/components/admin/ui';
import DeleteButton from '@/components/admin/DeleteButton';
import { deleteProjectPage } from '../content-actions';
import { RETIRED_PROJECT_SLUGS, VISUALISATION_SLUG } from '@/lib/project-slugs';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const session = await requireSession();
  const rows = await safeQuery(
    () =>
      prisma.projectPage.findMany({
        orderBy: [{ order: 'asc' }, { title: 'asc' }],
        include: { _count: { select: { sections: true } } },
      }),
    [],
    'admin projects',
  );

  return (
    <>
      <AdminNav email={session.email} />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <AdminPageHeader
          title="Project Pages"
          description="Gallery pages, published at /projects/<slug>. The reserved slug 3d-visualisation powers that top-level page instead."
          backHref="/admin"
          action={<LinkButton href="/admin/projects/new">Add page</LinkButton>}
        />

        {rows.length === 0 ? (
          <EmptyState
            message="No project pages yet."
            action={
              <LinkButton href="/admin/projects/new">
                Add the first one
              </LinkButton>
            }
          />
        ) : (
          <Card className="!p-0">
            <ul className="divide-y divide-black/10">
              {rows.map((p) => {
                const href = RETIRED_PROJECT_SLUGS.includes(p.slug)
                  ? 'not shown on the site'
                  : p.slug === VISUALISATION_SLUG
                    ? `/${p.slug}`
                    : `/projects/${p.slug}`;
                return (
                  <li key={p.id} className="flex items-center gap-4 px-6 py-4">
                    <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-black/5">
                      {p.heroImageUrl && (
                        <img
                          src={p.heroImageUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-black">
                        {p.title}
                      </p>
                      <p className="truncate text-sm text-black/50">
                        {href} · {p._count.sections} section
                        {p._count.sections === 1 ? '' : 's'}
                      </p>
                    </div>
                    <Badge on={p.published} />
                    <Link
                      href={`/admin/projects/${p.id}`}
                      className="text-sm font-medium text-black underline-offset-2 hover:underline"
                    >
                      Edit
                    </Link>
                    <DeleteButton
                      action={deleteProjectPage}
                      id={p.id}
                      label={p.title}
                    />
                  </li>
                );
              })}
            </ul>
          </Card>
        )}
      </main>
    </>
  );
}
