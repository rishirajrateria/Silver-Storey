import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/site';

/**
 * Explicitly welcomes search engines AND AI/LLM crawlers so the site is
 * eligible for AI answers (ChatGPT, Gemini, Claude, Perplexity, Copilot).
 *
 * What is NOT blocked matters as much: /_next/ holds every stylesheet and
 * script, and Google renders pages before ranking them, so blocking it means
 * Google sees an unstyled page. /api/og is the share-preview image for most
 * pages, so it is allowed explicitly ahead of the /api/ rule.
 */
export default function robots(): MetadataRoute.Robots {
  const allow = ['/', '/api/og'];
  const disallow = ['/api/', '/admin/', '/search', '/track'];
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
      { userAgent: '*', allow, disallow },
      { userAgent: 'Googlebot', allow, disallow },
      { userAgent: 'Bingbot', allow, disallow },
      { userAgent: aiBots, allow, disallow },
    ],
    // The index lists the section sitemaps; repeating them here is redundant.
    sitemap: `${SITE_URL}/sitemap-index.xml`,
  };
}
