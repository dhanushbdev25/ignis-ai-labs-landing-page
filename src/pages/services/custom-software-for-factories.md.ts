export const prerender = true;

import type { APIRoute } from 'astro';
import { servicesCustom } from '../../content/pages-content';
import { generatePageMarkdown } from '../../lib/seo/markdown-generator';

export const GET: APIRoute = async () => {
  return new Response(generatePageMarkdown(servicesCustom), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};

