import React from 'react';
import Link from 'next/link';
import { services } from '../icons';

export default function ServicesSection() {
  return (
    <div className="mx-auto max-w-360 px-6 text-center">
      <h2 className="mb-24 text-3xl font-light tracking-wide sm:text-4xl">
        All Under One Roof
      </h2>

      <div className="grid grid-cols-2 gap-x-8 gap-y-16 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-12">
        {services.map((service) => (
          <Link
            key={service.name}
            href={service.href}
            className="flex flex-col items-center justify-center gap-6 text-black/80 transition-colors hover:text-black"
          >
            {/* The label beneath names the tile, so the icon stays decorative. */}
            <img
              loading="lazy"
              decoding="async"
              src={service.image}
              alt=""
              width={112}
              height={112}
              className="h-28 w-28 object-contain"
            />
            <span className="text-base font-medium">{service.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
