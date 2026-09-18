import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma, isDatabaseConfigured } from '@/lib/db/client';

export async function POST(req: NextRequest) {
  try {
    const { name, phone, address, projectType, budget } =
      (await req.json()) as {
        name: string;
        phone: string;
        address: string;
        projectType: string;
        budget: string;
      };

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone are required.' },
        { status: 400 },
      );
    }

    // Store the lead first. Email delivery can fail for reasons outside our
    // control; once the enquiry is in the database it is never lost.
    let stored = false;
    if (isDatabaseConfigured) {
      try {
        await prisma.lead.create({
          data: {
            name: name.slice(0, 200),
            phone: phone.slice(0, 40),
            address: address?.slice(0, 500) || null,
            projectType: projectType?.slice(0, 120) || null,
            budget: budget?.slice(0, 120) || null,
            sourcePath: req.headers.get('referer')
              ? new URL(req.headers.get('referer')!).pathname.slice(0, 200)
              : null,
          },
        });
        stored = true;
      } catch (dbError) {
        console.error('[contact] could not store lead:', dbError);
      }
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    try {
      await transporter.sendMail({
        from: `"Silver Storey" <${process.env.SMTP_USER}>`,
        to: 'spidyanas7878@gmail.com',
        subject: `New Consultation Request from ${name}`,
        html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e5e5e5;border-radius:12px">
          <h2 style="margin-top:0;font-size:20px">New Contact Form Submission</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#666;width:130px">Name</td><td style="padding:8px 0;font-weight:600">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Phone</td><td style="padding:8px 0;font-weight:600">${phone}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Address</td><td style="padding:8px 0">${address || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Project Type</td><td style="padding:8px 0">${projectType || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Budget</td><td style="padding:8px 0">${budget ? `₹${budget}` : '—'}</td></tr>
          </table>
          <p style="margin-top:24px;font-size:12px;color:#999">Sent from Silver Storey website contact form</p>
        </div>
      `,
      });
    } catch (mailError) {
      console.error('[contact] email failed:', mailError);
      // The enquiry is safe in the database, so this is still a success for
      // the visitor; only surface an error if nothing was captured at all.
      if (!stored) throw mailError;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[contact] email error:', err);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 },
    );
  }
}
