import type { Pillar, Service } from './types';

export const appliedIntro =
  'Ready-built products plus custom integration and AI, so you can digitalize production without replacing the systems you already run.';

export const pillars: Pillar[] = [
  {
    index: '01',
    title: 'Products: WMS, ERP, Logistics and PRC',
    description: 'Ready-built systems you can deploy and customize.',
    items: ['Ready-built WMS & ERP', 'Logistics & PRC systems', 'Deploy & customize'],
  },
  {
    index: '02',
    title: 'SAP and System Integration',
    description: 'Connect your plant to SAP and any third-party system.',
    items: ['SAP S/4HANA & ECC', 'Third-party & legacy systems', 'Plant-wide data sync'],
  },
  {
    index: '03',
    title: 'AI and Automation',
    description: 'Agentic workflows, data pipelines and dashboards.',
    items: ['Agentic workflows', 'Data pipelines', 'Operational dashboards'],
  },
  {
    index: '04',
    title: 'Custom Software and Consulting',
    description: 'Software for any factory process, plus architecture advice.',
    items: ['Factory process software', 'Architecture advice', 'Strategic tech consulting'],
  },
];

export const capabilities = pillars;

export const services: Service[] = [
  { index: '01', title: 'Software Engineering', description: 'Custom platforms, cloud-native systems, resilient delivery.' },
  { index: '02', title: 'AI & ML Engineering', description: 'Production-grade models, pipelines, model ops.' },
  { index: '03', title: 'Business & Financial Analysis', description: 'Forecasting, scenario modelling, decision systems.' },
  { index: '04', title: 'UX & Product Design', description: 'Minimal product systems, rapid prototyping.' },
  { index: '05', title: 'Third-Party Integrations', description: 'SAP, ERP, CRM, logistics and communication connectors.' },
  { index: '06', title: 'Power BI & Analytics', description: 'Operational dashboards and governance.' },
];
