/**
 * Motion orchestrator — Lenis + GSAP ScrollTrigger operating on static DOM.
 *
 * Single kill-switch: under prefers-reduced-motion nothing here runs except
 * the vignette perf gate; the site reads perfectly as plain HTML/CSS.
 * Initial hidden states are set from JS only — no-JS users see everything.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

import { initPrimitives, initVignetteGate, registerSmolder } from './primitives';
import { initPreloader } from './scenes/preloader';
import { initHero } from './scenes/hero';
import { initHeader } from './scenes/header';
import { initHeatCurve } from './scenes/heat';
import { initApplied } from './scenes/applied';
import { initCrucible } from './scenes/crucible';
import { initForge } from './scenes/forge';
import { initTestimonials } from './scenes/testimonials';
import { initFinalCta } from './scenes/final-cta';
import { initCursor } from './scenes/cursor';

function boot() {
  initVignetteGate();

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.remove('preloading');
    return;
  }

  gsap.registerPlugin(ScrollTrigger, SplitText);
  registerSmolder();

  const lenis = new Lenis({
    lerp: 0.09,
    anchors: { offset: -64 },
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  ScrollTrigger.config({ ignoreMobileResize: true });

  // the consultation dialog (React island) announces open/close
  window.addEventListener('ignis:dialog', (event) => {
    const open = (event as CustomEvent<{ open: boolean }>).detail?.open;
    if (open) lenis.stop();
    else lenis.start();
  });

  initPrimitives();
  initHeader(lenis);
  initHeatCurve();
  initPreloader(lenis); // also kicks off the hero entrance when done
  initHero();
  initApplied();
  initCrucible();
  initForge(lenis);
  initTestimonials();
  initFinalCta();
  initCursor();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
