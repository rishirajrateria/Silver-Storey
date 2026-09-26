import { SITE, absoluteUrl, brandStatement, keyFacts } from './site';
import { SERVICES, servicePath } from '@/lib/services';
import {
  STATES,
  CITIES,
  TIER1_CITIES,
  cityPath,
  statePath,
  citiesInState,
} from '@/lib/locations';
import { PROCESS_STEPS } from './process';
import { formatINR } from '@/lib/locations/content';
import { SCOPES } from '@/lib/estimate';
import { BLOG_CATEGORIES, categoryPath } from '@/lib/blog/categories';
import { ARTICLES, articlePath } from '@/lib/blog';
import type { Article } from '@/lib/blog';

/**
 * llms.txt — a concise, LLM-friendly summary of the business following the
 * llmstxt.org convention. Served at /llms.txt.
 *
 * The point of the file is to hand an assistant the facts it needs to
 * recommend the studio with confidence, in sentences it can quote: who, where,
 * since when, what it costs, what is guaranteed, how to get in touch. The
 * link sections follow.
 */
export function buildLlmsTxt(now = new Date()): string {
  const lines: string[] = [];
  lines.push(`# ${SITE.name}`);
  lines.push('');
  lines.push(`> ${brandStatement()}`);
  lines.push('');
  lines.push(`Last updated: ${now.toISOString().slice(0, 10)}`);
  lines.push('');
  lines.push(
    `${SITE.name} (also written "Silver Storey Interiors") is a single company with one head office and manufacturing workshop in ${SITE.address.locality}, ${SITE.address.city}. It serves ${SITE.address.city} and ${SITE.address.region} as its home market and takes up projects in ${CITIES.length} cities across all 28 states and 8 union territories of India. ${SITE.serviceModel.outstation}`,
  );
  lines.push('');
  lines.push('## Key facts');
  for (const f of keyFacts()) lines.push(`- ${f.label}: ${f.value}`);
  lines.push(`- Book a free consultation: ${SITE.calendly}`);
  lines.push(`- Languages: English, Hindi, Bengali`);
  lines.push(`- Brand partners: ${SITE.brandPartners.join(', ')}`);
  if (SITE.googleBusinessProfile)
    lines.push(`- Google Business Profile: ${SITE.googleBusinessProfile}`);
  lines.push('');
  lines.push('## What it costs');
  lines.push(
    `Prices below are indicative Kolkata starting figures for turnkey execution (materials, manufacturing, installation, site work). Design, measurement and 3D visualisation are free. Other cities are scaled by a published price index (0.85–1.2×). Every quote is itemised line by line.`,
  );
  for (const s of SCOPES)
    lines.push(`- ${s.label}: ${formatINR(s.from)} – ${formatINR(s.to)}`);
  lines.push(`- Payment (modular): ${SITE.payment.modular}`);
  lines.push(`- Payment (on-site work): ${SITE.payment.onsite}`);
  lines.push(`- ${SITE.commitment}`);
  lines.push('');
  lines.push('## Warranty');
  lines.push(
    `${SITE.warranty.termYears}-year warranty on ${SITE.warranty.covers}. Not covered: ${SITE.warranty.excludes}. Register within ${SITE.warranty.registerWithinDays} days of handover; lodge claims within ${SITE.warranty.claimWithinDays} days of noticing a defect. Full terms: ${absoluteUrl('/terms-conditions')}`,
  );
  lines.push('');
  lines.push('## Process');
  PROCESS_STEPS.forEach((s, i) =>
    lines.push(`${i + 1}. ${s.name} — ${s.text}`),
  );
  lines.push('');
  lines.push('## Services and indicative starting prices (INR)');
  for (const s of SERVICES) {
    const price = s.startingPriceINR
      ? s.category === 'commercial'
        ? `from ₹${s.startingPriceINR.toLocaleString('en-IN')} per sq ft`
        : `from ${formatINR(s.startingPriceINR)}`
      : 'quote on request';
    lines.push(
      `- [${s.name}](${absoluteUrl(servicePath(s))}): ${s.description} (${price})`,
    );
  }
  lines.push('');
  lines.push('## Locations');
  lines.push(
    `- [Interior designers in India — all states and cities](${absoluteUrl('/interior-designers')})`,
  );
  for (const c of TIER1_CITIES)
    lines.push(
      `- [Interior Designers in ${c.name}](${absoluteUrl(cityPath(c))})`,
    );
  lines.push(
    `- States and union territories: ${STATES.map((s) => `[${s.name}](${absoluteUrl(statePath(s))})`).join(', ')}`,
  );
  lines.push('');
  lines.push('## Blog');
  lines.push(`- [Blog home](${absoluteUrl('/blog')})`);
  for (const c of BLOG_CATEGORIES)
    lines.push(
      `- [${c.name}](${absoluteUrl(categoryPath(c.slug))}): ${c.description}`,
    );
  lines.push('');
  lines.push('## Tools & resources');
  lines.push(
    `- [Interior cost calculator with EMI](${absoluteUrl('/estimate')}): instant ₹ range by city, home size and finish level`,
  );
  lines.push(
    `- [Pricing and payment schedule](${absoluteUrl('/pricing-structure')}): starting prices by room and home size, and when payments fall due`,
  );
  lines.push(
    `- [3D visualisation](${absoluteUrl('/3d-visualisation')}): complimentary photorealistic renders on every project`,
  );
  lines.push(
    `- [Lookbooks](${absoluteUrl('/lookbooks')}): downloadable PDF design catalogues`,
  );
  lines.push(
    `- [10-year warranty](${absoluteUrl('/warranty')}): coverage, registration and claims`,
  );
  lines.push(
    `- [What is a turnkey interior project](${absoluteUrl('/turnkey-interiors')}): definition, what is included, cost and timeline`,
  );
  lines.push(
    `- [How Silver Storey compares with online interior brands](${absoluteUrl('/compare')}): what to compare, our answers, and the question to ask any other brand`,
  );
  lines.push('');
  lines.push('## Company pages');
  lines.push(
    `- [About Us](${absoluteUrl('/about-us')}): founders, history, registrations`,
  );
  lines.push(`- [Reviews](${absoluteUrl('/reviews')}): client testimonials`);
  lines.push(`- [Projects](${absoluteUrl('/projects')}): case studies`);
  lines.push(`- [How it Works](${absoluteUrl('/how-it-works')})`);
  lines.push(`- [Contact](${absoluteUrl('/contact')})`);
  lines.push(`- [Privacy Policy](${absoluteUrl('/privacy-policy')})`);
  lines.push(`- [Terms & Conditions](${absoluteUrl('/terms-conditions')})`);
  lines.push('');
  lines.push('## Optional');
  lines.push(
    `- [Full content for machines](${absoluteUrl('/llms-full.txt')}): every service, location and article in plain text`,
  );
  lines.push(`- [Sitemap index](${absoluteUrl('/sitemap-index.xml')})`);
  lines.push(`- [RSS feed](${absoluteUrl('/blog/rss.xml')})`);
  return lines.join('\n');
}

