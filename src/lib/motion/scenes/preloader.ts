/**
 * Ignition preloader: a spark traces the brand mark while the forge
 * temperature climbs 0273°C → 1538°C, the mark flares, and the page ignites.
 * Gated to once per session by the inline head script (html.preloading).
 */
import { gsap } from 'gsap';
import type Lenis from 'lenis';
import { playHeroEntrance } from './hero';

export function initPreloader(lenis: Lenis) {
  const html = document.documentElement;
  const preloader = document.getElementById('preloader');

  if (!html.classList.contains('preloading') || !preloader) {
    // no ignition this visit — play the hero entrance straight away
    playHeroEntrance(0.15);
    return;
  }

  const sparkPath = document.getElementById('preloader-spark-path') as SVGPathElement | null;
  const sparkFill = document.getElementById('preloader-spark-fill');
  const temp = document.getElementById('preloader-temp');

  lenis.stop();
  try {
    sessionStorage.setItem('ignis-ignited', '1');
  } catch {
    /* private mode — preloader will simply replay */
  }

  const finish = () => {
    html.classList.remove('preloading');
    preloader.style.display = 'none';
    lenis.start();
  };

  const tl = gsap.timeline({ onComplete: finish });

  if (sparkPath) {
    const length = sparkPath.getTotalLength();
    gsap.set(sparkPath, { strokeDasharray: length, strokeDashoffset: length });
    tl.to(sparkPath, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut' }, 0.2);
  }

  if (temp) {
    const state = { value: 273 };
    tl.to(
      state,
      {
        value: 1538,
        duration: 1.3,
        ease: 'power2.inOut',
        onUpdate: () => {
          temp.textContent = String(Math.round(state.value)).padStart(4, '0');
        },
      },
      0.2
    );
  }

  if (sparkFill) {
    // the flare: fill snaps white-hot, then the whole mark dissolves upward
    tl.to(sparkFill, { opacity: 1, duration: 0.12, ease: 'power4.in' }, 1.5)
      .to(sparkFill, { opacity: 0.85, duration: 0.1 }, 1.62);
  }

  tl.to(
    preloader.firstElementChild,
    { y: -28, opacity: 0, scale: 1.06, duration: 0.5, ease: 'power3.in' },
    1.75
  ).to(preloader, { opacity: 0, duration: 0.45, ease: 'power2.out' }, 1.95);

  // hero ignites while the black veil lifts
  playHeroEntrance(1.9);
}
