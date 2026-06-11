/**
 * Final CTA — the molten orb magnetically attracts the cursor:
 * within 120px it leans toward the pointer (max 16px), springing back on exit.
 */
import { gsap } from 'gsap';

export function initFinalCta() {
  const scene = document.querySelector<HTMLElement>('[data-scene="final-cta"]');
  const orb = scene?.querySelector<HTMLElement>('.cta-orb');
  if (!scene || !orb || !matchMedia('(pointer: fine)').matches) return;

  const xTo = gsap.quickTo(orb, 'x', { duration: 0.5, ease: 'expo.out' });
  const yTo = gsap.quickTo(orb, 'y', { duration: 0.5, ease: 'expo.out' });

  const REACH = 120;
  const MAX_PULL = 16;

  scene.addEventListener('mousemove', (event) => {
    const rect = orb.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = event.clientX - cx;
    const dy = event.clientY - cy;
    const dist = Math.hypot(dx, dy) - rect.width / 2;

    if (dist < REACH) {
      const strength = 1 - Math.max(dist, 0) / REACH;
      xTo(gsap.utils.clamp(-MAX_PULL, MAX_PULL, dx * 0.12 * strength));
      yTo(gsap.utils.clamp(-MAX_PULL, MAX_PULL, dy * 0.12 * strength));
    } else {
      xTo(0);
      yTo(0);
    }
  });

  scene.addEventListener('mouseleave', () => {
    xTo(0);
    yTo(0);
  });
}
