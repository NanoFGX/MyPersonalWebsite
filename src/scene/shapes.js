// Point-cloud targets for the morphing particle system.
// Each generator fills `count` xyz triplets, roughly inside a radius of 2.4 units.

const TAU = Math.PI * 2;

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function globe(count) {
  const out = new Float32Array(count * 3);
  const r = rng(1);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const shell = r();
    let radius = 2.15;
    let y, rad, th;
    if (shell < 0.72) {
      y = 1 - (i / (count - 1)) * 2;
      rad = Math.sqrt(1 - y * y);
      th = golden * i;
    } else if (shell < 0.9) {
      // latitude rings
      const ring = Math.floor(r() * 7) - 3;
      y = ring / 4;
      rad = Math.sqrt(1 - y * y);
      th = r() * TAU;
      radius = 2.18;
    } else {
      // orbit ring
      y = (r() - 0.5) * 0.02;
      rad = 1;
      th = r() * TAU;
      radius = 2.9 + (r() - 0.5) * 0.08;
    }
    out[i * 3] = Math.cos(th) * rad * radius;
    out[i * 3 + 1] = y * radius;
    out[i * 3 + 2] = Math.sin(th) * rad * radius;
  }
  return out;
}

function monogram(count, text = 'ZA') {
  const out = new Float32Array(count * 3);
  const w = 512;
  const h = 256;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 220px "Geist Variable", system-ui, sans-serif';
  ctx.fillText(text, w / 2, h / 2 + 8);
  const data = ctx.getImageData(0, 0, w, h).data;
  const pts = [];
  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      if (data[(y * w + x) * 4 + 3] > 128) pts.push(x, y);
    }
  }
  const r = rng(2);
  const n = pts.length / 2;
  for (let i = 0; i < count; i++) {
    if (n === 0 || r() < 0.06) {
      // sparse dust around the letters
      out[i * 3] = (r() - 0.5) * 6.5;
      out[i * 3 + 1] = (r() - 0.5) * 3.2;
      out[i * 3 + 2] = (r() - 0.5) * 2;
      continue;
    }
    const k = Math.floor(r() * n) * 2;
    out[i * 3] = ((pts[k] + r() * 2) / w - 0.5) * 5.6;
    out[i * 3 + 1] = -((pts[k + 1] + r() * 2) / h - 0.5) * 2.8;
    out[i * 3 + 2] = (r() - 0.5) * 0.45;
  }
  return out;
}

