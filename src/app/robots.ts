import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/site';

/**
 * Explicitly welcomes search engines AND AI/LLM crawlers so the site is
 * eligible for AI answers (ChatGPT, Gemini, Claude, Perplexity, Copilot).
 */
export default function robots(): MetadataRoute.Robots {
  const disallow = ['/api/', '/studio/', '/_next/'];
  const aiBots = [
    'GPTBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'ClaudeBot',
    'Claude-User',
    'Claude-SearchBot',
    'anthropic-ai',
    'Google-Extended',
    'GoogleOther',
    'PerplexityBot',
    'Perplexity-User',
    'Bytespider',
    'CCBot',
    'Applebot',
    'Applebot-Extended',
    'Amazonbot',
    'meta-externalagent',
    'DuckAssistBot',
    'YouBot',
    'cohere-ai',
    'MistralAI-User',
  ];
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow },
      { userAgent: 'Googlebot', allow: '/', disallow },
      { userAgent: 'Bingbot', allow: '/', disallow },
      { userAgent: aiBots, allow: '/', disallow },
    ],
    sitemap: [
      `${SITE_URL}/sitemap-index.xml`,
      `${SITE_URL}/sitemap/0.xml`,
      `${SITE_URL}/sitemap/1.xml`,
      `${SITE_URL}/sitemap/2.xml`,
      `${SITE_URL}/sitemap/3.xml`,
    ],
    host: SITE_URL,
  };
}
