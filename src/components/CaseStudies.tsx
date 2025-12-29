import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { X, ExternalLink } from 'lucide-react';

interface CaseStudy {
  id: number;
  title: string;
  category: string;
  problem: string;
  solution: string;
  outcomes: string[];
  imageQuery: string;
}

export function CaseStudies() {
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);

  const caseStudies: CaseStudy[] = [
    {
      id: 1,
      title: 'Global Supply Chain Platform',
      category: 'Enterprise Software',
      problem: 'Manufacturing client needed real-time visibility across 50+ suppliers and 20 distribution centers with legacy system constraints.',
      solution: 'Cloud-native platform with real-time data integration, predictive analytics for demand forecasting, and automated workflow orchestration.',
      outcomes: [
        '40% reduction in stockouts',
        '25% improvement in forecast accuracy',
        '$2M annual cost savings through optimization'
      ],
      imageQuery: 'warehouse logistics technology'
    },
    {
      id: 2,
      title: 'AI-Powered Financial Analysis',
      category: 'AI & ML',
      problem: 'Financial services firm processing 100K+ transactions daily needed automated anomaly detection and risk assessment.',
      solution: 'ML pipeline with real-time fraud detection, risk scoring models, and automated reporting dashboard with explainable AI.',
      outcomes: [
        '95% accuracy in fraud detection',
        '80% reduction in manual review time',
        'Real-time risk scoring for all transactions'
      ],
      imageQuery: 'data analytics dashboard'
    },
    {
      id: 3,
      title: 'Healthcare Data Integration',
      category: 'Data Engineering',
      problem: 'Multi-clinic healthcare network with siloed patient data across 15 locations and 5 different legacy systems.',
      solution: 'HIPAA-compliant data warehouse with ETL pipelines, unified patient records, and analytics platform for clinical insights.',
      outcomes: [
        'Unified view of 500K+ patient records',
        '70% faster clinical reporting',
        'Full HIPAA compliance and audit trails'
      ],
      imageQuery: 'healthcare technology'
    },
    {
      id: 4,
      title: 'E-commerce Personalization Engine',
      category: 'AI & Product',
      problem: 'Retail client with 2M+ SKUs needed intelligent product recommendations to improve conversion and average order value.',
      solution: 'Recommendation engine using collaborative filtering and content-based algorithms, A/B testing framework, and real-time personalization.',
      outcomes: [
        '35% increase in conversion rate',
        '50% higher average order value',
        '3x improvement in customer engagement'
      ],
      imageQuery: 'ecommerce online shopping'
    }
  ];

  return (
    <section id="work" className="py-[var(--s-8)] bg-white">
      <div className="max-w-[1400px] mx-auto px-[120px]">
        <div className="mb-12">
          <h2 className="mb-4">Case Studies</h2>
          <p className="text-lg text-[var(--neutral-700)] max-w-2xl">
            Real-world impact across industries
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.id}
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => setSelectedCase(study)}
            >
              <div className="relative overflow-hidden rounded-xl mb-4 aspect-video bg-[var(--surface-light)]">
                <ImageWithFallback
                  src={`https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80`}
                  alt={study.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <span className="text-white flex items-center gap-2">
                    View case study <ExternalLink size={16} />
                  </span>
                </div>
              </div>
              
              <div className="mb-2">
                <span className="text-xs text-[var(--accent-blue)] tracking-wide uppercase">
                  {study.category}
                </span>
              </div>
              
              <h3 className="mb-2 group-hover:text-[var(--accent-blue)] transition-colors duration-200">
                {study.title}
              </h3>
              
              <p className="text-sm text-[var(--neutral-700)] line-clamp-2">
                {study.problem}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Case Study Detail Modal */}
      <AnimatePresence>
        {selectedCase && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCase(null)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-64 overflow-hidden rounded-t-2xl bg-[var(--surface-light)]">
                <ImageWithFallback
                  src={`https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80`}
                  alt={selectedCase.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedCase(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[var(--neutral-900)] hover:bg-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-8">
                <div className="mb-4">
                  <span className="text-sm text-[var(--accent-blue)] tracking-wide uppercase">
                    {selectedCase.category}
                  </span>
                </div>
                
                <h2 className="mb-6">{selectedCase.title}</h2>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="mb-2">Challenge</h4>
                    <p className="text-[var(--neutral-700)]">{selectedCase.problem}</p>
                  </div>
                  
                  <div>
                    <h4 className="mb-2">Solution</h4>
                    <p className="text-[var(--neutral-700)]">{selectedCase.solution}</p>
                  </div>
                  
                  <div>
                    <h4 className="mb-3">Outcomes</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {selectedCase.outcomes.map((outcome, idx) => (
                        <div key={idx} className="p-4 bg-[var(--surface-light)] rounded-lg">
                          <div className="flex items-start gap-2">
                            <span className="text-[var(--accent-blue)] text-lg">✓</span>
                            <p className="text-sm text-[var(--neutral-700)]">{outcome}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
