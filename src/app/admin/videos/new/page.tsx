import React from 'react';
import { requireSession } from '@/lib/auth';
import AdminNav from '@/components/admin/AdminNav';
import { AdminPageHeader } from '@/components/admin/ui';
import VideoForm from '@/components/admin/VideoForm';

export const dynamic = 'force-dynamic';

export default async function NewVideoPage() {
  const session = await requireSession();
  return (
    <>
      <AdminNav email={session.email} />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <AdminPageHeader title="New video" backHref="/admin/videos" />
        <VideoForm />
      </main>
    </>
  );
}
