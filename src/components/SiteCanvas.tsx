import React from 'react';

/**
 * The site's backdrop: a cream-to-white wash whose light slowly moves.
 *
 * Rendered once from the root layout and pinned to the viewport, so every
 * page shares one ground and a 6000px city page never bands the way a
 * page-height gradient would.
 *
 * Two full-bleed arrangements of the wash cross-fade on a 48s cycle while a
 * soft pool of light crosses on a 66s one — the periods do not divide, so
 * the pair never repeats the same arrangement. Only opacity and transform
 * animate, so the compositor keeps all of it on the GPU and the pages above
 * never repaint.
 */
export default function SiteCanvas() {
  return (
    <div aria-hidden className="site-canvas">
      <span className="site-drift site-drift-a" />
      <span className="site-drift site-drift-b" />
      <span className="site-drift-c" />
    </div>
  );
}
