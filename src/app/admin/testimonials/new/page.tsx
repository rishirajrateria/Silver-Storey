import React from 'react';
import { requireSession } from '@/lib/auth';
import AdminNav from '@/components/admin/AdminNav';
import { AdminPageHeader } from '@/components/admin/ui';
import TestimonialForm from '@/components/admin/TestimonialForm';

export const dynamic = 'force-dynamic';

export default async function NewTestimonialPage() {
  const session = await requireSession();
  return (
    <>
      <AdminNav email={session.email} />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <AdminPageHeader
          title="New testimonial"
          backHref="/admin/testimonials"
        />
        <TestimonialForm />
      </main>
    </>
  );
}
