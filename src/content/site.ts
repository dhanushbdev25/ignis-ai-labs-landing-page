export const site = {
  name: 'Ignis AI Labs',
  url: 'https://ignisailabs.com',
  title: 'Ignis AI Labs | Factory Digitalization, WMS, ERP & AI Automation',
  description:
    'Factory digitalization, production routing software (PRC), WMS, ERP and SAP integrations for manufacturing and logistics plants in India and worldwide.',
  email: 'contact@ignisailabs.com',
  phone: '+91 75502 15578',
  phoneHref: 'tel:+917550215578',
  location: 'India and worldwide',
  areaServed: 'India and worldwide',
  ogImage: 'https://ignisailabs.com/og-image.png',
};

export const hero = {
  eyebrow: 'FACTORY DIGITALIZATION · SAP INTEGRATION · AI AUTOMATION',
  headlineLead: 'Digitalize',
  headlineA: 'Your Factory.',
  headlineB: 'Connect Everything.',
  headlineC: 'Automate the Rest.',
  subline:
    'Ready-built products (WMS, ERP, logistics and PRC) plus custom software development for factories, plants and warehouses, integrated with SAP and existing systems, with AI automation on top.',
  ctaPrimary: 'Book a Free Plant Assessment',
  ctaSecondary: 'Explore Our Products',
  ctaNote: 'We respond within 24 hours.',
  scrollCue: 'SCROLL TO EXPLORE',
  plantConnect: {
    title: 'HOW IGNIS CONNECTS YOUR PLANT',
    shopFloor: {
      badge: 'SHOP FLOOR',
      title: 'Production and warehouse',
      desc: 'Production steps, stock and dispatch captured digitally.',
    },
    platform: {
      badge: 'IGNIS PLATFORM',
      title: 'WMS · ERP · Logistics · PRC',
      desc: 'With AI automation and agentic workflows on top.',
    },
    existingSystems: {
      badge: 'YOUR EXISTING SYSTEMS',
      title: 'SAP · Oracle · MS Dynamics · Zoho · Tally',
      desc: 'Connected without replacing them.',
    },
    footnote: '',
  },
};

/** Section eyebrows — the Temperature Index. 1538°C = melting point of iron. */
export const sections = {
  applied: { id: 'capabilities', index: '01', name: 'APPLIED', temp: '0420°C' },
  translated: { id: 'integrations', index: '02', name: 'TRANSLATED', temp: '0890°C' },
  forged: { id: 'process', index: '03', name: 'FORGED', temp: '1538°C' },
  deployed: { id: 'work', index: '04', name: 'DEPLOYED', temp: '0740°C' },
  trusted: { id: 'proof', index: '05', name: 'TRUSTED', temp: '0390°C' },
  answered: { id: 'faq', index: '06', name: 'ANSWERED', temp: '0180°C' },
  ignite: { id: 'contact', index: '07', name: 'IGNITION — AGAIN', temp: '1538°C' },
} as const;

export const navLinks = [
  { label: 'Capabilities', href: '/#capabilities', index: '01' },
  { label: 'Integrations', href: '/#integrations', index: '02' },
  { label: 'Process', href: '/#process', index: '03' },
  { label: 'Products', href: '/#work', index: '04' },
  { label: 'FAQ', href: '/#faq', index: '06' },
] as const;

export const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/ignis_ai_labs' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/ignisailabs' },
] as const;

export const stats = [
  { value: '10+', label: 'Clients Served', target: 10, suffix: '+' },
  { value: '50+', label: 'Projects Delivered', target: 50, suffix: '+' },
  { value: '99.8%', label: 'Satisfaction', target: 99.8, suffix: '%', decimals: 1 },
] as const;

export const statsMicroline = 'END-TO-END DELIVERY · RAPID ITERATION · QUALITY ASSURED';
