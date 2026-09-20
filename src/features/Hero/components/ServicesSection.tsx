import React from 'react';
import { services } from '../icons';

export default function ServicesSection() {
  return (
    <div className="mx-auto max-w-360 px-6 text-center">
      <h2 className="mb-24 text-3xl font-light tracking-wide sm:text-4xl">
        All Under One Roof
      </h2>

      <div className="grid grid-cols-2 gap-x-8 gap-y-16 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-12">
        {services.map((service, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center gap-6 text-black/80 transition-colors hover:text-black"
          >
            <img
              loading="lazy"
              decoding="async"
              src={service.image}
              alt={service.name}
              className="h-28 w-28 object-contain"
            />
            <span className="text-base font-medium">{service.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
