import type { Metadata } from 'next';
import TermsConditionsPage from '@/features/TermsConditions/TermsConditionsPage';
import { getProjectPages } from '@/lib/sanity/projectPages';
import JsonLd from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, graph, webPageSchema } from '@/lib/seo/schema';

const TITLE = 'Terms & Conditions | Warranty and Service Terms – Silver Storey';
const DESCRIPTION =
  'Silver Storey’s terms of service, 10-year warranty conditions, payment schedule and project policies for residential and commercial interior design.';

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/terms-conditions',
});

export default async function Page() {
  const projectPages = await getProjectPages();
  const jsonLd = graph(
    webPageSchema({
      name: TITLE,
      description: DESCRIPTION,
      path: '/terms-conditions',
    }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Terms & Conditions', path: '/terms-conditions' },
    ]),
  );
  return (
    <>
      <JsonLd data={jsonLd} />
      <TermsConditionsPage projectPages={projectPages} />
    </>
  );
}
