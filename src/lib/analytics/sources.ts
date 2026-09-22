/**
 * Referring hostnames, turned into the names people actually use.
 *
 * The tracker stores the bare hostname ("chatgpt.com"), never a full URL, so
 * this is presentation only — nothing here changes what is recorded.
 */
const EXACT: Record<string, string> = {
  // Search
  'google.com': 'Google',
  'bing.com': 'Bing',
  'duckduckgo.com': 'DuckDuckGo',
  'yahoo.com': 'Yahoo',
  'ecosia.org': 'Ecosia',
  'search.brave.com': 'Brave Search',
  'yandex.com': 'Yandex',

  // AI assistants
  'chatgpt.com': 'ChatGPT',
  'chat.openai.com': 'ChatGPT',
  'openai.com': 'ChatGPT',
  'claude.ai': 'Claude',
  'anthropic.com': 'Claude',
  'gemini.google.com': 'Gemini',
  'bard.google.com': 'Gemini',
  'perplexity.ai': 'Perplexity',
  'copilot.microsoft.com': 'Microsoft Copilot',
  'grok.com': 'Grok',
  'x.ai': 'Grok',
  'deepseek.com': 'DeepSeek',
  'chat.deepseek.com': 'DeepSeek',
  'poe.com': 'Poe',
  'you.com': 'You.com',
  'phind.com': 'Phind',

  // Social and messaging
  'instagram.com': 'Instagram',
  'l.instagram.com': 'Instagram',
  'facebook.com': 'Facebook',
  'l.facebook.com': 'Facebook',
  'm.facebook.com': 'Facebook',
  'lm.facebook.com': 'Facebook',
  'linkedin.com': 'LinkedIn',
  'lnkd.in': 'LinkedIn',
  'youtube.com': 'YouTube',
  'youtu.be': 'YouTube',
  'pinterest.com': 'Pinterest',
  'in.pinterest.com': 'Pinterest',
  'wa.me': 'WhatsApp',
  'whatsapp.com': 'WhatsApp',
  'web.whatsapp.com': 'WhatsApp',
  't.co': 'X (Twitter)',
  'x.com': 'X (Twitter)',
  'twitter.com': 'X (Twitter)',
  'reddit.com': 'Reddit',
  'out.reddit.com': 'Reddit',
  'tiktok.com': 'TikTok',
  'threads.net': 'Threads',
  'threads.com': 'Threads',
  't.me': 'Telegram',
  'quora.com': 'Quora',

  // Places an interior studio actually gets found
  'houzz.in': 'Houzz',
  'houzz.com': 'Houzz',
  'justdial.com': 'JustDial',
  'sulekha.com': 'Sulekha',
  'indiamart.com': 'IndiaMART',
  'magicbricks.com': 'MagicBricks',
  '99acres.com': '99acres',
  'housing.com': 'Housing.com',
};

/**
 * Anything not in the table keeps its hostname, minus a leading "www." and a
 * regional Google suffix, so google.co.in and google.com are one row rather
 * than two.
 */
export function sourceName(host: string | null | undefined): string {
  if (!host) return 'Direct';

  const clean = host
    .trim()
    .toLowerCase()
    .replace(/^www\./, '');
  if (!clean) return 'Direct';
  if (EXACT[clean]) return EXACT[clean];

  // google.co.in, google.co.uk, google.de … all read as Google.
  if (/^(www\.)?google\.[a-z.]{2,7}$/.test(clean)) return 'Google';
  if (/^(news|mail|images|translate)\.google\.[a-z.]{2,7}$/.test(clean)) {
    return 'Google';
  }
  if (/\.bing\.com$/.test(clean)) return 'Bing';
  if (/\.perplexity\.ai$/.test(clean)) return 'Perplexity';

  return clean;
}

/** Display names for the bucketed `source` column. */
export const SOURCE_LABELS: Record<string, string> = {
  organic: 'Search engines',
  ai: 'AI assistants',
  direct: 'Direct',
  referral: 'Other websites',
  social: 'Social media',
};
