/**
 * The Crucible (Intelligence, Translated) — desktop-only pinned scrub.
 * Ten system nodes orbit the crucible; the node passing the 3-o'clock
 * reading position brightens, connects via an ember filament, and speaks
 * its microcopy. The crucible's mode label cross-fades through the scrub.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initCrucible() {
  const stage = document.querySelector<HTMLElement>('[data-scene="crucible"]');
  if (!stage) return;

  const mm = gsap.matchMedia();
  mm.add('(min-width: 1024px)', () => {
    const nodes = Array.from(stage.querySelectorAll<HTMLElement>('.crucible-node'));
    const readout = stage.querySelector<HTMLElement>('#crucible-readout');
    const filament = stage.querySelector<HTMLElement>('.crucible-filament');
    const mode = stage.querySelector<HTMLElement>('#crucible-mode');
    const ring = stage.querySelector<HTMLElement>('.crucible-ring');
    const guide = stage.querySelector<HTMLElement>('.crucible-orbit-guide');
    if (!nodes.length) return;

    let modeLabels: string[] = [];
    try {
      modeLabels = JSON.parse(mode?.dataset.labels ?? '[]');
    } catch {
      modeLabels = [];
    }

    const step = 360 / nodes.length;
    let radius = orbitRadius();
    let activeIndex = -1;

    function orbitRadius() {
      return Math.min(window.innerWidth * 0.28, 400);
    }

    const sizeGuide = () => {
      if (!guide) return;
      guide.style.width = `${radius * 2}px`;
      guide.style.height = `${radius * 2 * 0.62}px`;
    };

    const layout = (rotation: number) => {
      nodes.forEach((node, i) => {
        const angleDeg = i * step - rotation;
        const angle = (angleDeg * Math.PI) / 180;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius * 0.62; // squashed ellipse — depth
        // proximity to the 3-o'clock reading position (angle 0°)
        const norm = ((angleDeg % 360) + 360) % 360;
        const distFromZero = Math.min(norm, 360 - norm);
        const proximity = 1 - Math.min(distFromZero / 32, 1);
        // recede behind the section header in the upper-left quadrant
        const behindHeader = norm > 175 && norm < 265;
        gsap.set(node, {
          x,
          y,
          xPercent: -50,
          yPercent: -50,
          scale: 1 + proximity * 0.35,
          opacity: behindHeader ? 0.08 : 0.45 + proximity * 0.55,
          color: proximity > 0.6 ? '#f5efe6' : '',
        });
      });
    };

    const setActive = (index: number) => {
      if (index === activeIndex) return;
      activeIndex = index;
      const node = nodes[index];
      if (readout) {
        readout.textContent = node.dataset.micro ?? '';
        gsap.fromTo(readout, { opacity: 0, x: 12 }, { opacity: 1, x: 0, duration: 0.4, ease: 'expo.out' });
      }
      if (filament) {
        gsap.fromTo(filament, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'expo.out' });
      }
      if (ring) {
        // the crucible flares each time it ingests a new system
        gsap.fromTo(ring, { filter: 'brightness(1.7)' }, { filter: 'brightness(1)', duration: 0.7, ease: 'power2.out' });
      }
    };

    const setMode = (progress: number) => {
      if (!mode || !modeLabels.length) return;
      const idx = Math.min(Math.floor(progress * modeLabels.length), modeLabels.length - 1);
      if (mode.textContent !== modeLabels[idx]) {
        mode.textContent = modeLabels[idx];
        gsap.fromTo(mode, { opacity: 0 }, { opacity: 1, duration: 0.4 });
      }
    };

    layout(0);
    sizeGuide();
    setActive(0);

    const trigger = ScrollTrigger.create({
      trigger: stage,
      start: 'top top',
      end: '+=300%',
      pin: true,
      scrub: 0.8,
      onUpdate: (self) => {
        const rotation = self.progress * 360;
        layout(rotation);
        setMode(self.progress);
        // node nearest the reading position
        const index = Math.round(rotation / step) % nodes.length;
        setActive((index + nodes.length) % nodes.length);
      },
    });

    const onResize = () => {
      radius = orbitRadius();
      sizeGuide();
      layout(trigger.progress * 360);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      trigger.kill();
    };
  });
}
