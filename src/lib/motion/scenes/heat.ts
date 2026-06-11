/**
 * The Heat Curve — one root ScrollTrigger writing `--heat` (0–1) on <html>.
 * Ambient glows read it via opacity calc(); the page warms toward the
 * Forge section and cools through the proof sections.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** scroll-progress keyframes → heat */
const CURVE: [number, number][] = [
  [0.0, 0.55], // hero — embers in darkness
  [0.18, 0.6], // applied — raw material
  [0.32, 0.75], // translated — the crucible
  [0.5, 1.0], // forged — peak heat
  [0.68, 0.6], // deployed — cast and cooling
  [0.82, 0.35], // trusted/answered — tempered
  [0.95, 0.8], // final CTA — re-ignition
  [1.0, 0.25], // footer — banked embers
];

function sample(progress: number): number {
  for (let i = 1; i < CURVE.length; i++) {
    const [x1, y1] = CURVE[i - 1];
    const [x2, y2] = CURVE[i];
    if (progress <= x2) {
      const t = (progress - x1) / (x2 - x1);
      return y1 + (y2 - y1) * t;
    }
  }
  return CURVE[CURVE.length - 1][1];
}

export function initHeatCurve() {
  const html = document.documentElement;
  let current = 0.55;
  ScrollTrigger.create({
    start: 0,
    end: () => ScrollTrigger.maxScroll(window),
    onUpdate: (self) => {
      // soften with a small lerp so the page temperature never jumps
      current += (sample(self.progress) - current) * 0.2;
      html.style.setProperty('--heat', current.toFixed(3));
    },
  });
  gsap.set(html, { '--heat': current });
}
