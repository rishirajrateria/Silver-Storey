import type { Metadata } from 'next';
import ContactPage from '@/features/Contact/ContactPage';
import { getProjectPageLinks } from '@/lib/db/content';
import JsonLd from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import {
  breadcrumbSchema,
  graph,
  localBusinessSchema,
  webPageSchema,
} from '@/lib/seo/schema';
import { SITE } from '@/lib/seo/site';

const PATH = '/contact';
const TITLE =
  'Contact Silver Storey | Book a Free Interior Design Consultation';
const DESCRIPTION = `Call ${SITE.phoneDisplay}, WhatsApp, email ${SITE.email} or book a free 30-minute consultation. Head office: ${SITE.address.street}, Kolkata ${SITE.address.postalCode}. Projects across India.`;

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Contact', path: PATH },
];

export default async function Page() {
  const projectPages = await getProjectPageLinks();
  const jsonLd = graph(
    webPageSchema({
      name: TITLE,
      description: DESCRIPTION,
      path: PATH,
      type: 'ContactPage',
    }),
    breadcrumbSchema(CRUMBS),
    localBusinessSchema(),
  );
  return (
    <>
      <JsonLd data={jsonLd} />
      <ContactPage projectPages={projectPages} crumbs={CRUMBS} />
    </>
  );
}
