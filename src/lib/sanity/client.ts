import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Public client for fetching data
export const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || '5moen2qt',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: import.meta.env.PROD,
});

// Image URL builder
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Types for Sanity documents
export interface Testimonial {
  _id: string;
  title: string;
  quote: string;
  author: string;
  company: string;
  role: string;
  order: number;
  companyLogo?: SanityImageSource;
}

export interface CaseStudy {
  _id: string;
  title: string;
  category: string;
  problem: string;
  solution: string;
  outcomes: string[];
  image: SanityImageSource;
  order: number;
}

export interface Service {
  _id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export interface Benefit {
  _id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export interface PricingPlan {
  _id: string;
  name: string;
  price: number;
  billingPeriod: string;
  tagline: string;
  highlighted: boolean;
  features: {
    feature: string;
    included: boolean;
    value?: string;
  }[];
  ctaText: string;
  order: number;
}

export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  order: number;
}

export interface ProcessStep {
  _id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export interface SiteSettings {
  _id: string;
  siteName: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  stats: {
    happyCustomers: string;
    projectsCompleted: string;
    satisfaction: string;
  };
}
