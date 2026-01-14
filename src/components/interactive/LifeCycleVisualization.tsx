import { useEffect, useMemo, useState } from 'react';
import './LifeCycleVisualization.css';

interface Phase {
  _id: string;
  title: string;
  description: string;
  order: number;
}

interface LifeCycleVisualizationProps {
  phases: Phase[];
}

interface PhasePosition {
  x: number;
  y: number;
  angle: number;
}

interface TextPosition {
  offsetX: number;
  offsetY: number;
  align: 'left' | 'center' | 'right';
}

/**
 * Calculate positions for all phases in circular layout (desktop)
 */
function calculateCircularPositions(
  centerX: number,
  centerY: number,
  radius: number,
  phaseCount: number
): PhasePosition[] {
  const positions: PhasePosition[] = [];
  const angleStep = (2 * Math.PI) / phaseCount;

  for (let i = 0; i < phaseCount; i++) {
    // Start at top (-90 degrees) and distribute evenly
    const angle = i * angleStep - Math.PI / 2;
    positions.push({
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      angle: (angle * 180) / Math.PI,
    });
  }

  return positions;
}

/**
 * Calculate positions for all phases in vertical layout (mobile)
 * Line and markers on the left, text on the right
 */
function calculateVerticalPositions(
  centerX: number,
  svgHeight: number,
  phaseCount: number
): PhasePosition[] {
  const positions: PhasePosition[] = [];
  // Use more spacing between phases for better readability
  // Each phase needs ~120px of vertical space for text
  const minPhaseHeight = 120;
  const totalNeededHeight = phaseCount * minPhaseHeight;
  const topPadding = 40;
  const bottomPadding = 40;
  
  // If content needs more space, use calculated spacing, otherwise use even distribution
  const spacing = totalNeededHeight > svgHeight 
    ? (svgHeight - topPadding - bottomPadding) / phaseCount
    : minPhaseHeight;

  for (let i = 0; i < phaseCount; i++) {
    positions.push({
      x: centerX * 0.2, // Position line/markers at 20% from left
      y: topPadding + (spacing * i) + (spacing / 2),
      angle: 0,
    });
  }

  return positions;
}

/**
 * Calculate text block position based on phase index (desktop)
 */
function getDesktopTextPosition(index: number, baseOffset: number): TextPosition {
  // Text positioning around the circle
  // Index 0: Ignite (top) - center aligned
  // Index 1: Architect (top-right) - left aligned
  // Index 2: Construct (bottom-right) - left aligned
  // Index 3: Validate (bottom) - center aligned
  // Index 4: Activate (bottom-left) - right aligned
  // Index 5: Amplify (middle-left) - right aligned

  switch (index) {
    case 0: // Ignite - top, center
      return {
        offsetX: 0,
        offsetY: -100,
        align: 'center',
      };
    case 1: // Architect - top-right
      return {
        offsetX: baseOffset,
        offsetY: -baseOffset * 0.15,
        align: 'left',
      };
    case 2: // Construct - bottom-right
      return {
        offsetX: baseOffset,
        offsetY: baseOffset * 0.25,
        align: 'left',
      };
    case 3: // Validate - bottom, center
      return {
        offsetX: 0,
        offsetY: 120,
        align: 'center',
      };
    case 4: // Activate - bottom-left
      return {
        offsetX: -baseOffset,
        offsetY: baseOffset * 0.25,
        align: 'right',
      };
    case 5: // Amplify - middle-left
      return {
        offsetX: -baseOffset,
        offsetY: -baseOffset * 0.1,
        align: 'right',
      };
    default:
      return {
        offsetX: baseOffset,
        offsetY: 0,
        align: 'left',
      };
  }
}

/**
 * Generate vertical line path for mobile layout
 */
