import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
  _id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  companyLogo?: string;
  companyLogoColor?: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

export default function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0);

  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, goToNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setIsAutoPlaying(false);
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        setIsAutoPlaying(false);
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    goToPrev();
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    goToNext();
  };

  // Refined animation variants
  const cardVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  const contentVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1]
      }
    },
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section 
      id="testimonials" 
      className="py-16 md:py-20 bg-white overflow-hidden"
    >
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="section-label mb-4 inline-block">Testimonials</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-[var(--color-text-primary)]">
            What our clients say
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Don't just take our word for it
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-purple-50/50 to-white rounded-2xl p-8 md:p-12 border border-purple-100/50 shadow-lg">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                }}
                className="flex flex-col items-center text-center"
              >
                {/* Star Rating */}
                <motion.div 
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  className="flex gap-1 mb-6"
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg 
                      key={star} 
                      className="w-5 h-5 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </motion.div>

                {/* Quote */}
                <motion.blockquote 
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  className="text-xl md:text-2xl text-[var(--color-text-primary)] leading-relaxed mb-8 italic font-light max-w-3xl"
                >
                  "{currentTestimonial.quote}"
                </motion.blockquote>

                {/* Company Logo and Name */}
                <div className="flex flex-col items-center gap-3 mt-4">
                  {currentTestimonial.companyLogo && (
                    <div 
                      className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md group flex items-center justify-center"
                    >
                      <img 
                        src={currentTestimonial.companyLogo}
                        alt={`${currentTestimonial.company} logo`}
                        className="max-w-full max-h-full object-contain transition-all duration-300"
                      />
                    </div>
                  )}
                  <div className="text-center">
                    <div className="font-semibold text-base md:text-lg text-[var(--color-text-primary)]">
                      {currentTestimonial.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center transition-all duration-200 hover:border-purple-300 hover:shadow-md group"
              aria-label="Previous testimonial"
            >
              <svg 
                className="w-5 h-5 text-[var(--color-text-secondary)] group-hover:text-purple-600 transition-colors" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={handleNext}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center transition-all duration-200 hover:border-purple-300 hover:shadow-md group"
              aria-label="Next testimonial"
            >
              <svg 
                className="w-5 h-5 text-[var(--color-text-secondary)] group-hover:text-purple-600 transition-colors" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`
                  h-1.5 rounded-full transition-all duration-300
                  ${index === currentIndex 
                    ? 'w-8 bg-purple-600' 
                    : 'w-1.5 bg-gray-300 hover:bg-purple-300'
                  }
                `}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
