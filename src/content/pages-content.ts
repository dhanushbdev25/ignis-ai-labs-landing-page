export interface PageContent {
  slug: string;
  url: string;
  markdownUrl: string;
  title: string; // Under 60 chars
  metaDescription: string; // Under 155 chars
  targetKeyword: string;
  eyebrow: string;
  h1: string;
  lead: string; // Answer-first 2-3 sentences
  definition: string;
  whoThisIsFor: string[];
  keyProblemsSolved: string[];
  howItWorks: Array<{ step: string; title: string; description: string }>;
  featuresOrSpecs: Array<{ title: string; description: string }>;
  faqs: Array<{ question: string; answer: string }>;
  breadcrumbs: Array<{ name: string; url: string }>;
  lastUpdated: string;
}

export const solutionsPRC: PageContent = {
  slug: 'solutions/production-routing-chart',
  url: 'https://ignisailabs.com/solutions/production-routing-chart',
  markdownUrl: 'https://ignisailabs.com/solutions/production-routing-chart.md',
  title: 'Production Routing Chart (PRC) | Ignis AI Labs',
  metaDescription:
    'Digital production routing and approval software for composites, moulding and discrete manufacturing plants. Works with or without SAP.',
  targetKeyword: 'production routing software for moulding companies',
  eyebrow: 'Production Software / PRC',
  h1: 'Production Routing Chart (PRC) for Manufacturing Plants',
  lead:
    'Production Routing Chart (PRC) is an application that replaces paper traveler cards and clipboards with digital stage-by-stage job tracking. Built specifically for composites, fiber moulding and custom manufacturing, it records operator sign-offs, inspection checkpoints and cycle times on the plant floor. Operators get clear job instructions on touchscreen tablets while plant managers see job status in real time.',
  definition:
    'Production Routing Chart (PRC) is digital route-card software that tracks manufactured parts through cutting, layup, curing, machining, inspection and dispatch with mandatory approvals at each gate.',
  whoThisIsFor: [
    'Composites, FRP and fiber moulding factories running high-mix multi-stage parts.',
    'Discrete manufacturing plants with multi-stage fabrication and required quality sign-offs.',
    'Production heads who want to eliminate lost paperwork, missing traveler cards and untracked scrap.',
    'Quality managers who need timestamped traceability for audits without manual filing.',
  ],
  keyProblemsSolved: [
    'Paper traveler sheets getting lost, soaked in resin or damaged on the shop floor.',
    'Inability to see which batch is currently at curing, trimming or final inspection without walking the floor.',
    'Skipped quality approval steps because paper signatures are signed off after the fact.',
    'Delayed cost accounting because part labor and machine times take days to enter into spreadsheets.',
  ],
  howItWorks: [
    {
      step: '01',
      title: 'Define Work Centers and Approval Gates',
      description:
        'Map your plant flow: material issue, mold prep, lamination, oven cure, trimming, testing and packing. Configure which steps require technician or supervisor sign-off before advancing.',
    },
    {
      step: '02',
      title: 'Barcode or QR Part Tracking',
      description:
        'Print durable barcodes or QR codes at job release. Operators scan traveler badges using rugged floor tablets or handheld scanners at every station.',
    },
    {
      step: '03',
      title: 'Digital Sign-Off and Parameter Logging',
      description:
        'Operators enter actual weights, resin batch numbers, curing temperatures and inspection measurements. The system locks progression if required thresholds are missed.',
    },
    {
      step: '04',
      title: 'Real-Time Plant Dashboard and ERP Sync',
      description:
        'Floor progress syncs directly to your plant dashboard and pushes completed stage logs to SAP, Oracle or your internal ERP.',
    },
  ],
  featuresOrSpecs: [
    {
      title: 'Configurable Routing Templates',
      description:
        'Create unique routing templates per part number or customize routes on the fly for rework and prototype runs.',
    },
    {
      title: 'Quality Gate Enforcement',
      description:
        'Prevent a component from moving to machining until the curing inspection checklist is digitally approved by QA.',
    },
    {
      title: 'Sub-Assembly & Batch Tracking',
      description:
        'Link component parts and chemical batches to finished assemblies for complete backwards traceability during warranty or quality reviews.',
    },
    {
      title: 'ERP & SAP Connectors',
      description:
        'Pass work order progress, scrap counts and completed unit receipts directly to your enterprise system via REST APIs, RFC or database connectors.',
    },
  ],
  faqs: [
    {
      question: 'Can PRC work with our existing SAP or ERP system?',
      answer:
        'Yes. PRC integrates with SAP S/4HANA, SAP ECC, Oracle, MS Dynamics, and custom ERPs using standard APIs, RFCs or scheduled database synchronization. Production orders can be imported from SAP, and stage completions are pushed back automatically.',
    },
    {
      question: 'Do plant operators need extensive training to use PRC?',
      answer:
        'No. The shop floor interface is designed for touchscreen tablets with large touch targets, minimal typing, barcode scanning, and multi-language support so operators learn it within one shift.',
    },
    {
      question: 'What hardware is required on the shop floor?',
      answer:
        'PRC runs as a responsive web application on any standard browser. Plants typically use 10-inch Android or Windows tablets mounted on protective enclosures, or rugged industrial handhelds with built-in barcode scanners.',
    },
    {
      question: 'Can we modify routing steps for custom one-off orders?',
      answer:
        'Yes. Authorized supervisors can duplicate an existing template, insert or skip specific steps, and attach customer drawing revisions before dispatching the order to the floor.',
    },
    {
      question: 'How long does a typical PRC deployment take?',
      answer:
        'A single production line deployment typically takes [TODO: 3 to 6 weeks] from workflow mapping to operator go-live, depending on ERP integration requirements.',
    },
  ],
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Solutions', url: '/#capabilities' },
    { name: 'Production Routing Chart (PRC)', url: '/solutions/production-routing-chart' },
  ],
  lastUpdated: 'November 2026',
};

