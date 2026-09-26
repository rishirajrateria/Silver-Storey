import React from 'react';
import { SITE } from '@/lib/seo/site';
import EstimatePopup from '@/components/EstimatePopup';

// width/height are each file's intrinsic pixels, so the bar keeps its shape
// before the icons arrive; `size` is the rendered box.
const ICONS: Record<
  string,
  { src: string; size: string; width: number; height: number }
> = {
  facebook: {
    src: '/images/facebook.avif',
    size: 'h-20 w-20',
    width: 850,
    height: 530,
  },
  linkedin: {
    src: '/images/linkedin.avif',
    size: 'h-12 w-12',
    width: 512,
    height: 512,
  },
  youtube: {
    src: '/images/youtube.avif',
    size: 'h-12 w-12',
    width: 512,
    height: 512,
  },
  instagram: {
    src: '/images/instagram (2).avif',
    size: 'h-12 w-12',
    width: 512,
    height: 512,
  },
};

function SocialIcon({ network }: { network: string }) {
  const social = SITE.socials.find((s) => s.key === network);
  const icon = ICONS[network];
  if (!social || !icon) return null;
  return (
    <a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={social.label}
      className="hidden transition-transform hover:scale-105 sm:flex"
    >
      <img
        src={icon.src}
        alt={social.label}
        width={icon.width}
        height={icon.height}
        className={`${icon.size} object-contain`}
      />
    </a>
  );
}

export default function SocialBar({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-8 sm:gap-12 ${className}`}>
      <SocialIcon network="facebook" />
      <SocialIcon network="linkedin" />

      <EstimatePopup className="glass flex h-9 items-center justify-center rounded-sm px-5 text-[10px] font-semibold tracking-wider text-black transition-transform hover:scale-105 sm:text-[11px]">
        GET FREE ESTIMATE
      </EstimatePopup>

      <SocialIcon network="youtube" />
      <SocialIcon network="instagram" />
    </div>
  );
}
