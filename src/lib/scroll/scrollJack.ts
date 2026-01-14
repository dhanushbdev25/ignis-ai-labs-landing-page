/**
 * Scroll-jacking controller utility
 * Intercepts wheel/touch events and converts them to controlled progress
 * Prevents page scroll while progress is between 0 and 1
 */

export interface ScrollJackOptions {
  /** Target element to monitor for activation */
  target: HTMLElement;
  /** Callback when progress changes (0-1) */
  onProgress: (progress: number) => void;
  /** Callback when lock state changes */
  onLockChange?: (isLocked: boolean) => void;
  /** Scroll sensitivity multiplier (default: 0.5) */
  sensitivity?: number;
  /** Minimum viewport overlap to activate (0-1, default: 0.1) */
  activationThreshold?: number;
  /** Whether scroll-jack is enabled (respects prefers-reduced-motion) */
  enabled?: boolean;
}

export class ScrollJackController {
  private target: HTMLElement;
  private onProgress: (progress: number) => void;
  private onLockChange?: (isLocked: boolean) => void;
  private sensitivity: number;
  private activationThreshold: number;
  private enabled: boolean;

  private progress: number = 0;
  private isLocked: boolean = false;
  private isActive: boolean = false;
  private rafId: number | null = null;
  private continuousCheckRafId: number | null = null;
  private lastTouchY: number = 0;
  private touchStartY: number = 0;
  private isTouching: boolean = false;

  constructor(options: ScrollJackOptions) {
    this.target = options.target;
    this.onProgress = options.onProgress;
    this.onLockChange = options.onLockChange;
    this.sensitivity = options.sensitivity ?? 0.5;
    this.activationThreshold = options.activationThreshold ?? 0.1;
    this.enabled = options.enabled ?? true;

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.enabled = false;
    }

