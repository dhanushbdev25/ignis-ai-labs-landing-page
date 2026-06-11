export interface Pillar {
  index: string;
  title: string;
  items: string[];
}

export interface Service {
  index: string;
  title: string;
  description: string;
}

export interface EnterpriseSystem {
  name: string;
  microText: string;
  outcome: string;
}

export interface ProcessPhase {
  numeral: string;
  title: string;
  temperature: string;
  description: string;
}

export interface Project {
  meta: string;
  title: string;
  impact: string;
  visual: 'warehouse-grid' | 'logistics-flow' | 'document-assembly';
}

export interface Testimonial {
  title: string;
  quote: string;
  author: string;
  role: string;
  company: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface Stat {
  value: string;
  label: string;
  /** numeric target for the count-up animation */
  target: number;
  suffix: string;
  decimals?: number;
}
