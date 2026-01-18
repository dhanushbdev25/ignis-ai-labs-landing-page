import { useState, useEffect, useRef, useCallback } from 'react';

interface DialSystem {
  name: string;
  microText: string;
}

interface IntelligenceDialProps {
  systems: DialSystem[];
}

interface LogoPosition {
  x: number;
  y: number;
  angle: number;
}

export default function IntelligenceDial({ systems }: IntelligenceDialProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [logoPositions, setLogoPositions] = useState<LogoPosition[]>([]);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Calculate positions
  const calculatePositions = useCallback(() => {
    if (!containerRef.current || !coreRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width || container.offsetWidth || 800;
    const containerHeight = containerRect.height || container.offsetHeight || 600;
    
    // If container has no dimensions, wait a bit
    if (containerWidth === 0 || containerHeight === 0) {
      return;
    }
    
    // Use center of container as reference
    const coreX = containerWidth / 2;
    const coreY = containerHeight / 2;

    setContainerSize({ width: containerWidth, height: containerHeight });

    // Calculate ring radius (distance from core center to logo center)
    // Increased to 0.52 to add more space between logos and core
    const ringRadius = Math.min(containerWidth, containerHeight) * 0.50;
    
    // Calculate positions for each logo
    const positions: LogoPosition[] = systems.map((_, index) => {
      const angle = (index * 360) / systems.length - 90; // Start from top (-90deg)
      const radian = (angle * Math.PI) / 180;
      const x = coreX + ringRadius * Math.cos(radian);
      const y = coreY + ringRadius * Math.sin(radian);
      return { x, y, angle };
    });

    setLogoPositions(positions);
  }, [systems]);

  // Auto-rotation
  useEffect(() => {
    if (isMobile || isPaused) return;

    const rotateInterval = 3500; // 3.5 seconds

    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % systems.length);
    }, rotateInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [systems.length, isPaused, isMobile]);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update positions on mount and resize
  useEffect(() => {
    // Delay initial calculation to ensure DOM is ready
    const timer = setTimeout(() => {
      calculatePositions();
    }, 100);

    const handleResize = () => {
      calculatePositions();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [calculatePositions]);

  const handleLogoInteraction = (index: number) => {
    setActiveIndex(index);
    if (!isMobile) {
      setIsPaused(true);
      setTimeout(() => setIsPaused(false), 5000); // Resume after 5 seconds
    }
  };

  const handleLogoHover = (index: number | null) => {
    setHoveredIndex(index);
  };

  const activeSystem = systems[activeIndex];

  return (
    <div className="dial-container" ref={containerRef}>
      {/* Static Core */}
      <div className={`dial-core ${hoveredIndex !== null ? 'core-hovered' : ''}`} ref={coreRef}>
        <div className="core-glow"></div>
        <div className="core-inner">
          <div className="core-label">Ignis Intelligence</div>
          <div className={`core-micro-text ${activeSystem ? 'visible' : ''}`}>
            {activeSystem?.microText || ''}
          </div>
        </div>
      </div>

      {/* Dial Ring - Logos */}
      <div className="dial-ring">
        {systems.map((system, index) => {
          const position = logoPositions[index];
          const isActive = index === activeIndex;
          
          // Calculate fallback position if not yet calculated
          let displayX = 0;
          let displayY = 0;
          
          if (position) {
            displayX = position.x;
            displayY = position.y;
          } else {
            // Fallback: calculate based on angle (assume 400x300 container center)
            const angle = (index * 360) / systems.length - 90;
            const radian = (angle * Math.PI) / 180;
            const radius = 200;
            displayX = 400 + radius * Math.cos(radian);
            displayY = 300 + radius * Math.sin(radian);
          }

          return (
            <div
              key={index}
              className={`dial-logo ${isActive ? 'active' : ''}`}
              style={{
                position: 'absolute',
                left: `${displayX}px`,
                top: `${displayY}px`,
                transform: 'translate(-50%, -50%)',
                opacity: position ? 1 : 0.3,
              }}
              onMouseEnter={() => {
                if (!isMobile) {
                  handleLogoInteraction(index);
                  handleLogoHover(index);
                }
              }}
              onMouseLeave={() => handleLogoHover(null)}
              onClick={() => handleLogoInteraction(index)}
              role="button"
              tabIndex={0}
              aria-label={`${system.name} - ${system.microText}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleLogoInteraction(index);
                }
              }}
            >
              <span className="logo-text">{system.name}</span>
            </div>
          );
        })}
      </div>

    </div>
  );
}
