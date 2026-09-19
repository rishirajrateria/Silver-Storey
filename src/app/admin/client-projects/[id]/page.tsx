import React from 'react';
import dayjs from 'dayjs';
import { notFound } from 'next/navigation';
import { requireSession } from '@/lib/auth';
import { prisma, safeQuery } from '@/lib/db/client';
import AdminNav from '@/components/admin/AdminNav';
import { AdminPageHeader, Card } from '@/components/admin/ui';
import ClientProjectForm from '@/components/admin/ClientProjectForm';
import ProjectUpdateForm from '@/components/admin/ProjectUpdateForm';
import DeleteButton from '@/components/admin/DeleteButton';
import { deleteProjectUpdate } from '../../content-actions';
import { TRACK_STEPS } from '@/lib/track';

export const dynamic = 'force-dynamic';

const toInput = (d: Date | null) =>
  d ? dayjs(d).format('YYYY-MM-DD') : undefined;

export default async function EditClientProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSession();
  const { id } = await params;
  const row = await safeQuery(
    () =>
      prisma.clientProject.findUnique({
        where: { id },
        include: { updates: { orderBy: { createdAt: 'desc' } } },
      }),
    null,
    'edit client project',
  );
  if (!row) notFound();

  return (
    <>
      <AdminNav email={session.email} />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <AdminPageHeader
          title={row.title}
          description={`${row.clientName} · code ${row.accessCode}`}
          backHref="/admin/client-projects"
        />
        <div className="space-y-8">
          <ClientProjectForm
            values={{
              id: row.id,
              accessCode: row.accessCode,
              clientName: row.clientName,
              phoneLast4: row.phoneLast4,
              title: row.title,
              city: row.city ?? undefined,
              currentStep: row.currentStep,
              status: row.status,
              startDate: toInput(row.startDate),
              expectedHandover: toInput(row.expectedHandover),
              projectManager: row.projectManager ?? undefined,
              notes: row.notes ?? undefined,
            }}
          />

          <ProjectUpdateForm
            clientProjectId={row.id}
            currentStep={row.currentStep}
          />

          <Card className="!p-0">
            <h2 className="border-b border-black/10 px-6 py-4 text-lg font-bold text-black">
              Updates ({row.updates.length})
            </h2>
            {row.updates.length === 0 ? (
              <p className="px-6 py-6 text-sm text-black/50">
                Nothing posted yet.
              </p>
            ) : (
              <ul className="divide-y divide-black/10">
                {row.updates.map((u) => (
                  <li key={u.id} className="flex gap-4 px-6 py-4">
                    <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-black/5">
                      {u.imageUrl && (
                        <img
                          src={u.imageUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-black">{u.title}</p>
                      {u.body && (
                        <p className="line-clamp-2 text-sm text-black/60">
                          {u.body}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-black/45">
                        {dayjs(u.createdAt).format('D MMM YYYY, h:mm A')}
                        {u.step && ` · ${TRACK_STEPS[u.step - 1]?.name}`}
                      </p>
                    </div>
                    <DeleteButton
                      action={deleteProjectUpdate}
                      id={u.id}
                      label={u.title}
                    />
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </main>
    </>
  );
}
