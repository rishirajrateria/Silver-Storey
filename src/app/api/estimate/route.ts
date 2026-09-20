import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma, isDatabaseConfigured } from '@/lib/db/client';
import {
  checkFormRateLimit,
  clean,
  clientIp,
  contactRecipient,
  isHoneypotTripped,
  validEmail,
  validPhone,
} from '@/lib/auth/form-guard';
import { computeEstimate, formatIndian, type FinishKey } from '@/lib/estimate';
import { getCity } from '@/lib/locations';
import { SITE } from '@/lib/seo/site';

/**
 * Saves a calculator result as an "estimate" lead and, when SMTP is set up,
 * emails the visitor their estimate and the studio a copy.
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    if (isHoneypotTripped(body)) return NextResponse.json({ success: true });

    const limited = checkFormRateLimit(clientIp(req));
    if (limited) return NextResponse.json({ error: limited }, { status: 429 });

    const name = clean(body.name, 120);
    const phone = clean(body.phone, 40);
    const email = clean(body.email, 254);
    const citySlug = clean(body.city, 80);
    const scope = clean(body.scope, 20);
    const finish = clean(body.finish, 20) as FinishKey;
    const addOns = Array.isArray(body.addOns)
      ? body.addOns
          .filter((a): a is string => typeof a === 'string')
          .slice(0, 10)
      : [];

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

    const city = getCity(citySlug);
    const result = computeEstimate({
      scope,
      finish,
      addOns,
      priceIndex: city?.priceIndex ?? 1,
    });
    if (!result)
      return NextResponse.json(
        { error: 'Please complete the calculator first.' },
        { status: 400 },
      );

    const details = {
      scope,
      finish,
      addOns,
      city: city?.slug ?? null,
      low: result.low,
      high: result.high,
      breakdown: result.breakdown,
    };

    let stored = false;
    if (isDatabaseConfigured) {
      try {
        await prisma.lead.create({
          data: {
            kind: 'estimate',
            name,
            phone,
            email,
            city: city?.name ?? null,
            projectType: result.breakdown[0]?.label ?? scope,
            budget: `₹${formatIndian(result.low)} – ₹${formatIndian(result.high)}`,
            details,
            sourcePath: '/estimate',
          },
        });
        stored = true;
      } catch (dbError) {
        console.error('[estimate] could not store lead:', dbError);
      }
    }

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const esc = (v: string) =>
        v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const rows = result.breakdown
        .map(
          (b) =>
            `<tr><td style="padding:6px 0;color:#555">${esc(b.label)}</td><td style="padding:6px 0;text-align:right">₹${formatIndian(b.low)} – ₹${formatIndian(b.high)}</td></tr>`,
        )
        .join('');
      const summary = `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e5e5e5;border-radius:12px">
          <h2 style="margin-top:0;font-size:20px">Your Silver Storey estimate</h2>
          <p style="color:#555">${esc(city ? `For ${city.name}` : 'Pan-India baseline')} · prepared for ${esc(name)}</p>
          <table style="width:100%;border-collapse:collapse">${rows}
            <tr><td style="padding:10px 0;font-weight:700;border-top:1px solid #ddd">Estimated total</td><td style="padding:10px 0;font-weight:700;text-align:right;border-top:1px solid #ddd">₹${formatIndian(result.low)} – ₹${formatIndian(result.high)}</td></tr>
          </table>
          <p style="font-size:13px;color:#666">This is an indicative range. Consultation, site measurement and 3D visualisation are complimentary; your itemised quote will be exact. Call or WhatsApp ${SITE.phoneDisplay} to book.</p>
        </div>`;
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      try {
        await transporter.sendMail({
          from: `"Silver Storey" <${process.env.SMTP_USER}>`,
          to: email,
          subject: 'Your interior estimate from Silver Storey',
          html: summary,
        });
        await transporter.sendMail({
          from: `"Silver Storey" <${process.env.SMTP_USER}>`,
          to: contactRecipient(),
          subject: `Estimate request from ${name} (${city?.name ?? 'city not chosen'})`,
          html: `${summary}<p style="font-family:sans-serif;font-size:13px">Phone: ${esc(phone)} · Email: ${esc(email)}${stored ? ' · saved under Enquiries' : ''}</p>`,
        });
      } catch (mailError) {
        console.error('[estimate] email failed:', mailError);
        if (!stored) throw mailError;
      }
    } else if (!stored) {
      return NextResponse.json(
        { error: 'Email is not configured.' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      emailed: Boolean(process.env.SMTP_USER),
    });
  } catch (err) {
    console.error('[estimate] failed:', err);
    return NextResponse.json(
      { error: 'Could not send. Please try again.' },
      { status: 500 },
    );
  }
}
