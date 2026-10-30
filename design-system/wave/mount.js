import * as THREE from 'three';
import { vertexShader, fragmentShader } from './shaders.js';
import defaults from './settings.json';

// Folded ribbon geometry, same as stripe-wave-lab/src/main.js and DS Report scripts/wave/mount.js.
function makeFoldedGeometry() {
  const segmentsX = 128, segmentsY = 256, width = 400, height = 400;
  const positions = [], uvs = [], indices = [];
  for (let j = 0; j <= segmentsY; j++) {
    const v = 1 - j / segmentsY;
    const fold = 4 - 2 * Math.pow(4 * v * (1 - v), 9.5);
    for (let i = 0; i <= segmentsX; i++) {
      const u = i / segmentsX;
      let x = u * width - width / 2;
      const y = -(j * height / segmentsY - height / 2);
      let z;
      if (x < -16) z = fold;
      else if (x < 16) {
        const t = (x + 16) / 32;
        z = Math.cos(t * Math.PI) * fold;
        x = Math.cos(-Math.PI / 2 + t * Math.PI) * fold - 16;
      } else { z = -fold; x = -x; }
      x += width / 4;
      positions.push(y, z, x);
      uvs.push(u, v);
    }
  }
  for (let j = 0; j < segmentsY; j++) for (let i = 0; i < segmentsX; i++) {
    const a = j * (segmentsX + 1) + i, b = a + segmentsX + 1;
    indices.push(a, b, a + 1, b, b + 1, a + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}

// Settings were tuned on a 1392px-wide lab stage; the scene scales from that width.
const LAB_W = 1392;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let geometry;

// Report hero framing (DS Report scripts/wave/embed.js, live on ds-report.vercel.app):
// canvas rect as fractions of the host, wave scale k, start time t0.
const HERO = { x: .3313, y: 0, w: .8083, h: .9494, k: 1.37, t0: -1.5 };

// host: positioned element; the canvas is placed inside it by `frame`.
// Options override settings.json keys; options.frame overrides HERO keys, options.frameSm overrides frame below 700px.
const small = matchMedia('(max-width: 699px)');
export function mount(host, options = {}) {
  const p = { ...defaults, ...options };
  const fLg = { ...HERO, ...options.frame }, fSm = { ...fLg, ...options.frameSm };
  let f = fLg;
  geometry ??= makeFoldedGeometry();

  const canvas = document.createElement('canvas');
  canvas.className = 'wave-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  host.prepend(canvas);

  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false }); }
  catch { canvas.remove(); return null; } // no WebGL: host keeps its black background
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(p.white);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, .1, 10000);
  camera.position.set(100, 0, 5000);
  camera.lookAt(0, 0, 0);

  const uniforms = {
    uTime: { value: 0 }, uSpeed: { value: p.speed },
    uDisplaceX: { value: p.displaceX }, uDisplaceZ: { value: p.displaceZ },
    uDisplaceAmount: { value: p.displaceAmount },
    uTwist: { value: new THREE.Vector3(p.twistX, p.twistY, p.twistZ) },
    uTwistPower: { value: new THREE.Vector3(p.twistPowerX, p.twistPowerY, p.twistPowerZ) },
    uPalette: { value: new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1) },
    uResolution: { value: new THREE.Vector2() },
    uPaletteMode: { value: 1 }, // gradient only: the image palette is not shipped
    uGradientColors: { value: [p.gradientColor1, p.gradientColor2, p.gradientColor3].map(c => new THREE.Color(c)) },
    uFibers: { value: p.fibers }, uFiberScale: { value: p.fiberScale ?? 1 }, uGlow: { value: p.glow }, uGrain: { value: p.grain },
    uSaturation: { value: p.saturation }, uContrast: { value: p.contrast }, uHue: { value: p.hue },
  };
  uniforms.uPalette.value.needsUpdate = true;
  const mesh = new THREE.Mesh(geometry, new THREE.ShaderMaterial({
    uniforms, vertexShader, fragmentShader, side: THREE.DoubleSide, extensions: { derivatives: true },
  }));
  mesh.position.set(p.positionX, p.positionY, p.positionZ);
  mesh.rotation.set(p.rotationX, p.rotationY, p.rotationZ);
  mesh.scale.set(p.scaleX, p.scaleY, p.scaleZ);
  scene.add(mesh);

  const render = () => renderer.render(scene, camera);
  canvas.style.position = 'absolute';
  const resize = () => {
    const r = { width: host.offsetWidth, height: host.offsetHeight }; // layout size: a scaled parent (post builder preview) must not shrink it
    f = small.matches ? fSm : fLg;
    // frame.aspect: the view is the hero's (w / aspect tall, anchored at the top), scaled to the host width;
    // the canvas still fills the host height so the ribbon runs on instead of being cut
    const w = r.width * f.w, h = r.height * f.h, hv = f.aspect ? w / f.aspect : h;
    if (!w || !h) return;
    const top = f.aspect ? hv * f.y / f.h : r.height * f.y;
    Object.assign(canvas.style, { left: r.width * f.x + 'px', top: top + 'px', width: w + 'px', height: h + 'px' });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setSize(w, h, false);
    scene.scale.setScalar(f.k * w / LAB_W);
    Object.assign(camera, { left: -w / 2, right: w / 2, top: hv / 2, bottom: hv / 2 - h, zoom: p.zoom });
    camera.updateProjectionMatrix();
    uniforms.uResolution.value.set(canvas.width, canvas.height);
    render();
  };

  // Runs only while on screen; reduced motion renders one still frame.
  let visible = false, raf = 0, last = 0, time = f.t0;
  let held = false;
  const tick = now => {
    raf = 0;
    if (held) return;
    time += Math.min((now - last) / 1000, .05);
    last = now;
    uniforms.uTime.value = p.timeOffset + time;
    render();
    if (visible && !reduced.matches) raf = requestAnimationFrame(tick);
  };
  const start = () => { if (!raf && !held && !reduced.matches) { last = performance.now(); raf = requestAnimationFrame(tick); } };
  new ResizeObserver(resize).observe(host);
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); }).observe(host);
  uniforms.uTime.value = p.timeOffset + time;
  resize();
  // tint: ease the ribbon to new gradient colours (and saturation/contrast/glow), e.g. on a card hover; `white` sets the ground.
  // Renders its own frames so it also runs under reduced motion.
  let tintRaf = 0;
  const tint = (to, ms = 250) => {
    const cols = uniforms.uGradientColors.value, from = cols.map(c => c.clone());
    const target = [to.gradientColor1, to.gradientColor2, to.gradientColor3].map((c, i) => c ? new THREE.Color(c) : from[i]);
    const nums = ['saturation', 'contrast', 'glow'].filter(k => to[k] != null).map(k => {
      const u = uniforms['u' + k[0].toUpperCase() + k.slice(1)];
      return [u, u.value, to[k]];
    });
    if (to.white) renderer.setClearColor(to.white); // ground switches at once: the host swaps its blend mode with it
    const t0 = performance.now();
    cancelAnimationFrame(tintRaf);
    const step = now => {
      const k = Math.min((now - t0) / ms, 1), e = 1 - (1 - k) ** 3;
      cols.forEach((c, i) => c.copy(from[i]).lerp(target[i], e));
      nums.forEach(([u, a, b]) => { u.value = a + (b - a) * e; });
      render();
      if (k < 1) tintRaf = requestAnimationFrame(step);
    };
    tintRaf = requestAnimationFrame(step);
  };
  // seek: jump to a moment (s from the start) and draw it; hold: stop or resume the clock (frame-by-frame export);
  // reframe: change the frame keys (x, y, w, h, k) without a new WebGL context
  const seek = s => { time = f.t0 + s; uniforms.uTime.value = p.timeOffset + time; render(); };
  const hold = on => { held = on; if (!on && visible) start(); };
  const reframe = o => { Object.assign(fLg, o); Object.assign(fSm, o); resize(); };
  return { canvas, render, tint, seek, hold, reframe };
}
