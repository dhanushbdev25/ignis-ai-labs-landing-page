import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  quote: string;
  author: string;
  title: string;
  company: string;
}

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials: Testimonial[] = [
    {
      quote: "Ignis AI Labs transformed our supply chain operations with a solution that exceeded expectations. Their technical expertise and understanding of enterprise complexity is unmatched.",
      author: "Sarah Chen",
      title: "VP of Operations",
      company: "Global Manufacturing Corp"
    },
    {
      quote: "The AI-powered analytics platform delivered insights we never thought possible. The team's professionalism and delivery speed were exceptional.",
      author: "Michael Rodriguez",
      title: "Chief Technology Officer",
      company: "FinTech Solutions Inc"
    },
    {
      quote: "Working with Ignis AI Labs felt like having an extension of our team. They understood our healthcare compliance requirements and delivered a HIPAA-compliant solution on time.",
      author: "Dr. Emily Patterson",
      title: "Director of Health Informatics",
      company: "Regional Health Network"
    }
  ];

  const logos = [
    { name: 'Enterprise Corp', width: 120 },
    { name: 'Tech Solutions', width: 140 },
    { name: 'Global Industries', width: 130 },
    { name: 'Innovation Labs', width: 110 },
    { name: 'Digital Systems', width: 125 }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="py-[var(--s-8)] bg-[var(--surface-light)]">
      <div className="max-w-[1400px] mx-auto px-[120px]">
        {/* Client Logos */}
        <div className="mb-16">
          <p className="text-center text-sm text-[var(--neutral-700)] mb-8 uppercase tracking-wider">
            Trusted by Industry Leaders
          </p>
          <div className="flex items-center justify-center gap-12 flex-wrap opacity-40">
            {logos.map((logo, index) => (
              <div
                key={index}
                className="h-8 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
                style={{ width: logo.width }}
              >
                <div className="text-[var(--neutral-900)] text-sm tracking-tight">
                  {logo.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative min-h-[280px] flex items-center">
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
                  <p className="text-2xl text-[var(--neutral-900)] mb-8 leading-relaxed">
                    "{testimonials[currentIndex].quote}"
                  </p>
                  
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-[var(--accent-blue)] flex items-center justify-center text-white text-xl mb-3">
                      {testimonials[currentIndex].author.charAt(0)}
                    </div>
                    <h4 className="mb-1">{testimonials[currentIndex].author}</h4>
                    <p className="text-sm text-[var(--neutral-700)]">
                      {testimonials[currentIndex].title}
                    </p>
                    <p className="text-sm text-[var(--accent-blue)]">
                      {testimonials[currentIndex].company}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
              onClick={handlePrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-[var(--neutral-300)] flex items-center justify-center hover:border-[var(--accent-blue)] hover:text-[var(--accent-blue)] transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
            
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-[var(--neutral-300)] flex items-center justify-center hover:border-[var(--accent-blue)] hover:text-[var(--accent-blue)] transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Indicators */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'w-8 bg-[var(--accent-blue)]' 
                    : 'w-2 bg-[var(--neutral-300)] hover:bg-[var(--accent-slate)]'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
