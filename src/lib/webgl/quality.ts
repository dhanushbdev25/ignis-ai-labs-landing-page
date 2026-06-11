/** Device heuristics: particle count, DPR cap, or skip WebGL entirely. */

export interface QualityProfile {
  particles: number;
  dpr: number;
}

export function decideQuality(): QualityProfile | null {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean };
    deviceMemory?: number;
  };
  if (nav.connection?.saveData) return null;
  if (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) return null;

  const probe = document.createElement('canvas');
  const gl = probe.getContext('webgl2') ?? probe.getContext('webgl');
  if (!gl) return null;

  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const width = window.innerWidth;
  const particles = width < 768 ? 1200 : width < 1280 ? 2200 : 4000;

  return { particles, dpr };
}