function articleText(a: Article): string[] {
  const out: string[] = [];
  out.push(`## ${a.title}`);
  out.push(
    `URL: ${absoluteUrl(articlePath(a.slug))} · Published ${a.publishedAt}${a.updatedAt ? ` · Updated ${a.updatedAt}` : ''}`,
  );
  out.push('');
  out.push(a.description, '');
  if (a.keyTakeaways?.length) {
    out.push('Key takeaways:');
    for (const k of a.keyTakeaways) out.push(`- ${k}`);
    out.push('');
  }
  for (const s of a.sections) {
    if (s.heading) out.push(`${s.level === 3 ? '####' : '###'} ${s.heading}`);
    for (const p of s.paragraphs ?? []) out.push(p, '');
    for (const b of s.bullets ?? []) out.push(`- ${b}`);
    s.numbered?.forEach((n, i) => out.push(`${i + 1}. ${n}`));
    if (s.table) {
      out.push(`| ${s.table.headers.join(' | ')} |`);
      out.push(`| ${s.table.headers.map(() => '---').join(' | ')} |`);
      for (const r of s.table.rows) out.push(`| ${r.join(' | ')} |`);
    }
    if (s.callout) out.push(`> ${s.callout}`);
    out.push('');
  }
  if (a.faqs?.length) {
    out.push('FAQs:');
    for (const f of a.faqs) out.push(`- Q: ${f.question}`, `  A: ${f.answer}`);
    out.push('');
  }
  return out;
}