export const solutionsWMS: PageContent = {
  slug: 'solutions/warehouse-management-system',
  url: 'https://ignisailabs.com/solutions/warehouse-management-system',
  markdownUrl: 'https://ignisailabs.com/solutions/warehouse-management-system.md',
  title: 'Warehouse Management System (WMS) | Ignis AI Labs',
  metaDescription:
    'Industrial WMS for manufacturing plants and distribution centers. Real-time stock tracking, bin management, and barcode-guided picking.',
  targetKeyword: 'WMS for manufacturing plants',
  eyebrow: 'Warehouse Software / WMS',
  h1: 'Warehouse Management System (WMS) for Plant Operations',
  lead:
    'Ignis WMS is an inventory and warehouse management system engineered for industrial plants and distribution facilities. It manages raw material staging, WIP storage, and finished goods dispatch with bin-level accuracy. By replacing paper pick lists with barcode-guided routes, warehouse teams pick faster and eliminate stockout surprises.',
  definition:
    'Ignis WMS is software that controls the receipt, storage, movement, picking, and dispatch of materials inside manufacturing warehouses and supply chain depots.',
  whoThisIsFor: [
    'Manufacturing plants managing raw materials, chemical batches, sub-assemblies, and finished goods.',
    'Distribution centers experiencing dispatch errors, lost inventory, or high picking times.',
    'Supply chain managers who need accurate bin-level visibility without doing manual cycle counts every weekend.',
    'Operations teams running multi-zone warehouses across ambient and cold storage locations.',
  ],
  keyProblemsSolved: [
    'Operators spending 20 minutes searching warehouse racks for misplaced raw materials.',
    'Accidental shipment of wrong items or expired batch codes.',
    'Inaccurate ERP inventory counts caused by delayed manual entry of floor movements.',
    'Inefficient picking paths where workers crisscross the warehouse floor multiple times per order.',
  ],
  howItWorks: [
    {
      step: '01',
      title: 'Inbound Receiving and GRN Generation',
      description:
        'Scan incoming vendor purchase orders, verify supplier quantities, generate pallet or bin barcode labels, and automatically log Goods Receipt Notes (GRN).',
    },
    {
      step: '02',
      title: 'Directed Putaway to Optimal Bins',
      description:
        'The system directs operators to exact aisle, rack, and bin locations based on item weight, turnover velocity, and chemical compatibility.',
    },
    {
      step: '03',
      title: 'Optimized Picking and Wave Allocation',
      description:
        'Batch multiple work orders or customer shipments into single-pass pick paths with shortest walking distance algorithms.',
    },
    {
      step: '04',
      title: 'Packing Verification and Dispatch Clearance',
      description:
        'Scan items into shipping cartons, print delivery challans, and sync dispatch confirmation back to SAP, Oracle, or transport partners.',
    },
  ],
  featuresOrSpecs: [
    {
      title: 'Bin & Location Management',
      description:
        'Configure multi-level warehouse hierarchies: zone, aisle, rack, shelf, and bin with volumetric limits and storage rules.',
    },
    {
      title: 'FIFO and Batch / Lot Traceability',
      description:
        'Enforce First-In-First-Out (FIFO) or First-Expired-First-Out (FEFO) to prevent material obsolescence and preserve batch integrity.',
    },
    {
      title: 'Barcode & QR Mobile Scanning',
      description:
        'Support for 1D/2D barcodes on Android mobile computers (Zebra, Honeywell, Datalogic) and consumer mobile devices.',
    },
    {
      title: 'ERP Inventory Synchronization',
      description:
        'Real-time inventory updates sent to ERP systems on every stock movement, receipt, scrap write-off, and sales dispatch.',
    },
  ],
  faqs: [
    {
      question: 'Does Ignis WMS work alongside SAP or Oracle ERP?',
      answer:
        'Yes. Ignis WMS acts as the execution layer on the floor, while SAP or Oracle remains your system of record for accounting. Purchase orders and sales orders flow down into WMS, and physical movements flow up in real time.',
    },
    {
      question: 'Can the WMS handle raw materials, WIP, and finished goods in the same plant?',
      answer:
        'Yes. You can segregate stock into distinct logical or physical warehouses, such as Raw Material Stores, Quarantine, Floor WIP, and Finished Goods Dispatch.',
    },
    {
      question: 'Does it support offline scanning if warehouse Wi-Fi drops?',
      answer:
        'Yes. Mobile handheld scanners store scans locally in memory and sync queues automatically once network connectivity is re-established.',
    },
    {
      question: 'Can we generate barcode labels directly from the system?',
      answer:
        'Yes. Ignis WMS connects directly to industrial thermal barcode printers (Zebra ZPL, TSC, Honeywell) to print bin labels, item tags, and master pallet stickers on demand.',
    },
    {
      question: 'How quickly can warehouse workers be trained?',
      answer:
        'Because the mobile app uses guided step-by-step screens (scan bin, scan item, enter quantity), most warehouse operators become proficient within two shifts.',
    },
  ],
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Solutions', url: '/#capabilities' },
    { name: 'Warehouse Management System (WMS)', url: '/solutions/warehouse-management-system' },
  ],
  lastUpdated: 'November 2026',
};

