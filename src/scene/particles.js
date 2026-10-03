import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  BufferGeometry,
  BufferAttribute,
  ShaderMaterial,
  Points,
  Group,
  Color,
  NormalBlending,
} from 'three';
import { buildShapes } from './shapes.js';

const vertex = /* glsl */ `
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute float aRand;
  attribute float aAccent;
  uniform float uT;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uBurst;
  uniform float uShimmer;
  varying float vAlpha;
  varying float vAccent;

  void main() {
    float delay = aRand * 0.45;
    float t = clamp((uT - delay) / 0.55, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);
    vec3 p = mix(aFrom, aTo, t);
    vec3 dir = normalize(aFrom + aTo + vec3(0.001));
    p += dir * sin(t * 3.14159) * uBurst * (0.35 + aRand * 0.9);
    p += uShimmer * 0.018 * vec3(
      sin(uTime * 0.7 + aRand * 41.0),
      cos(uTime * 0.6 + aRand * 29.0),
      sin(uTime * 0.5 + aRand * 17.0)
    );
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float twinkle = 0.65 + 0.35 * sin(uTime * 2.2 + aRand * 60.0);
    gl_PointSize = uSize * (0.55 + aRand * 0.9) * (1.0 + aAccent * 1.1) * uPixelRatio * (6.0 / -mv.z);
    vAlpha = smoothstep(-14.0, -3.5, mv.z) * mix(1.0, twinkle, aAccent);
    vAccent = aAccent;
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uAccent;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vAccent;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.1, d) * vAlpha * uOpacity;
    gl_FragColor = vec4(mix(uColor, uAccent, vAccent), a);
  }
`;

const damp = (a, b, lambda, dt) => a + (b - a) * (1 - Math.exp(-lambda * dt));
const wrapAngle = (a) => Math.atan2(Math.sin(a), Math.cos(a));

// Flat shapes sway around the front instead of spinning, so they never turn edge-on or mirrored.
const FLAT = new Set(['monogram', 'shield', 'medal', 'portal']);

export function createParticleScene(canvas, { shapes, reduced = false } = {}) {
  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
  } catch {
    return null;
  }

  const small = window.matchMedia('(max-width: 767px)').matches;
  const count = small ? 7000 : 14000;
  const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(38, 1, 0.1, 50);
  camera.position.set(0, 0, 9);

  const targets = buildShapes(shapes, count);
  const first = targets[shapes[0]];

  const geometry = new BufferGeometry();
  const aFrom = new BufferAttribute(first.slice(), 3);
  const aTo = new BufferAttribute(first.slice(), 3);
  const rand = new Float32Array(count);
  const accent = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    rand[i] = Math.random();
    accent[i] = Math.random() < 0.06 ? 1 : 0;
  }
  geometry.setAttribute('position', new BufferAttribute(first.slice(), 3));
  geometry.setAttribute('aFrom', aFrom);
  geometry.setAttribute('aTo', aTo);
  geometry.setAttribute('aRand', new BufferAttribute(rand, 1));
  geometry.setAttribute('aAccent', new BufferAttribute(accent, 1));

  const css = getComputedStyle(document.documentElement);
  const material = new ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthWrite: false,
    blending: NormalBlending,
    uniforms: {
      uT: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: small ? 2.9 : 2.75 },
      uPixelRatio: { value: dpr },
      uBurst: { value: reduced ? 0 : 0.55 },
      uShimmer: { value: reduced ? 0 : 1 },
      uOpacity: { value: 0 },
      uColor: { value: new Color(css.getPropertyValue('--particle').trim() || '#c9d3df') },
      uAccent: { value: new Color(css.getPropertyValue('--accent').trim() || '#f5b03c') },
    },
  });

  const points = new Points(geometry, material);
  points.frustumCulled = false;
  const tilt = new Group();
  const spin = new Group();
  spin.add(points);
  tilt.add(spin);
  scene.add(tilt);

  // Current morph pair.
  let fromName = shapes[0];
  let toName = shapes[0];
  let morphT = 0;

  // Pose: x/y as a fraction of the visible half extents, s as a fraction of the visible half height.
  const pose = { x: 0.4, y: 0, s: 0.62, dim: 1, rx: 0 };
  const poseTarget = { ...pose };
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let opacityTarget = 1;
  let running = false;
  let raf = 0;
  let last = performance.now();
  let elapsed = 0;

  function setPair(a, b) {
    if (a === fromName && b === toName) return;
    if (a !== fromName) {
      aFrom.array.set(targets[a]);
      aFrom.needsUpdate = true;
      fromName = a;
    }
    if (b !== toName) {
      aTo.array.set(targets[b]);
      aTo.needsUpdate = true;
      toName = b;
    }
  }

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    elapsed += dt;

    pointer.x = damp(pointer.x, pointer.tx, 3, dt);
    pointer.y = damp(pointer.y, pointer.ty, 3, dt);
    for (const k of ['x', 'y', 's', 'dim', 'rx']) pose[k] = damp(pose[k], poseTarget[k], 4, dt);

    const halfH = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
    const halfW = halfH * camera.aspect;
    tilt.position.set(pose.x * halfW, pose.y * halfH, 0);
    const scale = (pose.s * halfH) / 2.4;
    tilt.scale.setScalar(scale);
    tilt.rotation.x = pose.rx + pointer.y * 0.18;
    tilt.rotation.y = pointer.x * 0.35;
    if (!reduced) {
      const active = morphT < 0.5 ? fromName : toName;
      if (FLAT.has(active)) {
        spin.rotation.y = damp(wrapAngle(spin.rotation.y), Math.sin(elapsed * 0.35) * 0.38, 2.2, dt);
      } else {
        spin.rotation.y += dt * 0.09;
      }
    }

    const u = material.uniforms;
    u.uTime.value = elapsed;
    u.uT.value = morphT;
    u.uOpacity.value = damp(u.uOpacity.value, opacityTarget * pose.dim, 3, dt);

    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  const onPointer = (e) => {
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
  };
  const onVisibility = () => (document.hidden ? stop() : start());

  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', onVisibility);
  if (!reduced && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', onPointer, { passive: true });
  }
  resize();

  return {
    count,
    /** Morph between two named shapes at progress t (0..1), blending poses alongside. */
    morph(a, b, t, poseA, poseB) {
      setPair(a, b);
      morphT = t;
      const e = t * t * (3 - 2 * t);
      for (const k of Object.keys(poseTarget)) {
        poseTarget[k] = poseA[k] + (poseB[k] - poseA[k]) * e;
      }
    },
    show() {
      opacityTarget = 1;
    },
    start,
    stop,
  };
}
