'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db/client';
import { getSession } from '@/lib/auth';
import { revalidateForContent } from '@/lib/admin/revalidate';
import { slugify } from '@/lib/admin/slug';
import { deleteUpload } from '@/lib/storage';

export interface ActionState {
  error?: string;
  ok?: boolean;
}

async function guard(): Promise<void> {
  const session = await getSession();
  if (!session) redirect('/admin/login');
}

function str(form: FormData, key: string): string {
  return String(form.get(key) ?? '').trim();
}
function optional(form: FormData, key: string): string | null {
  const value = str(form, key);
  return value === '' ? null : value;
}
function num(form: FormData, key: string, fallback = 0): number {
  const parsed = Number(form.get(key));
  return Number.isFinite(parsed) ? parsed : fallback;
}
function bool(form: FormData, key: string): boolean {
  return form.get(key) === 'on' || form.get(key) === 'true';
}

function fail(error: string): ActionState {
  return { error };
}

/* ───────────────────────────── Categories ───────────────────────────── */

export async function saveCategory(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  await guard();
  const id = str(form, 'id');
  const name = str(form, 'name');
  const price = str(form, 'price');

  if (!name) return fail('Name is required.');
  if (!price) return fail('Starting price is required.');

  const data = {
    name,
    price,
    imageUrl: optional(form, 'imageUrl'),
    order: num(form, 'order'),
    published: bool(form, 'published'),
  };

  try {
    if (id) await prisma.category.update({ where: { id }, data });
    else await prisma.category.create({ data });
  } catch (error) {
    console.error('[admin] saveCategory failed:', error);
    return fail('Could not save. Check the database connection.');
  }

  revalidateForContent('category');
  revalidatePath('/admin/categories');
  redirect('/admin/categories');
}

export async function deleteCategory(form: FormData): Promise<void> {
  await guard();
  const id = str(form, 'id');
  if (!id) return;
  try {
    const existing = await prisma.category.findUnique({ where: { id } });
    await prisma.category.delete({ where: { id } });
    if (existing?.imageUrl) await deleteUpload(existing.imageUrl);
  } catch (error) {
    console.error('[admin] deleteCategory failed:', error);
  }
  revalidateForContent('category');
  revalidatePath('/admin/categories');
  redirect('/admin/categories');
}

/* ─────────────────────────────── Videos ─────────────────────────────── */

/** Accepts a full YouTube URL or a bare ID and returns the ID. */
export async function extractYoutubeId(input: string): Promise<string> {
  const value = input.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/,
    /^([A-Za-z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = pattern.exec(value);
    if (match) return match[1];
  }
  return '';
}

export async function saveVideo(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  await guard();
  const id = str(form, 'id');
  const title = str(form, 'title');
  const youtubeId = await extractYoutubeId(str(form, 'youtubeId'));

  if (!title) return fail('Title is required.');
  if (!youtubeId) {
    return fail('Enter a valid YouTube URL or 11-character video ID.');
  }

  const data = {
    title,
    youtubeId,
    description: optional(form, 'description'),
    order: num(form, 'order'),
    published: bool(form, 'published'),
  };

  try {
    if (id) await prisma.video.update({ where: { id }, data });
    else await prisma.video.create({ data });
  } catch (error) {
    console.error('[admin] saveVideo failed:', error);
    return fail('Could not save. Check the database connection.');
  }

  revalidateForContent('video');
  revalidatePath('/admin/videos');
  redirect('/admin/videos');
}

export async function deleteVideo(form: FormData): Promise<void> {
  await guard();
  const id = str(form, 'id');
  if (!id) return;
  try {
    await prisma.video.delete({ where: { id } });
  } catch (error) {
    console.error('[admin] deleteVideo failed:', error);
  }
  revalidateForContent('video');
  revalidatePath('/admin/videos');
  redirect('/admin/videos');
}

/* ───────────────────────────── Project pages ───────────────────────────── */

interface SectionInput {
  title: string;
  images: { title: string; description: string; imageUrl: string }[];
}

/** Gallery sections arrive as a JSON string from the client editor. */
function parseSections(raw: string): SectionInput[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((section) => {
      if (typeof section !== 'object' || section === null) return [];
      const s = section as Record<string, unknown>;
      const title = typeof s.title === 'string' ? s.title.trim() : '';
      if (!title) return [];
      const images = Array.isArray(s.images)
        ? s.images.flatMap((image) => {
            if (typeof image !== 'object' || image === null) return [];
            const i = image as Record<string, unknown>;
            const imageUrl =
              typeof i.imageUrl === 'string' ? i.imageUrl.trim() : '';
            if (!imageUrl) return [];
            return [
              {
                title: typeof i.title === 'string' ? i.title.trim() : '',
                description:
                  typeof i.description === 'string' ? i.description.trim() : '',
                imageUrl,
              },
            ];
          })
        : [];
      return [{ title, images }];
    });
  } catch {
    return [];
  }
}