export const solutionsERP: PageContent = {
  slug: 'solutions/erp-for-manufacturers',
  url: 'https://ignisailabs.com/solutions/erp-for-manufacturers',
  markdownUrl: 'https://ignisailabs.com/solutions/erp-for-manufacturers.md',
  title: 'Manufacturing ERP Software | Ignis AI Labs',
  metaDescription:
    'Tailored ERP for mid-size manufacturers. Connect production, raw material inventory, purchasing and finance without legacy complexity.',
  targetKeyword: 'ERP for small and mid-size factories',
  eyebrow: 'Enterprise Systems / ERP',
  h1: 'ERP Software Built for Mid-Size Manufacturing Plants',
  lead:
    'Ignis Manufacturing ERP connects plant production, inventory control, purchase orders, customer delivery, and financial tracking into a single unified platform. Unlike rigid legacy ERPs that require months of expensive customization, our system is engineered around actual plant workflows. Your operations team gets accurate production cost figures and clear stock status without wading through hundreds of unnecessary menus.',
  definition:
    'Manufacturing ERP is enterprise resource planning software specifically designed to coordinate production scheduling, bill of materials (BOM), procurement, inventory, and plant finance.',
  whoThisIsFor: [
    'Factories outgrowing Tally or basic accounting tools that need real manufacturing resource planning.',
    'Plant owners tired of expensive maintenance fees and sluggish interfaces from legacy ERP providers.',
    'Multi-site manufacturing operations that need real-time data consolidation across plant locations.',
    'Job shops and discrete manufacturers that manage multi-level Bills of Materials (BOM).',
  ],
  keyProblemsSolved: [
    'Disconnected spreadsheets for production planning, purchase orders, and accounting causing stock shortfalls.',
    'Lack of true unit-level production cost visibility (raw materials + direct labor + overheads).',
    'Procurement ordering raw materials too late or ordering items already sitting forgotten in another warehouse bay.',
    'Financial statements delayed by weeks because floor inventory counts take days to reconcile.',
  ],
  howItWorks: [
    {
      step: '01',
      title: 'BOM and Routing Setup',
      description:
        'Define raw material ratios, sub-components, machine center allocations, and scrap allowances for every finished product.',
    },
    {
      step: '02',
      title: 'Sales Orders to Production Scheduling',
      description:
        'Convert customer purchase orders into automated material requirements planning (MRP) and shop floor job tickets.',
    },
    {
      step: '03',
      title: 'Automated Procurement and Supplier Tracking',
      description:
        'Trigger supplier purchase requests when inventory levels breach minimum safety stock thresholds.',
    },
    {
      step: '04',
      title: 'Finished Goods Accounting and Invoicing',
      description:
        'Generate GST-compliant invoices, track accounts receivable, and calculate gross margin per production batch automatically.',
    },
  ],
  featuresOrSpecs: [
    {
      title: 'Multi-Level Bill of Materials (BOM)',
      description:
        'Create complex hierarchical BOMs with revision control, substitute material definitions, and byproduct tracking.',
    },
    {
      title: 'Material Requirements Planning (MRP)',
      description:
        'Forecast raw material purchase requirements based on open sales orders, lead times, and current stock on hand.',
    },
    {
      title: 'Live Work-In-Progress (WIP) Valuation',
      description:
        'Calculate true job costs including direct materials, allocated operator hours, and machine utility rates.',
    },
    {
      title: 'Modular Architecture',
      description:
        'Deploy only the modules you need: Production, Inventory, Procurement, Sales, or Accounting, and expand as your factory scales.',
    },
  ],
  faqs: [
    {
      question: 'How does Ignis ERP differ from large systems like SAP S/4HANA?',
      answer:
        'Tier-1 ERPs like SAP require millions in license costs, large consultant teams, and months of configuration. Ignis ERP provides the core manufacturing workflows mid-size plants actually use: BOM, production orders, inventory, and finance, at a fraction of the cost and timeline.',
    },
    {
      question: 'Can we import historical data from Tally or our existing spreadsheets?',
      answer:
        'Yes. We provide standard data migration pipelines for master items, vendor ledgers, customer records, and opening inventory balances.',
    },
    {
      question: 'Is the system cloud-hosted or on-premise?',
      answer:
        'Both options are available. We host on secure cloud servers with automated daily backups, or deploy locally on your plant network if your compliance policies require on-premise infrastructure.',
    },
    {
      question: 'Can it handle tax compliance like GST and export documentation?',
      answer:
        'Yes. The invoicing module supports e-invoicing, e-way bills, tax deduction records, and export challans compliant with national regulations.',
    },
    {
      question: 'What is the licensing model?',
      answer:
        'We offer transparent licensing without arbitrary per-user penalty fees, making it cost-effective to grant access to supervisors, operators, and executives alike.',
    },
  ],
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Solutions', url: '/#capabilities' },
    { name: 'Manufacturing ERP', url: '/solutions/erp-for-manufacturers' },
  ],
  lastUpdated: 'November 2026',
};

