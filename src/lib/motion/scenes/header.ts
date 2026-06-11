/**
 * Header behavior: glass condensation past 120px, hide-on-down/show-on-up,
 * and the nav gauge that mirrors the active section's temperature index.
 */
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';

export function initHeader(lenis: Lenis) {
  const header = document.getElementById('site-header');
  if (!header) return;

  let lastY = 0;
  lenis.on('scroll', ({ scroll }: { scroll: number }) => {
    header.classList.toggle('is-scrolled', scroll > 120);

    const goingDown = scroll > lastY + 2;
    const goingUp = scroll < lastY - 2;
    if (goingDown && scroll > 600 && !header.classList.contains('menu-open')) {
      header.classList.add('is-hidden');
    } else if (goingUp || scroll <= 600) {
      header.classList.remove('is-hidden');
    }
    lastY = scroll;
  });

  // nav gauge — `01 / APPLIED — 0420°C` for the section in view
  const gauge = document.getElementById('nav-gauge');
  if (!gauge) return;

  document.querySelectorAll<HTMLElement>('section[id] .eyebrow').forEach((eyebrow) => {
    const section = eyebrow.closest('section');
    const reading = eyebrow.textContent?.trim().replace(/\s+/g, ' ');
    if (!section || !reading || !/^\d{2} \//.test(reading)) return;
    ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => {
        if (self.isActive) {
          gauge.textContent = `· ${reading}`;
          gauge.style.opacity = '1';
        }
      },
    });
  });

  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: '+=600',
    onLeaveBack: () => {
      gauge.style.opacity = '0';
    },
  });
}
