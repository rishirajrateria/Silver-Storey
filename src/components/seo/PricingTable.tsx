import React from 'react';
import Link from 'next/link';
import type { PriceRow } from '@/lib/locations/content';
import { formatINR } from '@/lib/locations/content';
import { servicePath } from '@/lib/services';

export default function PricingTable({
  title,
  rows,
  note,
}: {
  title: string;
  rows: PriceRow[];
  note?: string;
}) {
  return (
    <section
      className="mx-auto max-w-5xl px-6 py-14 sm:py-20"
      aria-labelledby="pricing-title"
    >
      <h2
        id="pricing-title"
        className="mb-3 text-2xl font-bold tracking-tight text-black sm:text-3xl"
      >
        {title}
      </h2>
      <p className="mb-8 max-w-2xl text-sm text-black/55 sm:text-base">
        {note ??
          'Indicative starting estimates. Every Silver Storey quote is itemised — consultation, site measurement and 3D visualisation are complimentary.'}
      </p>
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm sm:text-base">
          <thead className="bg-black text-white">
            <tr>
              <th scope="col" className="px-5 py-3 font-semibold">
                Scope
              </th>
              <th scope="col" className="px-5 py-3 font-semibold">
                Starting from
              </th>
              <th
                scope="col"
                className="hidden px-5 py-3 font-semibold sm:table-cell"
              >
                Typical range
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10">
            {rows.map((r) => (
              <tr key={r.key}>
                <td className="px-5 py-3 text-black">
                  <Link
                    href={servicePath(r.serviceSlug)}
                    className="underline-offset-2 hover:underline"
                  >
                    {r.label}
                  </Link>
                </td>
                <td className="px-5 py-3 font-semibold text-[#6b1a1a]">
                  {formatINR(r.from)}
                </td>
                <td className="hidden px-5 py-3 text-black/60 sm:table-cell">
                  {formatINR(r.from)} – {formatINR(r.to)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