export const solutionsLogistics: PageContent = {
  slug: 'solutions/logistics-software',
  url: 'https://ignisailabs.com/solutions/logistics-software',
  markdownUrl: 'https://ignisailabs.com/solutions/logistics-software.md',
  title: 'Logistics & Import/Export Software | Ignis AI Labs',
  metaDescription:
    'Custom logistics apps, dispatch tracking and automated customs workflow software for manufacturers and freight operators worldwide.',
  targetKeyword: 'logistics software for import/export',
  eyebrow: 'Supply Chain Software / Logistics',
  h1: 'Logistics & Import/Export Workflow Software',
  lead:
    'Ignis logistics applications automate dispatch tracking, shipping document generation, and international trade compliance for manufacturers. From packing list compilation to customs document assembly and carrier milestone tracking, our software eliminates transport bottlenecks and manual paperwork errors.',
  definition:
    'Import/export workflow software coordinates transport bookings, packing specifications, customs declaration documents, and container tracking for manufacturing shipments.',
  whoThisIsFor: [
    'Export-oriented manufacturers shipping finished components across international borders.',
    'Industrial procurement teams importing raw materials, specialized chemicals, and production tooling.',
    'Logistics coordinators tired of copying data between shipping manifests, customs spreadsheets, and ERP orders.',
    'Plant dispatch teams managing private fleets, third-party logistics (3PL) partners, and freight forwarders.',
  ],
  keyProblemsSolved: [
    'Customs clearance delays caused by mismatched invoice quantities, incorrect HS codes, or missing paperwork.',
    'Lack of centralized visibility on container status, vessel arrival times, and port demurrage risks.',
    'Manual entry mistakes when transferring order details from factory ERP to transport manifests.',
    'Disputed freight charges and untracked detention costs across multiple shipping vendors.',
  ],
  howItWorks: [
    {
      step: '01',
      title: 'Order Import and Packing Optimization',
      description:
        'Import confirmed sales orders, group items by container volume, and calculate gross and net weight specs automatically.',
    },
    {
      step: '02',
      title: 'Automated Document Assembly',
      description:
        'Generate export commercial invoices, packing lists, certificates of origin, and shipping instructions with one click.',
    },
    {
      step: '03',
      title: 'Carrier Booking and Milestone Tracking',
      description:
        'Assign shipments to transport carriers, dispatch e-way bills or bills of lading, and track GPS/container milestones.',
    },
    {
      step: '04',
      title: 'Delivery Confirmation and Proof of Delivery (POD)',
      description:
        'Capture digital sign-offs, timestamps, and condition photos upon delivery to trigger immediate customer invoicing.',
    },
  ],
  featuresOrSpecs: [
    {
      title: 'Dynamic Document Assembly Engine',
      description:
        'Format and generate multi-country customs templates, shipping bills, and certificates without re-typing data.',
    },
    {
      title: 'HS Code & Compliance Validation',
      description:
        'Pre-validate Harmonized System (HS) codes, tariff classifications, and duty calculations prior to filing.',
    },
    {
      title: 'Multi-Carrier API Connectivity',
      description:
        'Direct tracking integrations with ocean lines, air cargo APIs, national highway tracking portals, and courier services.',
    },
    {
      title: 'Detention & Demurrage Early Warning',
      description:
        'Automated alerts when containers approach free-time expiry at ports or transit yards.',
    },
  ],
  faqs: [
    {
      question: 'Can this software generate export documents compliant with international customs?',
      answer:
        'Yes. The document assembly engine outputs standardized invoices, packing lists, inspection certificates, and shipper declarations compliant with global trade standards.',
    },
    {
      question: 'Does it integrate with our plant WMS and ERP?',
      answer:
        'Yes. Dispatch manifests are created directly from WMS packing scans, ensuring that the physical items inside the container match the commercial invoice exactly.',
    },
    {
      question: 'Can third-party freight forwarders log in to upload shipping bills?',
      answer:
        'Yes. Role-based external portal access allows freight agents and customs brokers to upload bills of lading, customs clearance receipts, and tracking numbers.',
    },
    {
      question: 'Can we track private factory fleet vehicles as well?',
      answer:
        'Yes. The dispatch module supports GPS tracking device webhooks and mobile driver app tracking for internal fleet trucks.',
    },
    {
      question: 'Does it alert us before port demurrage charges apply?',
      answer:
        'Yes. Configurable alert thresholds notify your dispatch team 48 and 24 hours before container free-time expires at destination ports.',
    },
  ],
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Solutions', url: '/#capabilities' },
    { name: 'Logistics & Import/Export Software', url: '/solutions/logistics-software' },
  ],
  lastUpdated: 'November 2026',
};