function racks(count) {
  const out = new Float32Array(count * 3);
  const r = rng(3);
  const W = 3.4;
  const H = 0.62;
  const D = 1.5;
  const gap = 0.32;
  const levels = 4;
  const total = levels * H + (levels - 1) * gap;
  for (let i = 0; i < count; i++) {
    const lvl = Math.floor(r() * levels);
    const y0 = -total / 2 + lvl * (H + gap);
    const pick = r();
    let x, y, z;
    if (pick < 0.45) {
      // front face with vent grid rows
      x = (r() - 0.5) * W;
      y = y0 + Math.round(r() * 5) / 5 * H;
      z = D / 2;
    } else if (pick < 0.62) {
      // LED column on the right of each front panel
      x = W / 2 - 0.28 - Math.floor(r() * 3) * 0.14;
      y = y0 + H * 0.5 + (r() - 0.5) * 0.06;
      z = D / 2 + 0.02;
    } else {
      // box edges
      const e = Math.floor(r() * 4);
      const t = r();
      if (e === 0) { x = (t - 0.5) * W; y = y0; z = (r() < 0.5 ? -1 : 1) * D / 2; }
      else if (e === 1) { x = (t - 0.5) * W; y = y0 + H; z = (r() < 0.5 ? -1 : 1) * D / 2; }
      else if (e === 2) { x = (r() < 0.5 ? -1 : 1) * W / 2; y = y0 + t * H; z = (r() < 0.5 ? -1 : 1) * D / 2; }
      else { x = (r() < 0.5 ? -1 : 1) * W / 2; y = y0 + (r() < 0.5 ? 0 : H); z = (t - 0.5) * D; }
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
}

function shieldOutline(t) {
  // t in [0,1): clockwise outline of a heater shield, width ~3.2, height ~3.8
  const top = 1.7;
  const w = 1.6;
  if (t < 0.25) {
    const u = t / 0.25;
    return [-w + u * 2 * w, top + Math.sin(u * Math.PI) * 0.12];
  }
  if (t < 0.625) {
    const u = (t - 0.25) / 0.375;
    const x = w * Math.cos(u * Math.PI * 0.5) ** 0.8;
    const y = top - u * 3.9;
    return [x, y];
  }
  const u = (t - 0.625) / 0.375;
  const x = -w * Math.sin(u * Math.PI * 0.5) ** 1.25;
  const y = -2.2 + u * 3.9;
  return [x, y];
}

function shield(count) {
  const out = new Float32Array(count * 3);
  const r = rng(4);
  const poly = [];
  for (let i = 0; i < 160; i++) poly.push(shieldOutline(i / 160));
  const inside = (px, py) => {
    let c = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i];
      const [xj, yj] = poly[j];
      if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) c = !c;
    }
    return c;
  };
  for (let i = 0; i < count; i++) {
    const pick = r();
    let x, y, z;
    if (pick < 0.35) {
      const [ox, oy] = shieldOutline(r());
      x = ox * (1 + (r() - 0.5) * 0.02);
      y = oy;
      z = (r() - 0.5) * 0.2;
    } else if (pick < 0.47) {
      // inner bevel
      const [ox, oy] = shieldOutline(r());
      x = ox * 0.84;
      y = oy * 0.86 + 0.1;
      z = 0.18;
    } else if (pick < 0.6) {
      // check mark
      const t = r();
      if (t < 0.38) {
        const u = t / 0.38;
        x = -0.75 + u * 0.55;
        y = 0.05 - u * 0.6;
      } else {
        const u = (t - 0.38) / 0.62;
        x = -0.2 + u * 1.05;
        y = -0.55 + u * 1.25;
      }
      x += (r() - 0.5) * 0.12;
      y += (r() - 0.5) * 0.12;
      z = 0.42;
    } else {
      do {
        x = (r() - 0.5) * 3.3;
        y = -2.3 + r() * 4.2;
      } while (!inside(x, y));
      const d = 1 - Math.min(1, (x * x) / 2.6 + ((y + 0.2) * (y + 0.2)) / 4.5);
      z = d * 0.45 + (r() - 0.5) * 0.05;
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
}

function helix(count) {
  const out = new Float32Array(count * 3);
  const r = rng(5);
  const len = 7;
  const turns = 3.2;
  const rad = 0.95;
  for (let i = 0; i < count; i++) {
    const t = r();
    const x = (t - 0.5) * len;
    const a = t * turns * TAU;
    const pick = r();
    let y, z;
    if (pick < 0.4) {
      y = Math.cos(a) * rad;
      z = Math.sin(a) * rad;
    } else if (pick < 0.8) {
      y = Math.cos(a + Math.PI) * rad;
      z = Math.sin(a + Math.PI) * rad;
    } else {
      // rungs, snapped to evenly spaced steps
      const step = Math.round(t * 46) / 46;
      const b = step * turns * TAU;
      const u = r() * 2 - 1;
      out[i * 3] = (step - 0.5) * len;
      out[i * 3 + 1] = Math.cos(b) * rad * u;
      out[i * 3 + 2] = Math.sin(b) * rad * u;
      continue;
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y + (r() - 0.5) * 0.06;
    out[i * 3 + 2] = z + (r() - 0.5) * 0.06;
  }
  return out;
}

function terrain(count) {
  const out = new Float32Array(count * 3);
  const side = Math.ceil(Math.sqrt(count));
  for (let i = 0; i < count; i++) {
    const gx = (i % side) / (side - 1) - 0.5;
    const gz = Math.floor(i / side) / (side - 1) - 0.5;
    const x = gx * 7;
    const z = gz * 7;
    const y =
      Math.sin(x * 0.9) * 0.28 +
      Math.cos(z * 1.1 + x * 0.3) * 0.32 +
      Math.sin(Math.hypot(x, z) * 1.6) * 0.18;
    out[i * 3] = x;
    out[i * 3 + 1] = y - 0.6;
    out[i * 3 + 2] = z;
  }
  return out;
}

function medal(count) {
  const out = new Float32Array(count * 3);
  const r = rng(7);
  for (let i = 0; i < count; i++) {
    const pick = r();
    if (pick < 0.7) {
      // torus knot (2,3)
      const t = r() * TAU;
      const p = 2;
      const q = 3;
      const rr = Math.cos(q * t) + 2.2;
      const cx = rr * Math.cos(p * t) * 0.62;
      const cy = rr * Math.sin(p * t) * 0.62;
      const cz = -Math.sin(q * t) * 0.62;
      const tube = 0.16 * Math.sqrt(r());
      const a = r() * TAU;
      out[i * 3] = cx + Math.cos(a) * tube;
      out[i * 3 + 1] = cy + Math.sin(a) * tube;
      out[i * 3 + 2] = cz + Math.sin(a + 1) * tube;
    } else {
      const a = r() * TAU;
      const rad = 2.75 + (r() - 0.5) * 0.05;
      out[i * 3] = Math.cos(a) * rad;
      out[i * 3 + 1] = Math.sin(a) * rad;
      out[i * 3 + 2] = (r() - 0.5) * 0.05;
    }
  }
  return out;
}

function lattice(count) {
  const out = new Float32Array(count * 3);
  const r = rng(8);
  const n = 4;
  const size = 3;
  const step = size / (n - 1);
  for (let i = 0; i < count; i++) {
    const axis = Math.floor(r() * 3);
    const a = Math.floor(r() * n) * step - size / 2;
    const b = Math.floor(r() * n) * step - size / 2;
    const t = r() * size - size / 2;
    let x, y, z;
    if (axis === 0) { x = t; y = a; z = b; }
    else if (axis === 1) { x = a; y = t; z = b; }
    else { x = a; y = b; z = t; }
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
}

function portal(count) {
  const out = new Float32Array(count * 3);
  const r = rng(9);
  for (let i = 0; i < count; i++) {
    const pick = r();
    const a = r() * TAU;
    let rad, z;
    if (pick < 0.4) { rad = 2.3; z = 0; }
    else if (pick < 0.6) { rad = 1.7; z = 0.1; }
    else if (pick < 0.7) { rad = 1.15; z = 0.2; }
    else { rad = 0.4 + Math.pow(r(), 0.6) * 3.2; z = (r() - 0.5) * 3; }
    out[i * 3] = Math.cos(a) * rad + (r() - 0.5) * 0.03;
    out[i * 3 + 1] = Math.sin(a) * rad + (r() - 0.5) * 0.03;
    out[i * 3 + 2] = z;
  }
  return out;
}

export const SHAPES = { globe, monogram, racks, shield, helix, terrain, medal, lattice, portal };

export function buildShapes(names, count) {
  const cache = {};
  for (const n of names) {
    if (!cache[n]) cache[n] = SHAPES[n](count);
  }
  return cache;
}
