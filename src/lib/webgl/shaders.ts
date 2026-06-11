/**
 * Ember field shaders — pure math, no textures.
 * Each particle loops a life cycle: spawn in the bottom band, rise with
 * per-particle speed, drift on layered sine "curl", flicker, cool, die.
 */

export const vertex = /* glsl */ `
  attribute vec3 position; // x: horizontal seed, y: phase seed, z: misc seed

  uniform float uTime;
  uniform float uAspect;
  uniform vec2 uMouse;   // clip-space, lerped on CPU
  uniform float uDpr;

  varying float vLife;
  varying float vFlicker;

  float hash(float n) { return fract(sin(n) * 43758.5453123); }

  void main() {
    float seed = position.z;
    float speed = mix(0.018, 0.075, hash(seed * 3.7));
    float life = fract(uTime * speed + position.y);

    // rise from below the fold to above the top
    float y = -1.15 + life * 2.45;

    // horizontal placement + layered sine drift that widens as the ember rises
    float x = position.x;
    float drift = sin(life * 6.2832 * 0.6 + seed * 17.0) * 0.10
                + sin(life * 6.2832 * 1.7 + seed * 31.0) * 0.045;
    x += drift * (0.3 + life);

    // cursor is a heat source — nearby embers get pushed outward
    vec2 pos = vec2(x, y);
    vec2 fromMouse = pos - uMouse;
    fromMouse.x *= uAspect;
    float d = length(fromMouse);
    if (d > 0.0001) {
      pos += normalize(fromMouse) * smoothstep(0.30, 0.0, d) * 0.10;
    }

    vLife = life;
    vFlicker = 0.7 + 0.3 * sin(uTime * (3.0 + hash(seed * 9.1) * 6.0) + seed * 40.0);

    gl_Position = vec4(pos, 0.0, 1.0);
    float size = mix(1.5, 4.0, hash(seed * 5.3));
    gl_PointSize = size * uDpr * (1.2 - life * 0.7) * vFlicker;
  }
`;

export const fragment = /* glsl */ `
  precision mediump float;

  varying float vLife;
  varying float vFlicker;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float sprite = smoothstep(0.5, 0.05, d);

    // embers cool as they rise: white-hot core -> molten orange -> deep red
    vec3 hot   = vec3(1.0, 0.91, 0.77);  // #ffe8c4
    vec3 core  = vec3(1.0, 0.36, 0.10);  // #ff5c1a
    vec3 dying = vec3(0.48, 0.13, 0.03); // #7a2208

    vec3 color = mix(hot, core, smoothstep(0.0, 0.35, vLife));
    color = mix(color, dying, smoothstep(0.45, 0.95, vLife));

    // fade in fast at spawn, fade out as it dies
    float alpha = sprite * vFlicker;
    alpha *= smoothstep(0.0, 0.08, vLife);
    alpha *= 1.0 - smoothstep(0.55, 1.0, vLife);

    gl_FragColor = vec4(color * alpha, alpha);
  }
`;
