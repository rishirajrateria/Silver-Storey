import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/seo/PageShell';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import { PageHero, Prose } from '@/components/seo/Prose';
import JsonLd from '@/lib/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, graph, webPageSchema } from '@/lib/seo/schema';
import { SITE } from '@/lib/seo/site';
import { getProjectPageLinks } from '@/lib/db/content';

export const revalidate = 3600;

const PATH = '/privacy-policy';
const TITLE = 'Privacy Policy | Silver Storey';
const DESCRIPTION =
  'What Silver Storey collects through its enquiry forms and first-party analytics, why, where it is stored, and how to have it deleted. No third-party trackers or advertising cookies.';

/** The date this text was last changed; update it with the wording. */
const EFFECTIVE_DATE = '2026-09-26';

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

export default async function PrivacyPolicyPage() {
  const projectPages = await getProjectPageLinks();
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Privacy Policy', path: PATH },
  ];
  const jsonLd = graph(
    webPageSchema({
      name: TITLE,
      description: DESCRIPTION,
      path: PATH,
      dateModified: EFFECTIVE_DATE,
    }),
    breadcrumbSchema(crumbs),
  );

  return (
    <PageShell projectPages={projectPages}>
      <div>
        <JsonLd data={jsonLd} />
        <PageHero
          eyebrow="Plain English, no legalese"
          title="Privacy Policy"
          subtitle={`How ${SITE.name} handles the details you give us and the little we record when you browse this site.`}
        >
          <Breadcrumbs items={crumbs} />
        </PageHero>

        <section className="mx-auto max-w-4xl px-6 pb-20">
          <p className="mb-8 text-sm text-black/50">
            Effective from{' '}
            <time dateTime={EFFECTIVE_DATE}>{EFFECTIVE_DATE}</time>. If we
            change how we handle your data, we update this page and this date.
          </p>
          <Prose>
            <h2>Who we are</h2>
            <p>
              This site is run by {SITE.name}, an interior design studio at{' '}
              {SITE.address.street}, {SITE.address.city}{' '}
              {SITE.address.postalCode}, {SITE.address.region},{' '}
              {SITE.address.countryName}. For anything about your data, write to{' '}
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
            </p>

            <h2>What our forms collect, and why</h2>
            <p>
              Every form on this site exists so that we can get back to you
              about a project. We ask only for what that needs:
            </p>
            <ul>
              <li>
                <strong>Contact form</strong> — your name, phone number and, if
                you give them, your address or city, the type of project and a
                budget range. We use them to call you back and prepare for the
                consultation.
              </li>
              <li>
                <strong>Estimate calculator</strong> — your name, phone number,
                email address and city, plus the scope, finish and add-ons you
                chose. We use them to email you the estimate and to follow up.
              </li>
              <li>
                <strong>Lookbook download</strong> — your name, phone number and
                email address, in exchange for the PDF.
              </li>
              <li>
                <strong>&ldquo;Get free estimate&rdquo; pop-up</strong> — just a
                phone number, so we can call you.
              </li>
              <li>
                <strong>Project tracker</strong> — the access code we gave you
                when your project started; nothing else.
              </li>
            </ul>
            <p>
              Alongside the form, we record which page you sent it from, so we
              know which room or service you were looking at.
            </p>

            <h2>Where it goes</h2>
            <p>
              Enquiries are stored in the studio&rsquo;s own database, where our
              team reads them in a password-protected admin panel. A copy is
              emailed to the studio through our email provider, and an estimate
              is emailed to the address you gave. We do not sell, rent or share
              enquiries with anyone else.
            </p>

            <h2>Analytics</h2>
            <p>
              We count page views ourselves, without any third-party analytics
              or advertising service. For each page you open we record the page
              address, the site that referred you (if any), your device type,
              and the country, state and city our hosting network reports for
              your connection.
            </p>
            <p>
              To count how many different people visit, we build a visitor
              identifier by hashing your IP address and browser user agent
              together with a secret salt that changes every day. The IP address
              and user agent themselves are never stored, and because the salt
              rotates, the same person tomorrow is a different identifier — we
              cannot follow you from one day to the next, and no consent banner
              is needed.
            </p>

            <h2>Cookies</h2>
            <p>
              The site sets no cookies for visitors — no analytics cookies and
              no advertising cookies. The only cookie we set is a session cookie
              for our own staff when they log in to the admin panel.
            </p>

            <h2>Spam protection</h2>
            <p>
              Our forms use a hidden field that only automated bots fill in, and
              a limit on how many submissions one connection can make in a few
              minutes. That limit keeps your IP address in memory for a short
              while and never writes it to the database.
            </p>

            <h2>Content from other companies</h2>
            <p>
              Some pages embed content from other services, which may set their
              own cookies under their own privacy policies:
            </p>
            <ul>
              <li>
                <strong>YouTube</strong> — project videos on the home page. Only
                a thumbnail loads at first; YouTube&rsquo;s player, and its
                cookies, load when you press play.
              </li>
              <li>
                <strong>Google Maps</strong> — the map of our head office on the{' '}
                <Link href="/contact">contact page</Link>, which loads when that
                part of the page comes into view.
              </li>
              <li>
                <strong>Calendly</strong> — consultation bookings open on
                Calendly&rsquo;s own site.
              </li>
            </ul>

            <h2>How long we keep it</h2>
            <p>
              Enquiries are kept while we service the enquiry and for our
              records afterwards. Write to us and we will delete yours. Page
              view records hold no personal details, as described above.
            </p>

            <h2>Your rights</h2>
            <p>
              You can ask us what we hold about you, ask us to correct it, or
              ask us to delete it. Email{' '}
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a> from the address
              or phone number you gave us, so we can be sure the request is
              yours, and we will honour it.
            </p>

            <h2>Contact</h2>
            <p>
              {SITE.name}, {SITE.address.street}, {SITE.address.city}{' '}
              {SITE.address.postalCode}. Phone{' '}
              <a href={`tel:${SITE.phoneE164}`}>{SITE.phoneDisplay}</a>, email{' '}
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
            </p>
          </Prose>
        </section>
      </div>
    </PageShell>
  );
}
