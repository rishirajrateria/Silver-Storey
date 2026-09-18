import React from 'react';
import { notFound } from 'next/navigation';
import { requireSession } from '@/lib/auth';
import { prisma, safeQuery } from '@/lib/db/client';
import AdminNav from '@/components/admin/AdminNav';
import { AdminPageHeader } from '@/components/admin/ui';
import LookbookForm from '@/components/admin/LookbookForm';

export const dynamic = 'force-dynamic';

export default async function EditLookbookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSession();
  const { id } = await params;
  const row = await safeQuery(
    () => prisma.lookbook.findUnique({ where: { id } }),
    null,
    'edit lookbook',
  );
  if (!row) notFound();

  return (
    <>
      <AdminNav email={session.email} />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <AdminPageHeader
          title={`Edit ${row.title}`}
          backHref="/admin/lookbooks"
        />
        <LookbookForm
          values={{
            id: row.id,
            title: row.title,
            slug: row.slug,
            description: row.description ?? undefined,
            roomType: row.roomType ?? undefined,
            fileUrl: row.fileUrl,
            coverImageUrl: row.coverImageUrl ?? undefined,
            pages: row.pages ?? undefined,
            order: row.order,
            published: row.published,
          }}
        />
      </main>
    </>
  );
}
