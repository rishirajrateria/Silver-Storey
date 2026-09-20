import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/seo/PageShell';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import CTASection from '@/components/seo/CTASection';
import FAQSection from '@/components/seo/FAQSection';
import LinkGrid from '@/components/seo/LinkGrid';
import { PageHero, Prose } from '@/components/seo/Prose';
import JsonLd from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import {
  breadcrumbSchema,
  faqSchema,
  graph,
  itemListSchema,
  webPageSchema,
  type FAQ,
} from '@/lib/seo/schema';
import { getLookbooks, getProjectPageLinks } from '@/lib/db/content';
import { roomLabel } from '@/lib/rooms';
import { SERVICES, servicePath } from '@/lib/services';

export const revalidate = 300;

const PATH = '/lookbooks';
const TITLE = 'Interior Design Lookbooks & Catalogues (PDF) | Silver Storey';
const DESCRIPTION =
  'Download free Silver Storey lookbooks — modular kitchen, wardrobe, living room and full-home design catalogues with real projects, finishes and indicative prices.';

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  keywords: [
    'interior design catalogue pdf',
    'modular kitchen catalogue',
    'wardrobe design catalogue',
    'interior design lookbook',
  ],
});

const FAQS: FAQ[] = [
  {
    question: 'Are the lookbooks free?',
    answer:
      'Yes. Enter your name, phone and email and the PDF opens immediately. We use the details only to follow up with design ideas — never to spam.',
  },
  {
    question: 'Are the designs in the lookbooks real projects?',
    answer:
      'Yes. Every lookbook is built from Silver Storey projects and 3D visualisations, with the finishes and brands we actually use.',
  },
  {
    question: 'Can I get a design from a lookbook made for my home?',
    answer:
      'That is exactly what they are for. Note the page or design name and share it during your free consultation; we adapt it to your measurements and budget.',
  },
];

export default async function LookbooksPage() {
  const [lookbooks, projectPages] = await Promise.all([
    getLookbooks(),
    getProjectPageLinks(),
  ]);
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Lookbooks', path: PATH },
  ];
  const jsonLd = graph(
    webPageSchema({
      name: TITLE,
      description: DESCRIPTION,
      path: PATH,
      type: 'CollectionPage',
    }),
    breadcrumbSchema(crumbs),
    lookbooks.length > 0 &&
      itemListSchema({
        name: 'Silver Storey lookbooks',
        items: lookbooks.map((l) => ({
          name: l.title,
          path: `/lookbooks/${l.slug}`,
        })),
      }),
    faqSchema(FAQS),
  );

  return (
    <PageShell projectPages={projectPages}>
      <JsonLd data={jsonLd} />
      <PageHero
        eyebrow="Free downloads"
        title="Design Lookbooks"
        subtitle="Curated PDF catalogues of real Silver Storey projects — kitchens, wardrobes, living rooms and complete homes — with finishes, brands and indicative prices."
      >
        <Breadcrumbs items={crumbs} />
      </PageHero>

      <section className="mx-auto max-w-6xl px-6 py-8">
        {lookbooks.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="mb-2 text-lg font-bold text-black">
              Lookbooks are on their way
            </p>
            <p className="mx-auto mb-6 max-w-md text-sm text-black/60">
              We are putting the first catalogues together. In the meantime,
              browse our projects or ask for a personalised set of designs.
            </p>
            <Link
              href="/residential-projects"
              className="btn-bump inline-flex rounded-full bg-black px-6 py-3 text-sm font-medium text-white"
            >
              Browse projects
            </Link>
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lookbooks.map((l) => (
              <li key={l.id}>
                <Link
                  href={`/lookbooks/${l.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-black/5">
                    {l.coverImageUrl && (
                      <img
                        src={l.coverImageUrl}
                        alt={l.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    {l.roomType && (
                      <span className="mb-2 text-[11px] font-semibold tracking-[0.2em] text-[#6b1a1a] uppercase">
                        {roomLabel(l.roomType) ?? l.roomType}
                      </span>
                    )}
                    <h2 className="mb-2 text-lg font-bold text-black">
                      {l.title}
                    </h2>
                    {l.description && (
                      <p className="mb-4 line-clamp-3 flex-1 text-sm text-black/60">
                        {l.description}
                      </p>
                    )}
                    <span className="text-sm font-medium text-black">
                      Download PDF{l.pages ? ` · ${l.pages} pages` : ''} →
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mx-auto max-w-4xl px-6 py-10">
        <Prose>
          <h2>What is in a Silver Storey lookbook</h2>
          <p>
            Each lookbook is a themed edit of our work: photographs and 3D
            visualisations of finished rooms, the materials and brands behind
            them, the layout ideas that made them work and what a similar scope
            typically costs. They are made to be shared with family and marked
            up before a consultation, so the first meeting starts with a clear
            brief rather than a blank page.
          </p>
        </Prose>
      </section>

      <LinkGrid
        id="services"
        title="Explore the services behind the designs"
        columns={3}
        items={SERVICES.slice(0, 9).map((s) => ({
          name: s.name,
          path: servicePath(s),
        }))}
      />
      <FAQSection faqs={FAQS} />
      <CTASection
        title="Prefer designs made for your home?"
        subtitle="Book a free consultation and get 3D visualisations of your own rooms."
      />
    </PageShell>
  );
}
