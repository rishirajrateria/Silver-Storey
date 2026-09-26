import { getAllBlogItems, articlePath, ARTICLE_BY_SLUG } from '@/lib/blog';
import type { Article } from '@/lib/blog';
import { SITE, absoluteUrl } from '@/lib/seo/site';

export const revalidate = 3600;

function esc(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Built-in articles carry their full text so feed readers and AI ingestion get the content, not a teaser. */
function articleHtml(a: Article): string {
  const parts: string[] = [];
  if (a.keyTakeaways?.length)
    parts.push(
      `<ul>${a.keyTakeaways.map((k) => `<li>${esc(k)}</li>`).join('')}</ul>`,
    );
  for (const s of a.sections) {
    if (s.heading)
      parts.push(`<h${s.level ?? 2}>${esc(s.heading)}</h${s.level ?? 2}>`);
    for (const p of s.paragraphs ?? []) parts.push(`<p>${esc(p)}</p>`);
    if (s.bullets?.length)
      parts.push(
        `<ul>${s.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>`,
      );
    if (s.numbered?.length)
      parts.push(
        `<ol>${s.numbered.map((b) => `<li>${esc(b)}</li>`).join('')}</ol>`,
      );
    if (s.table)
      parts.push(
        `<table><thead><tr>${s.table.headers.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${s.table.rows
          .map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`)
          .join('')}</tbody></table>`,
      );
    if (s.callout) parts.push(`<blockquote>${esc(s.callout)}</blockquote>`);
  }
  return parts.join('');
}

export async function GET() {
  const items = await getAllBlogItems();
  const dates = items
    .map((i) => {
      const local = ARTICLE_BY_SLUG[i.slug];
      return local?.updatedAt ?? local?.publishedAt ?? i.publishedAt;
    })
    .filter((d): d is string => Boolean(d))
    .map((d) => new Date(d).getTime());
  const lastBuild = new Date(dates.length ? Math.max(...dates) : Date.now());

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${esc(SITE.name)} Blog — Interior Design Guides</title>
    <link>${absoluteUrl('/blog')}</link>
    <description>${esc('Cost guides, materials comparisons, design ideas and city guides from Silver Storey interior designers.')}</description>
    <language>en-in</language>
    <lastBuildDate>${lastBuild.toUTCString()}</lastBuildDate>
    <image>
      <url>${absoluteUrl('/icon-512.png')}</url>
      <title>${esc(SITE.name)}</title>
      <link>${absoluteUrl('/blog')}</link>
    </image>
    <atom:link href="${absoluteUrl('/blog/rss.xml')}" rel="self" type="application/rss+xml" />
${items
  .map((i) => {
    const local = ARTICLE_BY_SLUG[i.slug];
    const url = absoluteUrl(articlePath(i.slug));
    return `    <item>
      <title>${esc(i.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      ${i.publishedAt ? `<pubDate>${new Date(i.publishedAt).toUTCString()}</pubDate>` : ''}
      ${i.description ? `<description>${esc(i.description)}</description>` : ''}
      ${local ? `<content:encoded><![CDATA[${articleHtml(local)}]]></content:encoded>` : ''}
      <author>${esc(SITE.email)} (${esc(SITE.name)})</author>
    </item>`;
  })
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
