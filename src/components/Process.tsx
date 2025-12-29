import { motion } from 'motion/react';
import { ProcessNode } from './ProcessNode';
import { Search, Layers, Code, CheckCircle, Rocket, Activity } from 'lucide-react';

export function Process() {
  const processSteps = [
    {
      icon: Search,
      title: 'Discovery',
      description: 'Problem definition & data mapping',
      details: [
        'Stakeholder interviews and requirements gathering',
        'Current system audit and data inventory',
        'Success metrics definition'
      ]
    },
    {
      icon: Layers,
      title: 'Architecture',
      description: 'Blueprints, security, data contracts',
      details: [
        'System design and component architecture',
        'Security framework and compliance review',
        'API contracts and data models'
      ]
    },
    {
      icon: Code,
      title: 'Development',
      description: 'CI/CD, modular build',
      details: [
        'Agile sprints with continuous integration',
        'Modular, testable code architecture',
        'Automated testing and quality gates'
      ]
    },
    {
      icon: CheckCircle,
      title: 'Validation',
      description: 'Integration & performance checks',
      details: [
        'End-to-end integration testing',
        'Load testing and performance tuning',
        'User acceptance testing with stakeholders'
      ]
    },
    {
      icon: Rocket,
      title: 'Deployment',
      description: 'Cloud delivery & monitoring',
      details: [
        'Infrastructure as code deployment',
        'Blue-green or canary release strategy',
        'Monitoring and alerting setup'
      ]
    },
    {
      icon: Activity,
      title: 'Scaling',
      description: 'Cost-performance optimization',
      details: [
        'System observability and metrics analysis',
        'Auto-scaling and resource optimization',
        'Continuous improvement and support'
      ]
    }
  ];

  return (
    <section id="process" className="py-[var(--s-8)] bg-white">
      <div className="max-w-[1400px] mx-auto px-[120px]">
        <motion.div 
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="mb-4">Engineering Process</h2>
          <p className="text-lg text-[var(--neutral-700)] max-w-2xl mx-auto">
            A structured approach from concept to production
          </p>
        </motion.div>
        
        {/* Desktop Timeline */}
        <div className="hidden lg:block relative">
          {/* Horizontal Line */}
          <div className="absolute top-7 left-0 right-0 h-px bg-[var(--neutral-300)]" />
          
          {/* Process Nodes */}
          <div className="grid grid-cols-6 gap-8">
            {processSteps.map((step, index) => (
              <ProcessNode
                key={step.title}
                icon={step.icon}
                title={step.title}
                description={step.description}
                details={step.details}
                index={index}
                isLast={index === processSteps.length - 1}
              />
            ))}
          </div>
        </div>

        {/* Mobile Timeline */}
        <div className="lg:hidden space-y-8">
          {processSteps.map((step, index) => (
            <motion.div 
              key={step.title} 
              className="flex gap-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border-2 border-[var(--accent-blue)] bg-white flex items-center justify-center">
                  <step.icon className="text-[var(--accent-blue)]" size={20} />
                </div>
                {index < processSteps.length - 1 && (
                  <div className="w-px h-16 bg-[var(--neutral-300)] mt-2" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <h4 className="mb-2">{step.title}</h4>
                <p className="text-sm text-[var(--neutral-700)] mb-3">
                  {step.description}
                </p>
                <ul className="space-y-1 text-sm text-[var(--neutral-700)]">
                  {step.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[var(--accent-blue)] mt-1">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
