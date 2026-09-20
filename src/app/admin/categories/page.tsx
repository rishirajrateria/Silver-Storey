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
import { deleteCategory } from '../content-actions';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const session = await requireSession();
  const rows = await safeQuery(
    () =>
      prisma.category.findMany({
        orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      }),
    [],
    'admin categories',
  );

  return (
    <>
      <AdminNav email={session.email} />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <AdminPageHeader
          title="Categories"
          description="Room cards shown on the home page, with their starting prices."
          backHref="/admin"
          action={
            <LinkButton href="/admin/categories/new">Add category</LinkButton>
          }
        />

        {rows.length === 0 ? (
          <EmptyState
            message="No categories yet."
            action={
              <LinkButton href="/admin/categories/new">
                Add the first one
              </LinkButton>
            }
          />
        ) : (
          <Card className="!p-0">
            <ul className="divide-y divide-black/10">
              {rows.map((c) => (
                <li key={c.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-black/5">
                    {c.imageUrl && (
                      <img
                        src={c.imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-black">{c.name}</p>
                    <p className="text-sm text-black/50">
                      {c.price} · order {c.order}
                    </p>
                  </div>
                  <Badge on={c.published} />
                  <Link
                    href={`/admin/categories/${c.id}`}
                    className="text-sm font-medium text-black underline-offset-2 hover:underline"
                  >
                    Edit
                  </Link>
                  <DeleteButton
                    action={deleteCategory}
                    id={c.id}
                    label={c.name}
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
