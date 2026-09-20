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
import { deleteTestimonial } from '../content-actions';

export const dynamic = 'force-dynamic';

export default async function TestimonialsPage() {
  const session = await requireSession();
  const rows = await safeQuery(
    () =>
      prisma.testimonial.findMany({
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      }),
    [],
    'admin testimonials',
  );

  return (
    <>
      <AdminNav email={session.email} />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <AdminPageHeader
          title="Testimonials"
          description="Real client reviews. Published ones replace the built-in quotes on the home and about pages and feed star-rating markup for Google."
          backHref="/admin"
          action={
            <LinkButton href="/admin/testimonials/new">
              Add testimonial
            </LinkButton>
          }
        />

        {rows.length === 0 ? (
          <EmptyState
            message="No testimonials yet — the site is showing the three built-in quotes."
            action={
              <LinkButton href="/admin/testimonials/new">
                Add the first one
              </LinkButton>
            }
          />
        ) : (
          <Card className="!p-0">
            <ul className="divide-y divide-black/10">
              {rows.map((t) => (
                <li key={t.id} className="flex items-start gap-4 px-6 py-4">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-black/5">
                    {t.imageUrl && (
                      <img
                        src={t.imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-black">
                      {t.name}
                      <span className="ml-2 text-xs text-[#6b1a1a]">
                        {'★'.repeat(t.rating)}
                        <span className="text-black/20">
                          {'★'.repeat(5 - t.rating)}
                        </span>
                      </span>
                    </p>
                    <p className="line-clamp-2 text-sm text-black/60">
                      {t.quote}
                    </p>
                    <p className="mt-1 text-xs text-black/45">
                      {[t.location, t.projectType, t.source]
                        .filter(Boolean)
                        .join(' · ')}{' '}
                      · order {t.order}
                    </p>
                  </div>
                  <Badge on={t.published} />
                  <Link
                    href={`/admin/testimonials/${t.id}`}
                    className="text-sm font-medium text-black underline-offset-2 hover:underline"
                  >
                    Edit
                  </Link>
                  <DeleteButton
                    action={deleteTestimonial}
                    id={t.id}
                    label={t.name}
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
