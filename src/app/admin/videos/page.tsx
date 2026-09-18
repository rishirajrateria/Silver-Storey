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
import { deleteVideo } from '../content-actions';

export const dynamic = 'force-dynamic';

export default async function VideosPage() {
  const session = await requireSession();
  const rows = await safeQuery(
    () =>
      prisma.video.findMany({
        orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      }),
    [],
    'admin videos',
  );

  return (
    <>
      <AdminNav email={session.email} />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <AdminPageHeader
          title="Videos"
          description="YouTube videos shown in the home page carousel."
          backHref="/admin"
          action={<LinkButton href="/admin/videos/new">Add video</LinkButton>}
        />

        {rows.length === 0 ? (
          <EmptyState
            message="No videos yet."
            action={
              <LinkButton href="/admin/videos/new">
                Add the first one
              </LinkButton>
            }
          />
        ) : (
          <Card className="!p-0">
            <ul className="divide-y divide-black/10">
              {rows.map((v) => (
                <li key={v.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="h-14 w-24 shrink-0 overflow-hidden rounded-lg bg-black/5">
                    <img
                      src={`https://img.youtube.com/vi/${v.youtubeId}/default.jpg`}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-black">{v.title}</p>
                    <p className="truncate text-sm text-black/50">
                      {v.youtubeId} · order {v.order}
                    </p>
                  </div>
                  <Badge on={v.published} />
                  <Link
                    href={`/admin/videos/${v.id}`}
                    className="text-sm font-medium text-black underline-offset-2 hover:underline"
                  >
                    Edit
                  </Link>
                  <DeleteButton
                    action={deleteVideo}
                    id={v.id}
                    label={v.title}
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
