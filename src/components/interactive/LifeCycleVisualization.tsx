import { useEffect, useRef, useState } from 'react';

interface Phase {
  _id: string;
  title: string;
  description: string;
  order: number;
}

interface LifeCycleVisualizationProps {
  phases: Phase[];
}

export default function LifeCycleVisualization({ phases }: LifeCycleVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // SVG dimensions
  const svgSize = isMobile ? 800 : 900;
  const centerX = svgSize / 2;
  const centerY = svgSize / 2;
  const radius = isMobile ? 0 : 280; // Static circle radius

  // Calculate phase positions
  const getPhasePosition = (index: number) => {
    if (isMobile) {
      // Vertical layout for mobile
      const totalHeight = svgSize;
      const spacing = totalHeight / (phases.length + 1);
      return {
        x: centerX,
        y: spacing * (index + 1),
        angle: 0,
      };
    } else {
      // Circular layout for desktop
      const angle = (index / phases.length) * 2 * Math.PI - Math.PI / 2; // Start at top
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        angle: (angle * 180) / Math.PI,
      };
    }
  };

  // Generate SVG path (mobile only)
  const generatePath = () => {
    // Vertical line path for mobile
    const startY = svgSize * 0.1;
    const endY = svgSize * 0.9;
    return `M ${centerX} ${startY} L ${centerX} ${endY}`;
  };

  const pathLength = isMobile ? svgSize * 0.8 : 2 * Math.PI * radius;

  return (
    <div ref={containerRef} className="lifecycle-visualization-container">
      <div className="lifecycle-svg-wrapper">
        <svg
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          className="lifecycle-svg"
          style={{ overflow: 'visible' }}
        >
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2={isMobile ? '0%' : '100%'} y2={isMobile ? '100%' : '0%'}>
            <stop offset="0%" stopColor="#9333ea" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#7c3aed" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Path line - Static complete circle/line */}
        {isMobile ? (
          <path
            d={generatePath()}
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth={2}
            strokeLinecap="round"
            filter="url(#glow)"
          />
        ) : (
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth={3}
            strokeLinecap="round"
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: `${centerX}px ${centerY}px`,
            }}
            filter="url(#glow)"
          />
        )}

        {/* Phase markers - All visible statically */}
        {phases.map((phase, index) => {
          const pos = getPhasePosition(index);

          return (
            <g key={phase._id} className="phase-marker-group">
              {/* Glow circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isMobile ? 12 : 16}
                fill="rgba(168, 85, 247, 0.4)"
                opacity={0.8}
                style={{
                  filter: 'blur(8px)',
                  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
              {/* Main circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isMobile ? 8 : 10}
                fill="#a855f7"
                style={{
                  filter: 'drop-shadow(0 0 16px rgba(168, 85, 247, 0.6))',
                  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            </g>
          );
        })}
        </svg>

        {/* Phase descriptions - All visible statically */}
        <div className="phase-descriptions">
        {phases.map((phase, index) => {
          const pos = getPhasePosition(index);

          // Calculate percentage positions
          const leftPercent = (pos.x / svgSize) * 100;
          const topPercent = (pos.y / svgSize) * 100;

          // Hardcode positioning for each step to ensure correct alignment
          let textOffsetX = 0;
          let textOffsetY = 0;
          let textAlign: 'left' | 'center' | 'right' = 'left';
          
          if (!isMobile) {
            const baseOffset = 160; // Base distance from circle point to prevent overlap
            
            // Hardcode each step based on index
            // Index 0: Ignite (top) - center, closer to circle
            // Index 1: Architect (top-right) - RIGHT
            // Index 2: Construct (bottom-right) - RIGHT
            // Index 3: Validate (bottom-middle-right) - RIGHT, directly under circle
            // Index 4: Activate (bottom-left) - LEFT
            // Index 5: Amplify (middle-left) - LEFT
            
            switch (index) {
              case 0: // Ignite - top, center, closer to circle point
                textOffsetY = -100; // Reduced from -baseOffset to bring it closer
                textAlign = 'center';
                break;
              case 1: // Architect - top-right, text on RIGHT
                textOffsetX = baseOffset;
                textOffsetY = -baseOffset * 0.15;
                textAlign = 'left';
                break;
              case 2: // Construct - bottom-right, text on RIGHT
                textOffsetX = baseOffset;
                textOffsetY = baseOffset * 0.25;
                textAlign = 'left';
                break;
              case 3: // Validate - right side (90°), centered like Ignite, with spacing from circle point
                textOffsetX = 0; // Center horizontally to align with Ignite
                textOffsetY = 120; // Below the circle point with proper spacing like other steps
                textAlign = 'center'; // Center align like Ignite
                break;
              case 4: // Activate - bottom-left, text on LEFT
                textOffsetX = -baseOffset;
                textOffsetY = baseOffset * 0.25;
                textAlign = 'right';
                break;
              case 5: // Amplify - middle-left, text on LEFT
                textOffsetX = -baseOffset;
                textOffsetY = -baseOffset * 0.1;
                textAlign = 'right';
                break;
              default:
                // Fallback
                textOffsetX = baseOffset;
                textAlign = 'left';
            }
          } else {
            // Mobile: Center all text below nodes with consistent spacing
            textOffsetY = 60; // Consistent spacing below node on mobile
            textAlign = 'center';
          }

          return (
            <div
              key={phase._id}
              className="phase-description active"
              style={{
                position: 'absolute',
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
                transform: `translate(calc(-50% + ${textOffsetX}px), calc(-50% + ${textOffsetY}px))`,
                textAlign: textAlign as 'left' | 'center' | 'right',
                opacity: 1,
                pointerEvents: 'auto',
                maxWidth: isMobile ? '280px' : '200px', // Force text wrapping with narrower width
                padding: isMobile ? '0.5rem' : '0.75rem',
              }}
            >
              <h3 className="phase-title">{phase.title}</h3>
              <p className="phase-text">{phase.description}</p>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}
