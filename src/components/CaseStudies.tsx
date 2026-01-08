import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { X, ExternalLink } from 'lucide-react';
import { getCaseStudies, urlFor, type CaseStudy } from '../santiy/queries';

export function CaseStudies() {
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getCaseStudies();
        setCaseStudies(data);
        setError(null);
      } catch (err) {
        setError('Failed to load case studies');
        console.error('Error fetching case studies:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const getImageUrl = (image: any) => {
    if (!image) return '';
    return urlFor(image).width(800).height(450).url() || '';
  };

  if (loading) {
    return (
      <section id="work" className="py-[var(--s-8)] bg-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 xl:px-[120px]">
          <div className="mb-12">
            <h2 className="mb-4">Case Studies</h2>
            <p className="text-lg text-[var(--neutral-700)] max-w-2xl">
              Real-world impact across industries
            </p>
          </div>
          <div className="text-center text-[var(--neutral-700)] py-12">
            Loading case studies...
          </div>
        </div>
      </section>
    );
  }

  if (error || caseStudies.length === 0) {
    return (
      <section id="work" className="py-[var(--s-8)] bg-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 xl:px-[120px]">
          <div className="mb-12">
            <h2 className="mb-4">Case Studies</h2>
            <p className="text-lg text-[var(--neutral-700)] max-w-2xl">
              Real-world impact across industries
            </p>
          </div>
          <div className="text-center text-[var(--neutral-700)] py-12">
            {error || 'No case studies available'}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="work" className="py-[var(--s-8)] bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[120px]">
        <div className="mb-6 sm:mb-8 md:mb-12">
          <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl">Case Studies</h2>
          <p className="text-sm sm:text-base md:text-lg text-[var(--neutral-700)] max-w-2xl">
            Real-world impact across industries
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study._id}
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => setSelectedCase(study)}
            >
              <div className="relative overflow-hidden rounded-lg sm:rounded-xl mb-3 sm:mb-4 aspect-video bg-[var(--surface-light)]">
                <ImageWithFallback
                  src={getImageUrl(study.image)}
                  alt={study.title}
                  className=" object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 sm:p-6">
                  <span className="text-white text-sm sm:text-base flex items-center gap-2">
                    View case study <ExternalLink size={14} className="sm:w-4 sm:h-4" />
                  </span>
                </div>
              </div>
              
              <div className="mb-1.5 sm:mb-2">
                <span className="text-[10px] sm:text-xs text-[var(--accent-blue)] tracking-wide uppercase">
                  {study.category}
                </span>
              </div>
              
              <h3 className="mb-1.5 sm:mb-2 text-lg sm:text-xl md:text-2xl group-hover:text-[var(--accent-blue)] transition-colors duration-200">
                {study.title}
              </h3>
              
              <p className="text-xs sm:text-sm text-[var(--neutral-700)] line-clamp-2">
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCase(null)}
          >
            <motion.div
              className="bg-white rounded-xl sm:rounded-2xl max-w-[90vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] w-full mx-auto max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-40 sm:h-48 md:h-64 overflow-hidden rounded-t-xl sm:rounded-t-2xl bg-[var(--surface-light)] flex-shrink-0">
                <ImageWithFallback
                  src={getImageUrl(selectedCase.image)}
                  alt={selectedCase.title}
                  className="w-full h-full max-w-full max-h-full object-cover"
                />
                <button
                  onClick={() => setSelectedCase(null)}
                  className="absolute top-2 right-2 sm:top-4 sm:right-4 w-9 h-9 sm:w-11 sm:h-11 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[var(--neutral-900)] hover:bg-white transition-colors min-w-[36px] min-h-[36px] sm:min-w-[44px] sm:min-h-[44px]"
                  aria-label="Close modal"
                >
                  <X size={18} className="sm:w-5 sm:h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 sm:p-6 md:p-8">
                  <div className="mb-3 sm:mb-4">
                    <span className="text-xs sm:text-sm text-[var(--accent-blue)] tracking-wide uppercase">
                      {selectedCase.category}
                    </span>
                  </div>
                  
                  <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl md:text-3xl">{selectedCase.title}</h2>
                  
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <h4 className="mb-1.5 sm:mb-2 text-base sm:text-lg">Challenge</h4>
                      <p className="text-sm sm:text-base text-[var(--neutral-700)] leading-relaxed">{selectedCase.problem}</p>
                    </div>
                    
                    <div>
                      <h4 className="mb-1.5 sm:mb-2 text-base sm:text-lg">Solution</h4>
                      <p className="text-sm sm:text-base text-[var(--neutral-700)] leading-relaxed">{selectedCase.solution}</p>
                    </div>
                    
                    <div>
                      <h4 className="mb-2 sm:mb-3 text-base sm:text-lg">Outcomes</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                        {selectedCase.outcomes.map((outcome, idx) => (
                          <div key={idx} className="p-3 sm:p-4 bg-[var(--surface-light)] rounded-lg">
                            <div className="flex items-start gap-2">
                              <span className="text-[var(--accent-blue)] text-base sm:text-lg flex-shrink-0 mt-0.5">✓</span>
                              <p className="text-xs sm:text-sm text-[var(--neutral-700)] leading-relaxed">{outcome}</p>
                            </div>
                          </div>
                        ))}
                      </div>
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
