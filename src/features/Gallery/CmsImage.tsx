import React from 'react';
import Image from 'next/image';
import { isOptimisable } from './image-policy';

/**
 * A CMS photograph whose real pixel size we never know at render time. It
 * fills a positioned, aspect-ratio parent, so the browser reserves the space
 * before the bytes arrive and nothing shifts — the layout stays with the
 * card, not the image.
 */
export default function CmsImage({
  src,
  alt,
  sizes,
  className = 'object-cover',
  preload = false,
}: {
  src: string;
  alt: string;
  /** The rendered width per breakpoint, so the right srcset entry is chosen. */
  sizes: string;
  className?: string;
  /** Only for the one image above the fold. */
  preload?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      unoptimized={!isOptimisable(src)}
      {...(preload ? { preload: true } : { loading: 'lazy' })}
    />
  );
}
