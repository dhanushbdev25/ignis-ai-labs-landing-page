/**
 * The Heat Cursor — desktop only. A 6px ivory dot with a lerped 28px ring
 * that ignites over interactive elements and sheds tiny embers on fast
 * movement (pooled spans, recycled — not a particle system).
 */
import { gsap } from 'gsap';

const INTERACTIVE = 'a, button, summary, [role="button"], input, select, textarea, label';
const TEXT_FIELDS = 'input, textarea, select';
const POOL_SIZE = 12;

export function initCursor() {
  if (!matchMedia('(pointer: fine) and (min-width: 1024px)').matches) return;

  const host = document.getElementById('heat-cursor');
  if (!host) return;

  host.innerHTML = `
    <div class="hc-dot"></div>
    <div class="hc-ring"></div>
  `;
  const dot = host.querySelector<HTMLElement>('.hc-dot')!;
  const ring = host.querySelector<HTMLElement>('.hc-ring')!;

  injectStyles();
  document.documentElement.classList.add('cursor-enhanced');

  const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' });
  const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' });
  const ringX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });

  // ember pool
  const pool: HTMLElement[] = [];
  for (let i = 0; i < POOL_SIZE; i++) {
    const ember = document.createElement('span');
    ember.className = 'hc-ember';
    host.appendChild(ember);
    pool.push(ember);
  }
  let poolIndex = 0;
  let lastShed = 0;

  let lastX = 0;
  let lastY = 0;
  let lastT = performance.now();
  let visible = false;

  document.addEventListener('mousemove', (event) => {
    const { clientX: x, clientY: y } = event;
    if (!visible) {
      visible = true;
      gsap.set([dot, ring], { x, y });
      gsap.to(host, { opacity: 1, duration: 0.3 });
    }
    dotX(x);
    dotY(y);
    ringX(x);
    ringY(y);

    // shed embers on fast movement
    const now = performance.now();
    const dt = Math.max(now - lastT, 1);
    const velocity = Math.hypot(x - lastX, y - lastY) / dt;
    if (velocity > 1.4 && now - lastShed > 90) {
      lastShed = now;
      const ember = pool[poolIndex];
      poolIndex = (poolIndex + 1) % POOL_SIZE;
      gsap.killTweensOf(ember);
      gsap.set(ember, { x, y, opacity: 0.9, scale: 1 });
      gsap.to(ember, {
        x: x + gsap.utils.random(-14, 14),
        y: y - gsap.utils.random(18, 34),
        opacity: 0,
        scale: 0.4,
        duration: 0.6,
        ease: 'power2.out',
      });
    }
    lastX = x;
    lastY = y;
    lastT = now;
  });

  document.addEventListener('mouseleave', () => {
    visible = false;
    gsap.to(host, { opacity: 0, duration: 0.3 });
  });

  // the <dialog> renders in the top layer, above this cursor — hand the
  // native cursor back while it's open
  window.addEventListener('ignis:dialog', (event) => {
    const open = (event as CustomEvent<{ open: boolean }>).detail?.open;
    document.documentElement.classList.toggle('cursor-enhanced', !open);
    host.style.visibility = open ? 'hidden' : '';
  });

  // ring ignites over interactives; hides over text fields
  document.addEventListener('mouseover', (event) => {
    const target = event.target as HTMLElement;
    if (target.closest(TEXT_FIELDS)) {
      host.classList.add('hc-hidden');
    } else {
      host.classList.remove('hc-hidden');
      host.classList.toggle('hc-active', !!target.closest(INTERACTIVE));
    }
  });
}

function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
    html.cursor-enhanced body { cursor: none; }
    html.cursor-enhanced :is(a, button, summary, [role="button"], label) { cursor: none; }
    html.cursor-enhanced :is(input, textarea, select) { cursor: auto; }
    #heat-cursor { position: fixed; inset: 0; z-index: 90; pointer-events: none; opacity: 0; }
    #heat-cursor.hc-hidden { opacity: 0 !important; }
    #heat-cursor .hc-dot {
      position: absolute; top: -3px; left: -3px; width: 6px; height: 6px;
      border-radius: 50%; background: var(--color-ivory);
    }
    #heat-cursor .hc-ring {
      position: absolute; top: -14px; left: -14px; width: 28px; height: 28px;
      border-radius: 50%; border: 1px solid rgba(245, 239, 230, 0.35);
      transition: width 0.25s, height 0.25s, top 0.25s, left 0.25s, border-color 0.25s, box-shadow 0.25s;
    }
    #heat-cursor.hc-active .hc-ring {
      width: 18px; height: 18px; top: -9px; left: -9px;
      border-color: var(--color-ember-core);
      box-shadow: 0 0 12px rgba(255, 92, 26, 0.5);
    }
    #heat-cursor .hc-ember {
      position: absolute; top: -1.5px; left: -1.5px; width: 3px; height: 3px;
      border-radius: 50%; background: var(--color-ember-core);
      box-shadow: 0 0 5px 1px rgba(255, 92, 26, 0.55); opacity: 0;
    }
  `;
  document.head.appendChild(style);
}
