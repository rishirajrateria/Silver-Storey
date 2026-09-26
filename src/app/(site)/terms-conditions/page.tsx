import type { Metadata } from 'next';
import TermsConditionsPage from '@/features/TermsConditions/TermsConditionsPage';
import { getProjectPageLinks } from '@/lib/db/content';
import JsonLd from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, graph, webPageSchema } from '@/lib/seo/schema';
import { SITE } from '@/lib/seo/site';

const PATH = '/terms-conditions';
const TITLE = 'Terms & Conditions | Warranty and Service Terms – Silver Storey';
const DESCRIPTION = `Silver Storey’s terms of service, ${SITE.warranty.termYears}-year warranty conditions, payment schedule and project policies for residential and commercial interior design.`;

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Terms & Conditions', path: PATH },
];

export default async function Page() {
  const projectPages = await getProjectPageLinks();
  const jsonLd = graph(
    webPageSchema({
      name: TITLE,
      description: DESCRIPTION,
      path: PATH,
    }),
    breadcrumbSchema(CRUMBS),
  );
  return (
    <>
      <JsonLd data={jsonLd} />
      <TermsConditionsPage projectPages={projectPages} crumbs={CRUMBS} />
    </>
  );
}
