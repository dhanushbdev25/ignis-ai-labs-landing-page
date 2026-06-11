/**
 * Intelligence, Applied — THE POUR.
 * Desktop: a molten runner draws down the rail; as each pillar's mold
 * reaches the gate, liquid metal fills the typography bottom-up, flashes
 * white-hot, then cools and sets. A sticky MOLD SPEC plate narrates the
 * active pillar. Mobile / no-JS: solid titles + inline capability bullets.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const POUR_CLIP = 'inset(calc(var(--pour) * 100%) -10% -20% -10%)';
const STATUS = { empty: 'empty', pouring: 'pouring', set: 'set' } as const;

export function initApplied() {
  const scene = document.querySelector<HTMLElement>('[data-scene="applied"]');
  if (!scene) return;

  // mobile rail — draws downward with scroll (runs regardless; hidden ≥lg)
  const mobileRail = scene.querySelector<HTMLElement>('[data-cast-draw]');
  if (mobileRail) {
    gsap.fromTo(
      mobileRail,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: scene,
          start: 'top 75%',
          end: 'bottom 65%',
          scrub: 0.8,
        },
      }
    );
  }

  const mm = gsap.matchMedia();
  mm.add(
    { isDesktop: '(min-width: 1024px)', isFine: '(pointer: fine)' },
    (ctx) => {
      const { isDesktop, isFine } = ctx.conditions as {
        isDesktop: boolean;
        isFine: boolean;
      };
      if (!isDesktop) return;

      const rows = Array.from(scene.querySelectorAll<HTMLElement>('.cast-row'));
      const runner = scene.querySelector<HTMLElement>('.cast-runner');
      const railSpark = scene.querySelector<HTMLElement>('.cast-rail-spark');
      const plate = scene.querySelector<HTMLElement>('.cast-plate');
      const specs = Array.from(scene.querySelectorAll<HTMLElement>('.plate-spec'));
      const needle = scene.querySelector<SVGLineElement>('.plate-needle');
      const heatFloor = document.querySelector<HTMLElement>('.cast-heat-floor');
      if (!rows.length || !plate || specs.length !== rows.length) return;

      scene.classList.add('is-enhanced');

      const poured: boolean[] = rows.map(() => false);
      let scrollActive = 0;
      let hoverActive = -1;
      let plateActive = -1;

      // ---- enhanced initial states (JS-only; no-JS users never see these) --
      rows.forEach((row) => {
        const ghost = row.querySelector<HTMLElement>('.cast-ghost');
        const solid = row.querySelector<HTMLElement>('.cast-solid');
        const melt = row.querySelector<HTMLElement>('.cast-melt');
        const meniscus = row.querySelector<HTMLElement>('.cast-meniscus');
        if (!ghost || !solid || !melt || !meniscus) return;
        gsap.set(ghost, { opacity: 0.45 });
        gsap.set(solid, { opacity: 0 });
        gsap.set(melt, { opacity: 1, '--pour': 1, clipPath: POUR_CLIP });
        gsap.set(meniscus, { top: 'calc(var(--pour, 1) * 100%)' });
      });
      gsap.set(plate, { opacity: 0, y: 24 });
      specs.forEach((spec) => gsap.set(spec, { opacity: 0 }));

      // ---- ember pool — sparks that pop off the meniscus ------------------
      const emberPool: HTMLSpanElement[] = Array.from({ length: 6 }, () => {
        const ember = document.createElement('span');
        ember.setAttribute('aria-hidden', 'true');
        ember.style.cssText =
          'position:absolute;width:3px;height:3px;border-radius:50%;' +
          'background:var(--color-ember-amber);pointer-events:none;opacity:0;' +
          'box-shadow:0 0 6px 1px rgba(255,92,26,0.6);z-index:10;';
        scene.appendChild(ember);
        return ember;
      });
      let emberCursor = 0;

      const popEmbers = (row: HTMLElement, count: number) => {
        const stack = row.querySelector<HTMLElement>('.cast-stack');
        if (!stack) return;
        const sceneRect = scene.getBoundingClientRect();
        const rect = stack.getBoundingClientRect();
        for (let i = 0; i < count; i++) {
          const ember = emberPool[emberCursor++ % emberPool.length];
          const x = rect.left - sceneRect.left + gsap.utils.random(0.1, 0.7) * rect.width;
          const y = rect.top - sceneRect.top + gsap.utils.random(0.2, 0.8) * rect.height;
          gsap.killTweensOf(ember);
          gsap.set(ember, { x, y, opacity: 0, scale: 1 });
          gsap
            .timeline({ delay: gsap.utils.random(0, 0.5) })
            .to(ember, { opacity: 1, duration: 0.12 })
            .to(
              ember,
              {
                x: x + gsap.utils.random(-26, 26),
                y: y - gsap.utils.random(30, 70),
                scale: 0.4,
                duration: gsap.utils.random(0.6, 1),
                ease: 'power1.out',
              },
              0
            )
            .to(ember, { opacity: 0, duration: 0.3 }, '-=0.35');
        }
      };

      // ---- the MOLD SPEC plate --------------------------------------------
      const rotateNeedle = needle
        ? gsap.quickTo(needle, 'rotation', { duration: 0.9, ease: 'elastic.out(1, 0.5)' })
        : null;

      const setSpecStatus = (index: number, state: keyof typeof STATUS) => {
        const spec = specs[index];
        const word = spec.querySelector<HTMLElement>('.plate-status-word');
        spec.classList.toggle('is-pouring', state === 'pouring');
        spec.classList.toggle('is-set', state === 'set');
        if (word) word.textContent = STATUS[state];
        const status = rows[index].querySelector<HTMLElement>('.cast-status');
        if (status) {
          const labels = { empty: 'empty', pouring: 'pouring…', set: 'set' };
          status.textContent = `Mold 0${index + 1} — ${labels[state]}`;
        }
      };

      const setPlate = (index: number) => {
        if (index === plateActive) return;
        plateActive = index;
        // exactly one panel may own the plate — kill in-flight tweens so
        // rapid scroll/hover switches can never leave two panels visible
        specs.forEach((spec, j) => {
          if (j === index) return;
          gsap.killTweensOf(spec);
          gsap.to(spec, { opacity: 0, x: 8, duration: 0.18, ease: 'power2.in' });
        });
        const spec = specs[index];
        gsap.killTweensOf(spec);
        // mono instrument flicker — stepped, not smooth
        gsap
          .timeline()
          .fromTo(spec, { x: -8 }, { x: 0, duration: 0.35, ease: 'power2.out' }, 0)
          .fromTo(spec, { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0)
          .to(spec, { opacity: 0.25, duration: 0.05 }, 0.05)
          .to(spec, { opacity: 1, duration: 0.08 }, 0.1);
        rotateNeedle?.(-90 + index * 60);
      };

      const refreshPlate = () => setPlate(hoverActive >= 0 ? hoverActive : scrollActive);

      // plate arrives with the section
      ScrollTrigger.create({
        trigger: scene,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          gsap.to(plate, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' });
          refreshPlate();
        },
      });

      // ---- runner scrub -----------------------------------------------------
      if (runner && railSpark) {
        gsap.set(runner, { scaleY: 0 });
        ScrollTrigger.create({
          trigger: scene.querySelector('.cast-rows'),
          start: 'top 78%',
          end: 'bottom 55%',
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            gsap.set(runner, { scaleY: self.progress });
            gsap.set(railSpark, {
              top: `${self.progress * 100}%`,
              opacity: self.progress > 0.01 && self.progress < 0.995 ? 1 : 0,
            });
          },
        });
      }

      // ---- the pour ----------------------------------------------------------
      const pour = (row: HTMLElement, index: number) => {
        if (poured[index]) return;
        poured[index] = true;

        const gate = row.querySelector<HTMLElement>('.cast-gate');
        const ghost = row.querySelector<HTMLElement>('.cast-ghost');
        const solid = row.querySelector<HTMLElement>('.cast-solid');
        const melt = row.querySelector<HTMLElement>('.cast-melt');
        const meltText = row.querySelector<HTMLElement>('.cast-melt-text');
        const meniscus = row.querySelector<HTMLElement>('.cast-meniscus');
        if (!ghost || !solid || !melt || !meltText || !meniscus) return;

        setSpecStatus(index, 'pouring');

        const tl = gsap.timeline({
          onComplete: () => gsap.set(melt, { willChange: 'auto' }),
        });

        // 1 — the gate opens; the empty mold brightens in anticipation
        if (gate) tl.fromTo(gate, { scaleX: 0 }, { scaleX: 1, duration: 0.25, ease: 'expo.out' }, 0);
        tl.to(ghost, { opacity: 0.85, duration: 0.25, ease: 'power2.out' }, 0);

        // 2 — liquid metal rises through the letterforms
        tl.set(melt, { willChange: 'clip-path' }, 0.15);
        tl.to(meniscus, { opacity: 1, duration: 0.15 }, 0.15);
        tl.to(melt, { '--pour': 0, duration: 0.9, ease: 'power2.inOut' }, 0.2);
        tl.call(() => popEmbers(row, 4), [], 0.45);

        // 3 — white-hot flash at fill; the liquid settles with a wobble
        tl.to(meniscus, { opacity: 0, duration: 0.2 }, 1.05);
        tl.to(
          meltText,
          {
            textShadow: '0 0 36px rgba(255,232,196,0.65), 0 0 12px rgba(255,92,26,0.5)',
            duration: 0.18,
            ease: 'power2.out',
          },
          1.0
        );
        tl.fromTo(
          melt,
          { scaleY: 1.018, transformOrigin: '50% 100%' },
          { scaleY: 1, duration: 0.7, ease: 'elastic.out(1, 0.45)' },
          1.05
        );
        if (heatFloor) {
          tl.to(heatFloor, { opacity: 0.5, duration: 0.2, ease: 'power2.out' }, 1.0);
          tl.to(heatFloor, { opacity: 0, duration: 1.5, ease: 'power2.out' }, 1.25);
        }

        // 4 — the metal cools and sets: molten → solid ivory with afterglow
        tl.to(meltText, { textShadow: '0 0 0px rgba(255,232,196,0)', duration: 0.5 }, 1.3);
        tl.to(melt, { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, 1.35);
        tl.to(ghost, { opacity: 0, duration: 0.5 }, 1.35);
        tl.fromTo(
          solid,
          { opacity: 0, textShadow: '0 0 24px rgba(255,92,26,0.45)' },
          { opacity: 1, duration: 0.6, ease: 'power2.out' },
          1.4
        );
        tl.to(solid, { textShadow: '0 0 0px rgba(255,92,26,0)', duration: 2.2, ease: 'power2.out' }, 1.7);

        // 5 — the metal is set: the plate stamps CAST: SET
        tl.call(
          () => {
            row.classList.add('is-set');
            setSpecStatus(index, 'set');
            const status = specs[index].querySelector('.plate-status');
            if (status) gsap.fromTo(status, { scale: 1.12 }, { scale: 1, duration: 0.4, ease: 'back.out(2)' });
          },
          [],
          1.7
        );
      };

      rows.forEach((row, index) => {
        ScrollTrigger.create({
          trigger: row,
          start: 'top 72%',
          once: true,
          onEnter: () => pour(row, index),
        });

        // scroll position narrates the plate
        ScrollTrigger.create({
          trigger: row,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => {
            if (self.isActive) {
              scrollActive = index;
              if (hoverActive < 0) refreshPlate();
            }
          },
        });
      });

      // ---- re-melt on hover (set rows only, fine pointers) -------------------
      const hoverCleanups: Array<() => void> = [];
      if (isFine) {
        rows.forEach((row, index) => {
          const solid = row.querySelector<HTMLElement>('.cast-solid');
          const melt = row.querySelector<HTMLElement>('.cast-melt');
          const meltText = row.querySelector<HTMLElement>('.cast-melt-text');
          if (!solid || !melt || !meltText) return;

          const enter = () => {
            hoverActive = index;
            refreshPlate();
            if (!poured[index] || gsap.isTweening(melt)) return;
            // re-heat: the set metal glows molten while the cursor rests on it
            meltText.classList.add('animate-molten-slide');
            gsap.set(meltText, { backgroundSize: '200% 100%' });
            gsap.to(melt, { opacity: 1, duration: 0.45, ease: 'power2.out' });
            gsap.to(solid, { opacity: 0.15, duration: 0.45, ease: 'power2.out' });
          };
          const leave = () => {
            hoverActive = -1;
            refreshPlate();
            if (!poured[index]) return;
            gsap.to(melt, { opacity: 0, duration: 0.5, ease: 'power2.inOut' });
            gsap.to(solid, {
              opacity: 1,
              duration: 0.5,
              ease: 'power2.inOut',
              onComplete: () => meltText.classList.remove('animate-molten-slide'),
            });
          };
          row.addEventListener('mouseenter', enter);
          row.addEventListener('mouseleave', leave);
          hoverCleanups.push(() => {
            row.removeEventListener('mouseenter', enter);
            row.removeEventListener('mouseleave', leave);
          });
        });
      }

      return () => {
        scene.classList.remove('is-enhanced');
        hoverCleanups.forEach((fn) => fn());
        emberPool.forEach((ember) => ember.remove());
        rows.forEach((row) => {
          row.classList.remove('is-set');
          ['.cast-ghost', '.cast-solid', '.cast-melt', '.cast-melt-text', '.cast-meniscus', '.cast-gate'].forEach(
            (sel) => {
              const el = row.querySelector(sel);
              if (el) gsap.set(el, { clearProps: 'all' });
            }
          );
        });
        gsap.set(plate, { clearProps: 'all' });
        specs.forEach((spec) => gsap.set(spec, { clearProps: 'all' }));
      };
    }
  );
}
