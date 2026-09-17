import type { Metadata } from 'next';
import HowItWorksPage from '@/features/HowItWorks/HowItWorksPage';
import { getProjectPages } from '@/lib/sanity/projectPages';
import JsonLd from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import {
  breadcrumbSchema,
  graph,
  howToSchema,
  webPageSchema,
} from '@/lib/seo/schema';
import { PROCESS_STEPS } from '@/lib/seo/process';

const TITLE = 'How It Works | Silver Storey’s 6-Step Interior Design Process';
const DESCRIPTION =
  'From a free consultation and estimate to complimentary 3D visualisation, design approval and delivery in 45 days — see exactly how a Silver Storey interior project runs from day one to handover.';

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/how-it-works',
  keywords: [
    'interior design process',
    'how interior design works',
    'interior design steps',
    '3D interior visualisation',
  ],
});

export default async function Page() {
  const projectPages = await getProjectPages();
  const jsonLd = graph(
    webPageSchema({
      name: TITLE,
      description: DESCRIPTION,
      path: '/how-it-works',
    }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'How it Works', path: '/how-it-works' },
    ]),
    howToSchema({
      name: 'How a Silver Storey interior design project works',
      description: DESCRIPTION,
      steps: PROCESS_STEPS,
      totalTime: 'P45D',
    }),
  );
  return (
    <>
      <JsonLd data={jsonLd} />
      <HowItWorksPage projectPages={projectPages} />
    </>
  );
}
