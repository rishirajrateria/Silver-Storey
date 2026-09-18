import React from 'react';
import { requireSession } from '@/lib/auth';
import AdminNav from '@/components/admin/AdminNav';
import { AdminPageHeader } from '@/components/admin/ui';
import ClientProjectForm from '@/components/admin/ClientProjectForm';

export const dynamic = 'force-dynamic';

export default async function NewClientProjectPage() {
  const session = await requireSession();
  return (
    <>
      <AdminNav email={session.email} />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <AdminPageHeader
          title="New client project"
          description="A unique project code is generated when you save."
          backHref="/admin/client-projects"
        />
        <ClientProjectForm />
      </main>
    </>
  );
}
