import { CapabilityCard } from './CapabilityCard';
import { Code2, Brain, TrendingUp, Palette, Link2, BarChart3 } from 'lucide-react';

export function Capabilities() {
  const capabilities = [
    {
      icon: Code2,
      title: 'Software Engineering',
      description: 'Custom platforms, cloud-native systems, resilient delivery.',
      tintColor: '#F3F7F5'
    },
    {
      icon: Brain,
      title: 'AI & ML Engineering',
      description: 'Production-grade models, pipelines, model ops.',
      tintColor: '#F3F7F5'
    },
    {
      icon: TrendingUp,
      title: 'Business & Financial Analysis',
      description: 'Forecasting, scenario modelling, decision systems.',
      tintColor: '#F3F7F5'
    },
    {
      icon: Palette,
      title: 'UX & Product Design',
      description: 'Minimal product systems, rapid prototyping.',
      tintColor: '#E8EEFF'
    },
    {
      icon: Link2,
      title: 'Third-Party Integrations',
      description: 'ERP, CRM, logistics and communication connectors.',
      tintColor: '#E8EEFF'
    },
    {
      icon: BarChart3,
      title: 'Power BI & Analytics',
      description: 'Operational dashboards and governance.',
      tintColor: '#E8EEFF'
    }
  ];

  return (
    <section id="capabilities" className="py-[var(--s-8)] bg-[var(--surface-light)]">
      <div className="max-w-[1400px] mx-auto px-[120px]">
        <div className="mb-12">
          <h2 className="mb-4">Capabilities</h2>
          <p className="text-lg text-[var(--neutral-700)] max-w-2xl">
            Full-spectrum engineering services for modern enterprises
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((capability, index) => (
            <CapabilityCard
              key={capability.title}
              icon={capability.icon}
              title={capability.title}
              description={capability.description}
              tintColor={capability.tintColor}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
