import type { Metadata } from 'next';
import ContactPage from '@/features/Contact/ContactPage';
import { getProjectPages } from '@/lib/sanity/projectPages';
import JsonLd from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import {
  breadcrumbSchema,
  graph,
  localBusinessSchema,
  webPageSchema,
} from '@/lib/seo/schema';
import { SITE } from '@/lib/seo/site';

const TITLE =
  'Contact Silver Storey | Book a Free Interior Design Consultation';
const DESCRIPTION = `Call ${SITE.phoneDisplay}, WhatsApp, email ${SITE.email} or book a free 30-minute consultation. Head office: ${SITE.address.street}, Kolkata ${SITE.address.postalCode}. Projects across India.`;

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/contact',
  keywords: [
    'contact interior designer',
    'interior designer Kolkata contact',
    'free interior design consultation',
  ],
});

export default async function Page() {
  const projectPages = await getProjectPages();
  const jsonLd = graph(
    webPageSchema({
      name: TITLE,
      description: DESCRIPTION,
      path: '/contact',
      type: 'ContactPage',
    }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Contact', path: '/contact' },
    ]),
    localBusinessSchema({ id: '/contact#localbusiness', url: '/contact' }),
  );
  return (
    <>
      <JsonLd data={jsonLd} />
      <ContactPage projectPages={projectPages} />
    </>
  );
}
