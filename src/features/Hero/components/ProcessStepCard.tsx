'use client';

import React from 'react';

interface ProcessStepCardProps {
  name: string;
  label?: string;
  image?: string;
  icon?: React.ReactNode;
}

export default function ProcessStepCard({
  name,
  label,
  image,
  icon,
}: ProcessStepCardProps) {
  return (
    <div
      style={{
        background: '#f5f4f2',
        borderRadius: '1rem',
        boxShadow:
          '0 2px 12px 0 rgba(0,0,0,0.07), 0 1px 3px 0 rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 0.75rem 2.75rem',
        gap: '0.5rem',
        minHeight: '110px',
        textAlign: 'center',
        cursor: 'default',
        transition: 'box-shadow 0.2s, transform 0.2s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          '0 6px 24px 0 rgba(0,0,0,0.11), 0 2px 6px 0 rgba(0,0,0,0.06)';
        (e.currentTarget as HTMLDivElement).style.transform =
          'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          '0 2px 12px 0 rgba(0,0,0,0.07), 0 1px 3px 0 rgba(0,0,0,0.04)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Icon or Image */}
      {icon ? (
        <div
          style={{
            width: '2.5rem',
            height: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </div>
      ) : image ? (
        <img
          loading="lazy"
          decoding="async"
          src={image}
          alt={name}
          style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }}
        />
      ) : null}

      {/* Label */}
      {label && (
        <p
          style={{
            fontSize: '0.75rem',
            fontWeight: 500,
            color: '#2d3142',
            lineHeight: 1.35,
            margin: 0,
            letterSpacing: '0.01em',
            whiteSpace: 'pre-line',
          }}
        >
          {label}
        </p>
      )}
    </div>
  );
}
