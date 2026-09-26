import React from 'react';
import PageShell from '@/components/seo/PageShell';
import Breadcrumbs, { type Crumb } from '@/components/seo/Breadcrumbs';
import Footer from '../Hero/components/Footer';
import ContactDetails from './components/ContactDetails';
import ContactForm from './components/ContactForm';
import MapSection from './components/MapSection';

/**
 * A server component so the address, phone and hours are in the HTML the
 * LocalBusiness schema points at; the form and the floating controls stay
 * client-side.
 */
export default function ContactPage({
  projectPages = [],
  crumbs,
}: {
  projectPages?: { title: string; slug: string }[];
  crumbs: Crumb[];
}) {
  return (
    <PageShell projectPages={projectPages}>
      <div>
        <Footer />
        <div className="mx-auto max-w-4xl px-6 pt-10">
          <Breadcrumbs items={crumbs} />
        </div>
        <ContactForm />
        <ContactDetails />
        <MapSection />
      </div>
    </PageShell>
  );
}
