import type { Project } from './types';

export const deployedIntro =
  "Systems we've built and deployed for warehouse, logistics and production teams.";

export const projects: Project[] = [
  {
    meta: 'PRODUCTION · PROCESS DIGITALIZATION',
    title: 'Production Routing Chart (PRC)',
    impact:
      'A customizable routing chart application that digitalizes any production process, with step-by-step routing and automated approvals. Built for composites and fiber moulding.',
    visual: 'document-assembly',
    caseStudyHref: '/case-studies/production-routing-chart',
    solutionHref: '/solutions/production-routing-chart',
  },
  {
    meta: 'WAREHOUSE · INVENTORY',
    title: 'Warehouse Management System (WMS)',
    impact:
      'Real-time stock tracking and optimized picking for a [client type] distribution center.',
    visual: 'warehouse-grid',
    caseStudyHref: '/case-studies/warehouse-management-system',
    solutionHref: '/solutions/warehouse-management-system',
  },
  {
    meta: 'LOGISTICS · CUSTOMS AUTOMATION',
    title: 'Import/Export Workflow Handler',
    impact:
      'Import and export management for [client type], with customs documents generated automatically and compliance tracked in one place.',
    visual: 'logistics-flow',
    caseStudyHref: '/case-studies/import-export-workflow-handler',
    solutionHref: '/solutions/logistics-software',
  },
];
