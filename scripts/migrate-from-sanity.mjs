#!/usr/bin/env node
/**
 * One-time migration: Sanity → your own Postgres database.
 *
 *   SANITY_PROJECT_ID=kae503a3 SANITY_DATASET=production \
 *   DATABASE_URL="postgres://…" \
 *   node scripts/migrate-from-sanity.mjs
 *
 * Optional:
 *   BLOB_READ_WRITE_TOKEN=…   copy images into Vercel Blob (recommended).
 *                             Without it, existing Sanity CDN URLs are reused,
 *                             which keeps working but leaves you dependent on
 *                             Sanity for image hosting.
 *   --dry-run                 report what would be imported, write nothing.
 *
 * Re-running is safe: rows are matched on slug (or name/title) and updated.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PROJECT_ID =
  process.env.SANITY_PROJECT_ID ??
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??
  'kae503a3';
const DATASET =
  process.env.SANITY_DATASET ??
  process.env.NEXT_PUBLIC_SANITY_DATASET ??
  'production';
const DRY_RUN = process.argv.includes('--dry-run');

const API = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${DATASET}`;

async function groq(query) {
  const res = await fetch(`${API}?query=${encodeURIComponent(query)}`);
  if (!res.ok)
    throw new Error(`Sanity query failed (${res.status}): ${await res.text()}`);
  const { result } = await res.json();
  return result;
}

/* ── Image handling ─────────────────────────────────────────────────────── */

/** Turns a Sanity asset ref (image-abc123-1200x800-jpg) into a CDN URL. */
function assetUrl(ref) {
  if (!ref || typeof ref !== 'string') return null;
  const m = /^(image|file)-([a-f0-9]+)-(?:(\d+x\d+)-)?(\w+)$/.exec(ref);
  if (!m) return null;
  const [, kind, id, dims, ext] = m;
  const name = dims ? `${id}-${dims}.${ext}` : `${id}.${ext}`;
  return `https://cdn.sanity.io/${kind === 'image' ? 'images' : 'files'}/${PROJECT_ID}/${DATASET}/${name}`;
}

let blobPut = null;
if (process.env.BLOB_READ_WRITE_TOKEN && !DRY_RUN) {
  ({ put: blobPut } = await import('@vercel/blob'));
}

const copied = new Map();

/** Copies an asset into Vercel Blob when configured; otherwise reuses the URL. */
async function migrateAsset(url) {
  if (!url) return null;
  if (!blobPut) return url;
  if (copied.has(url)) return copied.get(url);

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`download failed (${res.status})`);
    const blob = await res.blob();
    const filename = url.split('/').pop() ?? 'asset';
    const stored = await blobPut(`silver-storey/${filename}`, blob, {
      access: 'public',
      addRandomSuffix: false,
      contentType: res.headers.get('content-type') ?? undefined,
      cacheControlMaxAge: 31536000,
    });
    copied.set(url, stored.url);
    process.stdout.write('.');
    return stored.url;
  } catch (error) {
    console.warn(
      `\n  ! could not copy ${url}: ${error.message} — keeping original URL`,
    );
    copied.set(url, url);
    return url;
  }
}

/* ── Portable Text → Markdown ───────────────────────────────────────────── */

function spansToMarkdown(children = [], markDefs = []) {
  return children
    .map((child) => {
      let text = child.text ?? '';
      if (!text) return '';
      const marks = child.marks ?? [];
      for (const mark of marks) {
        if (mark === 'strong') text = `**${text}**`;
        else if (mark === 'em') text = `*${text}*`;
        else if (mark === 'code') text = `\`${text}\``;
        else {
          const def = markDefs.find((d) => d._key === mark);
          if (def?._type === 'link' && def.href)
            text = `[${text}](${def.href})`;
        }
      }
      return text;
    })
    .join('');
}

