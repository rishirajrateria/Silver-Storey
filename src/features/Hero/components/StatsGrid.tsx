'use client';

import React from 'react';
import type { StatItem } from '../types';
import { useCountOnVisible } from '../../../hooks/useCountOnVisible';

// A fixed locale keeps server and client markup identical; the browser's own
// locale could otherwise turn "50,000" into "50.000" during hydration.
const formatter = new Intl.NumberFormat('en-IN');

function parseNumericPart(val: string) {
  const m = val.match(/([\d,\.]+)/);
  if (!m) return { num: 0, prefix: '', suffix: val };
  const numeric = m[0].replace(/,/g, '');
  const num = Number(numeric) || 0;
  const prefix = val.slice(0, m.index || 0);
  const suffix = val.slice((m.index || 0) + m[0].length);
  return { num, prefix, suffix };
}

export default function StatsGrid({ items }: { items: StatItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-16 text-center md:grid-cols-4">
      {items.map((stat, i) => {
        const { num, prefix, suffix } = parseNumericPart(stat.val);
        return (
          <Stat
            key={stat.label}
            num={num}
            prefix={prefix}
            suffix={suffix}
            label={stat.label}
            delay={i * 120}
          />
        );
      })}
    </div>
  );
}

function Stat({
  num,
  prefix,
  suffix,
  label,
  delay = 0,
}: {
  num: number;
  prefix?: string;
  suffix?: string;
  label: string;
  delay?: number;
}) {
  const { ref, value, visible } = useCountOnVisible<HTMLDivElement>(num, 700);
  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(2rem)',
        transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
      }}
    >
      <div className="mb-3 text-5xl font-light sm:text-6xl">
        {`${prefix}${formatter.format(value)}${suffix}`}
      </div>
      <div className="text-sm font-medium text-black/60 sm:text-base">
        {label}
      </div>
    </div>
  );
}
