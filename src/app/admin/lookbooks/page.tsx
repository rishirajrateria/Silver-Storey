import React from 'react';
import Link from 'next/link';
import { requireSession } from '@/lib/auth';
import { prisma, safeQuery } from '@/lib/db/client';
import AdminNav from '@/components/admin/AdminNav';
import {
  AdminPageHeader,
  Badge,
  Card,
  EmptyState,
  LinkButton,
} from '@/components/admin/ui';
import DeleteButton from '@/components/admin/DeleteButton';
import { deleteLookbook } from '../content-actions';

export const dynamic = 'force-dynamic';

export default async function LookbooksAdminPage() {
  const session = await requireSession();
  const rows = await safeQuery(
    () =>
      prisma.lookbook.findMany({
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      }),
    [],
    'admin lookbooks',
  );

  return (
    <>
      <AdminNav email={session.email} />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <AdminPageHeader
          title="Lookbooks"
          description="PDF catalogues visitors download in exchange for their contact details. Each download appears under Enquiries as a lookbook lead."
          backHref="/admin"
          action={
            <LinkButton href="/admin/lookbooks/new">Add lookbook</LinkButton>
          }
        />
        {rows.length === 0 ? (
          <EmptyState
            message="No lookbooks yet."
            action={
              <LinkButton href="/admin/lookbooks/new">
                Add the first one
              </LinkButton>
            }
          />
        ) : (
          <Card className="!p-0">
            <ul className="divide-y divide-black/10">
              {rows.map((l) => (
                <li key={l.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-black/5">
                    {l.coverImageUrl && (
                      <img
                        src={l.coverImageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-black">{l.title}</p>
                    <p className="text-sm text-black/50">
                      /lookbooks/{l.slug} · {l.downloads} download
                      {l.downloads === 1 ? '' : 's'} · order {l.order}
                    </p>
                  </div>
                  <Badge on={l.published} />
                  <Link
                    href={`/admin/lookbooks/${l.id}`}
                    className="text-sm font-medium text-black underline-offset-2 hover:underline"
                  >
                    Edit
                  </Link>
                  <DeleteButton
                    action={deleteLookbook}
                    id={l.id}
                    label={l.title}
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
