import { ImageResponse } from 'next/og';
import { SITE } from '@/lib/seo/site';

/** Dynamic Open Graph image: /api/og?title=...&subtitle=... */
export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (
    searchParams.get('title') ?? 'Premium Interior Designers in India'
  ).slice(0, 90);
  const subtitle = (
    searchParams.get('subtitle') ??
    'Free 3D design · Transparent pricing · 45-day delivery · 10-year warranty'
  ).slice(0, 120);
  const fontSize = title.length > 60 ? 56 : title.length > 40 ? 66 : 78;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 72,
        background:
          'linear-gradient(135deg, #0a0a0a 0%, #1d1d1d 60%, #6b1a1a 140%)',
        color: 'white',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          fontSize: 26,
          letterSpacing: 8,
          textTransform: 'uppercase',
          opacity: 0.8,
        }}
      >
        Silver Storey · Interior Designers
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            fontSize,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: -1.5,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 24,
            fontSize: 28,
            opacity: 0.85,
          }}
        >
          {subtitle}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 24,
          opacity: 0.8,
        }}
      >
        <span>{SITE.url.replace(/^https?:\/\//, '')}</span>
        <span>{SITE.phoneDisplay}</span>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
