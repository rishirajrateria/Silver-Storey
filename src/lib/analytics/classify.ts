/**
 * Request classification for analytics. Pure functions, unit tested — no
 * request objects, so they can be exercised directly.
 */

export type Device = 'desktop' | 'mobile' | 'tablet';
export type Source =
  | 'direct'
  | 'organic'
  | 'ai'
  | 'social'
  | 'referral'
  | 'internal';

const BOT_PATTERN =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|whatsapp|telegram|preview|monitor|uptime|pingdom|lighthouse|headless|curl|wget|python-requests|axios|node-fetch|scrapy|semrush|ahrefs|mj12|dotbot|petalbot|gptbot|claudebot|perplexity|applebot|amazonbot|bytespider/i;

/** Crawlers and preview fetchers must not be counted as visitors. */
export function isBot(userAgent: string | null | undefined): boolean {
  if (!userAgent || userAgent.trim() === '') return true;
  return BOT_PATTERN.test(userAgent);
}

export function detectDevice(userAgent: string | null | undefined): Device {
  if (!userAgent) return 'desktop';
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/.test(ua))
    return 'tablet';
  if (/mobi|iphone|ipod|android|blackberry|iemobile|opera mini/.test(ua))
    return 'mobile';
  return 'desktop';
}

/**
 * AI assistants, checked before everything else.
 *
 * Order matters: gemini.google.com and copilot.microsoft.com would otherwise
 * match the search-engine pattern and be reported as ordinary search traffic,
 * hiding exactly the number the llms.txt work exists to move.
 */
const AI_ASSISTANTS =
  /^(chatgpt\.com|chat\.openai\.com|openai\.com)$|^(claude\.ai|anthropic\.com)$|^gemini\.google\.com$|^bard\.google\.com$|^(perplexity\.ai|www\.perplexity\.ai)$|^copilot\.microsoft\.com$|^(grok\.com|x\.ai)$|^(deepseek\.com|chat\.deepseek\.com)$|^(mistral\.ai|chat\.mistral\.ai)$|^poe\.com$|^you\.com$|^phind\.com$/i;

const SEARCH_ENGINES =
  /google|bing|yahoo|duckduckgo|baidu|yandex|ecosia|brave|startpage|qwant/i;
const SOCIAL =
  /facebook|instagram|twitter|^t\.co$|linkedin|pinterest|youtube|whatsapp|reddit|tiktok|threads|telegram/i;

/** Hostname only — we never store a full referring URL. */
export function referrerHost(
  referrer: string | null | undefined,
): string | null {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '');
    return host || null;
  } catch {
    return null;
  }
}

export function classifySource(
  referrer: string | null | undefined,
  selfHost: string | null | undefined,
): Source {
  const host = referrerHost(referrer);
  if (!host) return 'direct';
  if (selfHost && host === selfHost.replace(/^www\./, '')) return 'internal';
  if (AI_ASSISTANTS.test(host)) return 'ai';
  if (SEARCH_ENGINES.test(host)) return 'organic';
  if (SOCIAL.test(host)) return 'social';
  return 'referral';
}

/**
 * Normalises a path for storage: strips query strings and fragments, drops a
 * trailing slash, and caps length so a crafted URL cannot bloat the table.
 */
export function normalisePath(input: string): string | null {
  if (!input || typeof input !== 'string') return null;
  let path = input.split('?')[0].split('#')[0].trim();
  if (!path.startsWith('/')) return null;
  if (path.length > 1) path = path.replace(/\/+$/, '') || '/';
  if (path.length > 512) return null;
  // Ignore asset and internal requests.
  if (/^\/(_next|api|favicon|robots|sitemap|uploads|llms)/.test(path))
    return null;
  return path;
}
