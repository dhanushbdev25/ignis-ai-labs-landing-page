import type { Pillar, Service } from './types';

export const appliedIntro =
  'Four disciplines, one engineering culture. We work the raw material of enterprise complexity — systems, data, workflows — into intelligence that holds its shape under load.';

export const pillars: Pillar[] = [
  {
    index: '01',
    title: 'Software & Platforms',
    items: ['Full-stack web + mobile', 'Platforms, portals, products', 'Cloud + DevOps + modernization'],
  },
  {
    index: '02',
    title: 'Enterprise Systems & Integrations',
    items: ['ERP workflows', 'Finance & compliance', 'SAP + 3rd-party integrations'],
  },
  {
    index: '03',
    title: 'Analytics & AI',
    items: ['Data pipelines & AI automation', 'Dashboards + insights', 'Forecasting + decision support'],
  },
  {
    index: '04',
    title: 'Consulting',
    items: ['Architecture & solution design', 'Integration consulting', 'Fractional leadership (CTO / Tech Lead)'],
  },
];

export const services: Service[] = [
  { index: '01', title: 'Software Engineering', description: 'Custom platforms, cloud-native systems, resilient delivery.' },
  { index: '02', title: 'AI & ML Engineering', description: 'Production-grade models, pipelines, model ops.' },
  { index: '03', title: 'Business & Financial Analysis', description: 'Forecasting, scenario modelling, decision systems.' },
  { index: '04', title: 'UX & Product Design', description: 'Minimal product systems, rapid prototyping.' },
  { index: '05', title: 'Third-Party Integrations', description: 'SAP, ERP, CRM, logistics and communication connectors.' },
  { index: '06', title: 'Power BI & Analytics', description: 'Operational dashboards and governance.' },
];