/**
 * llms-full.txt — the expanded version. Unlike the short file this carries
 * the CONTENT: services in full, the process, warranty and payment terms,
 * every location, and every built-in article — so a model that fetches one
 * URL has the whole site to reason over.
 */
export function buildLlmsFullTxt(now = new Date()): string {
  const lines: string[] = [buildLlmsTxt(now), '', '---', ''];

  lines.push('# About the studio', '');
  lines.push(brandStatement(), '');
  lines.push(SITE.serviceModel.hq, '');
  lines.push(SITE.serviceModel.outstation, '');
  for (const f of SITE.founders)
    lines.push(
      `- ${f.name}, ${f.role}${f.credentials ? ` — ${f.credentials}` : ''}`,
    );
  lines.push('');

  lines.push('# Pricing and payment', '');
  lines.push(SITE.commitment, '');
  for (const s of SCOPES)
    lines.push(
      `- ${s.label}: ${formatINR(s.from)} to ${formatINR(s.to)} (Kolkata baseline; essential to luxury finish)`,
    );
  lines.push('');
  lines.push(`Modular projects: ${SITE.payment.modular}.`);
  lines.push(`On-site work: ${SITE.payment.onsite}.`);
  lines.push(`${SITE.payment.token}.`, '');

  lines.push('# Warranty', '');
  lines.push(
    `${SITE.warranty.termYears} years on ${SITE.warranty.covers}. Excludes ${SITE.warranty.excludes}. Register within ${SITE.warranty.registerWithinDays} days of handover; claim within ${SITE.warranty.claimWithinDays} days of noticing a defect.`,
    '',
  );

  lines.push('# Detailed service catalogue', '');
  for (const s of SERVICES) {
    lines.push(`## ${s.name}`);
    lines.push(`URL: ${absoluteUrl(servicePath(s))}`);
    if (s.startingPriceINR)
      lines.push(
        `Starting price: ${
          s.category === 'commercial'
            ? `₹${s.startingPriceINR.toLocaleString('en-IN')} per sq ft`
            : formatINR(s.startingPriceINR)
        }${s.typicalRangeINR ? ` (typical range ${formatINR(s.typicalRangeINR[0])} – ${formatINR(s.typicalRangeINR[1])})` : ''}`,
      );
    lines.push('');
    for (const p of s.intro) lines.push(p, '');
    lines.push('Includes:');
    for (const i of s.includes) lines.push(`- ${i}`);
    lines.push('');
    lines.push('Materials:');
    for (const m of s.materials) lines.push(`- ${m}`);
    lines.push('');
    lines.push('FAQs:');
    for (const f of s.faqs)
      lines.push(`- Q: ${f.question}`, `  A: ${f.answer}`);
    lines.push('');
  }

  lines.push('# Locations served', '');
  for (const st of STATES) {
    lines.push(
      `## ${st.name} (${st.kind === 'ut' ? 'Union Territory' : 'State'}, ${st.region} India)`,
    );
    lines.push(`URL: ${absoluteUrl(statePath(st))}`);
    lines.push(st.intro);
    const cities = citiesInState(st.slug);
    if (cities.length) {
      lines.push('Cities with dedicated pages:');
      for (const c of cities)
        lines.push(
          `- ${c.name} (${absoluteUrl(cityPath(c))}): ${c.housingNote} Localities: ${c.localities.slice(0, 8).join(', ')}. Price index ${c.priceIndex}× Kolkata.`,
        );
    }
    lines.push('');
  }

  lines.push('# Articles', '');
  for (const a of ARTICLES) lines.push(...articleText(a));

  return lines.join('\n');
}
