import { useEffect, useRef, useState } from 'react';
import { ScrollJackController } from '../../lib/scroll/scrollJack';

interface ScrollJackHostProps {
  /** Children to render */
  children: React.ReactNode;
  /** Callback when progress changes (0-1) */
  onProgress: (progress: number) => void;
  /** Scroll sensitivity (default: 0.5) */
  sensitivity?: number;
  /** Minimum viewport overlap to activate (default: 0.1) */
  activationThreshold?: number;
  /** Whether scroll-jack is enabled */
  enabled?: boolean;
  /** Additional className for the container */
  className?: string;
}

/**
 * ScrollJackHost - React wrapper for scroll-jacking
 * Wraps content and manages scroll interception to drive controlled progress
 */
export default function ScrollJackHost({
  children,
  onProgress,
  sensitivity = 0.5,
  activationThreshold = 0.1,
  enabled = true,
  className = '',
}: ScrollJackHostProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<ScrollJackController | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const shouldEnable = enabled && !prefersReducedMotion;

    // Create controller
    controllerRef.current = new ScrollJackController({
      target: containerRef.current,
      onProgress: (progress) => {
        onProgress(progress);
        // Dispatch custom event for Astro scripts to listen to
        window.dispatchEvent(new CustomEvent('scrolljack-progress', { 
          detail: { progress, target: containerRef.current } 
        }));
      },
      onLockChange: (locked) => {
        setIsLocked(locked);
        window.dispatchEvent(new CustomEvent('scrolljack-lock', { 
          detail: { isLocked: locked, target: containerRef.current } 
        }));
      },
      sensitivity,
      activationThreshold,
      enabled: shouldEnable,
    });

    // Cleanup
    return () => {
      controllerRef.current?.destroy();
      controllerRef.current = null;
    };
  }, [onProgress, sensitivity, activationThreshold, enabled]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        minHeight: '100vh', // Ensure enough space for scroll tracking
      }}
    >
      {children}
      {/* Visual indicator when locked (optional, can be removed) */}
      {isLocked && process.env.NODE_ENV === 'development' && (
        <div
          style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: 'rgba(168, 85, 247, 0.2)',
            color: '#a855f7',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        >
          Scroll Locked
        </div>
      )}
    </div>
  );
}
