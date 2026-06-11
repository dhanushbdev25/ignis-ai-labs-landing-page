/**
 * Intelligence, Forged — ONE STEEL.
 * Desktop: one billet of steel on a sticky stage, physically worked from
 * cold ingot to finished blade as the six phases scroll past. Scroll is the
 * bellows and the hammer: the metal's color follows a blackbody ramp built
 * from the ember tokens, and discrete strike beats reshape the silhouette.
 * Mobile: vertical filament timeline with a 6-frame silhouette filmstrip.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';

/* the ember spectrum IS the blackbody ramp — black → red → orange → white */
const HEAT_RAMP = ['#0b0705', '#7a2208', '#d63a10', '#ff5c1a', '#ffb35c', '#ffe8c4'];

/* strike beats: scroll positions where the hammer falls, and the shape
   keyframe the metal takes. Crossing-based — never onEnter-only — so fast
   or reversed scrolling can neither skip nor duplicate a strike.
   The scrub distance is (6 blocks − 1 viewport) = 5 screens, so phase i
   is centered at p = i/5: Construct owns [0.3, 0.5], Validate [0.5, 0.7]. */
const STRIKES = [
  { at: 0.34, shape: 1 },
  { at: 0.4, shape: 2 },
  { at: 0.46, shape: 3 },
  { at: 0.62, shape: 4 }, // the corrective strike in Validate
];

const SPARK_COUNT = 24;

