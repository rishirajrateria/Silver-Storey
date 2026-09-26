import type { Metadata } from 'next';
import PageShell from '@/components/seo/PageShell';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import FAQSection from '@/components/seo/FAQSection';
import { PageHero } from '@/components/seo/Prose';
import TrackForm from '@/features/Track/TrackForm';
import JsonLd from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import {
  breadcrumbSchema,
  faqSchema,
  graph,
  webPageSchema,
  type FAQ,
} from '@/lib/seo/schema';
import { SITE } from '@/lib/seo/site';
import { getProjectPageLinks } from '@/lib/db/content';

const PATH = '/track';
const TITLE = 'Track Your Project | Silver Storey Clients';
const DESCRIPTION =
  'Silver Storey clients: check the live status of your interior project — current milestone, expected handover, site photos and notes from your project manager.';

// Clients reach the tracker from the link in their welcome email; it holds
// nothing a searcher wants, so it stays out of the index (robots.txt agrees).
export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  noIndex: true,
});

const FAQS: FAQ[] = [
  {
    question: 'Where do I find my project code?',
    answer:
      'It is in the welcome message we send after your token booking, and your project manager can share it again at any time.',
  },
  {
    question: 'How often is the tracker updated?',
    answer:
      'Your project manager posts an update at every milestone and usually with site photos two or three times a week during execution.',
  },
  {
    question: 'What if my details are not recognised?',
    answer: `Check the code and the last four digits of the phone number you registered with. If it still fails, call ${SITE.phoneDisplay} and we will sort it out.`,
  },
];

export default async function TrackPage() {
  const projectPages = await getProjectPageLinks();
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Track your project', path: PATH },
  ];
  const jsonLd = graph(
    webPageSchema({ name: TITLE, description: DESCRIPTION, path: PATH }),
    breadcrumbSchema(crumbs),
    faqSchema(FAQS),
  );

  return (
    <PageShell projectPages={projectPages}>
      <JsonLd data={jsonLd} />
      <PageHero
        eyebrow="For Silver Storey clients"
        title="Track Your Project"
        subtitle="See which of the six milestones your home is at, the expected handover date, and the latest photos and notes from site."
      >
        <Breadcrumbs items={crumbs} />
      </PageHero>
      <section className="mx-auto max-w-4xl px-6 py-6">
        <TrackForm />
      </section>
      <FAQSection faqs={FAQS} />
    </PageShell>
  );
}
