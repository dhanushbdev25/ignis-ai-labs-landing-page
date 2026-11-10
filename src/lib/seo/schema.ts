import { site } from '../../content/site';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function generateOrganizationSchema() {
  return {
    '@type': 'Organization',
    '@id': `${site.url}/#organization`,
    name: 'Ignis AI Labs',
    url: site.url,
    logo: `${site.url}/images/systems/Ignis logo Dark Theme.svg`,
    description: site.description,
    email: site.email,
    telephone: site.phone,
    areaServed: 'India and worldwide',
    sameAs: [
      'https://www.linkedin.com/company/ignisailabs',
      'https://www.instagram.com/ignis_ai_labs',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: site.phone,
      contactType: 'Customer Service',
      email: site.email,
      areaServed: 'India and worldwide',
      availableLanguage: ['English'],
    },
  };
}

export function generateWebSiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    name: 'Ignis AI Labs',
    url: site.url,
    description: site.description,
    publisher: {
      '@id': `${site.url}/#organization`,
    },
  };
}

export function generateServicesSchema() {
  return [
    {
      '@type': 'Service',
      '@id': `${site.url}/#service-factory-digitalization`,
      name: 'Factory Digitalization',
      serviceType: 'Factory Digitalization Software',
      provider: { '@id': `${site.url}/#organization` },
      areaServed: 'India and worldwide',
      description:
        'End-to-end plant digitalization replacing paper sheets, whiteboards and isolated spreadsheets with real-time digital routing, operator inputs and machine visibility.',
    },
    {
      '@type': 'Service',
      '@id': `${site.url}/#service-sap-integration`,
      name: 'SAP & System Integration',
      serviceType: 'Enterprise System Integration',
      provider: { '@id': `${site.url}/#organization` },
      areaServed: 'India and worldwide',
      description:
        'Two-way plant floor connectivity with SAP S/4HANA, ECC, Oracle, Zoho, Tally, banking APIs and custom internal databases without replacing existing core systems.',
    },
    {
      '@type': 'Service',
      '@id': `${site.url}/#service-ai-automation`,
      name: 'AI & Process Automation',
      serviceType: 'AI Engineering & Automation',
      provider: { '@id': `${site.url}/#organization` },
      areaServed: 'India and worldwide',
      description:
        'Agentic operational workflows, automated anomaly detection, inventory forecasting and production throughput dashboards for industrial facilities.',
    },
    {
      '@type': 'Service',
      '@id': `${site.url}/#service-custom-software`,
      name: 'Custom Software Development for Factories',
      serviceType: 'Custom Software Engineering',
      provider: { '@id': `${site.url}/#organization` },
      areaServed: 'India and worldwide',
      description:
        'Custom web, mobile and edge software engineered for specific factory workstations, quality assurance checkpoints and plant operations.',
    },
  ];
}

export function generateSoftwareApplicationSchemas() {
  return [
    {
      '@type': 'SoftwareApplication',
      '@id': `${site.url}/#app-prc`,
      name: 'Production Routing Chart (PRC)',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: `${site.url}/solutions/production-routing-chart`,
      description:
        'Customizable production routing and approval application that tracks parts, stages, quality approvals and cycle times for composites, fiber moulding and manufacturing plants.',
      publisher: { '@id': `${site.url}/#organization` },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${site.url}/#app-wms`,
      name: 'Warehouse Management System (WMS)',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: `${site.url}/solutions/warehouse-management-system`,
      description:
        'Real-time raw material, WIP and finished goods tracking with optimized picking paths, barcode scanning and dispatch management for plant warehouses.',
      publisher: { '@id': `${site.url}/#organization` },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${site.url}/#app-erp`,
      name: 'Manufacturing ERP',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: `${site.url}/solutions/erp-for-manufacturers`,
      description:
        'Lightweight, responsive ERP connecting shop floor production, inventory counts, purchasing and plant-level finance without legacy bloat.',
      publisher: { '@id': `${site.url}/#organization` },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${site.url}/#app-logistics`,
      name: 'Logistics & Import/Export Workflow Handler',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: `${site.url}/solutions/logistics-software`,
      description:
        'Automated dispatch documentation, customs compliance generation and carrier tracking for domestic shipments and international freight.',
      publisher: { '@id': `${site.url}/#organization` },
    },
  ];
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateFaqSchema(faqs: FaqItem[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

