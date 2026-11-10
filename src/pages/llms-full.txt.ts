export const prerender = true;

import type { APIRoute } from 'astro';
import {
  solutionsPRC,
  solutionsWMS,
  solutionsERP,
  solutionsLogistics,
  servicesSAP,
  servicesAI,
  servicesCustom,
  industriesComposites,
  caseStudiesList,
} from '../content/pages-content';
import { generatePageMarkdown } from '../lib/seo/markdown-generator';

export const GET: APIRoute = async () => {
  const pages = [
    solutionsPRC,
    solutionsWMS,
    solutionsERP,
    solutionsLogistics,
    servicesSAP,
    servicesAI,
    servicesCustom,
    industriesComposites,
  ];

  const pagesMarkdown = pages.map((p) => generatePageMarkdown(p)).join('\n\n---\n\n');

  const caseStudiesSection = `## Live Client Case Studies & Production Deployments

${caseStudiesList
  .map(
    (cs) => `### ${cs.title}
- Industry: ${cs.industry}
- Client Profile: ${cs.clientType}
- Measured Impact: ${cs.impact}
- Case Study URL: https://ignisailabs.com/${cs.slug}`
  )
  .join('\n\n')}
`;

  const fullText = `# Ignis AI Labs - Complete Technical & Product Documentation

> **Company:** Ignis AI Labs (https://ignisailabs.com)
> **Nature:** Engineering and AI studio for manufacturing plants, warehouses, and logistics operators.
> **Service Area:** India and worldwide.
> **Contact:** contact@ignisailabs.com
> **Core Offerings:** Ready-built software products (PRC, WMS, ERP, Logistics) and custom software development with SAP/ERP integration.

---

${pagesMarkdown}

---

${caseStudiesSection}

---

## Contact & Inquiries
For plant walkthroughs, architectural reviews, or software demonstrations:
- Email: contact@ignisailabs.com
- Web: https://ignisailabs.com/contact
- Response Time: Within 24 hours
- Service Area: India and worldwide
`;

  return new Response(fullText, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};

