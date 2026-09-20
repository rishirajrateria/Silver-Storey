import React from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { requireSession } from '@/lib/auth';
import { prisma, safeQuery } from '@/lib/db/client';
import AdminNav from '@/components/admin/AdminNav';
import {
  AdminPageHeader,
  Badge,
  Banner,
  Card,
  EmptyState,
  LinkButton,
} from '@/components/admin/ui';
import DeleteButton from '@/components/admin/DeleteButton';
import { deleteBlogPost } from '../content-actions';
import { ARTICLES } from '@/lib/blog';

export const dynamic = 'force-dynamic';

export default async function BlogAdminPage() {
  const session = await requireSession();
  const rows = await safeQuery(
    () =>
      prisma.blogPost.findMany({
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      }),
    [],
    'admin blog',
  );

  return (
    <>
      <AdminNav email={session.email} />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <AdminPageHeader
          title="Blog"
          description="Articles written in Markdown."
          backHref="/admin"
          action={<LinkButton href="/admin/blog/new">Write post</LinkButton>}
        />

        <Banner>
          {ARTICLES.length} built-in guides also ship with the site in code.
          Posts you create here appear alongside them, and a post using the same
          slug takes precedence.
        </Banner>

        {rows.length === 0 ? (
          <EmptyState
            message="No posts created here yet."
            action={
              <LinkButton href="/admin/blog/new">
                Write the first post
              </LinkButton>
            }
          />
        ) : (
          <Card className="!p-0">
            <ul className="divide-y divide-black/10">
              {rows.map((p) => (
                <li key={p.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-black/5">
                    {p.mainImageUrl && (
                      <img
                        src={p.mainImageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-black">{p.title}</p>
                    <p className="truncate text-sm text-black/50">
                      /blog/{p.slug}
                      {p.publishedAt &&
                        ` · ${dayjs(p.publishedAt).format('D MMM YYYY')}`}
                    </p>
                  </div>
                  <Badge on={p.published} />
                  <Link
                    href={`/admin/blog/${p.id}`}
                    className="text-sm font-medium text-black underline-offset-2 hover:underline"
                  >
                    Edit
                  </Link>
                  <DeleteButton
                    action={deleteBlogPost}
                    id={p.id}
                    label={p.title}
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