export function initForge(lenis: Lenis) {
  // mobile/vertical filament — draws downward with scroll (not pinned)
  const verticalFilament = document.querySelector<HTMLElement>('[data-draw-v]');
  if (verticalFilament) {
    gsap.fromTo(
      verticalFilament,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: verticalFilament.parentElement,
          start: 'top 75%',
          end: 'bottom 65%',
          scrub: 0.8,
        },
      }
    );
  }

  const scene = document.querySelector<HTMLElement>('[data-scene="forge"]');
  if (!scene) return;

  let keyframes: string[] = [];
  try {
    keyframes = JSON.parse(scene.dataset.billetKeyframes ?? '[]');
  } catch {
    return;
  }
  if (keyframes.length < 5) return;

  const mm = gsap.matchMedia();
  mm.add('(min-width: 1024px)', () => {
    const grid = scene.querySelector<HTMLElement>('.forge-grid');
    const stage = scene.querySelector<HTMLElement>('.forge-stage');
    const shake = scene.querySelector<HTMLElement>('.forge-shake');
    const billet = scene.querySelector<SVGPathElement>('.forge-billet');
    const flash = scene.querySelector<SVGPathElement>('.forge-flash');
    const ram = scene.querySelector<SVGGElement>('.forge-ram');
    const gleam = scene.querySelector<SVGRectElement>('.forge-gleam');
    const bp = scene.querySelector<SVGGElement>('.forge-bp');
    const gauges = scene.querySelector<SVGGElement>('.forge-gauges');
    const passes = Array.from(scene.querySelectorAll<SVGTextElement>('.forge-gauge-pass'));
    const measure = scene.querySelector<SVGLineElement>('.forge-measure');
    const echoGroup = scene.querySelector<SVGGElement>('.forge-echoes');
    const echoes = Array.from(scene.querySelectorAll<SVGPathElement>('.forge-echo'));
    const temp = scene.querySelector<HTMLElement>('.forge-temp');
    const numerals = Array.from(scene.querySelectorAll<HTMLElement>('.forge-numeral'));
    const ticks = Array.from(scene.querySelectorAll<HTMLElement>('.forge-tick'));
    const blocks = Array.from(scene.querySelectorAll<HTMLElement>('.forge-block'));
    const sparkHost = scene.querySelector<HTMLElement>('.forge-sparks');
    if (!grid || !stage || !shake || !billet || !flash || !ram || blocks.length < 2) return;

    const ramp = gsap.utils.interpolate(HEAT_RAMP);
    const clamp01 = gsap.utils.clamp(0, 1);

    // ---- enhanced initial states (no-JS keeps the amber poster) ----------
    gsap.set(billet, {
      attr: { d: keyframes[0], pathLength: 1 },
      strokeDasharray: 1,
      strokeDashoffset: 1,
      fillOpacity: 0,
    });
    gsap.set(flash, { attr: { d: keyframes[0] } });
    gsap.set(ram, { y: -340 });
    if (bp) gsap.set(bp, { opacity: 0 });

    const setHeat = (colorP: number, glowP: number) => {
      stage.style.setProperty('--billet-heat', String(clamp01(glowP).toFixed(3)));
      stage.style.setProperty('--billet-edge', ramp(clamp01(colorP - 0.1)));
      stage.style.setProperty('--billet-core', ramp(clamp01(colorP + 0.08)));
    };
    setHeat(0, 0);

    // ---- spark pool --------------------------------------------------------
    const sparks: HTMLSpanElement[] = [];
    if (sparkHost) {
      for (let i = 0; i < SPARK_COUNT; i++) {
        const spark = document.createElement('span');
        spark.className = 'forge-spark-bit';
        sparkHost.appendChild(spark);
        sparks.push(spark);
      }
    }
    let sparkCursor = 0;

    const billetCenter = () => {
      const stageRect = shake.getBoundingClientRect();
      const rect = billet.getBoundingClientRect();
      return {
        x: rect.left - stageRect.left + rect.width / 2,
        y: rect.top - stageRect.top + rect.height / 2,
        w: rect.width,
      };
    };

    const burstSparks = (count: number) => {
      if (!sparks.length) return;
      const c = billetCenter();
      for (let i = 0; i < count; i++) {
        const spark = sparks[sparkCursor++ % sparks.length];
        const angle = gsap.utils.random(-Math.PI, 0); // upward hemisphere
        const speed = gsap.utils.random(60, 170);
        gsap.killTweensOf(spark);
        gsap.set(spark, {
          x: c.x + gsap.utils.random(-c.w * 0.3, c.w * 0.3),
          y: c.y,
          opacity: 1,
          scale: gsap.utils.random(0.7, 1.3),
        });
        gsap.to(spark, {
          x: `+=${Math.cos(angle) * speed}`,
          y: `+=${Math.sin(angle) * speed + 70}`, // gravity pulls the arc down
          opacity: 0,
          scale: 0.3,
          duration: gsap.utils.random(0.5, 0.9),
          ease: 'power1.out',
        });
      }
    };

    const riseSpark = () => {
      if (!sparks.length) return;
      const c = billetCenter();
      const spark = sparks[sparkCursor++ % sparks.length];
      const x = c.x + gsap.utils.random(-c.w * 0.45, c.w * 0.45);
      gsap.killTweensOf(spark);
      gsap.set(spark, { x, y: c.y - 8, opacity: 0.9, scale: 1 });
      gsap.to(spark, {
        x: x + gsap.utils.random(-20, 20),
        y: c.y - gsap.utils.random(80, 150),
        opacity: 0,
        scale: 0.4,
        duration: gsap.utils.random(1, 1.6),
        ease: 'power1.out',
      });
    };

    // ---- the strike --------------------------------------------------------
    let struck = 0;

    const strike = (shapeIndex: number) => {
      const d = keyframes[shapeIndex];
      gsap
        .timeline()
        // the ram falls, motion-stretched
        .fromTo(ram, { y: -340, scaleY: 1.15, transformOrigin: '50% 0%' }, { y: 84, scaleY: 1, duration: 0.12, ease: 'power3.in' })
        // impact: flash, morph, shake, sparks
        .set(flash, { attr: { d } }, 0.12)
        .fromTo(flash, { opacity: 0.9 }, { opacity: 0, duration: 0.3, ease: 'power2.out' }, 0.12)
        .to(billet, { attr: { d }, duration: 0.2, ease: 'back.out(1.4)' }, 0.12)
        .to(
          shake,
          {
            keyframes: [
              { x: -5, y: 3, duration: 0.05 },
              { x: 4, y: -2, duration: 0.05 },
              { x: -2, y: 1, duration: 0.05 },
              { x: 0, y: 0, duration: 0.08 },
            ],
          },
          0.12
        )
        .call(() => burstSparks(12), [], 0.12)
        // the ram withdraws
        .to(ram, { y: -340, duration: 0.5, ease: 'power2.out' }, 0.4);
    };

    const unstrike = (shapeIndex: number) => {
      gsap.to(billet, { attr: { d: keyframes[shapeIndex] }, duration: 0.3, ease: 'power2.out' });
      gsap.set(flash, { attr: { d: keyframes[shapeIndex] } });
    };

    // ---- Amplify: echo pulses + rising embers (paused off-phase) -----------
    const echoTl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.4 });
    if (echoGroup && echoes.length) {
      gsap.set(echoGroup, { opacity: 1 });
      echoes.forEach((echo, i) => {
        echoTl.fromTo(
          echo,
          { scale: 1, opacity: 0 },
          { scale: 1.22 + i * 0.06, opacity: 0.55 - i * 0.14, duration: 1.6, ease: 'power2.out' },
          i * 0.35
        );
        echoTl.to(echo, { opacity: 0, duration: 0.6 }, i * 0.35 + 1.0);
      });
      echoTl.eventCallback('onRepeat', () => riseSpark());
      gsap.set(echoGroup, { opacity: 0 });
    }

    // ---- master scrub (no pin — CSS sticky holds the stage) ----------------
    let brokeScale = false;

    const master = ScrollTrigger.create({
      trigger: grid,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.8,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;

        // -- heat: color follows progress; the bellows (scroll velocity)
        //    briefly stokes the glow without changing the metal's color
        const stoke = clamp01(Math.abs(lenis.velocity) / 60) * 0.12;
        setHeat(p, p + stoke);

        // -- the billet arrives: outline draws, body fades in (Ignite)
        gsap.set(billet, {
          strokeDashoffset: 1 - clamp01(p / 0.09),
          fillOpacity: clamp01(p / 0.07),
        });

        // -- HUD temperature — 0273°C → 1538°C → ∞
        if (temp) {
          if (p > 0.9) {
            temp.textContent = '∞';
            if (!brokeScale) {
              brokeScale = true;
              gsap.fromTo(
                temp,
                { textShadow: '0 0 28px rgba(255,232,196,0.9)' },
                { textShadow: '0 0 0px rgba(255,232,196,0)', duration: 1.2, ease: 'power2.out' }
              );
            }
          } else {
            brokeScale = false;
            temp.textContent = String(Math.round(273 + p * (1538 - 273))).padStart(4, '0');
          }
        }

        // -- ghost numeral crossfade with a slow drift
        const pos = p * (numerals.length - 1);
        numerals.forEach((numeral, i) => {
          const proximity = clamp01(1 - Math.abs(pos - i));
          gsap.set(numeral, { opacity: 0.05 * proximity, yPercent: (pos - i) * -6 });
        });

        // -- strikes: crossing-based state machine
        while (struck < STRIKES.length && p >= STRIKES[struck].at) {
          strike(STRIKES[struck].shape);
          struck++;
        }
        while (struck > 0 && p < STRIKES[struck - 1].at) {
          struck--;
          unstrike(struck > 0 ? STRIKES[struck - 1].shape : 0);
        }

        // -- Architect [≈0.1–0.3]: blueprint draws in, retracts before hammering
        if (bp) {
          gsap.set(bp, {
            opacity: 0.85 * clamp01((p - 0.12) / 0.05) * (1 - clamp01((p - 0.3) / 0.03)),
          });
        }

        // -- Validate [≈0.5–0.7]: tolerance gauges sweep, readouts land PASS
        if (gauges) {
          gsap.set(gauges, {
            opacity: clamp01((p - 0.52) / 0.035) * (1 - clamp01((p - 0.68) / 0.025)),
          });
          passes.forEach((pass, i) => {
            gsap.set(pass, { opacity: clamp01((p - (0.56 + i * 0.03)) / 0.015) });
          });
          if (measure) {
            const mx = 150 + clamp01((p - 0.53) / 0.12) * 500;
            gsap.set(measure, { attr: { x1: mx, x2: mx, y1: 262, y2: 348 } });
          }
        }

        // -- Activate [≈0.7–0.9]: the blade lifts off the anvil; gleam sweeps
        const lift = clamp01((p - 0.72) / 0.05) * -14;
        gsap.set(billet, { y: lift });
        gsap.set(flash, { y: lift });
        if (gleam) {
          const sweep = clamp01((p - 0.74) / 0.1);
          gsap.set(gleam, {
            attr: { x: -160 + sweep * 1000 },
            opacity: sweep > 0 && sweep < 1 ? Math.sin(sweep * Math.PI) : 0,
            y: lift,
          });
        }

        // -- Amplify [≈0.9–1]: echoes pulse outward while the phase holds
        if (echoGroup) {
          const amp = clamp01((p - 0.92) / 0.05);
          gsap.set(echoGroup, { opacity: amp, y: lift });
          if (amp > 0 && !echoTl.isActive() && echoTl.paused()) echoTl.play();
          if (amp === 0 && !echoTl.paused()) echoTl.pause();
        }
      },
    });

    // ---- per-phase narration: text emphasis + tick highlight ---------------
    let activeBlock = -1;
    const blockTriggers = blocks.map((block, i) => {
      const content = block.querySelector<HTMLElement>(':scope > div');
      return ScrollTrigger.create({
        trigger: block,
        start: 'top 60%',
        end: 'bottom 40%',
        onToggle: (self) => {
          if (content) {
            gsap.to(content, { opacity: self.isActive ? 1 : 0.3, duration: 0.45, ease: 'power2.out' });
          }
          if (self.isActive) {
            activeBlock = i;
            ticks.forEach((tick, t) => {
              tick.style.color = t === i ? 'var(--color-ember-core)' : '';
            });
          }
        },
      });
    });
    blocks.forEach((block, i) => {
      const content = block.querySelector<HTMLElement>(':scope > div');
      if (content && i !== activeBlock) gsap.set(content, { opacity: i === 0 ? 1 : 0.3 });
    });

    return () => {
      master.kill();
      blockTriggers.forEach((trigger) => trigger.kill());
      echoTl.kill();
      sparks.forEach((spark) => spark.remove());
      // restore the no-JS poster state
      gsap.set(billet, { clearProps: 'all', attr: { d: keyframes[4] } });
      billet.removeAttribute('stroke-dasharray');
      billet.removeAttribute('stroke-dashoffset');
      gsap.set(flash, { clearProps: 'all', attr: { d: keyframes[4] } });
      [ram, bp, gauges, echoGroup, gleam].forEach((el) => el && gsap.set(el, { clearProps: 'all' }));
      blocks.forEach((block) => {
        const content = block.querySelector<HTMLElement>(':scope > div');
        if (content) gsap.set(content, { clearProps: 'all' });
      });
      stage.style.removeProperty('--billet-heat');
      stage.style.removeProperty('--billet-edge');
      stage.style.removeProperty('--billet-core');
    };
  });
}