async function portableTextToMarkdown(blocks) {
  if (!Array.isArray(blocks)) return '';
  const out = [];

  for (const block of blocks) {
    if (block?._type === 'image') {
      const url = await migrateAsset(assetUrl(block.asset?._ref));
      if (url) out.push(`![${block.alt ?? ''}](${url})`);
      continue;
    }
    if (block?._type !== 'block') continue;

    const text = spansToMarkdown(block.children, block.markDefs);
    if (!text.trim()) continue;

    switch (block.style) {
      case 'h2':
        out.push(`## ${text}`);
        break;
      case 'h3':
        out.push(`### ${text}`);
        break;
      case 'h4':
        out.push(`#### ${text}`);
        break;
      case 'blockquote':
        out.push(`> ${text}`);
        break;
      default:
        if (block.listItem === 'bullet') out.push(`- ${text}`);
        else if (block.listItem === 'number') out.push(`1. ${text}`);
        else out.push(text);
    }
  }

  // Keep consecutive list items together; separate everything else by a blank line.
  let markdown = '';
  for (let i = 0; i < out.length; i++) {
    const line = out[i];
    const prev = out[i - 1];
    const bothList =
      prev && /^(- |\d+\. )/.test(prev) && /^(- |\d+\. )/.test(line);
    markdown += (i === 0 ? '' : bothList ? '\n' : '\n\n') + line;
  }
  return markdown.trim();
}

/* ── Migration steps ────────────────────────────────────────────────────── */

async function migrateCategories() {
  const rows = await groq(
    '*[_type=="category"]|order(order asc){_id,name,price,order,"ref":image.asset._ref}',
  );
  console.log(`\nCategories: ${rows.length}`);
  for (const [i, row] of rows.entries()) {
    const imageUrl = await migrateAsset(assetUrl(row.ref));
    const data = {
      name: row.name,
      price: row.price ?? '',
      imageUrl,
      order: row.order ?? i,
      published: true,
    };
    if (DRY_RUN) {
      console.log(`  would import ${row.name}`);
      continue;
    }
    const existing = await prisma.category.findFirst({
      where: { name: row.name },
    });
    if (existing)
      await prisma.category.update({ where: { id: existing.id }, data });
    else await prisma.category.create({ data });
    console.log(`  ✓ ${row.name}`);
  }
}

async function migrateVideos() {
  const rows = await groq(
    '*[_type=="video"]|order(order asc){_id,title,youtubeId,description,order}',
  );
  console.log(`\nVideos: ${rows.length}`);
  for (const [i, row] of rows.entries()) {
    const data = {
      title: row.title,
      youtubeId: row.youtubeId,
      description: row.description ?? null,
      order: row.order ?? i,
      published: true,
    };
    if (DRY_RUN) {
      console.log(`  would import ${row.title}`);
      continue;
    }
    const existing = await prisma.video.findFirst({
      where: { youtubeId: row.youtubeId },
    });
    if (existing)
      await prisma.video.update({ where: { id: existing.id }, data });
    else await prisma.video.create({ data });
    console.log(`  ✓ ${row.title}`);
  }
}

