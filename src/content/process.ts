import type { ProcessPhase } from './types';

export const forgedIntro = 'Intelligence evolves through deliberate stages.';

export const phases: ProcessPhase[] = [
  {
    numeral: 'I',
    title: 'Ignite',
    temperature: '0273°C',
    description: 'Discovery and problem definition. Mapping data sources and objectives.',
  },
  {
    numeral: 'II',
    title: 'Architect',
    temperature: '0610°C',
    description: 'Designing robust system architecture. Security protocols and scalable blueprints.',
  },
  {
    numeral: 'III',
    title: 'Construct',
    temperature: '1180°C',
    description: 'Building with modern DevOps practices. Automated pipelines and modular components.',
  },
  {
    numeral: 'IV',
    title: 'Validate',
    temperature: '1420°C',
    description: 'Rigorous testing and integration checks. Performance benchmarks and quality assurance.',
  },
  {
    numeral: 'V',
    title: 'Activate',
    temperature: '1538°C',
    description: 'Seamless cloud deployment. Continuous monitoring and real-time health checks.',
  },
  {
    numeral: 'VI',
    title: 'Amplify',
    temperature: '∞',
    description: 'Optimize resources and enhance performance. Cost-effective scaling as you grow.',
  },
];