function generateVerticalPath(centerX: number, svgHeight: number, phasePositions: PhasePosition[]): string {
  if (phasePositions.length === 0) {
    const startY = svgHeight * 0.08;
    const endY = svgHeight * 0.92;
    const lineX = centerX * 0.2; // Match marker position
    return `M ${lineX} ${startY} L ${lineX} ${endY}`;
  }
  // Use first and last marker positions for line endpoints
  const firstY = phasePositions[0].y;
  const lastY = phasePositions[phasePositions.length - 1].y;
  const padding = 30; // Padding above first and below last marker
  const lineX = phasePositions[0].x; // Use marker X position
  return `M ${lineX} ${Math.max(firstY - padding, svgHeight * 0.05)} L ${lineX} ${Math.min(lastY + padding, svgHeight * 0.95)}`;
}

export default function LifeCycleVisualization({
  phases,
}: LifeCycleVisualizationProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  // Responsive breakpoint check
  useEffect(() => {
    const checkResponsive = () => {
      const width = window.innerWidth;
      setViewportWidth(width);
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkResponsive();
    window.addEventListener('resize', checkResponsive);
    return () => window.removeEventListener('resize', checkResponsive);
  }, []);

  // SVG dimensions - responsive based on viewport
  const svgSize = useMemo(() => {
    if (isMobile) {
      // Mobile: use viewport width for width, calculate height based on content
      const width = Math.min((viewportWidth || 400) - 32, 600); // Account for padding
      // Calculate height: phases need ~120px each + top/bottom padding
      const calculatedHeight = phases.length * 120 + 80;
      // Return width for X, but we'll use calculatedHeight for actual SVG height
      return { width, height: calculatedHeight };
    }
    if (isTablet) {
      // Tablet: medium size
      return { width: 700, height: 700 };
    }
    // Desktop: full size
    return { width: 900, height: 900 };
  }, [isMobile, isTablet, viewportWidth, phases.length]);

  const centerX = typeof svgSize === 'number' ? svgSize / 2 : svgSize.width / 2;
  const centerY = typeof svgSize === 'number' ? svgSize / 2 : svgSize.height / 2;
  const svgWidth = typeof svgSize === 'number' ? svgSize : svgSize.width;
  const svgHeight = typeof svgSize === 'number' ? svgSize : svgSize.height;
  const radius = useMemo(() => {
    if (isMobile) {
      return 0; // No circle on mobile, vertical line only
    }
    if (isTablet) {
      return 200; // Smaller radius for tablet
    }
    return 280; // Full radius for desktop
  }, [isMobile, isTablet]);

  // Calculate phase positions
  const phasePositions = useMemo(() => {
    if (isMobile) {
      return calculateVerticalPositions(centerX, svgHeight, phases.length);
    }
    // Tablet and desktop use circular layout
    return calculateCircularPositions(centerX, centerY, radius, phases.length);
  }, [isMobile, centerX, centerY, radius, svgHeight, phases.length]);

  // Generate mobile path (after positions are calculated)
  const mobilePath = useMemo(() => {
    if (isMobile) {
      return generateVerticalPath(centerX, svgHeight, phasePositions);
    }
    return '';
  }, [isMobile, centerX, svgHeight, phasePositions]);

  return (
    <div className="lifecycle-visualization-container">
      <div className="lifecycle-svg-wrapper">
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="lifecycle-svg"
          aria-label="Lifecycle evolution visualization"
        >
          <defs>
            {/* Minimalist static gradient */}
            <linearGradient
              id="pathGradient"
              x1="0%"
              y1="0%"
              x2={isMobile ? '0%' : '100%'}
              y2={isMobile ? '100%' : '0%'}
            >
              <stop offset="0%" stopColor="rgba(168, 85, 247, 0.3)" />
              <stop offset="50%" stopColor="rgba(168, 85, 247, 0.5)" />
              <stop offset="100%" stopColor="rgba(168, 85, 247, 0.3)" />
            </linearGradient>

            {/* Subtle glow filter - reduced blur */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Mobile: Vertical line */}
          {isMobile && (
            <path
              d={mobilePath}
              fill="none"
              stroke="rgba(168, 85, 247, 0.4)"
              strokeWidth={viewportWidth < 480 ? 1.5 : 2}
              strokeLinecap="round"
            />
          )}

          {/* Desktop & Tablet: Minimalist circle with continuous rotation */}
          {!isMobile && (
            <g transform={`translate(${centerX}, ${centerY})`}>
              <g>
                {/* Continuous rotation animation */}
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0"
                  to="360"
                  dur="20s"
                  repeatCount="indefinite"
                />
                {/* Single clean circle */}
                <circle
                  cx={0}
                  cy={0}
                  r={radius}
                  fill="none"
                  stroke="rgba(168, 85, 247, 0.4)"
                  strokeWidth={isTablet ? 1.5 : 2}
                  strokeLinecap="round"
                  className="main-circle"
                />

                {/* Phase markers positioned relative to center */}
                {phases.map((phase, index) => {
                  const pos = phasePositions[index];
                  // Calculate relative position from center
                  const relativeX = pos.x - centerX;
                  const relativeY = pos.y - centerY;

                  return (
                    <g
                      key={phase._id}
                      className="phase-marker-group"
                      transform={`translate(${relativeX}, ${relativeY})`}
                    >
                      {/* Single clean marker circle */}
                      <circle
                        cx={0}
                        cy={0}
                        r={isTablet ? 7 : 8}
                        fill="rgba(168, 85, 247, 0.8)"
                        className="phase-marker"
                      />
                    </g>
                  );
                })}
              </g>
            </g>
          )}

          {/* Mobile: Phase markers (static, no rotation) */}
          {isMobile &&
            phases.map((phase, index) => {
              const pos = phasePositions[index];

              return (
                <g key={phase._id} className="phase-marker-group">
                  {/* Single clean marker circle */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={viewportWidth < 480 ? 6 : 8}
                    fill="rgba(168, 85, 247, 0.8)"
                    className="phase-marker"
                  />
                </g>
              );
            })}
        </svg>

        {/* Phase descriptions */}
        <div className="phase-descriptions">
          {phases.map((phase, index) => {
            const pos = phasePositions[index];
            const leftPercent = (pos.x / svgWidth) * 100;
            const topPercent = (pos.y / svgHeight) * 100;

            let textPosition: TextPosition;
            if (isMobile) {
              // Mobile: Position text to the right of the line/marker
              // Line is at 20% of SVG width, text starts at ~35% with proper spacing
              const lineXPercent = 20; // Line position as percentage
              const textStartPercent = 35; // Text start position
              const offsetFromCenter = ((textStartPercent - 50) / 100) * svgWidth;
              textPosition = {
                offsetX: offsetFromCenter,
                offsetY: 0, // Align vertically with marker
                align: 'left',
              };
            } else if (isTablet) {
              // Tablet: Position based on phase index with adjusted offset
              const baseOffset = 120; // Smaller offset for tablet
              textPosition = getDesktopTextPosition(index, baseOffset);
            } else {
              // Desktop: Position based on phase index
              textPosition = getDesktopTextPosition(index, 160);
            }

            return (
              <div
                key={phase._id}
                className={`phase-description active ${isMobile ? 'phase-description-mobile' : ''}`}
                style={
                  isMobile
                    ? {
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: `${topPercent}%`,
                        transform: 'translateY(-50%)',
                        textAlign: 'left',
                        paddingLeft: `calc(${svgWidth * 0.2}px + 1.5rem)`,
                        paddingRight: '1rem',
                        paddingTop: '0.75rem',
                        paddingBottom: '0.75rem',
                        boxSizing: 'border-box',
                        width: '100%',
                      }
                    : {
                        position: 'absolute',
                        left: `${leftPercent}%`,
                        top: `${topPercent}%`,
                        transform: `translate(calc(-50% + ${textPosition.offsetX}px), calc(-50% + ${textPosition.offsetY}px))`,
                        textAlign: textPosition.align,
                        maxWidth: isTablet ? '220px' : '200px',
                        padding: isTablet ? '0.625rem' : '0.75rem',
                      }
                }
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
