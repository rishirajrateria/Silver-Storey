import React from 'react';
import { notFound } from 'next/navigation';
import { requireSession } from '@/lib/auth';
import { prisma, safeQuery } from '@/lib/db/client';
import AdminNav from '@/components/admin/AdminNav';
import { AdminPageHeader } from '@/components/admin/ui';
import ProjectPageForm from '@/components/admin/ProjectPageForm';

export const dynamic = 'force-dynamic';

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSession();
  const { id } = await params;

  const row = await safeQuery(
    () =>
      prisma.projectPage.findUnique({
        where: { id },
        include: {
          sections: {
            orderBy: { order: 'asc' },
            include: { images: { orderBy: { order: 'asc' } } },
          },
        },
      }),
    null,
    'edit project page',
  );
  if (!row) notFound();

  return (
    <>
      <AdminNav email={session.email} />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <AdminPageHeader
          title={`Edit ${row.title}`}
          backHref="/admin/projects"
        />
        <ProjectPageForm
          values={{
            id: row.id,
            title: row.title,
            slug: row.slug,
            heroTitle: row.heroTitle,
            heroSubtitle: row.heroSubtitle ?? undefined,
            heroImageUrl: row.heroImageUrl ?? undefined,
            order: row.order,
            published: row.published,
            sections: row.sections.map((s) => ({
              key: s.id,
              title: s.title,
              images: s.images.map((i) => ({
                key: i.id,
                title: i.title,
                description: i.description ?? '',
                imageUrl: i.imageUrl,
              })),
            })),
          }}
        />
      </main>
    </>
  );
}