export const servicesSAP: PageContent = {
  slug: 'services/sap-and-system-integration',
  url: 'https://ignisailabs.com/services/sap-and-system-integration',
  markdownUrl: 'https://ignisailabs.com/services/sap-and-system-integration.md',
  title: 'SAP & System Integration for Manufacturing | Ignis AI Labs',
  metaDescription:
    'Connect factory floor systems, WMS, PRC and IoT to SAP S/4HANA, ECC, Oracle and Tally without replacing legacy software.',
  targetKeyword: 'SAP integration for manufacturers',
  eyebrow: 'Engineering Services / Integration',
  h1: 'SAP and Enterprise System Integration for Factories',
  lead:
    'Ignis AI Labs connects shop floor software, custom apps, and plant machines directly to SAP S/4HANA, SAP ECC, Oracle, Zoho, and Tally. Instead of forcing your plant to replace legacy systems that already work, we build resilient, high-speed integration bridges that synchronize work orders, material receipts, and inventory in real time.',
  definition:
    'Plant system integration is the engineering process of connecting factory floor hardware, routing apps, and warehouse software to central enterprise ERP databases.',
  whoThisIsFor: [
    'Manufacturing enterprises running SAP or Oracle that need shop floor workstations to report data directly.',
    'Plants struggling with manual batch data entry between factory clipboards and corporate ERP accounts.',
    'IT directors looking to modernize factory connectivity without undergoing a multi-year ERP migration.',
    'Plants operating specialized legacy machines, PLCs, or weighbridges that need to talk to modern cloud apps.',
  ],
  keyProblemsSolved: [
    'Operators writing production counts on paper slips that take 24 to 48 hours to enter into SAP.',
    'Inventory mismatches between physical plant shelves and corporate ERP ledgers.',
    'Fragile, unmonitored point-to-point scripts that fail silently and corrupt production records.',
    'Prohibitive consulting costs and multi-month delays for simple ERP interface changes.',
  ],
  howItWorks: [
    {
      step: '01',
      title: 'Interface Mapping and Architecture Review',
      description:
        'Audit your existing ERP schemas (BAPIs, IDocs, OData, RFCs, or SQL tables) and define strict data contracts for each plant event.',
    },
    {
      step: '02',
      title: 'Middleware & Connector Engineering',
      description:
        'Build lightweight, resilient integration services with local caching, automatic retries, and network fault tolerance.',
    },
    {
      step: '03',
      title: 'End-to-End Simulation Testing',
      description:
        'Test two-way synchronization using historical production workloads and edge cases: duplicate records, network dropouts, and invalid SKUs.',
    },
    {
      step: '04',
      title: 'Production Cutover and Health Telemetry',
      description:
        'Deploy with 24/7 logging, automated deadlock recovery, and latency monitors to ensure zero production interruption.',
    },
  ],
  featuresOrSpecs: [
    {
      title: 'SAP S/4HANA & ECC Native Connectors',
      description:
        'Direct communication using OData APIs, RFC function modules, BAPIs, and IDocs for real-time production confirmations.',
    },
    {
      title: 'Store-and-Forward Offline Resilience',
      description:
        'If the plant internet link drops, local edge buffers store shop floor transactions safely and flush them to SAP upon reconnection.',
    },
    {
      title: 'Multi-System Normalization',
      description:
        'Bridge diverse enterprise environments simultaneously: SAP for finance, custom WMS for inventory, and banking APIs for supplier payouts.',
    },
    {
      title: 'Audit Logging & Dead-Letter Queues',
      description:
        'Every single API payload is timestamped and logged. Failed transactions are isolated with full payload inspection for instant resolution.',
    },
  ],
  faqs: [
    {
      question: 'Do we need to alter our existing SAP configuration?',
      answer:
        'No. We typically build against standard SAP standard BAPIs and RFCs without requiring intrusive ABAP customizations or changes to your core financial ledgers.',
    },
    {
      question: 'What happens if the factory internet connection goes down?',
      answer:
        'Our integration bridges use local store-and-forward queues. Floor operators continue scanning and logging jobs without interruption, and data syncs automatically once connectivity returns.',
    },
    {
      question: 'Can you connect older legacy machinery and weighbridges to SAP?',
      answer:
        'Yes. We build serial, RS-485, and Modbus gateway software that reads data from physical scales, sensors, and PLCs and transforms it into clean JSON payloads for SAP.',
    },
    {
      question: 'How do you secure data transmission between plant and ERP?',
      answer:
        'All communications use TLS 1.3 encryption, mutual authentication, scoped API tokens, and IP allowlisting to protect your plant network.',
    },
    {
      question: 'Can you integrate with accounting software like Tally as well?',
      answer:
        'Yes. We provide bidirectional XML and ODBC connectors that synchronize sales invoices, purchase receipts, and stock ledger entries directly with Tally.',
    },
  ],
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/#capabilities' },
    { name: 'SAP & System Integration', url: '/services/sap-and-system-integration' },
  ],
  lastUpdated: 'November 2026',
};

