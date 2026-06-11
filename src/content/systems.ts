import type { EnterpriseSystem } from './types';

export const translatedIntro =
  'Our intelligence adapts to your existing platforms — no replacements, no disruption.';

export const microLabels = [
  'Data normalization',
  'Workflow orchestration',
  'Decision enrichment',
  'Compliance translation',
];

export const systems: EnterpriseSystem[] = [
  { name: 'SAP', microText: 'ERP workflow orchestration', outcome: 'Streamlined operations across your ERP' },
  { name: 'Oracle', microText: 'Database-driven intelligence', outcome: 'Real-time insights from your data' },
  { name: 'MS Dynamics', microText: 'Business process automation', outcome: 'Automated workflows that save time' },
  { name: 'O365', microText: 'Collaboration data integration', outcome: 'Unified communication across teams' },
  { name: 'Zoho', microText: 'CRM workflow synchronization', outcome: 'Seamless customer relationship management' },
  { name: 'Tally', microText: 'Accounting data normalization', outcome: 'Accurate financial reporting' },
  { name: 'Banking APIs', microText: 'Financial transaction intelligence', outcome: 'Secure, real-time payment processing' },
  { name: 'Payment Systems', microText: 'Payment flow orchestration', outcome: 'Frictionless payment experiences' },
  { name: 'Customs APIs', microText: 'Compliance document automation', outcome: 'Automated customs clearance' },
  { name: 'Internal ERPs', microText: 'Legacy system modernization', outcome: 'Legacy systems, modern intelligence' },
];
