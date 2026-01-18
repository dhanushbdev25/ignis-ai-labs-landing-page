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
  const userInteractedRef = useRef(false);
  const autoScrollResumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    currentInfiniteIndexRef.current = infiniteIndex;
    
    container.scrollTo({
      left: Math.max(0, scrollPosition),
      behavior: smooth ? 'smooth' : 'auto',
    });
    
    // Calculate real index inline
    const realIndex = (() => {
      if (testimonials.length === 0) return 0;
      const realIdx = infiniteIndex - 2;
      if (realIdx < 0) {
        return testimonials.length + realIdx;
      }
      if (realIdx >= testimonials.length) {
        return realIdx - testimonials.length;
      }
      return realIdx;
    })();
    setActiveIndex(realIndex);
    
    // Reset scrolling flag after animation
    if (smooth) {
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 500);
    } else {
      isScrollingRef.current = false;
    }
  }, [infiniteTestimonials.length, testimonials.length]);

  // Center first testimonial on mount (start at index 2, which is the first original testimonial)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || testimonials.length === 0) return;

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      centerTestimonial(2, false); // Start at index 2 (first original testimonial)
      currentInfiniteIndexRef.current = 2;
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [testimonials.length, centerTestimonial]);

  // Handle infinite loop scroll jumps
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || testimonials.length === 0) return;

    const handleScroll = () => {
      if (isScrollingRef.current) return;

      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth;
      const containerWidth = container.clientWidth;
      const testimonialBlocks = container.querySelectorAll('.testimonial-block');
      
      if (testimonialBlocks.length === 0) return;
      
      // If scrolled to the end duplicates, jump to original start
      if (scrollLeft + containerWidth >= scrollWidth - 50) {
        isScrollingRef.current = true;
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
          currentInfiniteIndexRef.current = 2;
          setTimeout(() => {
            isScrollingRef.current = false;
          }, 100);
        }
      }
      // If scrolled to the beginning duplicates, jump to original end
      else if (scrollLeft <= 50) {
        isScrollingRef.current = true;
        const jumpToIndex = testimonials.length + 1; // Last original testimonial
        const jumpBlock = testimonialBlocks[jumpToIndex] as HTMLElement;
        if (jumpBlock) {
          const blockWidth = jumpBlock.offsetWidth;
          const blockLeft = jumpBlock.offsetLeft;
          const scrollPosition = blockLeft - (containerWidth / 2) + (blockWidth / 2);
          container.scrollTo({
            left: scrollPosition,
            behavior: 'auto',
          });
          currentInfiniteIndexRef.current = jumpToIndex;
          setTimeout(() => {
            isScrollingRef.current = false;
          }, 100);
        }
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [testimonials.length]);

  // Track current infinite index
  const currentInfiniteIndexRef = useRef(2); // Start at first original testimonial

  // Function to start auto-scroll
  const startAutoScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || testimonials.length === 0) return;

    // Clear any existing interval
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
    }

    const scrollToNext = () => {
      // Don't scroll if user has interacted
      if (userInteractedRef.current) return;

      const testimonialBlocks = container.querySelectorAll('.testimonial-block');
      if (testimonialBlocks.length === 0) return;

      // Get current index and move to next
      let nextInfiniteIndex = currentInfiniteIndexRef.current + 1;
      
      // If we've reached the end duplicates, jump to the original start seamlessly
      if (nextInfiniteIndex >= testimonials.length + 2) {
        // We're at the end duplicates, jump to original start (index 2)
        nextInfiniteIndex = 2;
        isScrollingRef.current = true;
        
        // Jump without animation
        const jumpBlock = testimonialBlocks[2] as HTMLElement;
        if (jumpBlock) {
          const containerWidth = container.clientWidth;
          const blockWidth = jumpBlock.offsetWidth;
          const blockLeft = jumpBlock.offsetLeft;
          const scrollPosition = blockLeft - (containerWidth / 2) + (blockWidth / 2);
          
          container.scrollTo({
            left: scrollPosition,
            behavior: 'auto',
          });
          
          setTimeout(() => {
            isScrollingRef.current = false;
            currentInfiniteIndexRef.current = 2;
            const realIndex = getRealIndex(2);
            setActiveIndex(realIndex);
          }, 50);
        }
      } else {
        // Normal scroll to next
        currentInfiniteIndexRef.current = nextInfiniteIndex;
        centerTestimonial(nextInfiniteIndex, true);
      }
    };

    // Auto-scroll every 5 seconds
    autoScrollIntervalRef.current = setInterval(scrollToNext, 5000);
  }, [testimonials.length, centerTestimonial]);

  // Handle testimonial click
  const handleTestimonialClick = useCallback((infiniteIndex: number) => {
    // Prevent click during programmatic scrolling
    if (isScrollingRef.current) return;

    // Mark user interaction
    userInteractedRef.current = true;

    // Clear any existing auto-scroll resume timeout
    if (autoScrollResumeTimeoutRef.current) {
      clearTimeout(autoScrollResumeTimeoutRef.current);
      autoScrollResumeTimeoutRef.current = null;
    }

    // Pause auto-scroll
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }

    // Center the clicked testimonial
    centerTestimonial(infiniteIndex, true);

    // Restart auto-scroll after 10 seconds of no interaction
    autoScrollResumeTimeoutRef.current = setTimeout(() => {
      userInteractedRef.current = false;
      startAutoScroll();
    }, 10000);
  }, [centerTestimonial, startAutoScroll]);

  // Auto-scroll carousel with infinite loop
  useEffect(() => {
    // Don't start auto-scroll if user has interacted
    if (userInteractedRef.current) return;

    startAutoScroll();

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
      if (autoScrollResumeTimeoutRef.current) {
        clearTimeout(autoScrollResumeTimeoutRef.current);
      }
    };
  }, [testimonials.length, startAutoScroll]);

  // Track active testimonial using Intersection Observer (center detection)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

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
                  className={`testimonial-block ${isActive ? 'active' : ''} cursor-pointer`}
                  onClick={() => handleTestimonialClick(infiniteIndex)}
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