export const servicesAI: PageContent = {
  slug: 'services/ai-automation-for-manufacturing',
  url: 'https://ignisailabs.com/services/ai-automation-for-manufacturing',
  markdownUrl: 'https://ignisailabs.com/services/ai-automation-for-manufacturing.md',
  title: 'AI Automation for Manufacturing Plants | Ignis AI Labs',
  metaDescription:
    'Industrial AI automation, agentic operational workflows and machine data pipelines engineered for factory floors and logistics hubs.',
  targetKeyword: 'AI automation for manufacturing',
  eyebrow: 'Engineering Services / AI Automation',
  h1: 'AI Automation & Data Pipelines for Manufacturing',
  lead:
    'Ignis AI Labs builds operational AI workflows, intelligent document processing pipelines, and predictive plant dashboards. Rather than generic chatbots, we engineer AI systems that monitor real production signals: predicting machine maintenance windows, identifying material yield anomalies, and automating manual dispatch approvals. Your plant gains practical operational efficiency without research fluff.',
  definition:
    'Industrial AI automation is the application of machine learning, computer vision, and autonomous agentic workflows to factory scheduling, quality control, and inventory optimization.',
  whoThisIsFor: [
    'Factories generating high volumes of telemetry, machine logs, or paper inspection sheets that go unanalyzed.',
    'Operations leaders who want to catch production quality drift before it results in expensive scrap batches.',
    'Warehouses and supply chain operators looking to automate supplier invoice verification and customs paperwork.',
    'Manufacturing businesses wanting actionable throughput dashboards instead of static end-of-month reports.',
  ],
  keyProblemsSolved: [
    'Critical machine failures causing unplanned assembly line stoppages during peak order fulfilment.',
    'Staff spending hours manually comparing supplier delivery notes with ERP purchase orders.',
    'Quality defects detected only at final packaging instead of earlier in the production sequence.',
    'Inaccurate demand forecasting leading to either excessive raw material capital lockup or factory stockouts.',
  ],
  howItWorks: [
    {
      step: '01',
      title: 'Plant Data Source Audit',
      description:
        'Identify high-value operational bottlenecks and map existing data streams: machine PLCs, weighbridge logs, ERP orders, and inspection checklists.',
    },
    {
      step: '02',
      title: 'Targeted Model and Agent Design',
      description:
        'Train lightweight models or build agentic workflows focused on specific tasks: vision-based inspection, document parsing, or throughput forecasting.',
    },
    {
      step: '03',
      title: 'Edge & Cloud Integration',
      description:
        'Deploy lightweight inference models on local plant edge hardware or private cloud servers with sub-second response times.',
    },
    {
      step: '04',
      title: 'Closed-Loop Action Automation',
      description:
        'Connect AI inferences directly to action triggers: alert supervisors on mobile, flag quarantine bins in WMS, or update procurement buffers.',
    },
  ],
  featuresOrSpecs: [
    {
      title: 'Agentic Workflows for Operations',
      description:
        'Autonomous multi-step agents that cross-reference incoming shipping documents, verify purchase order matching, and flag exceptions.',
    },
    {
      title: 'Computer Vision Quality Checkpoints',
      description:
        'Camera-based inspection algorithms that detect surface defects, label misalignments, or dimension variances in real time.',
    },
    {
      title: 'Predictive Yield & Scrap Analysis',
      description:
        'Statistical modeling connecting raw chemical batches and ambient plant conditions to scrap rates in moulding and curing.',
    },
    {
      title: 'Live Operational Dashboards',
      description:
        'Real-time metrics on Overall Equipment Effectiveness (OEE), cycle times, and bottlenecked work centers accessible to plant leadership.',
    },
  ],
  faqs: [
    {
      question: 'Do we need a massive dataset before we can implement AI in our plant?',
      answer:
        'No. Many high-impact automations, such as document processing, rule-based agentic workflows, and basic anomaly detection, deliver immediate value using only your current operational data.',
    },
    {
      question: 'Does this require cloud connectivity for shop floor operations?',
      answer:
        'Not necessarily. For time-critical inspection and machine monitoring, we deploy models to local edge devices on your plant LAN so operations run smoothly even if external internet drops.',
    },
    {
      question: 'How do you prevent AI models from making incorrect operational decisions?',
      answer:
        'We design systems with human-in-the-loop validation: the AI flags anomalies, pre-fills forms, and recommends actions, while final approval remains with your authorized floor supervisors.',
    },
    {
      question: 'Is our production data kept private and secure?',
      answer:
        'Yes. All models and pipelines run within your private environment. Your proprietary formulas, manufacturing parameters, and customer order details are never used to train external public models.',
    },
    {
      question: 'How quickly can we see measurable return on an AI automation project?',
      answer:
        'Focused projects like automated document intake or scrap drift detection typically demonstrate measurable time savings and quality improvements within [TODO: 4 to 8 weeks] of floor pilot testing.',
    },
  ],
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/#capabilities' },
    { name: 'AI & Process Automation', url: '/services/ai-automation-for-manufacturing' },
  ],
  lastUpdated: 'November 2026',
};

