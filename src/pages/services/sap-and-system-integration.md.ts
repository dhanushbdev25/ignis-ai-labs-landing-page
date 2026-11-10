export const prerender = true;

import type { APIRoute } from 'astro';
import { servicesSAP } from '../../content/pages-content';
import { generatePageMarkdown } from '../../lib/seo/markdown-generator';

export const GET: APIRoute = async () => {
  return new Response(generatePageMarkdown(servicesSAP), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};

