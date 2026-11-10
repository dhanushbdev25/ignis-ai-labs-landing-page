import type { ProcessPhase } from './types';

export const forgedIntro = 'From your first plant walkthrough to a factory running live on connected systems.';

export const phases: ProcessPhase[] = [
  {
    numeral: 'I',
    title: 'Ignite',
    temperature: '0273°C',
    description:
      'Plant walkthrough and process mapping. We find where paper, spreadsheets and disconnected systems slow you down.',
  },
  {
    numeral: 'II',
    title: 'Architect',
    temperature: '0610°C',
    description: 'We design the target system: which WMS, ERP, logistics or PRC modules fit, and how they connect to your SAP and other systems.',
  },
  {
    numeral: 'III',
    title: 'Construct',
    temperature: '1180°C',
    description: 'Configuration and custom development, with integrations built against your SAP and third-party systems.',
  },
  {
    numeral: 'IV',
    title: 'Validate',
    temperature: '1420°C',
    description: 'Testing with your own production data and workflows, and sign-off by your team before go-live.',
  },
  {
    numeral: 'V',
    title: 'Activate',
    temperature: '1538°C',
    description: 'Go-live at the plant, with operator training and monitoring from day one.',
  },
  {
    numeral: 'VI',
    title: 'Amplify',
    temperature: '∞',
    description: 'Ongoing support, plus new modules and AI automation added as your plant grows.',
  },
];
