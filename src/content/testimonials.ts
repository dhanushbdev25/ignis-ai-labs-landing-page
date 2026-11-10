import type { Testimonial } from './types';
import indocool from '../assets/logos/Indocool.png';
import muphileLabs from '../assets/logos/muphileLabs.png';
import naraynaPearls from '../assets/logos/NaraynaPearls.png';
import waizo from '../assets/logos/Waioz.png';
import nip from '../assets/logos/NIP.png';
import alayaBakery from '../assets/logos/alayabakery.png';
import slizzo from '../assets/logos/Slizzo.png';

export const trustedBy = [
  { name: 'Indocool', logo: indocool },
  { name: 'Muphile Labs', logo: muphileLabs },
  { name: 'Narayana Pearls', logo: naraynaPearls },
  { name: 'Waioz', logo: waizo },
  { name: 'NIP', logo: nip },
  { name: 'Alaya', logo: alayaBakery },
  { name: 'Slizzo', logo: slizzo },
];

export const testimonials: Testimonial[] = [
  {
    title: 'Dependable partner for resourcing needs',
    quote:
      "We engaged Ignis through a consulting arrangement, and their engineering team handled multiple projects with competence and reliability. They've been a dependable partner for resourcing needs.",
    author: 'Abdul Wahab',
    role: 'Managing Director',
    company: 'Waioz',
  },
  {
    title: 'Seamless WMS and PRC deployment with SAP integration',
    quote:
      'Ignis deployed our WMS and PRC applications with direct SAP integration, giving us end-to-end visibility from raw materials to shop-floor production routing. It replaced manual tracking across the plant without disrupting daily operations.',
    author: 'Ramesh R',
    role: 'Operations & Supply Chain',
    company: 'Indocool',
  },
  {
    title: 'Rare ability to integrate complex software systems',
    quote:
      'Ignis has a rare ability to integrate complex software systems with real-world operational requirements. Their engineering discipline and clarity in execution make them a reliable partner for serious product teams.',
    author: 'Veeramani Viswanathan',
    role: 'Technical Director',
    company: 'Muphile Labs',
  },
  {
    title: 'Better visibility into sales patterns',
    quote:
      'Managing demand in a bakery is always tricky. Ignis built tools that gave us better visibility into sales patterns and helped us plan our inventory more accurately. It reduced waste and improved margins immediately.',
    author: 'Linsha',
    role: 'Managing Director',
    company: 'Slizzo',
  },
];
