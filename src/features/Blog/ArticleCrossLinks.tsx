import React from 'react';
import LinkGrid from '@/components/seo/LinkGrid';
import type { ServiceData } from '@/lib/services';
import { servicePath } from '@/lib/services';
import type { CityData } from '@/lib/locations';
import { cityPath } from '@/lib/locations';
import { formatINR } from '@/lib/locations/content';

function columnsFor(count: number): 2 | 3 | 4 {
  return count > 3 ? 4 : count === 1 ? 2 : 3;
}

/**
 * The bridge from a guide to the pages that sell: the services it discusses
 * and the city landing pages for the places it names. Rendered on the server
 * so the links are in the HTML a crawler reads, and skipped entirely when the
 * matcher found nothing rather than padded with unrelated pages.
 */
export default function ArticleCrossLinks({
  services,
  cities,
}: {
  services: ServiceData[];
  cities: CityData[];
}) {
  if (!services.length && !cities.length) return null;
  return (
    <>
      <LinkGrid
        id="related-services"
        title="Related services"
        description="What the studio designs and delivers for the rooms and homes this guide covers, with starting prices."
        columns={columnsFor(services.length)}
        items={services.map((s) => ({
          name: s.name,
          path: servicePath(s),
          meta: s.startingPriceINR
            ? `from ${formatINR(s.startingPriceINR)}`
            : undefined,
        }))}
      />
      <LinkGrid
        id="related-cities"
        title="Interior designers in the cities this guide mentions"
        columns={columnsFor(cities.length)}
        items={cities.map((c) => ({
          name: `Interior Designers in ${c.name}`,
          path: cityPath(c),
        }))}
      />
    </>
  );
}