export async function saveProjectPage(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  await guard();
  const id = str(form, 'id');
  const title = str(form, 'title');
  const heroTitle = str(form, 'heroTitle');
  const slug = slugify(str(form, 'slug') || title);

  if (!title) return fail('Page title is required.');
  if (!heroTitle) return fail('Hero heading is required.');
  if (!slug) return fail('Slug is required.');

  const sections = parseSections(str(form, 'sections'));

  const base = {
    title,
    slug,
    heroTitle,
    heroSubtitle: optional(form, 'heroSubtitle'),
    heroImageUrl: optional(form, 'heroImageUrl'),
    order: num(form, 'order'),
    published: bool(form, 'published'),
  };

  try {
    const clash = await prisma.projectPage.findFirst({
      where: { slug, ...(id ? { NOT: { id } } : {}) },
      select: { id: true },
    });
    if (clash) return fail(`Another page already uses the slug "${slug}".`);

    const sectionCreate = {
      create: sections.map((section, sIndex) => ({
        title: section.title,
        order: sIndex,
        images: {
          create: section.images.map((image, iIndex) => ({
            title: image.title || 'Untitled',
            description: image.description || null,
            imageUrl: image.imageUrl,
            order: iIndex,
          })),
        },
      })),
    };

    if (id) {
      // Sections are fully replaced — simpler and safer than diffing, and
      // the volumes here are small.
      await prisma.$transaction([
        prisma.gallerySection.deleteMany({ where: { projectPageId: id } }),
        prisma.projectPage.update({
          where: { id },
          data: { ...base, sections: sectionCreate },
        }),
      ]);
    } else {
      await prisma.projectPage.create({
        data: { ...base, sections: sectionCreate },
      });
    }
  } catch (error) {
    console.error('[admin] saveProjectPage failed:', error);
    return fail('Could not save. Check the database connection.');
  }

  revalidateForContent('projectPage', slug);
  revalidatePath('/admin/projects');
  redirect('/admin/projects');
}

export async function deleteProjectPage(form: FormData): Promise<void> {
  await guard();
  const id = str(form, 'id');
  if (!id) return;
  let slug: string | undefined;
  try {
    const existing = await prisma.projectPage.findUnique({ where: { id } });
    slug = existing?.slug;
    await prisma.projectPage.delete({ where: { id } });
  } catch (error) {
    console.error('[admin] deleteProjectPage failed:', error);
  }
  revalidateForContent('projectPage', slug);
  revalidatePath('/admin/projects');
  redirect('/admin/projects');
}

/* ─────────────────────────────── Blog ─────────────────────────────── */

