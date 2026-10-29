import { mount } from './mount.js';

// Every element with [data-wave] gets a live ribbon. Pass overrides as JSON: data-wave='{"speed":0.05}'.
for (const host of document.querySelectorAll('[data-wave]')) {
  let options = {};
  try { options = JSON.parse(host.dataset.wave || '{}'); } catch { /* keep defaults */ }
  host.wave = mount(host, options); // { canvas, render, tint } or null without WebGL
}
window.DSWave = { mount };
