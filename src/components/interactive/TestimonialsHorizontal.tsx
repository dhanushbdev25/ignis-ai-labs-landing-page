import { useEffect, useRef, useState, useCallback } from 'react';

interface Testimonial {
  _id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  companyLogo?: string;
  companyLogoColor?: string;
}

interface TestimonialsHorizontalProps {
  testimonials: Testimonial[];
}

export default function TestimonialsHorizontal({ testimonials }: TestimonialsHorizontalProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const activeIndexRef = useRef(0);
  const isScrollingRef = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Create infinite loop array: [last-1, last, ...original..., first, second]
  const infiniteTestimonials = testimonials.length > 0 ? [
    ...testimonials.slice(-2), // Last 2 at the beginning
    ...testimonials,            // Original testimonials
    ...testimonials.slice(0, 2) // First 2 at the end
  ] : [];

  // Get the real testimonial index from the infinite array index
  const getRealIndex = (infiniteIndex: number): number => {
    if (testimonials.length === 0) return 0;
    // Account for the 2 duplicates at the beginning
    const realIndex = infiniteIndex - 2;
    if (realIndex < 0) {
      return testimonials.length + realIndex;
    }
    if (realIndex >= testimonials.length) {
      return realIndex - testimonials.length;
    }
    return realIndex;
  };

  // Update ref when activeIndex changes
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Helper function to center a testimonial in the infinite array
  const centerTestimonial = useCallback((infiniteIndex: number, smooth: boolean = true) => {
    const container = scrollContainerRef.current;
    if (!container || infiniteTestimonials.length === 0) return;

    const testimonialBlocks = container.querySelectorAll('.testimonial-block');
    if (testimonialBlocks.length === 0) return;

    const targetBlock = testimonialBlocks[infiniteIndex] as HTMLElement;
    if (!targetBlock) return;

    // Center the testimonial in the viewport
    const containerWidth = container.clientWidth;
    const blockWidth = targetBlock.offsetWidth;
    const blockLeft = targetBlock.offsetLeft;
    const scrollPosition = blockLeft - (containerWidth / 2) + (blockWidth / 2);
    
    isScrollingRef.current = true;
    container.scrollTo({
      left: Math.max(0, scrollPosition),
      behavior: smooth ? 'smooth' : 'auto',
    });
    
    const realIndex = getRealIndex(infiniteIndex);
    setActiveIndex(realIndex);
    
    // Reset scrolling flag after animation
    if (smooth) {
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 500);
    } else {
      isScrollingRef.current = false;
    }
  }, [infiniteTestimonials.length]);

  // Center first testimonial on mount (start at index 2, which is the first original testimonial)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || testimonials.length === 0) return;

    // Only center on desktop
    if (window.innerWidth < 768) return;

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      centerTestimonial(2, false); // Start at index 2 (first original testimonial)
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [testimonials.length, centerTestimonial]);

  // Handle infinite loop scroll jumps
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || testimonials.length === 0) return;

    // Only handle on desktop
    if (window.innerWidth < 768) return;

    const handleScroll = () => {
      if (isScrollingRef.current) return;

      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth;
      const containerWidth = container.clientWidth;
      const testimonialBlocks = container.querySelectorAll('.testimonial-block');
      
      if (testimonialBlocks.length === 0) return;

      const firstBlock = testimonialBlocks[0] as HTMLElement;
      const lastBlock = testimonialBlocks[testimonialBlocks.length - 1] as HTMLElement;
      
      // If scrolled to the end duplicates, jump to original end
      if (scrollLeft + containerWidth >= scrollWidth - 10) {
        const jumpToIndex = testimonials.length + 1; // Second to last original
        const jumpBlock = testimonialBlocks[jumpToIndex] as HTMLElement;
        if (jumpBlock) {
          const blockWidth = jumpBlock.offsetWidth;
          const blockLeft = jumpBlock.offsetLeft;
          const scrollPosition = blockLeft - (containerWidth / 2) + (blockWidth / 2);
          container.scrollTo({
            left: scrollPosition,
            behavior: 'auto',
          });
        }
      }
      // If scrolled to the beginning duplicates, jump to original beginning
      else if (scrollLeft <= 10) {
        const jumpToIndex = 2; // First original testimonial
        const jumpBlock = testimonialBlocks[jumpToIndex] as HTMLElement;
        if (jumpBlock) {
          const blockWidth = jumpBlock.offsetWidth;
          const blockLeft = jumpBlock.offsetLeft;
          const scrollPosition = blockLeft - (containerWidth / 2) + (blockWidth / 2);
          container.scrollTo({
            left: scrollPosition,
            behavior: 'auto',
          });
        }
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [testimonials.length]);

  // Auto-scroll carousel
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || testimonials.length === 0) return;

    // Only autoplay on desktop
    if (window.innerWidth < 768) return;

    const scrollToNext = () => {
      const testimonialBlocks = container.querySelectorAll('.testimonial-block');
      if (testimonialBlocks.length === 0) return;

      // Find current centered block
      const containerWidth = container.clientWidth;
      let currentInfiniteIndex = 2; // Default to first original
      
      testimonialBlocks.forEach((block, index) => {
        const blockElement = block as HTMLElement;
        const blockLeft = blockElement.offsetLeft;
        const blockWidth = blockElement.offsetWidth;
        const blockCenter = blockLeft + blockWidth / 2;
        const containerCenter = container.scrollLeft + containerWidth / 2;
        
        if (Math.abs(blockCenter - containerCenter) < blockWidth / 2) {
          currentInfiniteIndex = index;
        }
      });

      // Move to next
      const nextInfiniteIndex = (currentInfiniteIndex + 1) % infiniteTestimonials.length;
      centerTestimonial(nextInfiniteIndex, true);
    };

    // Auto-scroll every 5 seconds
    autoScrollIntervalRef.current = setInterval(scrollToNext, 5000);

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, [testimonials.length, infiniteTestimonials.length, centerTestimonial]);

  // Track active testimonial using Intersection Observer (center detection)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Only use observer on desktop
    if (window.innerWidth < 768) return;

    const testimonialBlocks = container.querySelectorAll('.testimonial-block');
    if (testimonialBlocks.length === 0) return;

    const observerOptions = {
      root: container,
      rootMargin: '-40% 0px -40% 0px', // Only trigger when centered (20% visible on each side)
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      if (isScrollingRef.current) return;
      
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          const infiniteIndex = Array.from(testimonialBlocks).indexOf(entry.target);
          if (infiniteIndex !== -1) {
            const realIndex = getRealIndex(infiniteIndex);
            setActiveIndex(realIndex);
          }
        }
      });
    }, observerOptions);

    testimonialBlocks.forEach((block) => observer.observe(block));

    return () => {
      observer.disconnect();
    };
  }, [testimonials.length]);

  return (
    <section
      id="testimonials"
      className="py-16 md:py-24 bg-[var(--color-bg-primary)]"
    >
      <div className="container-custom">
        {/* Subtle label */}
        <p className="text-center text-[var(--color-text-muted)] mb-12 text-xs uppercase tracking-[0.2em] font-medium">
          Testimonials
        </p>

        {/* Horizontal scroll container */}
        <div
          ref={scrollContainerRef}
          className="testimonials-horizontal-container"
        >
          <div ref={trackRef} className="testimonials-track">
            {infiniteTestimonials.map((testimonial, infiniteIndex) => {
              const realIndex = getRealIndex(infiniteIndex);
              const isActive = realIndex === activeIndex;
              return (
                <div
                  key={`${testimonial._id}-${infiniteIndex}`}
                  className={`testimonial-block ${isActive ? 'active' : ''}`}
                >
                  {/* Quote */}
                  <blockquote className="testimonial-quote">
                    {testimonial.quote}
                  </blockquote>

                  {/* Author info */}
                  <div className="testimonial-author-info">
                    <div className="testimonial-name">{testimonial.author}</div>
                    <div className="testimonial-role-company">
                      {testimonial.role} · {testimonial.company}
                    </div>
                  </div>

                  {/* Optional logo - subtle */}
                  {testimonial.companyLogo && (
                    <div className="testimonial-logo-wrapper">
                      <img
                        src={testimonial.companyLogo}
                        alt={`${testimonial.company} logo`}
                        className="testimonial-logo"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
