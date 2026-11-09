export const site = {
  name: 'Ignis AI Labs',
  url: 'https://ignisailabs.com',
  title: 'Ignis AI Labs',
  description:
    'Software development and engineering services. We build scalable, high-performance solutions that drive real business impact and transform your digital operations.',
  email: 'contact@ignisailabs.com',
  phone: '+91 83000 40510',
  phoneHref: 'tel:+918300040510',
  location: 'Tirunelveli, IN',
  ogImage: 'https://ignisailabs.com/og-image.png',
};

export const hero = {
  eyebrow: '00 / IGNITION',
  headlineA: "We Don't Build Software.",
  headlineB: 'We',
  headlineEm: 'Grow',
  headlineC: 'Intelligence.',
  rotatingWords: [
    'digital transformation',
    'ERP modernization',
    'financial systems',
    'analytics insights',
    'integrations',
  ],
  subline: 'End-to-end enterprise systems, integrations, and analytics.',
  ctaPrimary: 'Request a Callback',
  ctaSecondary: 'See Our Work',
  scrollCue: 'SCROLL TO SMELT',
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
  { label: 'Capabilities', href: '#capabilities', index: '01' },
  { label: 'Integrations', href: '#integrations', index: '02' },
  { label: 'Process', href: '#process', index: '03' },
  { label: 'Work', href: '#work', index: '04' },
  { label: 'FAQ', href: '#faq', index: '06' },
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