export const servicesCustom: PageContent = {
  slug: 'services/custom-software-for-factories',
  url: 'https://ignisailabs.com/services/custom-software-for-factories',
  markdownUrl: 'https://ignisailabs.com/services/custom-software-for-factories.md',
  title: 'Custom Software Development for Factories | Ignis AI Labs',
  metaDescription:
    'Custom web and mobile apps engineered for manufacturing plant floors, workstations, quality checklists and warehouse teams.',
  targetKeyword: 'custom software for plants',
  eyebrow: 'Engineering Services / Custom Software',
  h1: 'Custom Software Development for Factories and Plants',
  lead:
    'Ignis AI Labs designs and builds custom web, mobile, and edge software for factories, plants, and warehouses. When off-the-shelf software fails to match your specific machinery, chemical processes, or proprietary assembly steps, we build software tailored to your exact floor operations. Your plant gets reliable, high-performance tools without paying for hundreds of unused software features.',
  definition:
    'Custom factory software is purpose-built digital applications engineered to match specific production, assembly, quality control, or inventory requirements in industrial facilities.',
  whoThisIsFor: [
    'Manufacturing businesses with unique production processes that standard SaaS tools cannot handle.',
    'Plants requiring custom tablet applications for operators on noisy, dusty, or glove-required shop floors.',
    'Companies wanting to replace aging desktop software (MS Access, FoxPro, or Visual Basic) with modern web systems.',
    'Original equipment manufacturers (OEMs) building software interfaces for their industrial machinery.',
  ],
  keyProblemsSolved: [
    'Forcing unique manufacturing workflows into rigid commercial software that requires convoluted manual workarounds.',
    'Old desktop databases crashing regularly and lacking multi-user floor access or audit logs.',
    'Commercial software charging exorbitant per-seat licenses that penalize factories with large shift counts.',
    'Software vendors taking months to implement simple feature modifications or custom reporting views.',
  ],
  howItWorks: [
    {
      step: '01',
      title: 'Plant Floor Walkthrough & Process Mapping',
      description:
        'We visit your shop floor virtually or in person to observe operators, machines, and paperwork in real conditions.',
    },
    {
      step: '02',
      title: 'Rapid Prototype & Operator Testing',
      description:
        'We build functional interactive prototypes within 10 days to test button sizes, contrast, and navigation directly with floor workers.',
    },
    {
      step: '03',
      title: 'Production Engineering & Integration',
      description:
        'We engineer resilient codebases with automated tests, barcode scanning libraries, and connectors to your existing databases and PLCs.',
    },
    {
      step: '04',
      title: 'Pilot Deployment & Shift Transition',
      description:
        'We deploy alongside your existing process for parallel testing before retiring legacy clipboards and spreadsheets permanently.',
    },
  ],
  featuresOrSpecs: [
    {
      title: 'Rugged Floor UX Design',
      description:
        'High-contrast interfaces with large touch targets designed for gloved hands, dim plant lighting, and fast barcode scanning.',
    },
    {
      title: 'Full-Stack Modern Architecture',
      description:
        'Engineered with React, TypeScript, Node.js, Python, PostgreSQL, and Redis for sub-100ms response times under continuous floor load.',
    },
    {
      title: 'Full Source Code Ownership',
      description:
        'You own the code, intellectual property, and database schemas with zero vendor lock-in and zero perpetual user tax.',
    },
    {
      title: 'Hardware & Peripheral Integration',
      description:
        'Direct interfaces with industrial thermal label printers, RFID gates, barcode guns, weigh scales, and digital calipers.',
    },
  ],
  faqs: [
    {
      question: 'Do we own the software and source code after development?',
      answer:
        'Yes. You receive full ownership of the source code, architecture blueprints, and database schemas with no hidden recurring intellectual property royalties.',
    },
    {
      question: 'How do you handle software updates without halting plant production?',
      answer:
        'We use blue-green deployments and automated container rollouts that deploy updates with zero system downtime during active manufacturing shifts.',
    },
    {
      question: 'Can the software run locally if our plant has unreliable internet?',
      answer:
        'Yes. We can deploy systems as local Progressive Web Apps (PWA) or on-premise Docker containers that run smoothly on your local factory network.',
    },
    {
      question: 'Do you provide ongoing support after deployment?',
      answer:
        'Yes. We provide ongoing maintenance contracts including security patches, feature iterations, uptime monitoring, and direct developer support.',
    },
    {
      question: 'How do we get started with a custom build?',
      answer:
        'We begin with an initial 30-minute discovery call to discuss your current bottleneck, followed by a detailed scope and delivery timeline proposal within 48 hours.',
    },
  ],
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/#capabilities' },
    { name: 'Custom Factory Software', url: '/services/custom-software-for-factories' },
  ],
  lastUpdated: 'November 2026',
};

