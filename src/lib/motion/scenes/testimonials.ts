/**
 * Field reports — desktop quote stage with a client-selector rail.
 * One quote at a time; the rail's tabs switch clients; a thin molten
 * progress bar drives the 8s auto-advance (paused on hover).
 * Without JS the quotes stack readably; mobile uses a native swipe carousel.
 */
import { gsap } from 'gsap';

export function initTestimonials() {
  const scene = document.querySelector<HTMLElement>('[data-scene="testimonials"]');
  if (!scene) return;

  const stage = scene.querySelector<HTMLElement>('.quote-stage');
  const slides = Array.from(scene.querySelectorAll<HTMLElement>('.quote-slide'));
  const tabs = Array.from(scene.querySelectorAll<HTMLElement>('.quote-tab'));
  const progress = scene.querySelector<HTMLElement>('.quote-progress');
  if (!stage || slides.length < 2) return;

  scene.classList.add('is-enhanced');

  let index = 0;
  let busy = false;
  let progressTween: gsap.core.Tween | null = null;

  const fitStage = (slide: HTMLElement, animate: boolean) => {
    const height = slide.offsetHeight;
    if (animate) gsap.to(stage, { height, duration: 0.5, ease: 'expo.out' });
    else gsap.set(stage, { height });
  };

  const syncTabs = () => {
    tabs.forEach((tab, i) => tab.classList.toggle('is-active', i === index));
  };

  slides.forEach((slide, i) => {
    gsap.set(slide, { opacity: i === 0 ? 1 : 0, pointerEvents: i === 0 ? 'auto' : 'none' });
  });
  fitStage(slides[0], false);
  syncTabs();

  const runProgress = () => {
    progressTween?.kill();
    if (!progress) return;
    progressTween = gsap.fromTo(
      progress,
      { scaleX: 0 },
      { scaleX: 1, duration: 8, ease: 'none', onComplete: () => show(index + 1) }
    );
  };

  const show = (nextIndex: number) => {
    const target = ((nextIndex % slides.length) + slides.length) % slides.length;
    if (busy || target === index) {
      if (target === index) runProgress();
      return;
    }
    busy = true;
    const outgoing = slides[index];
    const incoming = slides[target];
    index = target;
    syncTabs();

    gsap
      .timeline({
        onComplete: () => {
          busy = false;
        },
      })
      .to(outgoing, {
        opacity: 0,
        filter: 'blur(4px)',
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => gsap.set(outgoing, { pointerEvents: 'none', filter: 'blur(0px)' }),
      })
      .add(() => fitStage(incoming, true))
      .fromTo(
        incoming,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'expo.out',
          onStart: () => gsap.set(incoming, { pointerEvents: 'auto' }),
        }
      );
    runProgress();
  };

  tabs.forEach((tab, i) => tab.addEventListener('click', () => show(i)));
  scene.addEventListener('mouseenter', () => progressTween?.pause());
  scene.addEventListener('mouseleave', () => progressTween?.resume());
  window.addEventListener('resize', () => fitStage(slides[index], false));

  runProgress();
}
