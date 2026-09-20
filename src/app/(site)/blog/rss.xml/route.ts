import { getAllBlogItems, articlePath } from '@/lib/blog';
import { SITE, absoluteUrl } from '@/lib/seo/site';

export const revalidate = 3600;

function esc(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function GET() {
  const items = await getAllBlogItems();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE.name)} Blog — Interior Design Guides</title>
    <link>${absoluteUrl('/blog')}</link>
    <description>${esc('Cost guides, materials comparisons, design ideas and city guides from Silver Storey interior designers.')}</description>
    <language>en-in</language>
    <atom:link href="${absoluteUrl('/blog/rss.xml')}" rel="self" type="application/rss+xml" />
${items
  .map(
    (i) => `    <item>
      <title>${esc(i.title)}</title>
      <link>${absoluteUrl(articlePath(i.slug))}</link>
      <guid isPermaLink="true">${absoluteUrl(articlePath(i.slug))}</guid>
      ${i.publishedAt ? `<pubDate>${new Date(i.publishedAt).toUTCString()}</pubDate>` : ''}
      ${i.description ? `<description>${esc(i.description)}</description>` : ''}
      ${i.author ? `<author>${esc(SITE.email)} (${esc(i.author)})</author>` : ''}
    </item>`,
  )
  .join('\n')}
  </channel>
</rss>`;
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
