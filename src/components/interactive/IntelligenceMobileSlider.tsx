import { useState, useEffect, useRef } from 'react';

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
  const [isSettling, setIsSettling] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const logoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const outcomeRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Detect active slide using Intersection Observer
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const index = slideRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1 && index !== activeIndex) {
              setActiveIndex(index);
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.5,
      }
    );

    slideRefs.current.forEach((slide) => {
      if (slide) observer.observe(slide);
    });

    return () => {
      slideRefs.current.forEach((slide) => {
        if (slide) observer.unobserve(slide);
      });
    };
  }, [systems, activeIndex]);

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

  // Touch swipe handling - improved for smoother scrolling
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const isScrolling = useRef(false);

  const minSwipeDistance = 30;

  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
    isScrolling.current = false;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStartX.current || !touchStartY.current) return;
    
    const currentX = e.targetTouches[0].clientX;
    const currentY = e.targetTouches[0].clientY;
    const deltaX = Math.abs(currentX - touchStartX.current);
    const deltaY = Math.abs(currentY - touchStartY.current);
    
    // Detect if user is scrolling vertically or horizontally
    if (deltaY > deltaX) {
      isScrolling.current = true;
    }
    
    touchEndX.current = currentX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current || isScrolling.current) {
      touchStartX.current = null;
      touchEndX.current = null;
      return;
    }
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && activeIndex < systems.length - 1) {
      scrollToSlide(activeIndex + 1);
      triggerHapticFeedback();
    } else if (isRightSwipe && activeIndex > 0) {
      scrollToSlide(activeIndex - 1);
      triggerHapticFeedback();
    }
    
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const triggerHapticFeedback = () => {
    setIsSettling(true);
    setTimeout(() => {
      setIsSettling(false);
    }, 100);
  };

  const scrollToSlide = (index: number) => {
    const slide = slideRefs.current[index];
    if (slide && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const slideLeft = slide.offsetLeft;
      const slideWidth = slide.offsetWidth;
      const containerWidth = container.offsetWidth;
      const scrollPosition = slideLeft - (containerWidth / 2) + (slideWidth / 2);
      
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="mobile-slider-container">
      <div
        ref={scrollContainerRef}
        className="mobile-slider-scroll"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {systems.map((system, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={index}
              ref={(el) => (slideRefs.current[index] = el)}
              className={`mobile-slider-slide ${isActive ? 'active' : ''} ${isSettling && isActive ? 'settling' : ''}`}
            >
              {/* Material layer */}
              {isActive && <div className="mobile-slider-material-layer" />}

              {/* Intelligence trace */}
              {isActive && showTrace && (
                <svg className="mobile-slider-trace" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <line
                    x1="50"
                    y1="30"
                    x2="50"
                    y2="70"
                    stroke="url(#traceGradient)"
                    strokeWidth="0.5"
                    className="trace-line"
                  />
                  <defs>
                    <linearGradient id="traceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(168, 85, 247, 0)" />
                      <stop offset="50%" stopColor="rgba(168, 85, 247, 0.6)" />
                      <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
                    </linearGradient>
                  </defs>
                </svg>
              )}

              {/* Logo */}
              <div
                ref={(el) => (logoRefs.current[index] = el)}
                className={`mobile-slider-logo ${isActive ? 'active' : ''} ${showLogoHalo && isActive ? 'acknowledging' : ''}`}
              >
                {system.name}
              </div>

              {/* Outcome text */}
              <div
                ref={(el) => (outcomeRefs.current[index] = el)}
                className={`mobile-slider-outcome ${isActive ? 'active' : ''}`}
              >
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
          overscroll-behavior-x: contain;
          touch-action: pan-x;
        }

        .mobile-slider-scroll::-webkit-scrollbar {
          display: none;
        }

        .mobile-slider-slide {
          flex: 0 0 100%;
          width: 100%;
          scroll-snap-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.5rem;
          min-height: 450px;
          position: relative;
          transition: transform 0.1s ease-out;
        }

        .mobile-slider-slide.settling {
          transform: scale(0.99);
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
          top: calc(50% - 60px);
          left: 50%;
          transform: translateX(-50%);
          width: 1px;
          height: 120px;
          z-index: 1;
          pointer-events: none;
          opacity: 0;
          animation: traceAppear 0.5s ease-out forwards;
        }

        @keyframes traceAppear {
          0% {
            opacity: 0;
            transform: translateX(-50%) scaleY(0);
          }
          30% {
            opacity: 1;
            transform: translateX(-50%) scaleY(1);
          }
          70% {
            opacity: 1;
            transform: translateX(-50%) scaleY(1);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) scaleY(1);
          }
        }

        .trace-line {
          filter: drop-shadow(0 0 3px rgba(168, 85, 247, 0.8));
        }

        .mobile-slider-logo {
          font-size: 2.25rem;
          font-weight: 700;
          color: var(--color-text-secondary);
          filter: grayscale(100%) blur(0.5px);
          opacity: 0.5;
          text-align: center;
          margin-bottom: 2.5rem;
          transition: filter 0.2s ease, opacity 0.2s ease, color 0.2s ease;
          white-space: nowrap;
          letter-spacing: -0.02em;
          position: relative;
          z-index: 2;
        }

        .mobile-slider-logo.active {
          filter: grayscale(0%) blur(0);
          opacity: 1;
          color: var(--color-text-primary);
        }

        /* Logo acknowledgment halo */
        .mobile-slider-logo.acknowledging {
          animation: logoAcknowledge 0.3s ease-out;
        }

        @keyframes logoAcknowledge {
          0% {
            box-shadow: 0 0 0 rgba(168, 85, 247, 0);
          }
          50% {
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
          }
          100% {
            box-shadow: 0 0 0 rgba(168, 85, 247, 0);
          }
        }

        .mobile-slider-outcome {
          font-size: 1.125rem;
          line-height: 1.6;
          color: var(--color-text-secondary);
          text-align: center;
          opacity: 0;
          filter: blur(2px);
          letter-spacing: 0.02em;
          transition: opacity 0.15s ease-out, filter 0.15s ease-out, letter-spacing 0.15s ease-out;
          max-width: 85%;
          white-space: normal;
          word-wrap: break-word;
          font-weight: 400;
          position: relative;
          z-index: 2;
        }

        .mobile-slider-outcome.active {
          opacity: 1;
          filter: blur(0);
          letter-spacing: 0;
          animation: textResolve 0.15s ease-out;
        }

        @keyframes textResolve {
          0% {
            opacity: 0;
            filter: blur(2px);
            letter-spacing: 0.02em;
          }
          100% {
            opacity: 1;
            filter: blur(0);
            letter-spacing: 0;
          }
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
        }
      `}</style>
    </div>
  );
}
