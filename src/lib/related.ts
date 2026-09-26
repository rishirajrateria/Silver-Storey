import { ARTICLES } from '@/lib/blog';
import type { Article } from '@/lib/blog';
import { SERVICES } from '@/lib/services';
import type { ServiceData } from '@/lib/services';
import { CITIES } from '@/lib/locations';
import type { CityData } from '@/lib/locations';

/**
 * Cross-links between the three content layers — services, cities and the
 * blog — which until now were islands: no article linked to a service or
 * city page, and no service or city page linked to an article. The matching
 * is deliberately simple and deterministic (category, tags, names), so a
 * given page always shows the same related content.
 */

const norm = (s: string) => s.toLowerCase();

/** Blog category that speaks to each service category. */
const CATEGORY_FOR_SERVICE: Record<ServiceData['category'], string[]> = {
  package: ['cost-guides', 'planning-process'],
  bhk: ['cost-guides', 'planning-process'],
  room: ['design-ideas', 'cost-guides'],
  commercial: ['commercial'],
  specialty: ['materials-finishes', 'design-ideas'],
};

function serviceTerms(service: ServiceData): string[] {
  return [
    service.slug.replace(/-/g, ' '),
    service.shortName,
    ...service.keywords,
  ].map(norm);
}

function articleTerms(a: Article): string[] {
  return [a.title, a.slug.replace(/-/g, ' '), ...a.tags].map(norm);
}

function cityTerms(city: CityData): string[] {
  return [city.name, ...(city.aka ?? [])].map(norm);
}

/** Articles worth reading from a service page. */
export function articlesForService(service: ServiceData, limit = 3): Article[] {
  const terms = serviceTerms(service);
  const cats = CATEGORY_FOR_SERVICE[service.category] ?? [];
  return ARTICLES.map((a) => {
    const text = articleTerms(a).join(' ');
    let score = 0;
    if (service.slug === 'modular-kitchen' && a.category === 'modular-kitchen')
      score += 5;
    if (cats.includes(a.category)) score += 2;
    for (const t of terms) if (t.length > 3 && text.includes(t)) score += 3;
    return { a, score };
  })
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score || x.a.title.localeCompare(y.a.title))
    .slice(0, limit)
    .map((x) => x.a);
}

/** Articles that mention a city (city guides, local case studies). */
export function articlesForCity(city: CityData, limit = 3): Article[] {
  const terms = cityTerms(city);
  return ARTICLES.filter((a) => {
    const text = articleTerms(a).join(' ');
    return terms.some((t) => text.includes(t));
  })
    .sort((a, b) => a.title.localeCompare(b.title))
    .slice(0, limit);
}

/** Services an article should point readers at. */
export function servicesForArticle(a: Article, limit = 4): ServiceData[] {
  const text = articleTerms(a).join(' ');
  return SERVICES.map((s) => {
    let score = 0;
    if (s.slug === 'modular-kitchen' && a.category === 'modular-kitchen')
      score += 5;
    if ((CATEGORY_FOR_SERVICE[s.category] ?? []).includes(a.category))
      score += 1;
    for (const t of serviceTerms(s))
      if (t.length > 3 && text.includes(t)) score += 3;
    return { s, score };
  })
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score || x.s.name.localeCompare(y.s.name))
    .slice(0, limit)
    .map((x) => x.s);
}

/** Cities an article names — its natural local landing pages. */
export function citiesForArticle(a: Article, limit = 4): CityData[] {
  const text = articleTerms(a).join(' ');
  return CITIES.filter((c) => cityTerms(c).some((t) => text.includes(t)))
    .sort((x, y) => x.tier - y.tier || x.name.localeCompare(y.name))
    .slice(0, limit);
}