export const industriesComposites: PageContent = {
  slug: 'industries/composites-and-fiber-moulding',
  url: 'https://ignisailabs.com/industries/composites-and-fiber-moulding',
  markdownUrl: 'https://ignisailabs.com/industries/composites-and-fiber-moulding.md',
  title: 'Composites & Fiber Moulding Software | Ignis AI Labs',
  metaDescription:
    'Digital production routing, resin batch traceability and oven cure tracking for composites, FRP and fiber moulding manufacturers.',
  targetKeyword: 'production routing software for moulding companies',
  eyebrow: 'Industry Solutions / Composites',
  h1: 'Digitalization Software for Composites & Fiber Moulding Plants',
  lead:
    'Composites, FRP, and fiber moulding manufacturing require strict resin batch tracking, mold preparation checklists, and temperature-controlled curing cycles. Ignis AI Labs provides digital production routing (PRC), raw material inventory tracking, and quality approval software tailored specifically for composite component fabricators. Eliminate resin-soaked paper traveler sheets and trace every finished part back to its exact roll of fiber and resin lot.',
  definition:
    'Composites manufacturing software tracks fiber reinforcement layers, resin mix ratios, vacuum debulk stages, autoclave curing cycles, and destructive test coupons for advanced composite parts.',
  whoThisIsFor: [
    'Carbon fiber, glass fiber (FRP), and natural fiber moulding manufacturers.',
    'Fabricators supplying automotive, wind energy, aerospace, or marine composite components.',
    'Plant managers dealing with high scrap rates due to resin gel time expiry or skipped cure stages.',
    'Quality directors preparing for customer audits (ISO 9001, AS9100, IATF 16949) needing batch-level traceability.',
  ],
  keyProblemsSolved: [
    'Paper job sheets getting destroyed by resin, solvents, and mold-release wax on the shop floor.',
    'Inability to prove resin mix ratios or autoclave cure cycle temperatures during customer warranty claims.',
    'Excessive scrap when prepreg materials exceed out-life limits without automated expiration alerts.',
    'Manual calculation of composite part component weights causing inconsistent fiber-to-resin ratios.',
  ],
  howItWorks: [
    {
      step: '01',
      title: 'Roll and Chemical Lot Receipt',
      description:
        'Scan incoming carbon/glass fiber fabric rolls, resin drums, and catalysts. Track roll lot numbers, shelf life, and storage conditions.',
    },
    {
      step: '02',
      title: 'Kit Preparation & Mold Layup Sign-Off',
      description:
        'Operators scan traveler barcodes at the ply-cutting and layup station. Mandatory checklist verification ensures mold release and ply schedule accuracy.',
    },
    {
      step: '03',
      title: 'Oven & Autoclave Cure Logging',
      description:
        'Attach sensor temperature and pressure charts directly to the digital job record before moving components to demoulding.',
    },
    {
      step: '04',
      title: 'Trimming, NDT & Final Dispatch Record',
      description:
        'Log ultrasonic or visual inspection results, sign off dimensional checks, and automatically produce the Certificate of Conformance (CoC).',
    },
  ],
  featuresOrSpecs: [
    {
      title: 'Out-Life & Shelf-Life Timers',
      description:
        'Automated expiration tracking for prepregs, adhesives, and catalyzed resins with visual warning banners on floor tablets.',
    },
    {
      title: 'Mold Utilization Tracking',
      description:
        'Track the number of part pulls per composite tool or metal mould to schedule preventative surface maintenance and polishing.',
    },
    {
      title: 'Chemical Mix Ratio Calculators',
      description:
        'Direct scale integration prompts operators with exact gram weights of resin, hardener, and accelerator to ensure stoichiometric accuracy.',
    },
    {
      title: 'Complete Genealogy Certificates',
      description:
        'Generate customer-ready digital birth certificates combining fiber roll numbers, resin lot data, curing charts, and inspection sign-offs.',
    },
  ],
  faqs: [
    {
      question: 'Can the system track prepreg out-life in freezer storage and on the cutting table?',
      answer:
        'Yes. The software logs cumulative hours at room temperature and alerts operators when prepreg material approaches maximum allowable thaw time.',
    },
    {
      question: 'How do operators enter data when wearing protective lamination gloves?',
      answer:
        'The interface features large tap buttons, barcode scanning shortcuts, and simplified one-touch approval toggles designed specifically for lamination floor environments.',
    },
    {
      question: 'Can we attach digital oven or autoclave temperature logs to the job sheet?',
      answer:
        'Yes. Temperature data files, thermocouple CSV logs, or photo attachments can be uploaded directly to the batch record before demould clearance.',
    },
    {
      question: 'Does it support multi-cavity moulds and batch production?',
      answer:
        'Yes. You can route multiple component serial numbers under a single mold pull while maintaining individual part identification for downstream finishing.',
    },
    {
      question: 'Can we integrate this with our customer portal for automatic quality documentation?',
      answer:
        'Yes. Finished inspection certificates and batch genealogy records can be emailed automatically to your customers or exported via API upon shipping confirmation.',
    },
  ],
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Industries', url: '/#capabilities' },
    { name: 'Composites & Fiber Moulding', url: '/industries/composites-and-fiber-moulding' },
  ],
  lastUpdated: 'November 2026',
};

export const caseStudiesList = [
  {
    slug: 'case-studies/production-routing-chart',
    title: 'Production Routing Chart (PRC) for Composites Manufacturing',
    clientType: 'Precision Composites & Moulding Manufacturer',
    industry: 'Fiber Moulding & Industrial Composites',
    impact: 'Paperless shop floor routing, zero missed QA steps, and instant stage visibility across multi-stage moulding.',
    readTime: '4 min read',
  },
  {
    slug: 'case-studies/warehouse-management-system',
    title: 'WMS Deployment for Industrial Distribution Center',
    clientType: 'Manufacturing & Distribution Facility',
    industry: 'Automotive & Industrial Supply Chain',
    impact: 'Bin-level inventory accuracy, barcode-guided picking routes, and real-time ERP synchronization.',
    readTime: '4 min read',
  },
  {
    slug: 'case-studies/import-export-workflow-handler',
    title: 'Automated Customs & Export Workflow Handler',
    clientType: 'Global Industrial Component Exporter',
    industry: 'Export Manufacturing & Freight Logistics',
    impact: 'Automated shipping document assembly, tariff code validation, and container milestone tracking.',
    readTime: '4 min read',
  },
];