    this.init();
  }

  private init() {
    if (!this.enabled) return;

    // Listen for wheel events (desktop)
    window.addEventListener('wheel', this.handleWheel, { passive: false });
    
    // Listen for touch events (mobile)
    window.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    window.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    window.addEventListener('touchend', this.handleTouchEnd, { passive: false });

    // Listen for escape key to unlock
    window.addEventListener('keydown', this.handleKeyDown);

    // Monitor target visibility for activation
    this.checkActivation();
    window.addEventListener('scroll', this.checkActivation, { passive: true });
    window.addEventListener('resize', this.checkActivation, { passive: true });
    
    // Continuous check using RAF to catch fast scrolls (runs every frame when needed)
    const continuousCheck = () => {
      this.checkActivation();
      // Only keep checking if we're active or near the section
      const rect = this.target.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const isNearby = rect.bottom > -viewportHeight * 0.5 && rect.top < viewportHeight * 1.5;
      
      if (isNearby || this.isActive) {
        this.continuousCheckRafId = requestAnimationFrame(continuousCheck);
      } else {
        this.continuousCheckRafId = null;
      }
    };
    
    // Start continuous check
    this.continuousCheckRafId = requestAnimationFrame(continuousCheck);
  }

  private checkActivation = () => {
    if (!this.enabled) return;

    const rect = this.target.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const targetHeight = rect.height;
    
    // Calculate how much of the target is visible
    const visibleTop = Math.max(0, -rect.top);
    const visibleBottom = Math.max(0, viewportHeight - rect.top);
    const visibleHeight = Math.min(visibleBottom, targetHeight) - visibleTop;
    const overlapRatio = visibleHeight / Math.max(targetHeight, viewportHeight);

    // Check if section is centered in viewport (where all content is visible)
    // Activation when section center is near viewport center
    const sectionCenter = rect.top + rect.height / 2;
    const viewportCenter = viewportHeight / 2;
    const distanceFromCenter = Math.abs(sectionCenter - viewportCenter);
    const isCentered = distanceFromCenter < viewportHeight * 0.3; // Within 30% of viewport center
    
    // Activate when section is visible AND centered (or has sufficient overlap)
    const wasActive = this.isActive;
    this.isActive = (overlapRatio >= this.activationThreshold) && (isCentered || overlapRatio > 0.5);

    // If just became active and progress is 0, initialize progress from scroll position
    if (!wasActive && this.isActive && this.progress === 0) {
      // Calculate initial progress based on how far into the section we are
      const sectionTop = this.target.offsetTop;
      const scrollPosition = window.scrollY;
      const sectionHeight = this.target.offsetHeight;
      
      // If we're already past the start, initialize progress
      if (scrollPosition > sectionTop) {
        const scrollProgress = Math.min(1, (scrollPosition - sectionTop) / (sectionHeight * 0.8));
        this.updateProgress(scrollProgress);
      }
    }

    // Update lock state - lock when active and not at boundaries
    // Lock when section is centered/visible, even if progress is 0 (will initialize)
    const shouldLock = this.isActive && this.progress >= 0 && this.progress < 1;
    if (shouldLock !== this.isLocked) {
      this.isLocked = shouldLock;
      this.onLockChange?.(this.isLocked);
    }
  };

  private handleWheel = (e: WheelEvent) => {
    // Always check activation first (catches fast scrolls)
    this.checkActivation();
    
    if (!this.isActive || !this.enabled) return;

    // Check if we should lock scroll - lock when in active zone and not at boundaries
    const shouldLock = this.progress >= 0 && this.progress < 1;
    
    if (shouldLock) {
      e.preventDefault();
      e.stopPropagation();
      
      // Process scroll delta
      const delta = e.deltaY;
      const deltaProgress = (delta * this.sensitivity) / (this.target.offsetHeight || 1000);
      
      // Positive deltaY (scrolling down) should increase progress
      this.updateProgress(this.progress + deltaProgress);
    } else if (this.isActive) {
      // At boundaries - allow natural scroll but update progress to stay at boundary
      if (this.progress <= 0 && e.deltaY < 0) {
        // At top, scrolling up - allow natural scroll
        return;
      } else if (this.progress >= 1 && e.deltaY > 0) {
        // At bottom, scrolling down - allow natural scroll
        return;
      } else {
        // Near boundary but not quite there - still lock and update
        e.preventDefault();
        e.stopPropagation();
        const delta = e.deltaY;
        const deltaProgress = (delta * this.sensitivity) / (this.target.offsetHeight || 1000);
        this.updateProgress(this.progress + deltaProgress);
      }
    }
  };

  private handleTouchStart = (e: TouchEvent) => {
    if (!this.isActive || !this.enabled) return;
    
    this.isTouching = true;
    this.touchStartY = e.touches[0].clientY;
    this.lastTouchY = this.touchStartY;
  };

  private handleTouchMove = (e: TouchEvent) => {
    // Always check activation first
    this.checkActivation();
    
    if (!this.isActive || !this.isTouching || !this.enabled) return;

    const currentY = e.touches[0].clientY;
    const deltaY = this.lastTouchY - currentY; // Inverted: up is positive
    this.lastTouchY = currentY;

    const shouldLock = this.progress >= 0 && this.progress < 1;
    
    if (shouldLock) {
      e.preventDefault();
      e.stopPropagation();
      
      const deltaProgress = (deltaY * this.sensitivity) / (this.target.offsetHeight || 1000);
      this.updateProgress(this.progress + deltaProgress);
    }
  };

  private handleTouchEnd = () => {
    this.isTouching = false;
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    // Escape key unlocks scroll
    if (e.key === 'Escape' && this.isLocked) {
      this.unlock();
    }
  };

  private updateProgress(newProgress: number) {
    const clamped = Math.max(0, Math.min(1, newProgress));
    
    if (Math.abs(clamped - this.progress) < 0.001) return; // Avoid unnecessary updates
    
    this.progress = clamped;
    
    // Update lock state
    const shouldLock = this.isActive && this.progress > 0 && this.progress < 1;
    if (shouldLock !== this.isLocked) {
      this.isLocked = shouldLock;
      this.onLockChange?.(this.isLocked);
    }

    // Use RAF for smooth updates
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
    
    this.rafId = requestAnimationFrame(() => {
      this.onProgress(this.progress);
      this.rafId = null;
    });
  }

  /**
   * Manually set progress (0-1)
   */
  public setProgress(progress: number) {
    this.updateProgress(progress);
  }

  /**
   * Get current progress
   */
  public getProgress(): number {
    return this.progress;
  }

  /**
   * Check if scroll is currently locked
   */
  public isScrollLocked(): boolean {
    return this.isLocked;
  }

  /**
   * Manually unlock scroll
   */
  public unlock() {
    if (this.progress <= 0) {
      this.setProgress(0);
    } else if (this.progress >= 1) {
      this.setProgress(1);
    }
    this.isLocked = false;
    this.onLockChange?.(false);
  }

  /**
   * Enable/disable scroll-jack
   */
  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.unlock();
    }
  }

  /**
   * Cleanup and remove event listeners
   */
  public destroy() {
    window.removeEventListener('wheel', this.handleWheel);
    window.removeEventListener('touchstart', this.handleTouchStart);
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleTouchEnd);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('scroll', this.checkActivation);
    window.removeEventListener('resize', this.checkActivation);
    
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
    
    if (this.continuousCheckRafId !== null) {
      cancelAnimationFrame(this.continuousCheckRafId);
    }
  }
}
