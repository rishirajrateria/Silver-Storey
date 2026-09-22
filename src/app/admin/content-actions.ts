'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db/client';
import { getSession } from '@/lib/auth';
import { revalidateForContent } from '@/lib/admin/revalidate';
import { slugify } from '@/lib/admin/slug';
import { randomBytes } from 'node:crypto';
import { deleteUpload } from '@/lib/storage';
import { isRoomType } from '@/lib/rooms';

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

interface CategoryImageInput {
  imageUrl: string;
  title: string | null;
  price: string | null;
}

/** Parses the gallery payload from CategoryImagesEditor, dropping junk rows. */
function parseCategoryImages(raw: string): CategoryImageInput[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((image) => {
      if (typeof image !== 'object' || image === null) return [];
      const i = image as Record<string, unknown>;
      const imageUrl = typeof i.imageUrl === 'string' ? i.imageUrl.trim() : '';
      if (!imageUrl) return [];
      const title = typeof i.title === 'string' ? i.title.trim() : '';
      const price = typeof i.price === 'string' ? i.price.trim() : '';
      return [{ imageUrl, title: title || null, price: price || null }];
    });
  } catch {
    return [];
  }
}

/**
 * A category's slug must be unique, and renaming one must not collide with
 * another. Suffixes -2, -3, … the way uniqueSlug does, but checked against
 * the database rather than an in-memory list.
 */
