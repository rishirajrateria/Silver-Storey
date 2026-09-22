import 'server-only';
import { revalidatePath } from 'next/cache';

/**
 * Refreshes the public pages affected by a content change so edits appear
 * immediately instead of waiting for the ISR window.
 */
export function revalidateForContent(kind: string, slug?: string): void {
  const paths = new Set<string>(['/']);

  switch (kind) {
    case 'projectPage':
      if (slug) paths.add(`/projects/${slug}`);
      break;
    case 'blogPost':
      paths.add('/blog');
      paths.add('/blog/rss.xml');
      if (slug) paths.add(`/blog/${slug}`);
      break;
    case 'category':
      // The room cards on the home page, the stacked gallery, and the room's
      // own page. Without these the gallery keeps serving its cached copy for
      // the whole ISR window and newly added photos look like they vanished.
      paths.add('/gallery');
      if (slug) paths.add(`/gallery/${slug}`);
      break;
    case 'testimonial':
      paths.add('/about-us');
      break;
    case 'lookbook':
      paths.add('/lookbooks');
      if (slug) paths.add(`/lookbooks/${slug}`);
      break;
    default:
      break;
  }

  for (const path of paths) {
    try {
      revalidatePath(path);
    } catch (error) {
      console.error(`[revalidate] ${path} failed:`, error);
    }
  }
}
