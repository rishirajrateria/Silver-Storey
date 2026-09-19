import React from 'react';
import { requireSession } from '@/lib/auth';
import { prisma, safeQuery } from '@/lib/db/client';
import AdminNav from '@/components/admin/AdminNav';
import { AdminPageHeader, Card } from '@/components/admin/ui';
import DeleteButton from '@/components/admin/DeleteButton';
import BrochureForm from '@/components/admin/BrochureForm';
import { deleteBrochure } from '../content-actions';

export const dynamic = 'force-dynamic';

export default async function BrochurePage() {
  const session = await requireSession();
  const rows = await safeQuery(
    () =>
      prisma.brochure.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
    [],
    'admin brochure',
  );
  const active = rows.find((r) => r.isActive);

  return (
    <>
      <AdminNav email={session.email} />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <AdminPageHeader
          title="Brochure"
          description="The PDF offered for download on the home page. Uploading a new one replaces the active brochure."
          backHref="/admin"
        />

        <div className="mb-8">
          <BrochureForm
            activeFilename={active?.filename}
            activeUrl={active?.fileUrl}
          />
        </div>

        {rows.length > 0 && (
          <Card className="!p-0">
            <p className="border-b border-black/10 px-6 py-3 text-sm font-medium text-black">
              Uploaded brochures
            </p>
            <ul className="divide-y divide-black/10">
              {rows.map((b) => (
                <li key={b.id} className="flex items-center gap-4 px-6 py-3.5">
                  <a
                    href={b.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-0 flex-1 truncate text-sm text-black underline-offset-2 hover:underline"
                  >
                    {b.filename}
                  </a>
                  {b.isActive && (
                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Active
                    </span>
                  )}
                  <DeleteButton
                    action={deleteBrochure}
                    id={b.id}
                    label={b.filename}
                  />
                </li>
              ))}
            </ul>
          </Card>
        )}
      </main>
    </>
  );
}
