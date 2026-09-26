/**
 * Background video for the site.
 *
 * The hero at the top of the home page and the contact section on /contact
 * deliberately play the same clip: the browser downloads it once and the
 * second use is served from cache. Split them only if the two sections
 * should genuinely show different footage.
 *
 * The clip is muted, so it is encoded without an audio track; the WebM (VP9)
 * is offered first for browsers that play it, the MP4 (H.264, faststart) is
 * the fallback, and the poster is what paints instantly — and what stays on
 * screen wherever autoplay is blocked or data-saver is on.
 */
export const SITE_VIDEO = '/videos/hero.mp4';
export const SITE_VIDEO_WEBM = '/videos/hero.webm';
export const SITE_VIDEO_POSTER = '/videos/hero-poster.jpg';

export const HERO_VIDEO = SITE_VIDEO;
export const HERO_VIDEO_WEBM = SITE_VIDEO_WEBM;
export const HERO_VIDEO_POSTER = SITE_VIDEO_POSTER;

export const FOOTER_VIDEO = SITE_VIDEO;
export const FOOTER_VIDEO_WEBM = SITE_VIDEO_WEBM;
export const FOOTER_VIDEO_POSTER = SITE_VIDEO_POSTER;
