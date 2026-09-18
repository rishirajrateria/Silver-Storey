import { NextRequest, NextResponse } from 'next/server';
import { prisma, isDatabaseConfigured } from '@/lib/db/client';
import {
  checkFormRateLimit,
  clean,
  clientIp,
  isHoneypotTripped,
  validEmail,
  validPhone,
} from '@/lib/auth/form-guard';

/** Unlocks a lookbook PDF in exchange for contact details (Lead kind "lookbook"). */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    // Bots get a harmless success without the file.
    if (isHoneypotTripped(body))
      return NextResponse.json({ success: true, fileUrl: '/' });

    const limited = checkFormRateLimit(clientIp(req));
    if (limited) return NextResponse.json({ error: limited }, { status: 429 });

    const name = clean(body.name, 120);
    const phone = clean(body.phone, 40);
    const email = clean(body.email, 254);
    const slug = clean(body.slug, 120);

    if (!name || name.length < 2)
      return NextResponse.json(
        { error: 'Please enter your name.' },
        { status: 400 },
      );
    if (!validPhone(phone))
      return NextResponse.json(
        { error: 'Please enter a valid phone number.' },
        { status: 400 },
      );
    if (!validEmail(email))
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 },
      );
    if (!isDatabaseConfigured)
      return NextResponse.json(
        { error: 'Downloads are not available right now.' },
        { status: 503 },
      );

    const lookbook = await prisma.lookbook.findFirst({
      where: { slug, published: true },
    });
    if (!lookbook)
      return NextResponse.json(
        { error: 'This lookbook is no longer available.' },
        { status: 404 },
      );

    await prisma.$transaction([
      prisma.lead.create({
        data: {
          kind: 'lookbook',
          name,
          phone,
          email,
          projectType: lookbook.title,
          details: { lookbook: lookbook.slug },
          sourcePath: `/lookbooks/${lookbook.slug}`,
        },
      }),
      prisma.lookbook.update({
        where: { id: lookbook.id },
        data: { downloads: { increment: 1 } },
      }),
    ]);

    return NextResponse.json({ success: true, fileUrl: lookbook.fileUrl });
  } catch (err) {
    console.error('[lookbook] failed:', err);
    return NextResponse.json(
      { error: 'Could not unlock the download. Please try again.' },
      { status: 500 },
    );
  }
}
