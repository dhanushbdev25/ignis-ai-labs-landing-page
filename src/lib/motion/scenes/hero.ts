/**
 * Hero scene: entrance choreography, the rotating-word line,
 * scroll-out fade, and the lazy WebGL ember-field loader.
 */
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

const heroSection = () => document.querySelector<HTMLElement>('[data-scene="hero"]');

/** Entrance — called by the preloader scene (with or without ignition). */
export function playHeroEntrance(delay: number) {
  const section = heroSection();
  if (!section) return;

  const lines = Array.from(section.querySelectorAll<HTMLElement>('[data-hero-line]'));
  const reveals = section.querySelectorAll<HTMLElement>('[data-hero-reveal]');

  gsap.set(reveals, { y: 28, opacity: 0 });

  // word-mask reveal: each word rises out of its own clip wrapper
  let split: SplitText | null = null;
  let words: HTMLElement[] = [];
  try {
    split = new SplitText(lines, { type: 'words', mask: 'words', aria: 'auto' });
    words = split.words as HTMLElement[];
    // the molten gradient must live on the split word itself to survive the split
    words.forEach((word) => {
      if (word.closest('em')) word.classList.add('text-gradient-molten');
    });
    gsap.set(words, { yPercent: 120 });
  } catch {
    gsap.set(lines, { opacity: 0 });
  }

  const tl = gsap.timeline({
    delay,
    onComplete: () => split?.revert(), // restore clean DOM (and the em's own gradient)
  });

  if (words.length) {
    tl.to(words, { yPercent: 0, duration: 1.0, ease: 'expo.out', stagger: 0.055 });
  } else {
    tl.to(lines, { opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.12 });
  }

  tl.fromTo(
    lines,
    { textShadow: '0 0 36px rgba(255,92,26,0.5)' },
    { textShadow: '0 0 36px rgba(255,92,26,0)', duration: 1.3, ease: 'power2.out' },
    0.25
  ).to(reveals, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.07 }, 0.5);
}

export function initHero() {
  const section = heroSection();
  if (!section) return;

  initRotator(section);
  initScrollOut(section);
  initEmberFieldLoader(section);
  initPointerParallax(section);
}

/* ---- subtle depth: content drifts opposite the pointer ----------------- */
function initPointerParallax(section: HTMLElement) {
  if (!matchMedia('(pointer: fine)').matches) return;
  const content = section.querySelector<HTMLElement>('[data-hero-parallax]');
  if (!content) return;

  const xTo = gsap.quickTo(content, 'x', { duration: 0.9, ease: 'power3.out' });
  const yTo = gsap.quickTo(content, 'y', { duration: 0.9, ease: 'power3.out' });

  section.addEventListener('mousemove', (event) => {
    const nx = event.clientX / window.innerWidth - 0.5;
    const ny = event.clientY / window.innerHeight - 0.5;
    xTo(nx * -12);
    yTo(ny * -8);
  });
  section.addEventListener('mouseleave', () => {
    xTo(0);
    yTo(0);
  });
}

/* ---- rotating words --------------------------------------------------- */
function initRotator(section: HTMLElement) {
  const rotator = section.querySelector<HTMLElement>('#hero-rotator');
  const wordEl = rotator?.querySelector<HTMLElement>('.hero-word');
  if (!rotator || !wordEl) return;

  let words: string[] = [];
  try {
    words = JSON.parse(rotator.dataset.words ?? '[]');
  } catch {
    return;
  }
  if (words.length < 2) return;

  let index = 0;
  const cycle = () => {
    index = (index + 1) % words.length;
    gsap
      .timeline({ onComplete: () => gsap.delayedCall(2.8, cycle) })
      .to(wordEl, { yPercent: -110, opacity: 0, duration: 0.35, ease: 'power3.in' })
      .add(() => {
        wordEl.textContent = words[index];
      })
      .fromTo(
        wordEl,
        { yPercent: 110, opacity: 0, textShadow: '0 0 14px rgba(255,92,26,0.6)' },
        {
          yPercent: 0,
          opacity: 1,
          textShadow: '0 0 14px rgba(255,92,26,0)',
          duration: 0.5,
          ease: 'expo.out',
        }
      );
  };
  gsap.delayedCall(2.8, cycle);
}

/* ---- scroll-out: headline rises, embers die down ----------------------- */
function initScrollOut(section: HTMLElement) {
  const content = section.querySelector<HTMLElement>('.wrap');
  if (!content) return;
  gsap.to(content, {
    y: -90,
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '80% top',
      scrub: 0.8,
    },
  });

}

/* ---- lazy WebGL ember field -------------------------------------------- */
function initEmberFieldLoader(section: HTMLElement) {
  const host = section.querySelector<HTMLElement>('#ember-field');
  if (!host) return;

  const start = () => {
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => void })
      .requestIdleCallback;
    const kickoff = () => {
      import('../../webgl/ember-field')
        .then(({ mountEmberField }) => mountEmberField(host, section))
        .catch(() => {
          /* WebGL unavailable — the CSS atmosphere underneath stands alone */
        });
    };
    if (idle) idle(kickoff);
    else setTimeout(kickoff, 350);
  };

  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
}
