import React from 'react';
import { notFound } from 'next/navigation';
import { requireSession } from '@/lib/auth';
import { prisma, safeQuery } from '@/lib/db/client';
import AdminNav from '@/components/admin/AdminNav';
import { AdminPageHeader } from '@/components/admin/ui';
import BlogPostForm from '@/components/admin/BlogPostForm';
import { BLOG_CATEGORIES } from '@/lib/blog/categories';

export const dynamic = 'force-dynamic';

/** `datetime-local` needs `YYYY-MM-DDTHH:mm` in local time. */
function toLocalInput(date: Date | null): string | undefined {
  if (!date) return undefined;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSession();
  const { id } = await params;
  const row = await safeQuery(
    () => prisma.blogPost.findUnique({ where: { id } }),
    null,
    'edit blog post',
  );
  if (!row) notFound();

  return (
    <>
      <AdminNav email={session.email} />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <AdminPageHeader title={`Edit ${row.title}`} backHref="/admin/blog" />
        <BlogPostForm
          categories={BLOG_CATEGORIES.map((c) => ({
            slug: c.slug,
            name: c.name,
          }))}
          values={{
            id: row.id,
            title: row.title,
            slug: row.slug,
            description: row.description ?? undefined,
            author: row.author ?? undefined,
            category: row.category ?? undefined,
            mainImageUrl: row.mainImageUrl ?? undefined,
            body: row.body,
            published: row.published,
            publishedAt: toLocalInput(row.publishedAt),
          }}
        />
      </main>
    </>
  );
}
