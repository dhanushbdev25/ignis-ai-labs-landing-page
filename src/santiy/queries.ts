import { client } from './client';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

export interface Testimonial {
  _id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  order: number;
  companyLogo?: any;
}

export interface CaseStudy {
  _id: string;
  title: string;
  category: string;
  problem: string;
  solution: string;
  outcomes: string[];
  image: any;
  order: number;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const query = `*[_type == "testimonials"] | order(order asc) {
    _id,
    quote,
    author,
    role,
    company,
    order,
    companyLogo
  }`;
  
  return await client.fetch(query);
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  const query = `*[_type == "caseStudy"] | order(order asc) {
    _id,
    title,
    category,
    problem,
    solution,
    outcomes,
    image,
    order
  }`;
  
  return await client.fetch(query);
}

