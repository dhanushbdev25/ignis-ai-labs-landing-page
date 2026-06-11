/**
 * Generic data-attribute animation primitives:
 *   data-anim="fade-up" [data-anim-delay]   — reveal on enter
 *   data-anim="smolder"                     — headline wipe + cooling ember glow
 *   data-parallax="0.85"                    — ambient drift (glow blobs only)
 *   data-counter data-counter-target="50"   — count-up numerals
 *   data-marquee                            — scroll-velocity boost for the logo marquee
 *   data-accordion                          — GSAP height tweens on native <details>
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function registerSmolder() {
  gsap.registerEffect({
    name: 'smolder',
    effect: (targets: gsap.TweenTarget) =>
      gsap
        .timeline({
          // leave no clip behind — Fraunces italics overhang the box
          onComplete: () => gsap.set(targets, { clearProps: 'clipPath,textShadow' }),
        })
        .fromTo(
          targets,
          { clipPath: 'inset(-20% -10% 110% -10%)', y: 36 },
          { clipPath: 'inset(-20% -10% -25% -10%)', y: 0, duration: 1.1, ease: 'expo.out' }
        )
        .fromTo(
          targets,
          { textShadow: '0 0 32px rgba(255,92,26,0.45)' },
          { textShadow: '0 0 32px rgba(255,92,26,0)', duration: 1.2, ease: 'power2.out' },
          0.15
        ),
    extendTimeline: false,
  });
}

export function initPrimitives() {
  // ---- fade-up reveals -------------------------------------------------
  gsap.utils.toArray<HTMLElement>('[data-anim="fade-up"]').forEach((el) => {
    gsap.set(el, { y: 32, opacity: 0 });
    gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'expo.out',
      delay: parseFloat(el.dataset.animDelay ?? '0'),
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });

  // ---- smolder headlines ----------------------------------------------
  gsap.utils.toArray<HTMLElement>('[data-anim="smolder"]').forEach((el) => {
    gsap.set(el, { clipPath: 'inset(-20% -10% 110% -10%)', y: 36 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => gsap.effects.smolder(el),
    });
  });

  // ---- ambient parallax (decorative only) -------------------------------
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.dataset.parallax ?? '0.85');
    const travel = (1 - speed) * 400;
    gsap.fromTo(
      el,
      { y: travel },
      {
        y: -travel,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement ?? el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        },
      }
    );
  });

  // ---- count-up numerals -------------------------------------------------
  gsap.utils.toArray<HTMLElement>('[data-counter]').forEach((el) => {
    const target = parseFloat(el.dataset.counterTarget ?? '0');
    const decimals = parseInt(el.dataset.counterDecimals ?? '0', 10);
    const state = { value: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () =>
        gsap.to(state, {
          value: target,
          duration: 1.4,
          ease: 'expo.out',
          onUpdate: () => {
            el.textContent = state.value.toFixed(decimals);
          },
        }),
    });
  });

  // ---- marquee speed rides scroll velocity --------------------------------
  document.querySelectorAll<HTMLElement>('[data-marquee] .marquee-track').forEach((track) => {
    let animation: Animation | undefined;
    const grab = () => (animation ??= track.getAnimations()[0]);
    ScrollTrigger.create({
      onUpdate: (self) => {
        const anim = grab();
        if (anim) anim.playbackRate = gsap.utils.clamp(1, 1.6, 1 + Math.abs(self.getVelocity()) / 2500);
      },
    });
  });

  // ---- magnetic CTAs (desktop) --------------------------------------------
  if (matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll<HTMLElement>('.btn-molten, .btn-ghost').forEach((btn) => {
      const xTo = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3.out' });
      const yTo = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3.out' });
      btn.addEventListener('mousemove', (event) => {
        const rect = btn.getBoundingClientRect();
        xTo((event.clientX - rect.left - rect.width / 2) * 0.12);
        yTo((event.clientY - rect.top - rect.height / 2) * 0.18);
      });
      btn.addEventListener('mouseleave', () => {
        xTo(0);
        yTo(0);
      });
    });

    // ---- engineering plates tilt toward the pointer ------------------------
    document.querySelectorAll<HTMLElement>('[data-vignette]').forEach((plate) => {
      gsap.set(plate, { transformPerspective: 900 });
      const rxTo = gsap.quickTo(plate, 'rotationX', { duration: 0.6, ease: 'power3.out' });
      const ryTo = gsap.quickTo(plate, 'rotationY', { duration: 0.6, ease: 'power3.out' });
      plate.addEventListener('mousemove', (event) => {
        const rect = plate.getBoundingClientRect();
        const nx = (event.clientX - rect.left) / rect.width - 0.5;
        const ny = (event.clientY - rect.top) / rect.height - 0.5;
        rxTo(ny * -5);
        ryTo(nx * 5);
      });
      plate.addEventListener('mouseleave', () => {
        rxTo(0);
        ryTo(0);
      });
    });
  }

  // ---- FAQ accordion: tween native <details> open/close -------------------
  document.querySelectorAll<HTMLElement>('[data-accordion] details').forEach((details) => {
    const summary = details.querySelector('summary');
    const body = details.querySelector<HTMLElement>('.faq-body');
    if (!summary || !body) return;

    summary.addEventListener('click', (event) => {
      event.preventDefault();
      if (details.hasAttribute('open')) {
        gsap.to(body, {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: 'power3.inOut',
          onComplete: () => {
            details.removeAttribute('open');
            gsap.set(body, { clearProps: 'all' });
          },
        });
      } else {
        // close any sibling first — one open at a time
        details.parentElement
          ?.querySelectorAll<HTMLElement>('details[open]')
          .forEach((other) => {
            const otherBody = other.querySelector<HTMLElement>('.faq-body');
            if (otherBody) {
              gsap.to(otherBody, {
                height: 0,
                opacity: 0,
                duration: 0.35,
                ease: 'power3.inOut',
                onComplete: () => {
                  other.removeAttribute('open');
                  gsap.set(otherBody, { clearProps: 'all' });
                },
              });
            } else {
              other.removeAttribute('open');
            }
          });
        details.setAttribute('open', '');
        gsap.fromTo(
          body,
          { height: 0, opacity: 0 },
          {
            height: 'auto',
            opacity: 1,
            duration: 0.45,
            ease: 'power3.inOut',
            onComplete: () => gsap.set(body, { clearProps: 'height' }),
          }
        );
      }
    });
  });
}

/** Pause the case-study vignette loops while off-screen (runs in all modes). */
export function initVignetteGate() {
  const vignettes = document.querySelectorAll<HTMLElement>('[data-vignette]');
  if (!vignettes.length || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => entry.target.classList.toggle('is-paused', !entry.isIntersecting));
    },
    { rootMargin: '100px' }
  );
  vignettes.forEach((el) => {
    el.classList.add('is-paused');
    io.observe(el);
  });
}
