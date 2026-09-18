import React from 'react';
import { requireSession } from '@/lib/auth';
import AdminNav from '@/components/admin/AdminNav';
import { AdminPageHeader } from '@/components/admin/ui';
import ProjectPageForm from '@/components/admin/ProjectPageForm';

export const dynamic = 'force-dynamic';

export default async function NewProjectPage() {
  const session = await requireSession();
  return (
    <>
      <AdminNav email={session.email} />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <AdminPageHeader title="New project page" backHref="/admin/projects" />
        <ProjectPageForm />
      </main>
    </>
  );
}
