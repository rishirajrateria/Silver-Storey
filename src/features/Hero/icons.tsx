import React from 'react';
import type { ProcessStepIconItem, Service } from './types';

export const processStepIcons: ProcessStepIconItem[] = [
  {
    name: 'Meet our Expert',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-9 w-9"
      >
        <circle cx="9" cy="6" r="2.5" />
        <path d="M4 19v-1.5a4.5 4.5 0 0 1 4.5-4.5h1a4.5 4.5 0 0 1 4.5 4.5V19" />
        <circle cx="17" cy="6" r="2" />
        <path d="M20 19v-1a3.5 3.5 0 0 0-2.5-3.35" />
      </svg>
    ),
  },
  {
    name: 'Get free Estimate',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-9 w-9"
      >
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z" />
        <path d="M14 3v6h6" />
        <path d="M10.5 15.5l1 1 2.5-2.5" />
      </svg>
    ),
  },
  {
    name: 'Initial Payment',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-9 w-9"
      >
        <path d="M20 7H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
        <path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z" />
        <circle cx="16.5" cy="13" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: 'Get 3D visualization',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-9 w-9"
      >
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    name: 'Design Approval',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-9 w-9"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    name: 'Delivery in 45 Days!',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-9 w-9"
      >
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
];

// Each tile leads to the service page that actually sells that work; trades
// without a page of their own (soft furnishing, decor) go to the catalogue.
export const services: Service[] = [
  {
    name: 'Civil Work',
    image: '/images/civil%20work.avif',
    href: '/services/full-home-interiors',
  },
  {
    name: 'Modular',
    image: '/images/Modular.avif',
    href: '/services/modular-kitchen',
  },
  {
    name: 'Carpentry',
    image: '/images/Carpentry.avif',
    href: '/services/wardrobe-design',
  },
  { name: 'Furnishing', image: '/images/Furnishing.avif', href: '/services' },
  {
    name: 'Lighting',
    image: '/images/Lighting.avif',
    href: '/services/false-ceiling-design',
  },
  { name: 'Decor', image: '/images/Decor.avif', href: '/services' },
];
