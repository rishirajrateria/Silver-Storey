import React from 'react';
import dayjs from 'dayjs';
import { requireSession } from '@/lib/auth';
import { prisma, safeQuery } from '@/lib/db/client';
import { getLeadCounts } from '@/lib/analytics/queries';
import AdminNav from '@/components/admin/AdminNav';
import { AdminPageHeader, Card, EmptyState } from '@/components/admin/ui';
import LeadStatusSelect from '@/components/admin/LeadStatusSelect';
import DeleteButton from '@/components/admin/DeleteButton';
import { deleteLead } from '../content-actions';

export const dynamic = 'force-dynamic';

const STATUS_ORDER = ['new', 'contacted', 'qualified', 'won', 'lost'] as const;
const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  won: 'Won',
  lost: 'Lost',
};

export default async function LeadsPage() {
  const session = await requireSession();
  const [leads, counts] = await Promise.all([
    safeQuery(
      () => prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 200 }),
      [],
      'admin leads',
    ),
    getLeadCounts(),
  ]);

  return (
    <>
      <AdminNav email={session.email} />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <AdminPageHeader
          title="Enquiries"
          description="Every contact-form submission, saved as it arrives. Emails still send as before."
          backHref="/admin"
        />

        <dl className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
          {STATUS_ORDER.map((status) => (
            <Card key={status} className="!p-4">
              <dt className="text-xs tracking-wide text-black/50 uppercase">
                {STATUS_LABELS[status]}
              </dt>
              <dd className="mt-1 text-2xl font-bold text-black">
                {counts[status] ?? 0}
              </dd>
            </Card>
          ))}
        </dl>

        {leads.length === 0 ? (
          <EmptyState message="No enquiries yet. They will appear here the moment someone submits the contact form." />
        ) : (
          <Card className="!p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-black/10 text-xs tracking-wide text-black/50 uppercase">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Name
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Phone
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Project
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Budget
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      From
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Received
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Status
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10">
                  {leads.map((lead) => (
                    <tr key={lead.id}>
                      <td className="px-5 py-3 font-medium text-black">
                        {lead.name}
                        {lead.address && (
                          <span className="block text-xs text-black/45">
                            {lead.address}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <a
                          href={`tel:${lead.phone}`}
                          className="text-black/70 underline-offset-2 hover:underline"
                        >
                          {lead.phone}
                        </a>
                      </td>
                      <td className="px-5 py-3 text-black/70">
                        {lead.projectType ?? '—'}
                      </td>
                      <td className="px-5 py-3 text-black/70">
                        {lead.budget ?? '—'}
                      </td>
                      <td className="px-5 py-3 text-xs text-black/50">
                        {lead.sourcePath ?? '—'}
                      </td>
                      <td className="px-5 py-3 text-xs whitespace-nowrap text-black/50">
                        {dayjs(lead.createdAt).format('D MMM YYYY, h:mm A')}
                      </td>
                      <td className="px-5 py-3">
                        <LeadStatusSelect id={lead.id} status={lead.status} />
                      </td>
                      <td className="px-5 py-3">
                        <DeleteButton
                          action={deleteLead}
                          id={lead.id}
                          label={lead.name}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>
    </>
  );
}
