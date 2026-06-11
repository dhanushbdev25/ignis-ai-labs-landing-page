/**
 * The Ember Field — OGL points scene behind the hero.
 * GPU-resident: all motion is computed in the vertex shader; the CPU only
 * lerps one pointer uniform per frame. Pauses off-screen and on tab blur.
 */
import { Renderer, Geometry, Program, Mesh } from 'ogl';
import { decideQuality } from './quality';
import { vertex, fragment } from './shaders';

export function mountEmberField(host: HTMLElement, section: HTMLElement) {
  const quality = decideQuality();
  if (!quality) return;

  const renderer = new Renderer({
    alpha: true,
    depth: false,
    antialias: false,
    dpr: quality.dpr,
    premultipliedAlpha: true,
  });
  const gl = renderer.gl;
  const canvas = gl.canvas as HTMLCanvasElement;
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
  host.appendChild(canvas);

  // additive-style blending over the dark background
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  // per-particle seeds: x spawn position, life phase, misc seed
  const count = quality.particles;
  const seeds = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    seeds[i * 3 + 0] = (Math.random() * 2 - 1) * 1.05; // x in clip space
    seeds[i * 3 + 1] = Math.random(); // life phase
    seeds[i * 3 + 2] = Math.random() * 100 + 1; // seed
  }

  const geometry = new Geometry(gl, {
    position: { size: 3, data: seeds },
  });

  const program = new Program(gl, {
    vertex,
    fragment,
    transparent: true,
    depthTest: false,
    uniforms: {
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uMouse: { value: [0, -2] }, // start far away
      uDpr: { value: quality.dpr },
    },
  });

  const mesh = new Mesh(gl, { mode: gl.POINTS, geometry, program });

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = host;
    renderer.setSize(w, h);
    program.uniforms.uAspect.value = w / Math.max(h, 1);
  };
  resize();
  window.addEventListener('resize', resize);

  // pointer → clip space, lerped for the "heat source" push
  const mouse = { x: 0, y: -2, tx: 0, ty: -2 };
  const onPointerMove = (event: PointerEvent) => {
    const rect = host.getBoundingClientRect();
    mouse.tx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.ty = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
  };
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  let raf = 0;
  let running = false;
  let dead = false;

  // scroll velocity stokes the fire: a "virtual clock" runs faster while
  // the page is moving, so embers stream upward with the scroll
  let virtualTime = 0;
  let lastFrame = performance.now();
  let lastScrollY = window.scrollY;
  let boost = 0;

  const frame = () => {
    if (!running) return;
    raf = requestAnimationFrame(frame);

    const now = performance.now();
    const dt = Math.min((now - lastFrame) / 1000, 0.05);
    lastFrame = now;

    const scrollDelta = Math.abs(window.scrollY - lastScrollY);
    lastScrollY = window.scrollY;
    const targetBoost = Math.min(scrollDelta / 40, 2.2);
    boost += (targetBoost - boost) * 0.06;
    virtualTime += dt * (1 + boost);

    mouse.x += (mouse.tx - mouse.x) * 0.08;
    mouse.y += (mouse.ty - mouse.y) * 0.08;
    program.uniforms.uMouse.value = [mouse.x, mouse.y];
    program.uniforms.uTime.value = virtualTime;
    renderer.render({ scene: mesh });
  };

  const play = () => {
    if (running || dead) return;
    running = true;
    raf = requestAnimationFrame(frame);
  };
  const pause = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && document.visibilityState === 'visible') play();
      else pause();
    },
    { rootMargin: '20% 0px' }
  );
  io.observe(section);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') pause();
    else if (io.takeRecords().length === 0) play();
  });

  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    dead = true;
    pause();
    host.style.opacity = '0'; // the CSS atmosphere underneath stands alone
  });

  // ignite
  play();
  requestAnimationFrame(() => {
    host.style.opacity = '1';
  });
}