export async function saveBlogPost(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  await guard();
  const id = str(form, 'id');
  const title = str(form, 'title');
  const slug = slugify(str(form, 'slug') || title);
  const published = bool(form, 'published');
  const publishedAtRaw = str(form, 'publishedAt');

  if (!title) return fail('Title is required.');
  if (!slug) return fail('Slug is required.');

  let publishedAt: Date | null = null;
  if (publishedAtRaw) {
    const parsed = new Date(publishedAtRaw);
    if (Number.isNaN(parsed.getTime()))
      return fail('Publish date is not valid.');
    publishedAt = parsed;
  } else if (published) {
    publishedAt = new Date();
  }

  const data = {
    title,
    slug,
    description: optional(form, 'description'),
    author: optional(form, 'author'),
    category: optional(form, 'category'),
    mainImageUrl: optional(form, 'mainImageUrl'),
    body: str(form, 'body'),
    published,
    publishedAt,
  };

  try {
    const clash = await prisma.blogPost.findFirst({
      where: { slug, ...(id ? { NOT: { id } } : {}) },
      select: { id: true },
    });
    if (clash) return fail(`Another post already uses the slug "${slug}".`);

    if (id) await prisma.blogPost.update({ where: { id }, data });
    else await prisma.blogPost.create({ data });
  } catch (error) {
    console.error('[admin] saveBlogPost failed:', error);
    return fail('Could not save. Check the database connection.');
  }

  revalidateForContent('blogPost', slug);
  revalidatePath('/admin/blog');
  redirect('/admin/blog');
}

export async function deleteBlogPost(form: FormData): Promise<void> {
  await guard();
  const id = str(form, 'id');
  if (!id) return;
  let slug: string | undefined;
  try {
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    slug = existing?.slug;
    await prisma.blogPost.delete({ where: { id } });
  } catch (error) {
    console.error('[admin] deleteBlogPost failed:', error);
  }
  revalidateForContent('blogPost', slug);
  revalidatePath('/admin/blog');
  redirect('/admin/blog');
}

/* ───────────────────────────── Brochure ───────────────────────────── */

export async function saveBrochure(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  await guard();
  const fileUrl = str(form, 'fileUrl');
  if (!fileUrl) return fail('Upload a PDF first.');

  try {
    await prisma.$transaction([
      prisma.brochure.updateMany({
        data: { isActive: false },
        where: { isActive: true },
      }),
      prisma.brochure.create({
        data: {
          fileUrl,
          filename:
            str(form, 'filename') || fileUrl.split('/').pop() || 'brochure.pdf',
          isActive: true,
        },
      }),
    ]);
  } catch (error) {
    console.error('[admin] saveBrochure failed:', error);
    return fail('Could not save. Check the database connection.');
  }

  revalidateForContent('brochure');
  revalidatePath('/admin/brochure');
  redirect('/admin/brochure');
}

export async function deleteBrochure(form: FormData): Promise<void> {
  await guard();
  const id = str(form, 'id');
  if (!id) return;
  try {
    const existing = await prisma.brochure.findUnique({ where: { id } });
    await prisma.brochure.delete({ where: { id } });
    if (existing?.fileUrl) await deleteUpload(existing.fileUrl);
  } catch (error) {
    console.error('[admin] deleteBrochure failed:', error);
  }
  revalidateForContent('brochure');
  revalidatePath('/admin/brochure');
  redirect('/admin/brochure');
}

/* ────────────────────────────── Leads ────────────────────────────── */

const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'won', 'lost'] as const;

export async function updateLeadStatus(form: FormData): Promise<void> {
  await guard();
  const id = str(form, 'id');
  const status = str(form, 'status');
  if (!id || !(LEAD_STATUSES as readonly string[]).includes(status)) return;
  try {
    await prisma.lead.update({ where: { id }, data: { status } });
  } catch (error) {
    console.error('[admin] updateLeadStatus failed:', error);
  }
  revalidatePath('/admin/leads');
  revalidatePath('/admin');
}

export async function deleteLead(form: FormData): Promise<void> {
  await guard();
  const id = str(form, 'id');
  if (!id) return;
  try {
    await prisma.lead.delete({ where: { id } });
  } catch (error) {
    console.error('[admin] deleteLead failed:', error);
  }
  revalidatePath('/admin/leads');
  revalidatePath('/admin');
}
