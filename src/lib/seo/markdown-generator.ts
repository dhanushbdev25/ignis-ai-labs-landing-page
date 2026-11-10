import type { PageContent } from '../../content/pages-content';

export function generatePageMarkdown(page: PageContent): string {
  const whoForList = page.whoThisIsFor.map((item) => `- ${item}`).join('\n');
  const problemsList = page.keyProblemsSolved.map((item) => `- ${item}`).join('\n');

  const stepsList = page.howItWorks
    .map((step) => `### Step ${step.step}: ${step.title}\n${step.description}`)
    .join('\n\n');

  const featuresList = page.featuresOrSpecs
    .map((feat) => `### ${feat.title}\n${feat.description}`)
    .join('\n\n');

  const faqsList = page.faqs
    .map((faq) => `### Q: ${faq.question}\n**A:** ${faq.answer}`)
    .join('\n\n');

  return `# ${page.h1}

> **Definition:** ${page.definition}
> **Target Audience:** ${whoForList.replace(/\n/g, ' ')}
> **Service Area:** India and worldwide
> **Last Updated:** ${page.lastUpdated}
> **Canonical URL:** ${page.url}

## Executive Summary
${page.lead}

## Who This Is For
${whoForList}

## Key Operational Bottlenecks Solved
${problemsList}

## How It Works: Step-by-Step
${stepsList}

## Technical Capabilities and Features
${featuresList}

## Frequently Asked Questions
${faqsList}

---
*Published by Ignis AI Labs (https://ignisailabs.com). Engineering and AI studio for manufacturing plants, warehouses, and logistics operators across India and worldwide. Direct inquiries: contact@ignisailabs.com*
`;
}