async function uniqueCategorySlug(
  name: string,
  currentId: string | null,
): Promise<string> {
  const base = slugify(name) || 'category';
  let candidate = base;
  let n = 2;
  for (;;) {
    const clash = await prisma.category.findFirst({
      where: {
        slug: candidate,
        ...(currentId ? { NOT: { id: currentId } } : {}),
      },
      select: { id: true },
    });
    if (!clash) return candidate;
    candidate = `${base}-${n++}`;
  }
}

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

  const images = parseCategoryImages(str(form, 'images'));

  try {
    const data = {
      name,
      slug: await uniqueCategorySlug(name, id || null),
      price,
      imageUrl: optional(form, 'imageUrl'),
      order: num(form, 'order'),
      published: bool(form, 'published'),
    };

    const imageCreate = {
      create: images.map((image, index) => ({ ...image, order: index })),
    };

    if (id) {
      // Photos are fully replaced rather than diffed — the volumes are small
      // and it keeps the editor's ordering authoritative.
      await prisma.$transaction([
        prisma.categoryImage.deleteMany({ where: { categoryId: id } }),
        prisma.category.update({
          where: { id },
          data: { ...data, images: imageCreate },
        }),
      ]);
    } else {
      await prisma.category.create({ data: { ...data, images: imageCreate } });
    }
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
  images: {
    title: string;
    description: string;
    imageUrl: string;
    roomType: string | null;
  }[];
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
                roomType: isRoomType(i.roomType) ? i.roomType : null,
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
    // Case-study fields
    summary: optional(form, 'summary'),
    location: optional(form, 'location'),
    areaSqft: optional(form, 'areaSqft')
      ? Math.round(num(form, 'areaSqft'))
      : null,
    budget: optional(form, 'budget'),
    durationDays: optional(form, 'durationDays')
      ? Math.round(num(form, 'durationDays'))
      : null,
    propertyType: optional(form, 'propertyType'),
    style: optional(form, 'style'),
    materials: optional(form, 'materials'),
    clientName: optional(form, 'clientName'),
    clientQuote: optional(form, 'clientQuote'),
    beforeImageUrl: optional(form, 'beforeImageUrl'),
    afterImageUrl: optional(form, 'afterImageUrl'),
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
            roomType: image.roomType,
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

/* ──────────────────────────── Testimonials ──────────────────────────── */

export async function saveTestimonial(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  await guard();
  const id = str(form, 'id');
  const name = str(form, 'name');
  const quote = str(form, 'quote');
  const rating = Math.round(num(form, 'rating', 5));

  if (!name) return fail('Client name is required.');
  if (!quote) return fail('The quote is required.');
  if (rating < 1 || rating > 5) return fail('Rating must be between 1 and 5.');

  const data = {
    name,
    quote,
    rating,
    location: optional(form, 'location'),
    projectType: optional(form, 'projectType'),
    imageUrl: optional(form, 'imageUrl'),
    source: str(form, 'source') || 'direct',
    sourceUrl: optional(form, 'sourceUrl'),
    order: num(form, 'order'),
    published: bool(form, 'published'),
  };

  try {
    if (id) await prisma.testimonial.update({ where: { id }, data });
    else await prisma.testimonial.create({ data });
  } catch (error) {
    console.error('[admin] saveTestimonial failed:', error);
    return fail('Could not save. Check the database connection.');
  }

  revalidateForContent('testimonial');
  revalidatePath('/admin/testimonials');
  redirect('/admin/testimonials');
}

export async function deleteTestimonial(form: FormData): Promise<void> {
  await guard();
  const id = str(form, 'id');
  if (!id) return;
  try {
    const existing = await prisma.testimonial.findUnique({ where: { id } });
    await prisma.testimonial.delete({ where: { id } });
    if (existing?.imageUrl) await deleteUpload(existing.imageUrl);
  } catch (error) {
    console.error('[admin] deleteTestimonial failed:', error);
  }
  revalidateForContent('testimonial');
  revalidatePath('/admin/testimonials');
  redirect('/admin/testimonials');
}

/* ───────────────────────────── Lookbooks ───────────────────────────── */

export async function saveLookbook(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  await guard();
  const id = str(form, 'id');
  const title = str(form, 'title');
  const slug = slugify(str(form, 'slug') || title);
  const fileUrl = str(form, 'fileUrl');

  if (!title) return fail('Title is required.');
  if (!slug) return fail('Slug is required.');
  if (!fileUrl) return fail('Upload the PDF first.');

  const data = {
    title,
    slug,
    fileUrl,
    description: optional(form, 'description'),
    roomType: isRoomType(str(form, 'roomType')) ? str(form, 'roomType') : null,
    coverImageUrl: optional(form, 'coverImageUrl'),
    pages: optional(form, 'pages') ? Math.round(num(form, 'pages')) : null,
    order: num(form, 'order'),
    published: bool(form, 'published'),
  };

  try {
    const clash = await prisma.lookbook.findFirst({
      where: { slug, ...(id ? { NOT: { id } } : {}) },
      select: { id: true },
    });
    if (clash) return fail(`Another lookbook already uses the slug "${slug}".`);
    if (id) await prisma.lookbook.update({ where: { id }, data });
    else await prisma.lookbook.create({ data });
  } catch (error) {
    console.error('[admin] saveLookbook failed:', error);
    return fail('Could not save. Check the database connection.');
  }

  revalidateForContent('lookbook', slug);
  revalidatePath('/admin/lookbooks');
  redirect('/admin/lookbooks');
}

export async function deleteLookbook(form: FormData): Promise<void> {
  await guard();
  const id = str(form, 'id');
  if (!id) return;
  try {
    const existing = await prisma.lookbook.findUnique({ where: { id } });
    await prisma.lookbook.delete({ where: { id } });
    if (existing?.fileUrl) await deleteUpload(existing.fileUrl);
    if (existing?.coverImageUrl) await deleteUpload(existing.coverImageUrl);
    if (existing) revalidateForContent('lookbook', existing.slug);
  } catch (error) {
    console.error('[admin] deleteLookbook failed:', error);
  }
  revalidatePath('/admin/lookbooks');
  redirect('/admin/lookbooks');
}

/* ────────────────────────── Client projects ────────────────────────── */

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I

function generateAccessCode(): string {
  const bytes = randomBytes(6);
  let out = 'SS-';
  for (const b of bytes) out += CODE_ALPHABET[b % CODE_ALPHABET.length];
  return out;
}

function dateOrNull(form: FormData, key: string): Date | null {
  const value = str(form, key);
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function saveClientProject(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  await guard();
  const id = str(form, 'id');
  const clientName = str(form, 'clientName');
  const title = str(form, 'title');
  const phoneLast4 = str(form, 'phoneLast4').replace(/\D/g, '');
  const currentStep = Math.round(num(form, 'currentStep', 1));
  const status = str(form, 'status') || 'active';

  if (!clientName) return fail('Client name is required.');
  if (!title) return fail('Project title is required.');
  if (phoneLast4.length !== 4)
    return fail('Enter the last four digits of the client’s phone.');
  if (currentStep < 1 || currentStep > 6)
    return fail('Step must be between 1 and 6.');
  if (!['active', 'on-hold', 'completed'].includes(status))
    return fail('Invalid status.');

  const data = {
    clientName,
    title,
    phoneLast4,
    currentStep,
    status,
    city: optional(form, 'city'),
    startDate: dateOrNull(form, 'startDate'),
    expectedHandover: dateOrNull(form, 'expectedHandover'),
    projectManager: optional(form, 'projectManager'),
    notes: optional(form, 'notes'),
  };

  let targetId = id;
  try {
    if (id) {
      await prisma.clientProject.update({ where: { id }, data });
    } else {
      // Retry on the (very unlikely) code collision.
      for (let attempt = 0; attempt < 5; attempt++) {
        try {
          const created = await prisma.clientProject.create({
            data: { ...data, accessCode: generateAccessCode() },
          });
          targetId = created.id;
          break;
        } catch (error) {
          if (attempt === 4) throw error;
        }
      }
    }
  } catch (error) {
    console.error('[admin] saveClientProject failed:', error);
    return fail('Could not save. Check the database connection.');
  }

  revalidatePath('/admin/client-projects');
  redirect(`/admin/client-projects/${targetId}`);
}

export async function deleteClientProject(form: FormData): Promise<void> {
  await guard();
  const id = str(form, 'id');
  if (!id) return;
  try {
    const updates = await prisma.projectUpdate.findMany({
      where: { clientProjectId: id },
      select: { imageUrl: true },
    });
    await prisma.clientProject.delete({ where: { id } });
    for (const u of updates) if (u.imageUrl) await deleteUpload(u.imageUrl);
  } catch (error) {
    console.error('[admin] deleteClientProject failed:', error);
  }
  revalidatePath('/admin/client-projects');
  redirect('/admin/client-projects');
}

export async function addProjectUpdate(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  await guard();
  const clientProjectId = str(form, 'clientProjectId');
  const title = str(form, 'title');
  if (!clientProjectId) return fail('Missing project.');
  if (!title) return fail('Give the update a title.');
  const stepRaw = optional(form, 'step');
  const step = stepRaw ? Math.round(num(form, 'step')) : null;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.projectUpdate.create({
        data: {
          clientProjectId,
          title,
          body: optional(form, 'body'),
          imageUrl: optional(form, 'imageUrl'),
          step: step && step >= 1 && step <= 6 ? step : null,
        },
      });
      // Posting an update for a later step moves the project forward.
      if (step && step >= 1 && step <= 6 && bool(form, 'advance')) {
        await tx.clientProject.update({
          where: { id: clientProjectId },
          data: { currentStep: step },
        });
      }
    });
  } catch (error) {
    console.error('[admin] addProjectUpdate failed:', error);
    return fail('Could not save the update.');
  }

  revalidatePath(`/admin/client-projects/${clientProjectId}`);
  return { ok: true };
}

export async function deleteProjectUpdate(form: FormData): Promise<void> {
  await guard();
  const id = str(form, 'id');
  if (!id) return;
  let projectId = '';
  try {
    const existing = await prisma.projectUpdate.findUnique({ where: { id } });
    if (!existing) return;
    projectId = existing.clientProjectId;
    await prisma.projectUpdate.delete({ where: { id } });
    if (existing.imageUrl) await deleteUpload(existing.imageUrl);
  } catch (error) {
    console.error('[admin] deleteProjectUpdate failed:', error);
  }
  if (projectId) revalidatePath(`/admin/client-projects/${projectId}`);
}
