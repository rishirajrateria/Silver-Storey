import React from 'react';
import { notFound } from 'next/navigation';
import { requireSession } from '@/lib/auth';
import { prisma, safeQuery } from '@/lib/db/client';
import AdminNav from '@/components/admin/AdminNav';
import { AdminPageHeader } from '@/components/admin/ui';
import TestimonialForm from '@/components/admin/TestimonialForm';

export const dynamic = 'force-dynamic';

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSession();
  const { id } = await params;
  const row = await safeQuery(
    () => prisma.testimonial.findUnique({ where: { id } }),
    null,
    'edit testimonial',
  );
  if (!row) notFound();

  return (
    <>
      <AdminNav email={session.email} />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <AdminPageHeader
          title={`Edit — ${row.name}`}
          backHref="/admin/testimonials"
        />
        <TestimonialForm
          values={{
            id: row.id,
            name: row.name,
            location: row.location ?? undefined,
            projectType: row.projectType ?? undefined,
            rating: row.rating,
            quote: row.quote,
            imageUrl: row.imageUrl ?? undefined,
            source: row.source,
            sourceUrl: row.sourceUrl ?? undefined,
            order: row.order,
            published: row.published,
          }}
        />
      </main>
    </>
  );
}