async function migrateProjectPages() {
  const rows = await groq(`*[_type=="projectPage"]{
    _id,title,"slug":slug.current,heroTitle,heroSubtitle,
    "heroRef":heroImage.asset._ref,
    "sections":gallerySections[]{sectionTitle,"images":images[]{title,description,"ref":image.asset._ref}}
  }`);
  console.log(`\nProject pages: ${rows.length}`);

  for (const [i, row] of rows.entries()) {
    if (!row.slug) {
      console.warn(`  ! skipping "${row.title}" — no slug`);
      continue;
    }
    const heroImageUrl = await migrateAsset(assetUrl(row.heroRef));

    const sections = [];
    for (const section of row.sections ?? []) {
      const images = [];
      for (const image of section.images ?? []) {
        const url = await migrateAsset(assetUrl(image.ref));
        if (url)
          images.push({
            title: image.title ?? 'Untitled',
            description: image.description ?? null,
            imageUrl: url,
          });
      }
      if (section.sectionTitle)
        sections.push({ title: section.sectionTitle, images });
    }

    if (DRY_RUN) {
      console.log(
        `  would import ${row.title} (${sections.length} sections, ${sections.reduce((n, s) => n + s.images.length, 0)} images)`,
      );
      continue;
    }

    const base = {
      title: row.title,
      slug: row.slug,
      heroTitle: row.heroTitle ?? row.title,
      heroSubtitle: row.heroSubtitle ?? null,
      heroImageUrl,
      order: i,
      published: true,
    };
    const create = {
      create: sections.map((s, si) => ({
        title: s.title,
        order: si,
        images: { create: s.images.map((img, ii) => ({ ...img, order: ii })) },
      })),
    };

    const existing = await prisma.projectPage.findUnique({
      where: { slug: row.slug },
    });
    if (existing) {
      await prisma.$transaction([
        prisma.gallerySection.deleteMany({
          where: { projectPageId: existing.id },
        }),
        prisma.projectPage.update({
          where: { id: existing.id },
          data: { ...base, sections: create },
        }),
      ]);
    } else {
      await prisma.projectPage.create({ data: { ...base, sections: create } });
    }
    console.log(`  ✓ ${row.title} (${sections.length} sections)`);
  }
}

async function migrateBlogPosts() {
  const rows = await groq(`*[_type=="blogPost"]|order(publishedAt desc){
    _id,title,"slug":slug.current,description,author,publishedAt,
    "mainRef":mainImage.asset._ref,body
  }`);
  console.log(`\nBlog posts: ${rows.length}`);

  for (const row of rows) {
    if (!row.slug) {
      console.warn(`  ! skipping "${row.title}" — no slug`);
      continue;
    }
    const mainImageUrl = await migrateAsset(assetUrl(row.mainRef));
    const body = await portableTextToMarkdown(row.body);

    if (DRY_RUN) {
      console.log(
        `  would import ${row.title} (${body.length} chars of markdown)`,
      );
      continue;
    }

    const data = {
      title: row.title,
      slug: row.slug,
      description: row.description ?? null,
      author: row.author ?? null,
      mainImageUrl,
      body,
      published: true,
      publishedAt: row.publishedAt ? new Date(row.publishedAt) : new Date(),
    };
    const existing = await prisma.blogPost.findUnique({
      where: { slug: row.slug },
    });
    if (existing)
      await prisma.blogPost.update({ where: { id: existing.id }, data });
    else await prisma.blogPost.create({ data });
    console.log(`  ✓ ${row.title}`);
  }
}

async function migrateBrochure() {
  const rows = await groq('*[_type=="brochure"]{"ref":file.asset._ref}');
  console.log(`\nBrochures: ${rows.length}`);
  for (const row of rows) {
    const url = await migrateAsset(assetUrl(row.ref));
    if (!url) continue;
    if (DRY_RUN) {
      console.log(`  would import ${url}`);
      continue;
    }
    await prisma.brochure.updateMany({
      data: { isActive: false },
      where: { isActive: true },
    });
    await prisma.brochure.create({
      data: {
        fileUrl: url,
        filename: url.split('/').pop() ?? 'brochure.pdf',
        isActive: true,
      },
    });
    console.log(`  ✓ ${url.split('/').pop()}`);
  }
}

/* ── Run ────────────────────────────────────────────────────────────────── */

console.log(
  `Migrating from Sanity project "${PROJECT_ID}" / dataset "${DATASET}"`,
);
if (DRY_RUN) console.log('DRY RUN — nothing will be written.\n');
if (!blobPut && !DRY_RUN) {
  console.log(
    'Note: BLOB_READ_WRITE_TOKEN not set — images will keep their Sanity CDN URLs.\n',
  );
}

try {
  await migrateCategories();
  await migrateVideos();
  await migrateProjectPages();
  await migrateBlogPosts();
  await migrateBrochure();
  console.log('\nDone.');
} catch (error) {
  console.error('\nMigration failed:', error.message);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
