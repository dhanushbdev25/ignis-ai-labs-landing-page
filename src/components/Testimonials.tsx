import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getTestimonials, urlFor, type Testimonial } from '../santiy/queries';

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const testimonialsData = await getTestimonials();
        setTestimonials(testimonialsData);
        setError(null);
      } catch (err) {
        setError('Failed to load testimonials');
        console.error('Error fetching testimonials:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (testimonials.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 6000);

      return () => clearInterval(timer);
    }
  }, [testimonials.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  if (loading) {
    return (
      <section className="py-[var(--s-8)] bg-[var(--surface-light)]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 xl:px-[120px]">
          <div className="max-w-4xl mx-auto">
            <div className="relative min-h-[280px] flex items-center justify-center">
              <div className="text-center text-[var(--neutral-700)]">Loading testimonials...</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || testimonials.length === 0) {
    return (
      <section className="py-[var(--s-8)] bg-[var(--surface-light)]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 xl:px-[120px]">
          <div className="max-w-4xl mx-auto">
            <div className="relative min-h-[280px] flex items-center justify-center">
              <div className="text-center text-[var(--neutral-700)]">
                {error || 'No testimonials available'}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const getLogoUrl = (image: any) => {
    if (!image) return null;
    return urlFor(image).width(120).url() || null;
  };

  return (
    <section className="py-[var(--s-8)] bg-[var(--surface-light)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[120px]">
        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative min-h-[200px] sm:min-h-[240px] md:min-h-[280px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className="w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-center">
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[var(--neutral-900)] mb-6 sm:mb-8 leading-relaxed px-2 sm:px-4">
                    "{testimonials[currentIndex].quote}"
                  </p>
                  
                  <div className="flex flex-col items-center">
                    {testimonials[currentIndex].companyLogo ? (
                      <div className="mb-3 sm:mb-4 h-10 sm:h-12 flex items-center justify-center opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
                        <img
                          src={getLogoUrl(testimonials[currentIndex].companyLogo)}
                          alt={testimonials[currentIndex].company}
                          className="max-h-10 sm:max-h-12 max-w-[150px] sm:max-w-[200px] object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[var(--accent-blue)] flex items-center justify-center text-white text-lg sm:text-xl mb-2 sm:mb-3">
                        {testimonials[currentIndex].author.charAt(0)}
                      </div>
                    )}
                    <h4 className="mb-0.5 sm:mb-1 text-base sm:text-lg">{testimonials[currentIndex].author}</h4>
                    <p className="text-xs sm:text-sm text-[var(--neutral-700)]">
                      {testimonials[currentIndex].role}
                    </p>
                    <p className="text-xs sm:text-sm text-[var(--accent-blue)]">
                      {testimonials[currentIndex].company}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            {testimonials.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-0 sm:left-2 md:left-0 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-white border border-[var(--neutral-300)] flex items-center justify-center hover:border-[var(--accent-blue)] hover:text-[var(--accent-blue)] transition-colors shadow-md min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] md:min-w-[44px] md:min-h-[44px] z-10"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
                </button>
                
                <button
                  onClick={handleNext}
                  className="absolute right-0 sm:right-2 md:right-0 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-white border border-[var(--neutral-300)] flex items-center justify-center hover:border-[var(--accent-blue)] hover:text-[var(--accent-blue)] transition-colors shadow-md min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] md:min-w-[44px] md:min-h-[44px] z-10"
                  aria-label="Next testimoknial"
                >
                  <ChevronRight size={16} className="sm:w-5 sm:h-5" />
                </button>
              </>
            )}
          </div>

          {/* Indicators */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'w-6 sm:w-8 bg-[var(--accent-blue)]' 
                      : 'w-1.5 sm:w-2 bg-[var(--neutral-300)] hover:bg-[var(--accent-slate)]'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
