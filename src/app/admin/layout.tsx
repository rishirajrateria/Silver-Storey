import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Silver Storey CMS',
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-[#f0efec]">{children}</div>;
}
