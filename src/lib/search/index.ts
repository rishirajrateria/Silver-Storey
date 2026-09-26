import { CITIES, STATES, cityPath, statePath } from '@/lib/locations';
import { SERVICES, servicePath } from '@/lib/services';
import { getAllBlogItems, articlePath } from '@/lib/blog';
import { getLookbooks, getProjectPageLinks } from '@/lib/db/content';

export interface SearchHit {
  type:
    | 'city'
    | 'state'
    | 'service'
    | 'article'
    | 'project'
    | 'lookbook'
    | 'page';
  title: string;
  path: string;
  snippet?: string;
  score: number;
}

const STATIC_PAGES: {
  title: string;
  path: string;
  snippet: string;
  keywords: string;
}[] = [
  {
    title: 'Cost calculator',
    path: '/estimate',
    snippet: 'Estimate your interior cost with EMI.',
    keywords: 'price cost estimate budget calculator emi loan',
  },
  {
    title: 'Services & prices',
    path: '/services',
    snippet: 'Every package with starting prices.',
    keywords: 'services pricing packages',
  },
  {
    title: 'Pricing structure',
    path: '/pricing-structure',
    snippet: 'How Silver Storey quotes.',
    keywords: 'pricing payment schedule quote',
  },
  {
    title: 'How it works',
    path: '/how-it-works',
    snippet: 'Six steps from consultation to handover in 45 days.',
    keywords: 'process steps timeline delivery',
  },
  {
    title: '10-year warranty',
    path: '/warranty',
    snippet: 'What is covered and how to claim.',
    keywords: 'warranty guarantee claim',
  },
  {
    title: 'Lookbooks',
    path: '/lookbooks',
    snippet: 'Download design catalogues.',
    keywords: 'lookbook catalogue pdf download ideas',
  },
  {
    title: '3D visualisation',
    path: '/3d-visualisation',
    snippet: 'See your home before it is built.',
    keywords: '3d render visualisation visualization design',
  },
  {
    title: 'Projects & case studies',
    path: '/projects',
    snippet: 'Real homes we designed and delivered.',
    keywords: 'projects case studies portfolio work photos',
  },
  {
    title: 'Reviews',
    path: '/reviews',
    snippet: 'What clients say about working with us.',
    keywords: 'reviews testimonials ratings feedback',
  },
  {
    title: 'What is a turnkey interior project?',
    path: '/turnkey-interiors',
    snippet: 'Definition, what is included, cost and timeline.',
    keywords: 'turnkey meaning definition included contractor',
  },
  {
    title: 'How we compare',
    path: '/compare',
    snippet: 'Silver Storey vs online interior brands — what to check.',
    keywords: 'compare livspace homelane designcafe vs versus',
  },
  {
    title: 'Privacy policy',
    path: '/privacy-policy',
    snippet: 'What we collect and how we use it.',
    keywords: 'privacy data policy cookies',
  },
  {
    title: 'About us',
    path: '/about-us',
    snippet: 'The studio, founders and team.',
    keywords: 'about founders team company',
  },
  {
    title: 'Contact',
    path: '/contact',
    snippet: 'Call, WhatsApp or book a consultation.',
    keywords: 'contact phone address email consultation',
  },
  {
    title: 'Blog',
    path: '/blog',
    snippet: 'Guides, ideas and cost breakdowns.',
    keywords: 'blog articles ideas guides',
  },
  {
    title: 'Interior designers in India',
    path: '/interior-designers',
    snippet: 'All states and cities we serve.',
    keywords: 'cities states locations near me',
  },
];

function tokens(q: string): string[] {
  return q
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

/**
 * Simple weighted token match: title (or an alias such as "Bangalore" for
 * Bengaluru) scores highest, body/keywords lower.
 */
function score(
  terms: string[],
  title: string,
  body: string,
  aliases: string[] = [],
): number {
  const names = [title, ...aliases].map((n) => n.toLowerCase());
  const b = body.toLowerCase();
  let s = 0;
  for (const term of terms) {
    let best = 0;
    for (const t of names) {
      if (t === term) best = Math.max(best, 10);
      else if (t.startsWith(term)) best = Math.max(best, 6);
      else if (t.includes(term)) best = Math.max(best, 4);
    }
    s += best;
    if (b.includes(term)) s += 1;
  }
  return s;
}

export async function searchSite(
  query: string,
  limit = 40,
): Promise<SearchHit[]> {
  const terms = tokens(query);
  if (!terms.length) return [];

  const [blog, projects, lookbooks] = await Promise.all([
    getAllBlogItems(),
    getProjectPageLinks(),
    getLookbooks(),
  ]);

  const hits: SearchHit[] = [];
  const push = (hit: Omit<SearchHit, 'score'>, s: number) => {
    if (s > 0) hits.push({ ...hit, score: s });
  };

  for (const c of CITIES) {
    push(
      {
        type: 'city',
        title: `Interior Designers in ${c.name}`,
        path: cityPath(c),
        snippet: `${c.state}${c.localities.length ? ` · ${c.localities.slice(0, 3).join(', ')}` : ''}`,
      },
      score(
        terms,
        c.name,
        `${c.state} ${(c.aka ?? []).join(' ')} ${c.localities.join(' ')} interior designer`,
      ),
    );
  }
  for (const s of STATES) {
    push(
      {
        type: 'state',
        title: `Interior Designers in ${s.name}`,
        path: statePath(s),
        snippet: `${s.districts.length} districts`,
      },
      score(terms, s.name, `${s.capital} ${s.districts.join(' ')}`),
    );
  }
  for (const s of SERVICES) {
    push(
      {
        type: 'service',
        title: s.name,
        path: servicePath(s),
        snippet: s.description,
      },
      score(
        terms,
        s.name,
        `${s.shortName} ${s.description} ${s.keywords.join(' ')}`,
      ),
    );
  }
  for (const b of blog) {
    push(
      {
        type: 'article',
        title: b.title,
        path: articlePath(b.slug),
        snippet: b.description,
      },
      score(terms, b.title, `${b.description ?? ''} ${b.category ?? ''}`),
    );
  }
  for (const p of projects) {
    push(
      { type: 'project', title: p.title, path: `/projects/${p.slug}` },
      score(terms, p.title, 'project gallery case study'),
    );
  }
  for (const l of lookbooks) {
    push(
      {
        type: 'lookbook',
        title: l.title,
        path: `/lookbooks/${l.slug}`,
        snippet: l.description,
      },
      score(terms, l.title, `${l.description ?? ''} lookbook catalogue pdf`),
    );
  }
  for (const p of STATIC_PAGES) {
    push(
      { type: 'page', title: p.title, path: p.path, snippet: p.snippet },
      score(terms, p.title, p.keywords),
    );
  }

  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}
