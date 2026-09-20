import React from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { requireSession } from '@/lib/auth';
import { prisma, safeQuery } from '@/lib/db/client';
import AdminNav from '@/components/admin/AdminNav';
import {
  AdminPageHeader,
  Card,
  EmptyState,
  LinkButton,
} from '@/components/admin/ui';
import DeleteButton from '@/components/admin/DeleteButton';
import { deleteClientProject } from '../content-actions';
import { TRACK_STEPS, statusLabel } from '@/lib/track';

export const dynamic = 'force-dynamic';

export default async function ClientProjectsPage() {
  const session = await requireSession();
  const rows = await safeQuery(
    () =>
      prisma.clientProject.findMany({
        orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }],
        include: { _count: { select: { updates: true } } },
      }),
    [],
    'admin client projects',
  );

  return (
    <>
      <AdminNav email={session.email} />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <AdminPageHeader
          title="Client Projects"
          description="Live projects your clients can follow at /track. Create one per project, share the code, then post updates as work progresses."
          backHref="/admin"
          action={
            <LinkButton href="/admin/client-projects/new">
              New project
            </LinkButton>
          }
        />
        {rows.length === 0 ? (
          <EmptyState
            message="No client projects yet."
            action={
              <LinkButton href="/admin/client-projects/new">
                Create the first one
              </LinkButton>
            }
          />
        ) : (
          <Card className="!p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-black/10 text-xs tracking-wide text-black/50 uppercase">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Project</th>
                    <th className="px-5 py-3 font-semibold">Code</th>
                    <th className="px-5 py-3 font-semibold">Stage</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Updated</th>
                    <th className="px-5 py-3 font-semibold"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10">
                  {rows.map((p) => (
                    <tr key={p.id}>
                      <td className="px-5 py-3">
                        <Link
                          href={`/admin/client-projects/${p.id}`}
                          className="font-medium text-black underline-offset-2 hover:underline"
                        >
                          {p.title}
                        </Link>
                        <span className="block text-xs text-black/45">
                          {p.clientName}
                          {p.city ? ` · ${p.city}` : ''} · {p._count.updates}{' '}
                          update{p._count.updates === 1 ? '' : 's'}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-mono text-black/70">
                        {p.accessCode}
                      </td>
                      <td className="px-5 py-3 text-black/70">
                        {p.currentStep}. {TRACK_STEPS[p.currentStep - 1]?.name}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${p.status === 'completed' ? 'bg-green-100 text-green-800' : p.status === 'on-hold' ? 'bg-amber-100 text-amber-900' : 'bg-black/10 text-black/70'}`}
                        >
                          {statusLabel(p.status)}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs whitespace-nowrap text-black/50">
                        {dayjs(p.updatedAt).format('D MMM YYYY')}
                      </td>
                      <td className="px-5 py-3">
                        <DeleteButton
                          action={deleteClientProject}
                          id={p.id}
                          label={p.title}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>
    </>
  );
}
