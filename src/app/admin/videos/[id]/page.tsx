import React from 'react';
import { notFound } from 'next/navigation';
import { requireSession } from '@/lib/auth';
import { prisma, safeQuery } from '@/lib/db/client';
import AdminNav from '@/components/admin/AdminNav';
import { AdminPageHeader } from '@/components/admin/ui';
import VideoForm from '@/components/admin/VideoForm';

export const dynamic = 'force-dynamic';

export default async function EditVideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSession();
  const { id } = await params;
  const row = await safeQuery(
    () => prisma.video.findUnique({ where: { id } }),
    null,
    'edit video',
  );
  if (!row) notFound();

  return (
    <>
      <AdminNav email={session.email} />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <AdminPageHeader title={`Edit ${row.title}`} backHref="/admin/videos" />
        <VideoForm
          values={{
            id: row.id,
            title: row.title,
            youtubeId: row.youtubeId,
            description: row.description ?? undefined,
            order: row.order,
            published: row.published,
          }}
        />
      </main>
    </>
  );
}
