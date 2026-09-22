import React from 'react';
import { notFound } from 'next/navigation';
import { requireSession } from '@/lib/auth';
import { prisma, safeQuery } from '@/lib/db/client';
import AdminNav from '@/components/admin/AdminNav';
import { AdminPageHeader } from '@/components/admin/ui';
import CategoryForm from '@/components/admin/CategoryForm';

export const dynamic = 'force-dynamic';

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSession();
  const { id } = await params;
  const row = await safeQuery(
    () =>
      prisma.category.findUnique({
        where: { id },
        include: { images: { orderBy: { order: 'asc' } } },
      }),
    null,
    'edit category',
  );
  if (!row) notFound();

  return (
    <>
      <AdminNav email={session.email} />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <AdminPageHeader
          title={`Edit ${row.name}`}
          backHref="/admin/categories"
        />
        <CategoryForm
          values={{
            id: row.id,
            name: row.name,
            price: row.price,
            imageUrl: row.imageUrl ?? undefined,
            order: row.order,
            published: row.published,
            images: row.images.map((image) => ({
              key: image.id,
              imageUrl: image.imageUrl,
              title: image.title ?? '',
              price: image.price ?? '',
            })),
          }}
        />
      </main>
    </>
  );
}
