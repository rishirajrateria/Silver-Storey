import type { Metadata, Viewport } from 'next';
import { Space_Grotesk } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import JsonLd from '@/lib/seo/JsonLd';
import { graph, organizationSchema, websiteSchema } from '@/lib/seo/schema';
import { SITE, SITE_URL, PRIMARY_KEYWORDS } from '@/lib/seo/site';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      'Silver Storey | Premium Interior Designers in Kolkata & Across India',
    template: '%s | Silver Storey',
  },
  description: SITE.shortDescription,
  applicationName: SITE.name,
  keywords: PRIMARY_KEYWORDS,
  authors: SITE.founders.map((f) => ({ name: f.name })),
  creator: SITE.name,
  publisher: SITE.name,
  category: 'Interior Design',
  alternates: {
    canonical: '/',
    types: { 'application/rss+xml': `${SITE_URL}/blog/rss.xml` },
  },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: SITE.locale,
    url: SITE_URL,
    title:
      'Silver Storey | Premium Interior Designers in Kolkata & Across India',
    description: SITE.shortDescription,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Silver Storey — Designs for the Bold of Heart',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Silver Storey | Premium Interior Designers in India',
    description: SITE.shortDescription,
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_VERIFICATION
      ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION }
      : undefined,
  },
  other: {
    'geo.region': 'IN-WB',
    'geo.placename': 'Kolkata',
    'geo.position': `${SITE.geo.latitude};${SITE.geo.longitude}`,
    ICBM: `${SITE.geo.latitude}, ${SITE.geo.longitude}`,
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} h-full antialiased`}>
      <head>
        {/* Warm up connections to the CDNs used above the fold. */}
        <link rel="dns-prefetch" href="https://img.youtube.com" />
        <link rel="dns-prefetch" href="https://blob.vercel-storage.com" />
      </head>
      <body className="flex min-h-full flex-col">
        <JsonLd
          id="org-jsonld"
          data={graph(organizationSchema(), websiteSchema())}
        />
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
