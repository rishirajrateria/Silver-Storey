import type { Metadata } from 'next';
import HowItWorksPage from '@/features/HowItWorks/HowItWorksPage';
import { HOW_IT_WORKS_FAQS } from '@/features/HowItWorks/faqs';
import { getProjectPageLinks } from '@/lib/db/content';
import JsonLd from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import {
  breadcrumbSchema,
  faqSchema,
  graph,
  howToSchema,
  webPageSchema,
} from '@/lib/seo/schema';
import { PROCESS_STEPS } from '@/lib/seo/process';
import { SITE } from '@/lib/seo/site';

const PATH = '/how-it-works';
const TITLE = 'How It Works | Silver Storey’s 6-Step Interior Design Process';
const DESCRIPTION = `Free consultation, itemised estimate, booking token, free 3D, design approval, handover within ${SITE.stats.deliveryDays} days: how a Silver Storey project runs and when you pay.`;

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'How it Works', path: PATH },
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
    howToSchema({
      name: 'How a Silver Storey interior design project works',
      description: DESCRIPTION,
      steps: PROCESS_STEPS,
      totalTime: 'P45D',
    }),
    faqSchema(HOW_IT_WORKS_FAQS),
  );
  return (
    <>
      <JsonLd data={jsonLd} />
      <HowItWorksPage projectPages={projectPages} crumbs={CRUMBS} />
    </>
  );
}
