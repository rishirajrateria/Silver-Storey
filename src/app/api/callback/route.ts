import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma, isDatabaseConfigured } from '@/lib/db/client';
import {
  checkFormRateLimit,
  clean,
  clientIp,
  contactRecipient,
  isHoneypotTripped,
  validPhone,
} from '@/lib/auth/form-guard';

/**
 * The one-field "Get free estimate" popup: a phone number and nothing else.
 *
 * Deliberately the lowest-friction enquiry on the site — every extra field
 * costs enquiries, and the studio can ask for the rest on the call. The lead
 * is stored with no name, so the admin list falls back to showing the number.
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    // Bots fill every field, including the hidden one.
    if (isHoneypotTripped(body)) return NextResponse.json({ success: true });

    const limited = checkFormRateLimit(clientIp(req));
    if (limited) return NextResponse.json({ error: limited }, { status: 429 });

    const phone = clean(body.phone, 40);
    if (!validPhone(phone)) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number.' },
        { status: 400 },
      );
    }

    const sourcePath = clean(body.sourcePath, 200) || '/';

    let stored = false;
    if (isDatabaseConfigured) {
      try {
        await prisma.lead.create({
          data: { kind: 'callback', name: '', phone, sourcePath },
        });
        stored = true;
      } catch (dbError) {
        console.error('[callback] could not store lead:', dbError);
      }
    }

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const esc = (v: string) =>
        v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      try {
        await transporter.sendMail({
          from: `"Silver Storey" <${process.env.SMTP_USER}>`,
          to: contactRecipient(),
          subject: `Estimate call-back request — ${phone}`,
          html: `<div style="font-family:sans-serif;font-size:15px">
            <p><strong>${esc(phone)}</strong> asked for a free estimate.</p>
            <p style="color:#555">From ${esc(sourcePath)}${stored ? ' · saved under Enquiries' : ''}</p>
          </div>`,
        });
      } catch (mailError) {
        console.error('[callback] email failed:', mailError);
        // A stored lead is enough — the studio will see it in the panel.
        if (!stored) throw mailError;
      }
    } else if (!stored) {
      return NextResponse.json(
        { error: 'Could not send. Please call us instead.' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[callback] failed:', err);
    return NextResponse.json(
      { error: 'Could not send. Please try again.' },
      { status: 500 },
    );
  }
}
