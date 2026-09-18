import React from 'react';
import { requireSession } from '@/lib/auth';
import AdminNav from '@/components/admin/AdminNav';
import { AdminPageHeader } from '@/components/admin/ui';
import BlogPostForm from '@/components/admin/BlogPostForm';
import { BLOG_CATEGORIES } from '@/lib/blog/categories';

export const dynamic = 'force-dynamic';

export default async function NewBlogPostPage() {
  const session = await requireSession();
  return (
    <>
      <AdminNav email={session.email} />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <AdminPageHeader title="New post" backHref="/admin/blog" />
        <BlogPostForm
          categories={BLOG_CATEGORIES.map((c) => ({
            slug: c.slug,
            name: c.name,
          }))}
        />
      </main>
    </>
  );
}
