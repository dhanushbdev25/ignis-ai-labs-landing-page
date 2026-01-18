import { useState, useEffect, useRef, useCallback } from 'react';

interface MobileSliderSystem {
  name: string;
  outcome: string;
}

interface IntelligenceMobileSliderProps {
  systems: MobileSliderSystem[];
}

export default function IntelligenceMobileSlider({ systems }: IntelligenceMobileSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showTrace, setShowTrace] = useState(false);
  const [showLogoHalo, setShowLogoHalo] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeIndexRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const isScrollingRef = useRef(false);
  const touchEndTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update ref when activeIndex changes
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Smooth scroll detection using requestAnimationFrame
  const updateActiveIndex = useCallback((newIndex: number) => {
    const clampedIndex = Math.max(0, Math.min(newIndex, systems.length - 1));
    if (clampedIndex !== activeIndexRef.current) {
      activeIndexRef.current = clampedIndex;
      setActiveIndex(clampedIndex);
    }
  }, [systems.length]);

  // Use IntersectionObserver for reliable active slide detection
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const observerOptions = {
      root: container,
      rootMargin: '0px',
      threshold: [0.5, 0.6, 0.7], // Consider active when 50-70% visible
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      // Find the entry with highest intersection ratio
      let maxRatio = 0;
      let activeEntry: IntersectionObserverEntry | null = null;

      entries.forEach((entry) => {
        if (entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          activeEntry = entry;
        }
      });

      if (activeEntry && activeEntry.intersectionRatio >= 0.5) {
        const slideIndex = parseInt(activeEntry.target.getAttribute('data-slide-index') || '0', 10);
        updateActiveIndex(slideIndex);
      }
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    // Observe all slides
    slideRefs.current.forEach((slide, index) => {
      if (slide) {
        slide.setAttribute('data-slide-index', index.toString());
        observer.observe(slide);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [systems.length, updateActiveIndex]);

  // Fallback scroll handler using requestAnimationFrame for smooth updates
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }

      rafIdRef.current = requestAnimationFrame(() => {
        if (!container) return;

        const containerWidth = container.offsetWidth;
        const scrollLeft = container.scrollLeft;
        const slideIndex = Math.round(scrollLeft / containerWidth);
        updateActiveIndex(slideIndex);
        rafIdRef.current = null;
      });
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    // Initial check
    const initialIndex = Math.round(container.scrollLeft / container.offsetWidth);
    updateActiveIndex(initialIndex);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [updateActiveIndex]);

  // Programmatic scroll snap on touch end for smooth, bounce-free transitions
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let touchStartX = 0;
    let touchStartTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartTime = Date.now();
    };

    const handleTouchEnd = () => {
      if (touchEndTimeoutRef.current) {
        clearTimeout(touchEndTimeoutRef.current);
      }

      // Immediate snap without delay for smoother experience
      touchEndTimeoutRef.current = setTimeout(() => {
        if (!container) return;

        const containerWidth = container.offsetWidth;
        const scrollLeft = container.scrollLeft;
        const slideIndex = Math.round(scrollLeft / containerWidth);
        const targetScroll = slideIndex * containerWidth;

        // Snap to nearest slide immediately for smooth, bounce-free transition
        if (Math.abs(scrollLeft - targetScroll) > 5) {
          isScrollingRef.current = true;
          container.scrollTo({
            left: targetScroll,
            behavior: 'smooth',
          });

          setTimeout(() => {
            isScrollingRef.current = false;
          }, 250);
        }
      }, 50); // Reduced delay for more responsive snapping
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      if (touchEndTimeoutRef.current) {
        clearTimeout(touchEndTimeoutRef.current);
      }
    };
  }, []);

  // Trigger intelligence trace and logo acknowledgment on slide change
  useEffect(() => {
    setShowTrace(true);
    setShowLogoHalo(true);

    const traceTimeout = setTimeout(() => {
      setShowTrace(false);
    }, 500);

    const haloTimeout = setTimeout(() => {
      setShowLogoHalo(false);
    }, 300);

    return () => {
      clearTimeout(traceTimeout);
      clearTimeout(haloTimeout);
    };
  }, [activeIndex]);

  return (
    <div className="mobile-slider-container">
      <div ref={scrollContainerRef} className="mobile-slider-scroll">
        {systems.map((system, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={index}
              ref={(el) => (slideRefs.current[index] = el)}
              className={`mobile-slider-slide ${isActive ? 'active' : ''}`}
            >
              {/* Material layer */}
              {isActive && <div className="mobile-slider-material-layer" />}

              {/* Intelligence trace */}
              {isActive && showTrace && (
                <div className="mobile-slider-trace">
                  <div className="trace-line" />
                </div>
              )}

              {/* Logo */}
              <div
                className={`mobile-slider-logo ${isActive ? 'active' : ''} ${showLogoHalo && isActive ? 'acknowledging' : ''}`}
              >
                {system.name}
              </div>

              {/* Outcome text */}
              <div className={`mobile-slider-outcome ${isActive ? 'active' : ''}`}>
                {system.outcome}
              </div>
            </div>
          );
        })}
      </div>

      {/* Premium progress indicator */}
      <div className="mobile-slider-progress">
        <span className="mobile-slider-progress-text">
          {String(activeIndex + 1).padStart(2, '0')} / {String(systems.length).padStart(2, '0')}
        </span>
      </div>

      <style jsx>{`
        .mobile-slider-container {
          width: 100%;
          padding: 4rem 0;
          position: relative;
          background-color: var(--color-bg-primary);
          contain: layout style paint;
        }

        .mobile-slider-scroll {
          display: flex;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
          overscroll-behavior-x: none;
          overscroll-behavior-y: auto;
          touch-action: pan-x;
          contain: layout style;
        }

        .mobile-slider-scroll::-webkit-scrollbar {
          display: none;
        }

        .mobile-slider-slide {
          flex: 0 0 100%;
          width: 100%;
          min-width: 0;
          scroll-snap-align: center;
          scroll-snap-stop: always;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.5rem;
          min-height: 450px;
          position: relative;
          contain: layout style paint;
          scroll-margin: 0;
        }

        /* Material layer - only on active slide */
        .mobile-slider-material-layer {
          position: absolute;
          inset: 0;
          background: rgba(168, 85, 247, 0.05);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          box-shadow: inset 0 0 30px rgba(168, 85, 247, 0.08);
          pointer-events: none;
          z-index: 0;
        }

        /* Intelligence trace - connects logo to outcome */
        .mobile-slider-trace {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 1px;
          height: 120px;
          z-index: 1;
          pointer-events: none;
          opacity: 0;
          animation: traceAppear 0.5s ease-out forwards;
          overflow: hidden;
        }

        .trace-line {
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(168, 85, 247, 0.6) 50%,
            transparent 100%
          );
          box-shadow: 0 0 4px rgba(168, 85, 247, 0.4);
        }

        @keyframes traceAppear {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scaleY(0);
          }
          30% {
            opacity: 1;
            transform: translate(-50%, -50%) scaleY(1);
          }
          70% {
            opacity: 1;
            transform: translate(-50%, -50%) scaleY(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scaleY(1);
          }
        }

        .mobile-slider-logo {
          font-size: 2.25rem;
          font-weight: 700;
          color: var(--color-text-secondary);
          filter: grayscale(100%) blur(0.5px);
          opacity: 0.5;
          text-align: center;
          margin-bottom: 2.5rem;
          transition: filter 0.3s ease, opacity 0.3s ease, color 0.3s ease, transform 0.3s ease;
          white-space: nowrap;
          letter-spacing: -0.02em;
          position: relative;
          z-index: 2;
          background: transparent;
          border: none;
          padding: 0;
          box-shadow: none;
        }

        .mobile-slider-logo.active {
          filter: grayscale(0%) blur(0);
          opacity: 1;
          color: var(--color-text-primary);
        }

        /* Logo acknowledgment - scale and opacity only, no box-shadow */
        .mobile-slider-logo.acknowledging {
          animation: logoAcknowledge 0.3s ease-out;
        }

        @keyframes logoAcknowledge {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .mobile-slider-outcome {
          font-size: 1.125rem;
          line-height: 1.6;
          color: var(--color-text-secondary);
          text-align: center;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.4s ease-out, transform 0.4s ease-out;
          max-width: 85%;
          white-space: normal;
          word-wrap: break-word;
          overflow-wrap: break-word;
          font-weight: 400;
          position: relative;
          z-index: 2;
          will-change: opacity, transform;
          letter-spacing: 0;
        }

        .mobile-slider-outcome.active {
          opacity: 1;
          transform: translateY(0);
        }

        .mobile-slider-progress {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 2.5rem;
          padding: 0 1.5rem;
        }

        .mobile-slider-progress-text {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-text-muted);
          letter-spacing: 0.1em;
          font-variant-numeric: tabular-nums;
          opacity: 0.6;
          transition: opacity 0.2s ease, color 0.2s ease;
        }

        @media (prefers-reduced-motion: reduce) {
          .mobile-slider-logo,
          .mobile-slider-outcome,
          .mobile-slider-progress-text,
          .mobile-slider-slide {
            transition: none;
          }

          .mobile-slider-trace,
          .mobile-slider-logo.acknowledging,
          .mobile-slider-outcome.active {
            animation: none;
          }

          .mobile-slider-outcome {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
