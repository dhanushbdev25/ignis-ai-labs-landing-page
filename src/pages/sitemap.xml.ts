export const prerender = true;

import type { APIRoute } from 'astro';
import { site } from '../content/site';

const PUBLIC_PATHS = [
  '/',
  '/about',
  '/case-studies',
  '/case-studies/production-routing-chart',
  '/case-studies/warehouse-management-system',
  '/case-studies/import-export-workflow-handler',
  '/contact',
  '/faq',
  '/industries/composites-and-fiber-moulding',
  '/services/ai-automation-for-manufacturing',
  '/services/custom-software-for-factories',
  '/services/sap-and-system-integration',
  '/solutions/erp-for-manufacturers',
  '/solutions/logistics-software',
  '/solutions/production-routing-chart',
  '/solutions/warehouse-management-system',
];

export const GET: APIRoute = async () => {
  const urlsXml = PUBLIC_PATHS.map((path) => {
    const loc = path === '/' ? `${site.url}/` : `${site.url}${path}`;
    return `  <url>\n    <loc>${loc}</loc>\n  </url>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};

