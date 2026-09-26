import React from 'react';
import { SITE } from '@/lib/seo/site';

const { address } = SITE;

// The pin is the published head office, not a search for the brand name —
// a name search once landed the map in a different neighbourhood entirely.
const MAP_QUERY = encodeURIComponent(
  `${SITE.name}, ${address.street}, ${address.city} ${address.postalCode}`,
);
const MAP_SRC = `https://maps.google.com/maps?q=${MAP_QUERY}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

export default function MapSection() {
  return (
    <div className="cursor-default bg-white">
      {/* Address heading */}
      <div className="mx-auto max-w-5xl px-6 py-16 text-center sm:py-20">
        <h2 className="text-2xl leading-snug font-bold tracking-tight text-black sm:text-3xl md:text-4xl">
          {address.street}, {address.city}, {address.region}{' '}
          {address.postalCode}
        </h2>
      </div>

      {/* Map embed — Google's map, and Google's cookies, load only here. */}
      <div className="h-[50vh] w-full sm:h-[60vh]">
        <iframe
          src={MAP_SRC}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Silver Storey head office in Tangra, Kolkata"
        />
      </div>
    </div>
  );
}
