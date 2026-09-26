import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/seo/PageShell';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import CTASection from '@/components/seo/CTASection';
import FAQSection from '@/components/seo/FAQSection';
import { PageHero, Prose, FeatureList } from '@/components/seo/Prose';
import JsonLd from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import {
  breadcrumbSchema,
  faqSchema,
  graph,
  howToSchema,
  imageGallerySchema,
  webPageSchema,
  type FAQ,
} from '@/lib/seo/schema';
import {
  getProjectPage,
  getProjectPageLinks,
  VISUALISATION_SLUG,
} from '@/lib/db/content';

export const revalidate = 300;

const PATH = '/3d-visualisation';
const TITLE = 'Free 3D Interior Visualisation | Silver Storey';
const DESCRIPTION =
  'Every Silver Storey project includes complimentary photorealistic 3D visualisation — walk through your kitchen, bedrooms and living room, change finishes and approve the design before manufacturing starts.';

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  keywords: [
    '3D interior visualisation',
    '3D interior design rendering',
    'free 3D home design',
    '3D kitchen design',
    'interior design render India',
  ],
});

const STEPS = [
  {
    name: 'Site measurement',
    text: 'We laser-measure every wall, window, beam and outlet so the model matches your home to the centimetre.',
  },
  {
    name: 'Layout in 3D',
    text: 'Your designer builds the space in 3D and tests layouts — kitchen work triangle, wardrobe depths, TV sightlines — with you.',
  },
  {
    name: 'Materials and lighting',
    text: 'Real product libraries from our brand partners: laminates, acrylic, veneer, stone, tiles and the exact lighting scheme.',
  },
  {
    name: 'Photorealistic renders',
    text: 'Every room is rendered from several angles, at day and night, so you see what the finished home actually looks like.',
  },
  {
    name: 'Revise until it is right',
    text: 'Change a shutter colour, swap a countertop, move a wall — revisions are part of the process, not an extra.',
  },
  {
    name: 'Approve and build',
    text: 'The approved model becomes the production drawing. What is built is what you saw.',
  },
];

const FAQS: FAQ[] = [
  {
    question: 'Is 3D visualisation really free?',
    answer:
      'Yes, for residential projects it is included in every engagement after the token booking. There is no design fee; you pay only for execution.',
  },
  {
    question: 'How long do the renders take?',
    answer:
      'The first set typically arrives within 7–10 days of site measurement, and revisions within 2–3 working days.',
  },
  {
    question: 'Will the finished home look like the render?',
    answer:
      'That is the point. We render with the actual material codes we order, and the approved 3D model is what our workshop manufactures from. Small differences in natural light and photography aside, clients consistently tell us the home matches the render.',
  },
  {
    question: 'Can I see the 3D design of a project done for someone else?',
    answer:
      'Yes — the gallery on this page shows renders from real Silver Storey projects, alongside the finished photographs where available.',
  },
];

export default async function VisualisationPage() {
  const [page, projectPages] = await Promise.all([
    getProjectPage(VISUALISATION_SLUG),
    getProjectPageLinks(),
  ]);
  const images = (page?.sections ?? []).flatMap((s) => s.images);
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: '3D visualisation', path: PATH },
  ];
  const jsonLd = graph(
    webPageSchema({
      name: TITLE,
      description: DESCRIPTION,
      path: PATH,
      primaryImage: page?.heroImageUrl ?? images[0]?.imageUrl,
    }),
    breadcrumbSchema(crumbs),
    howToSchema({
      name: 'How Silver Storey 3D visualisation works',
      description: 'From measurement to photorealistic renders and approval.',
      steps: STEPS,
    }),
    imageGallerySchema({
      name: '3D visualisations by Silver Storey',
      path: PATH,
      images: images.map((i) => ({ url: i.imageUrl, caption: i.title })),
    }),
    faqSchema(FAQS),
  );

  return (
    <PageShell projectPages={projectPages}>
      <JsonLd data={jsonLd} />
      <PageHero
        eyebrow="Complimentary with every project"
        title="See Your Home in 3D Before It Is Built"
        subtitle="Photorealistic renders of every room, in the exact materials we will use — so you approve a home you have already seen, not a drawing you have to imagine."
      >
        <Breadcrumbs items={crumbs} />
      </PageHero>

      {images.length > 0 ? (
        <section
          className="mx-auto max-w-6xl px-6 py-8"
          aria-label="3D visualisation gallery"
        >
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((img) => (
              <li
                key={img.id}
                className="glass-panel overflow-hidden rounded-2xl"
              >
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="p-4">
                  <p className="font-semibold text-black">{img.title}</p>
                  {img.description && (
                    <p className="mt-1 text-sm text-black/55">
                      {img.description}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="mx-auto max-w-6xl px-6 py-8">
          <div className="glass-panel rounded-2xl p-8 text-center">
            <p className="mb-2 font-semibold text-black">
              Render gallery coming soon
            </p>
            <p className="mx-auto max-w-md text-sm text-black/60">
              Until then, the{' '}
              <Link href="/gallery" className="underline">
                room gallery
              </Link>{' '}
              shows finished spaces that started as 3D models.
            </p>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-4xl px-6 py-10">
        <Prose>
          <h2>Why we visualise everything</h2>
          <p>
            Most interior disputes come from a gap between what was imagined and
            what was built. A photorealistic model closes that gap: you see the
            shutter colour against your floor tile, how the false ceiling
            lighting falls on the dining table, whether the wardrobe leaves room
            to open the balcony door. Decisions become easy, revisions happen on
            screen instead of on site, and the production drawings come straight
            from the approved model — which is how we deliver in 45 days.
          </p>
          <h2>How it works</h2>
          <ol>
            {STEPS.map((s) => (
              <li key={s.name}>
                <strong>{s.name}.</strong> {s.text}
              </li>
            ))}
          </ol>
        </Prose>
        <div className="mt-8">
          <FeatureList
            title="What you receive"
            items={[
              'Renders of every room from multiple angles',
              'Day and night lighting studies',
              'Material and colour boards matched to real product codes',
              'Dimensioned layout drawings',
              'Unlimited revisions until sign-off',
              'A single approved model that becomes the production drawing',
            ]}
          />
        </div>
      </section>

      <FAQSection faqs={FAQS} />
      <CTASection
        title="See your own home in 3D"
        subtitle="Book a free consultation. We measure, model and render before you commit to anything."
      />
    </PageShell>
  );
}
