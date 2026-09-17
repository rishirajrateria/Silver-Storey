import { ImageResponse } from 'next/og';
import { SITE } from '@/lib/seo/site';

export const alt = 'Silver Storey — Designs for the Bold of Heart';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
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
          fontSize: 28,
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
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -2,
          }}
        >
          Designs for the Bold of Heart
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 28,
            fontSize: 30,
            opacity: 0.85,
          }}
        >
          Free 3D design · Transparent pricing · Delivery in 45 days · 10-year
          warranty
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 26,
          opacity: 0.8,
        }}
      >
        <span>{SITE.url.replace(/^https?:\/\//, '')}</span>
        <span>{SITE.phoneDisplay}</span>
      </div>
    </div>,
    { ...size },
  );
}
