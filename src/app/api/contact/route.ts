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

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;

    // Bots fill the hidden field; pretend it worked so they stop retrying.
    if (isHoneypotTripped(body)) return NextResponse.json({ success: true });

    const limited = checkFormRateLimit(clientIp(req));
    if (limited) return NextResponse.json({ error: limited }, { status: 429 });

    const name = clean(body.name, 120);
    const phone = clean(body.phone, 40);
    const address = clean(body.address, 300);
    const projectType = clean(body.projectType, 60);
    const budget = clean(body.budget, 40);

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone are required.' },
        { status: 400 },
      );
    }
    if (name.length < 2 || /https?:\/\//i.test(name)) {
      return NextResponse.json(
        { error: 'Please enter your name.' },
        { status: 400 },
      );
    }
    if (!validPhone(phone)) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number.' },
        { status: 400 },
      );
    }

    // Store the lead first. Email delivery can fail for reasons outside our
    // control; once the enquiry is in the database it is never lost.
    let stored = false;
    if (isDatabaseConfigured) {
      try {
        const referer = req.headers.get('referer');
        await prisma.lead.create({
          data: {
            kind: 'contact',
            name,
            phone,
            address: address || null,
            projectType: projectType || null,
            budget: budget || null,
            sourcePath: referer
              ? new URL(referer).pathname.slice(0, 200)
              : null,
          },
        });
        stored = true;
      } catch (dbError) {
        console.error('[contact] could not store lead:', dbError);
      }
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      if (stored) return NextResponse.json({ success: true });
      return NextResponse.json(
        { error: 'Email is not configured.' },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const esc = (v: string) =>
      v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    try {
      await transporter.sendMail({
        from: `"Silver Storey" <${process.env.SMTP_USER}>`,
        to: contactRecipient(),
        replyTo: undefined,
        subject: `New Consultation Request from ${name}`,
        html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e5e5e5;border-radius:12px">
          <h2 style="margin-top:0;font-size:20px">New Contact Form Submission</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#666;width:130px">Name</td><td style="padding:8px 0;font-weight:600">${esc(name)}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Phone</td><td style="padding:8px 0;font-weight:600">${esc(phone)}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Address</td><td style="padding:8px 0">${esc(address) || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Project Type</td><td style="padding:8px 0">${esc(projectType) || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Budget</td><td style="padding:8px 0">${budget ? `₹${esc(budget)}` : '—'}</td></tr>
          </table>
          <p style="margin-top:24px;font-size:12px;color:#999">Sent from Silver Storey website contact form${stored ? ' · also saved in the admin panel under Enquiries' : ''}</p>
        </div>
      `,
      });
    } catch (mailError) {
      console.error('[contact] email failed:', mailError);
      if (!stored) throw mailError;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[contact] failed:', err);
    return NextResponse.json(
      { error: 'Failed to send. Please try again.' },
      { status: 500 },
    );
  }
}
