import { SITE, absoluteUrl } from './site';
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
import { BLOG_CATEGORIES, categoryPath } from '@/lib/blog/categories';

/**
 * llms.txt — a concise, LLM-friendly summary of the business following the
 * llmstxt.org convention. Served at /llms.txt.
 */
export function buildLlmsTxt(): string {
  const lines: string[] = [];
  lines.push(`# ${SITE.name}`);
  lines.push('');
  lines.push(`> ${SITE.description}`);
  lines.push('');
  lines.push(
    `${SITE.name} is an interior design company founded in Kolkata, West Bengal, India by ${SITE.founders.map((f) => f.name).join(' and ')}. It designs and executes turnkey residential interiors (full homes, 1/2/3/4 BHK apartments, villas, modular kitchens, wardrobes, false ceilings) and commercial interiors (offices, retail, restaurants) across ${CITIES.length} Indian cities in all 28 states and 8 union territories.`,
  );
  lines.push('');
  lines.push('## Key facts');
  lines.push(
    `- Head office: ${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region} ${SITE.address.postalCode}, India`,
  );
  lines.push(`- Phone / WhatsApp: ${SITE.phoneDisplay}`);
  lines.push(`- Email: ${SITE.email}`);
  lines.push(`- Book a free consultation: ${SITE.calendly}`);
  lines.push(
    `- Experience: ${SITE.stats.yearsExperience} years; ${SITE.stats.sqftTransformed} sq ft delivered; ${SITE.stats.teamMembers} team members`,
  );
  lines.push(
    `- Differentiators: complimentary 3D visualisation before execution; transparent itemised pricing with no hidden charges; delivery within ${SITE.stats.deliveryDays} days of design approval; 10-year warranty on modular components and workmanship`,
  );
  lines.push(`- Brand partners: ${SITE.brandPartners.join(', ')}`);
  lines.push(`- Languages: English, Hindi, Bengali`);
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
    `- [3D visualisation](${absoluteUrl('/3d-visualisation')}): complimentary photorealistic renders on every project`,
  );
  lines.push(
    `- [Lookbooks](${absoluteUrl('/lookbooks')}): downloadable PDF design catalogues`,
  );
  lines.push(
    `- [10-year warranty](${absoluteUrl('/warranty')}): coverage, registration and claims`,
  );
  lines.push(
    `- [Client project tracker](${absoluteUrl('/track')}): progress login for existing clients`,
  );
  lines.push('');
  lines.push('## Company pages');
  lines.push(`- [About Us](${absoluteUrl('/about-us')})`);
  lines.push(`- [How it Works](${absoluteUrl('/how-it-works')})`);
  lines.push(`- [Pricing Structure](${absoluteUrl('/pricing-structure')})`);
  lines.push(`- [Contact](${absoluteUrl('/contact')})`);
  lines.push(`- [Terms & Conditions](${absoluteUrl('/terms-conditions')})`);
  lines.push('');
  lines.push('## Optional');
  lines.push(
    `- [Full machine-readable summary](${absoluteUrl('/llms-full.txt')})`,
  );
  lines.push(`- [Sitemap index](${absoluteUrl('/sitemap-index.xml')})`);
  return lines.join('\n');
}

/** llms-full.txt — the expanded version with every service, state and city. */
export function buildLlmsFullTxt(): string {
  const lines: string[] = [
    buildLlmsTxt(),
    '',
    '---',
    '',
    '# Detailed service catalogue',
    '',
  ];
  for (const s of SERVICES) {
    lines.push(`## ${s.name}`);
    lines.push(`URL: ${absoluteUrl(servicePath(s))}`);
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
          `- ${c.name}: ${absoluteUrl(cityPath(c))} — serves ${c.localities.slice(0, 6).join(', ')}`,
        );
    }
    lines.push(`Districts: ${st.districts.join(', ')}`);
    lines.push('');
  }
  return lines.join('\n');
}
