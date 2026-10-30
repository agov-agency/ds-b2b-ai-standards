// Post builder (src/pages/post-builder.astro): state → post markup, the template gallery, and PNG/MP4 export.
// Export draws three layers per frame: background, art (the figure redrawn at time t, or the wave canvas), copy on top.
import { toCanvas, getFontEmbedCSS } from 'html-to-image';
import { Muxer, ArrayBufferTarget } from 'mp4-muxer';
import { pieces } from './art';
import { alts } from './art/alt';
import type { Piece } from './art/iso';

type Author = { id: string; name: string; role: string; company: string; photo: string };
type Data = {
  authors: Author[];
  scenarios: { id: string; title: string; description: string; cadence: string; author?: string; status: string; cover: number; category: string; connectors: string[]; art?: { piece: string; zoom: number }; steps: string[] }[];
  skills: { id: string; title: string; description: string; author?: string; status: string; cover: number; category: string; connectors: string[]; icon: string; changes: string }[];
  rules: { id: string; number: number; title: string; why: string; author?: string; cover: number; category: string; icon: string; advises: string; adds: string; voices: { name: string; author?: string; company: string; quote: string }[] }[];
  quotes: { name: string; company: string; photo: string; text: string }[];
  logos: Record<string, string>;
};

const DEFAULTS = {
  format: 'square', layout: 'a', vpos: 'end', align: 'left',
  bg: 'black', bgCustom: '#0b0c0d', hue: 'auto', hueCustom: '#3875f6', cover: 0,
  about: '', lines: true, pattern: false, fade: true,
  logo: true, logoKind: 'mark', logoPos: 'left', logoH: 48, label: true, labelText: '',
  avatar: false, chips: false, chipsText: '', qmark: false, headline: '', context: '', hsize: 'auto', hpx: 80, hmax: 88, tsize: 24, rule: false,
  body: false, bodyText: '', pairs: false, pairsCms: true, pairsText: '', steps: false, stepsLabel: 'Process', stepsText: '', tools: false, toolsLabel: 'Runs with', toolsText: '', toolsCustom: false, toolsOwn: [{ name: '', logo: 'list' }], github: false,
  list: false, listText: '', button: false, buttonText: '',
  author: '', authorStyle: 'byline', aCustom: false, aName: '', aRole: '', aPhoto: '',
  art: { id: 'none', zoom: 1, x: 0, y: 0, t: 0, mono: false, animate: true, frame: 'bleed', photo: '' },
  wave: { c1: '#3875f6', c2: '#fa8c16', c3: '#3875f6', ground: '#000000', k: 1.37, time: 0 },
};
type State = typeof DEFAULTS;
const FORMATS: Record<string, [number, number]> = { square: [1080, 1080], portrait: [1080, 1350], story: [1080, 1920], wide: [1200, 628], header: [1200, 480], block: [1200, 240], cover: [1920, 1080] };
const WAVES = {
  brand: { c1: '#3875f6', c2: '#fa8c16', c3: '#3875f6', ground: '#000000' },
  cta: { c1: '#4aa8ff', c2: '#8a7cff', c3: '#4aa8ff', ground: '#5a8bfb' }, // SiteFooter hover
  mono: { c1: '#aaadb3', c2: '#ffffff', c3: '#767980', ground: '#000000' },
};
const SPEED = 0.6, FPS = 30; // IsoArt plays pieces at 0.6×

const clone = <T,>(o: T): T => JSON.parse(JSON.stringify(o));
const merge = (base: State, over: Partial<State> & { art?: Partial<State['art']>; wave?: Partial<State['wave']> }): State =>
  ({ ...base, ...over, art: { ...base.art, ...over.art }, wave: { ...base.wave, ...over.wave } }) as State;
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const br = (s: string) => esc(s.trim()).replace(/\n/g, '<br>'); // Enter in a text field is a line break in the post
const lines = (s: string) => s.split('\n').map((l) => l.trim()).filter(Boolean);
const initials = (n: string) => n.split(' ').map((w) => w[0]).slice(0, 2).join('');
const pieceOf = (id: string): Piece | undefined => (id.startsWith('alt:') ? alts[id.slice(4)]?.piece : pieces[id]);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');

let D: Data;
const authorById = (id?: string) => D.authors.find((a) => a.id === id);

// ---------- Colour ----------
function isDark(s: State) {
  if (s.bg === 'black') return true;
  if (s.bg !== 'custom') return false;
  const n = parseInt(s.bgCustom.slice(1), 16), [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 128;
}
const bgValue = (s: State) => (s.bg === 'black' ? 'var(--neutral-1000)' : s.bg === 'white' ? 'var(--neutral-0)' : s.bg === 'custom' ? s.bgCustom : `var(--${s.bg})`);
function hueValue(s: State, dark = isDark(s)) {
  if (s.hue === 'custom') return s.hueCustom;
  const n = s.hue === 'auto' ? (s.bg.startsWith('pastel-') ? +s.bg.slice(7) : s.cover) : s.hue === 'primary' ? 0 : +s.hue;
  return n ? `var(--pastel-${n}-${dark ? 200 : 450})` : `var(--primary-${dark ? 300 : 450})`;
}
// Panel behind framed art: the item's pastel on white, white on a pastel, a step up from black on black
const panelValue = (s: State) => (isDark(s) ? 'var(--neutral-950)' : s.bg === 'white' || s.bg === 'custom' ? (s.cover ? `var(--pastel-${s.cover})` : 'var(--neutral-25)') : 'var(--neutral-0)');

// ---------- Post markup ----------
function logoPick(name: string) {
  const n = name.toLowerCase();
  const key = /claude/.test(n) ? 'claude' : /chatgpt|openai/.test(n) ? 'chatgpt' : /gemini/.test(n) ? 'gemini' : /perplexity/.test(n) ? 'perplexity'
    : /linkedin/.test(n) ? 'linkedin' : /demandsense/.test(n) ? 'demandsense' : /crm|salesforce/.test(n) ? 'salesforce' : /hubspot/.test(n) ? 'hubspot'
    : /google ads/.test(n) ? 'googleads' : /analytics/.test(n) ? 'googleanalytics' : /sheet/.test(n) ? 'googlesheets' : /slack/.test(n) ? 'slack' : /excel|csv/.test(n) ? 'excel' : 'list';
  return D.logos[key] ?? '';
}

const img = (src: string, w: number) => (/cdn\.sanity\.io/.test(src) ? `${src}?w=${w}&h=${w}&fit=crop&auto=format` : src);
// Round photo above the headline (author posts, as on the site's author card): the item's author, else the one picked
function avatar(s: State) {
  const id = s.about.startsWith('author:') ? s.about.slice(7) : s.author, a = s.aCustom ? { name: s.aName, photo: s.aPhoto } : authorById(id);
  if (!a?.name) return '';
  return `<span class="p-av p-avatar">${a.photo ? `<img src="${esc(img(a.photo, 400))}" alt="" crossorigin="anonymous">` : esc(initials(a.name))}</span>`;
}
function authorBlock(s: State) {
  let name = '', role = '', photo = '';
  if (s.aCustom) ({ aName: name, aRole: role, aPhoto: photo } = s);
  else { const a = authorById(s.author); if (!a) return ''; name = a.name; role = [a.company, a.role].filter(Boolean).join(', '); photo = a.photo; }
  if (!name) return '';
  // As on the site's author card: name, then company and role as chips
  const chips = role.split(',').map((c) => c.trim()).filter(Boolean).map((c) => `<span class="chip">${esc(c)}</span>`).join('');
  return `<div class="p-author"><span class="p-av">${photo ? `<img src="${esc(img(photo, 256))}" alt="" crossorigin="anonymous">` : esc(initials(name))}</span><span><span>${esc(name)}</span>${chips ? `<span class="p-chips">${chips}</span>` : ''}</span></div>`;
}

// Boxes straight from the item: a rule's LinkedIn default against the Standard (a skill's tools go in the tool chips)
const rulePairs = (x: Data['rules'][number]) => [x.advises && `LinkedIn default | ${x.advises}`, x.adds && `*The Standard | ${x.adds}`].filter(Boolean).join('\n');
function cmsPairs(s: State) {
  const [kind, id] = s.about.split(':');
  const r = kind === 'rule' && D.rules.find((x) => x.id === id);
  return r ? rulePairs(r) : undefined;
}
const GITHUB = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1.1.9 2.3v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3"/></svg>';

export function postHTML(s: State) {
  const [W, H] = FORMATS[s.format], wide = W > H * 1.2, dark = isDark(s);
  // Wide posts split into a text column and an art column: text on art becomes text left, text only means no art
  if (wide && s.layout === 'over') s = { ...s, layout: 'a' };
  if (wide && s.layout === 'none') s = { ...s, art: { ...s.art, id: 'none' } };
  const sc = Math.min(W / 1080, H / (wide ? 760 : 1080));
  const cls = ['post', dark ? 'surface-black' : s.bg.startsWith('pastel-') ? 'on-pastel' : '', wide ? 'wide' : '', `fmt-${s.format}`, s.lines ? 'lines' : '', `frame-${s.art.frame}`,
    s.fade && s.art.id !== 'none' && s.layout === 'over' ? `fade fade-${s.vpos}` : '',
    `al-${s.align}`, `logo-${s.logoPos}`, s.hsize === 'fixed' ? 'hfixed' : '', s.bg !== 'white' && !dark ? 'tinted' : ''].filter(Boolean).join(' ');
  const style = `--w:${W}px; --h:${H}px; --s0:${sc.toFixed(3)}; --pbg:${bgValue(s)}; --hue:${hueValue(s)}; --panel:${panelValue(s)}; --logo:${s.logoH}; --vpos:${s.vpos}; --hs:${s.hpx}; --t:${(s.tsize / 32).toFixed(4)}; --ax:${s.art.x}%; --ay:${s.art.y}%`;
  const logo = s.logo ? `<img class="p-logo" src="/design-system/brand/${s.logoKind === 'mark' ? 'mark' : dark ? 'logo-b2b' : 'logo-b2b-light'}.svg" alt="">` : '';
  const label = s.label && s.labelText ? `<p class="p-label">${esc(s.labelText)}</p>` : '';
  const head = s.headline || s.context ? `<h1 class="p-head">${br(s.headline)}${s.context ? `${/^\s*\n/.test(s.context) ? '<br>' : ' '}<span class="tone-2">${br(s.context)}</span>` : ''}</h1>` : '';
  const pairs = lines((s.pairsCms && cmsPairs(s)) || s.pairsText).map((l) => { const hl = l.startsWith('*'), [k, ...v] = l.replace(/^\*\s*/, '').split('|'); return `<div class="${hl ? 'hl' : ''}"><p class="p-k">${esc(k.trim())}</p><p>${esc(v.join('|').trim())}</p></div>`; });
  const steps = lines(s.stepsText), list = lines(s.listText), tools = [...s.toolsText.split(',').map((t) => t.trim()).filter(Boolean).map((t) => ({ name: t, svg: logoPick(t) })),
    ...(s.toolsCustom ? s.toolsOwn.filter((t) => t.name.trim()).map((t) => ({ name: t.name.trim(), svg: D.logos[t.logo] ?? '' })) : [])];
  const main = [
    s.qmark ? '<svg class="p-q" viewBox="0 0 32 24" aria-hidden="true"><path d="M0 24V13L7 0h6L9 12h5v12zm18 0V13l7-13h6l-4 12h5v12z"/></svg>' : '',
    s.avatar ? avatar(s) : '',
    s.chips && s.chipsText ? `<p class="p-chips">${s.chipsText.split(',').map((c) => c.trim()).filter(Boolean).map((c) => `<span class="chip">${esc(c)}</span>`).join('')}</p>` : '',
    head,
    s.rule ? '<div class="p-rule"></div>' : '',
    s.body && s.bodyText ? `<p class="p-body">${br(s.bodyText)}</p>` : '',
    s.pairs && pairs.length ? `<div class="p-pairs">${pairs.join('')}</div>` : '',
    s.steps && steps.length ? `<div class="p-sec">${s.stepsLabel ? `<p class="p-k">${esc(s.stepsLabel)}</p>` : ''}<ol class="p-steps" style="--n:${steps.length}">${steps.map((t, i) => `<li${i ? '' : ' class="on"'}><span class="p-tick"><i><b>${i + 1}</b></i></span>${esc(t)}</li>`).join('')}</ol></div>` : '',
    s.tools && tools.length ? `<div class="p-sec">${s.toolsLabel ? `<p class="p-k">${esc(s.toolsLabel)}</p>` : ''}<p class="p-tools">${tools.map((t) => `<span class="p-tool">${t.svg}${esc(t.name)}</span>`).join('')}</p></div>` : '',
    s.list && list.length ? `<ul class="p-list">${list.map((l) => { const [k, ...v] = l.split('|'); return v.length ? `<li><b>${esc(k.trim())}</b><span>${esc(v.join('|').trim())}</span></li>` : `<li><b></b><span>${esc(k)}</span></li>`; }).join('')}</ul>` : '',
    s.button && s.buttonText ? `<span class="p-btn">${esc(s.buttonText)}</span>` : '',
  ].join('');
  // One or the other: the round photo up top stands for the author, so the byline at the bottom drops out
  const foot = (s.avatar ? '' : authorBlock(s)) + (s.github ? `<p class="p-gh">${GITHUB}<span>Open on GitHub</span></p>` : '');
  return `<div class="${cls}" style="${style}">
    <div class="p-bg${s.pattern ? ` pattern pattern-fade` : ''}"></div>
    <div class="p-grid lay-${s.art.id === 'none' ? 'none' : s.layout}">
      ${s.art.id !== 'none' && s.layout !== 'none' ? '<div class="p-art"></div>' : ''}
      ${logo || label ? `<div class="p-top">${logo}${label}</div>` : ''}
      <div class="p-main">${main}</div>
      ${foot ? `<div class="p-foot">${foot}</div>` : ''}
    </div>
    <div class="p-lines"></div>
  </div>`;
}

// ---------- Art ----------
// Pieces leave a lot of air around the drawing; posts crop to what it draws over a whole loop (plus a little margin)
const tight = new Map<Piece, { viewBox: string; focus: [number, number] }>();
function tightBox(piece: Piece) {
  let hit = tight.get(piece);
  if (hit) return hit;
  const [vx, vy, vw, vh] = piece.viewBox.split(/[ ,]+/).map(Number), [fx, fy] = piece.focus ?? [.5, .5];
  const svg = document.querySelector('.pb-protos svg')!.cloneNode(true) as SVGSVGElement, g = svg.querySelector<SVGGElement>('[data-frame]')!;
  document.querySelector('.pb-protos')!.append(svg);
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (let i = 0; i < (piece.period ? 8 : 1); i++) {
    g.innerHTML = piece.draw(piece.rest + i * piece.period / 8);
    const b = g.getBBox();
    if (!b.width) continue;
    x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + b.width); y1 = Math.max(y1, b.y + b.height);
  }
  svg.remove();
  if (!isFinite(x0)) hit = { viewBox: piece.viewBox, focus: [fx, fy] };
  else {
    const m = Math.max(x1 - x0, y1 - y0) * .04;
    x0 = Math.max(vx, x0 - m); y0 = Math.max(vy, y0 - m); x1 = Math.min(vx + vw, x1 + m); y1 = Math.min(vy + vh, y1 + m);
    const fpx = vx + fx * vw, fpy = vy + fy * vh, cl = (v: number) => Math.min(1, Math.max(0, v));
    hit = { viewBox: `${x0} ${y0} ${x1 - x0} ${y1 - y0}`, focus: [cl((fpx - x0) / (x1 - x0)), cl((fpy - y0) / (y1 - y0))] };
  }
  tight.set(piece, hit);
  return hit;
}
// Figures clone the IsoArt markup rendered on the page, so they carry its scoped styles
function figureEl(s: State, piece: Piece) {
  const dark = isDark(s);
  const fig = document.querySelector(dark ? '.pb-proto-d' : '.pb-proto-l')!.cloneNode(true) as HTMLElement;
  fig.classList.remove('pb-proto-d', 'pb-proto-l');
  const svg = fig.querySelector('svg')!;
  const tb = tightBox(piece);
  svg.setAttribute('viewBox', tb.viewBox);
  svg.classList.toggle('mono', !dark && s.art.mono);
  const [fx, fy] = tb.focus, hue = hueValue(s);
  fig.style.cssText = `--field: transparent; --zoom: ${s.art.zoom}; --fx: ${fx * 100}%; --fy: ${fy * 100}%; --art-a: ${hue}; --art-b: ${hue}; --art-c: ${hue}; --lit: ${hue}`;
  fig.querySelector('[data-frame]')!.innerHTML = piece.draw(piece.rest + s.art.t);
  return fig;
}

type Wave = { canvas: HTMLCanvasElement; render: () => void; tint: (o: object, ms?: number) => void; seek: (s: number) => void; hold: (on: boolean) => void; reframe: (o: object) => void };
let waveHost: HTMLElement & { wave?: Wave | null } | undefined, waveSnap = '';
function loadWave(): Promise<void> {
  if ((window as any).DSWave) return Promise.resolve();
  return new Promise((ok) => { const sc = document.createElement('script'); sc.src = '/design-system/wave.js'; sc.onload = () => ok(); document.head.append(sc); });
}
const waveOpts = (s: State) => ({ gradientColor1: s.wave.c1, gradientColor2: s.wave.c2, gradientColor3: s.wave.c3, white: s.wave.ground });

// The one live wave: its host moves into whichever post the editor shows
async function liveWave(s: State) {
  await loadWave();
  if (!waveHost) {
    waveHost = document.createElement('div');
    waveHost.className = 'p-wave';
    document.querySelector('.pb-protos')!.append(waveHost);
    waveHost.style.cssText = 'position:absolute;inset:0;width:1080px;height:1080px';
    waveHost.wave = (window as any).DSWave.mount(waveHost, { ...waveOpts(s), frame: { x: 0, y: 0, w: 1, h: 1, k: s.wave.k, t0: 0 } });
    waveHost.style.cssText = '';
  }
  const w = waveHost.wave;
  if (w) { w.tint(waveOpts(s), 1); w.reframe({ k: s.wave.k }); w.hold(!s.art.animate || reduced.matches); w.seek(s.wave.time); }
  return waveHost;
}

function fillArt(post: HTMLElement, s: State, live: boolean) {
  const box = post.querySelector<HTMLElement>('.p-art');
  if (!box) return undefined;
  if (s.art.id === 'wave') {
    if (live) liveWave(s).then((h) => { if (box.isConnected) { box.replaceChildren(h); waveHost?.wave?.reframe({}); waveHost?.wave?.seek(s.wave.time); } });
    else if (waveSnap) box.innerHTML = `<div class="p-wave"><img src="${waveSnap}" alt=""></div>`;
    return undefined;
  }
  if (s.art.id === 'photo') {
    const src = s.art.photo || (s.aCustom ? s.aPhoto : authorById(s.author)?.photo) || '';
    if (src) box.innerHTML = `<img class="p-photo" src="${esc(img(src, 1400))}" alt=""" crossorigin="anonymous" style="transform: scale(${s.art.zoom})">`;
    return undefined;
  }
  const piece = pieceOf(s.art.id);
  if (!piece) return undefined;
  box.replaceChildren(figureEl(s, piece));
  return piece;
}

// Largest headline that keeps everything inside the post (auto), or the size asked for
function fit(post: HTMLElement, s: State) {
  const head = post.querySelector<HTMLElement>('.p-head'), grid = post.querySelector<HTMLElement>('.p-grid')!;
  if (!head) return;
  const sc = +post.style.getPropertyValue('--s0');
  if (s.hsize === 'fixed') { post.style.setProperty('--hs', String(s.hpx * sc)); return; }
  const main = post.querySelector<HTMLElement>('.p-main')!;
  // Height the main column's content takes, in post pixels (the preview is scaled; the quote mark is an SVG without offsetTop)
  const used = () => { const k = [...main.children], r = post.getBoundingClientRect().width / post.offsetWidth; return (k[k.length - 1].getBoundingClientRect().bottom - k[0].getBoundingClientRect().top) / r; };
  const ok = () => grid.scrollHeight <= grid.clientHeight + 1 && used() <= main.clientHeight + 1 && head.scrollWidth <= head.clientWidth + 1;
  // Headline first: when it would drop below 60% of its size, the text around it shrinks a step instead
  for (const k of post.classList.contains('wide') ? [1, .9, .8, .7] : [1]) {
    post.style.setProperty('--k', String(k));
    let lo = 16 * sc, hi = s.hmax * sc;
    post.style.setProperty('--hs', String(hi));
    if (ok()) return;
    for (let i = 0; i < 10; i++) { const mid = (lo + hi) / 2; post.style.setProperty('--hs', String(mid)); if (ok()) lo = mid; else hi = mid; }
    post.style.setProperty('--hs', String(Math.floor(lo)));
    if (lo >= s.hmax * sc * .6) return;
  }
  // Still too much text: the art gives up its third of the height (down to a fifth) instead of the text running off the post
  const art = grid.querySelector<HTMLElement>(':scope > .p-art');
  if (!art || post.classList.contains('wide') || art.offsetParent === null) return;
  post.classList.add('hfixed');
  const room = () => ok() && art.offsetHeight >= post.offsetHeight * .2;
  let lo = 16 * sc, hi = s.hmax * sc;
  for (let i = 0; i < 10; i++) { const mid = (lo + hi) / 2; post.style.setProperty('--hs', String(mid)); if (room()) lo = mid; else hi = mid; }
  post.style.setProperty('--hs', String(Math.floor(lo)));
}

export function renderInto(host: HTMLElement, s: State, live = false) {
  host.innerHTML = postHTML(s);
  const post = host.firstElementChild as HTMLElement;
  const piece = fillArt(post, s, live);
  // Overflowing art would count as overflowing content, so it is clipped while the headline is sized
  post.classList.add('fitting'); fit(post, s); post.classList.remove('fitting');
  post.querySelectorAll('img').forEach((im) => {
    if (!im.complete) im.addEventListener('load', () => { post.classList.add('fitting'); fit(post, s); post.classList.remove('fitting'); }, { once: true });
    im.addEventListener('error', () => { if (im.crossOrigin) { im.removeAttribute('crossorigin'); im.src = im.src; } }, { once: true });
  });
  return { post, piece };
}

// ---------- Templates ----------
type Tpl = { group: string; name: string; note?: string; s: State };
// An author card: the person as the art (round photo), company and role as chips, what they added as a list; no byline, it would repeat them
function authorCard(id: string, items: string[] = []): Tpl {
  const a = authorById(id)!;
  return { group: 'Author cards', name: a.name, note: `${items.length} in the Standard`, s: merge(clone(DEFAULTS), {
    about: `author:${id}`, format: 'portrait', layout: 'none', vpos: 'end', bg: 'white', labelText: 'Author', avatar: true, chips: !!(a.role || a.company), chipsText: [a.company, a.role].filter(Boolean).join(', '),
    headline: a.name, context: '', hmax: 120, list: items.length > 0, listText: [...new Set(items)].slice(0, 4).join('\n'), author: '', aCustom: false, art: { ...DEFAULTS.art, photo: a.photo ?? '' } }) };
}
function templates(): Tpl[] {
  const T: Tpl[] = [], B = (o: Parameters<typeof merge>[1]) => merge(clone(DEFAULTS), o);
  const nR = D.rules.length, nA = D.authors.filter((a) => a.id !== 'demandsense').length;
  const promo = { headline: '', context: '', logoKind: 'full', logoH: 56, label: false, lines: true };
  // Launch: the promo visual in every cut the kit asks for, plus a few headline posts
  const G = 'Launch and promo';
  T.push({ group: G, name: 'Promo · catalogue', note: 'Animated: MP4', s: B({ ...promo, format: 'portrait', layout: 'b', headline: 'Every rule, skill and scenario in one place.', context: 'Free, community-built, maintained by DemandSense', hmax: 77, art: { id: 'directory', zoom: 1, t: 2.5, frame: 'bleed' } as never }) });
  T.push({ group: G, name: 'Promo · wave', note: 'Animated: MP4', s: B({ ...promo, format: 'portrait', layout: 'over', vpos: 'end', headline: 'The B2B AI Standard for LinkedIn Ads.', context: 'Free, community-built, maintained by DemandSense', hmax: 77, art: { id: 'wave', frame: 'bleed' } as never, wave: { k: 1.6, time: 6 } as never }) });
  T.push({ group: G, name: 'AI changed the game', s: B({ format: 'portrait', layout: 'a', headline: 'AI changed the game for LinkedIn Ads.', context: 'But nobody agreed on the rules.', art: { id: 'scenarios', zoom: 1, frame: 'bleed' } as never, hmax: 88 }) });
  T.push({ group: G, name: `${nR} rules`, s: B({ format: 'square', bg: 'white', layout: 'b', label: true, labelText: 'The Standard', headline: `${nR} rules for running LinkedIn Ads with AI.`, context: 'Each one written by a named practitioner', art: { id: 'rules', zoom: 1, frame: 'panel' } as never, cover: 16, hue: '16' }) });
  T.push({ group: G, name: 'Built with practitioners', s: B({ format: 'square', bg: 'pastel-14', layout: 'a', label: true, labelText: `${nA} practitioners`, headline: 'Written with the people who run the accounts.', context: 'One open standard, kept up to date', art: { id: 'skills', zoom: 1, frame: 'bleed' } as never }) });
  T.push({ group: G, name: 'Don’t take its word for it', s: B({ format: 'portrait', layout: 'none', vpos: 'center', pattern: true, headline: 'A standard for making ads work with AI,', context: 'without taking its word for it.', button: true, buttonText: 'Read the Standard', hmax: 104 }) });
  T.push({ group: G, name: 'Site preview · opening frame', note: '2 s, 1080', s: B({ format: 'square', layout: 'none', vpos: 'center', align: 'center', logoPos: 'left', label: false, pattern: true, headline: 'The B2B AI Standard', context: 'for LinkedIn Ads', hmax: 96 }) });
  T.push({ group: G, name: 'Site preview · closing frame', note: '3 s, 1080', s: B({ format: 'square', layout: 'none', vpos: 'center', align: 'center', pattern: true, headline: 'Read it free.', context: '\nthe-ai-standard.com', button: true, buttonText: 'Open the Standard', hmax: 96 }) });
  T.push({ group: G, name: 'Newsletter cover 16:9', s: B({ ...promo, format: 'cover', layout: 'a', vpos: 'end', headline: 'The B2B AI Standard for LinkedIn Ads.', context: 'Rules, skills and scenarios, each from a named practitioner', hmax: 64, art: { id: 'directory', zoom: 1, t: 2.5, frame: 'bleed' } as never }) });

  const N = 'Newsletter (Demand Wire)';
  T.push({ group: N, name: 'Launch header 1200×480', s: B({ ...promo, format: 'header', layout: 'a', vpos: 'end', headline: 'The B2B AI Standard', context: 'is out', hmax: 91, art: { id: 'directory', zoom: 1, t: 2.5, frame: 'bleed' } as never }) });
  T.push({ group: N, name: 'Launch header · wave', s: B({ ...promo, format: 'header', layout: 'over', vpos: 'end', headline: 'The B2B AI Standard', context: 'is out', hmax: 91, art: { id: 'wave', frame: 'bleed' } as never, wave: { k: 1.6, time: 4 } as never }) });
  T.push({ group: N, name: 'Block · From the Standard', s: B({ format: 'block', layout: 'a', logoKind: 'mark', label: false, headline: 'From the Standard:', context: 'one rule, skill or scenario for LinkedIn Ads with AI', hmax: 152, logoH: 110, lines: false, vpos: 'end', art: { id: 'wave', frame: 'bleed' } as never, wave: { k: 1.6, time: 10 } as never }) });
  T.push({ group: N, name: 'Block · light', s: B({ format: 'block', bg: 'white', layout: 'a', logoKind: 'mark', label: false, headline: 'From the Standard:', context: 'one rule, skill or scenario for LinkedIn Ads with AI', hmax: 152, logoH: 110, lines: false, vpos: 'end', art: { id: 'directory', zoom: 1, t: 2.5, frame: 'bleed' } as never }) });

  // Two-tone headlines read as two sentences: the black claim ends in a full stop before the grey context
  const claim = (t: string) => (/[.!?:]$/.test(t.trim()) ? t : `${t.trim()}.`);
  const scenario = (x: Data['scenarios'][number]): Tpl => ({ group: 'Scenario cards', name: x.title, note: x.status === 'soon' ? 'Coming soon' : 'Animated: MP4', s: B({
    about: `scenario:${x.id}`, format: 'portrait', layout: 'b', bg: `pastel-${x.cover}`, cover: x.cover, labelText: `Scenario · ${x.cadence}`, headline: x.title, context: '', body: !!x.description, bodyText: x.description, steps: x.steps.length > 0, stepsText: x.steps.slice(0, 7).join('\n'), tools: x.connectors.length > 0, toolsText: x.connectors.slice(0, 5).join(', '),
    author: x.author ?? '', hmax: 67, art: { id: x.art?.piece ?? 'sorter', zoom: 1, frame: 'bleed' } as never }) });
  const skill = (x: Data['skills'][number]): Tpl => ({ group: 'Skill cards', name: x.title, s: B({
    about: `skill:${x.id}`, format: 'square', layout: 'b', bg: 'white', cover: x.cover, labelText: 'Skill', chips: true, chipsText: x.category, headline: claim(x.title), context: x.description, hmax: 58,
    tools: x.connectors.length > 0, toolsText: x.connectors.slice(0, 5).join(', '), github: true,
    author: x.author ?? 'demandsense', art: { id: x.icon, zoom: 1, frame: 'panel' } as never }) });
  const rule = (x: Data['rules'][number]): Tpl => {
    const pairs = rulePairs(x);
    return { group: 'Rule cards', name: `${String(x.number).padStart(2, '0')} · ${x.title}`, s: B({
      about: `rule:${x.id}`, format: 'portrait', layout: 'a', bg: `pastel-${x.cover}`, cover: x.cover, labelText: `Rule ${String(x.number).padStart(2, '0')}`, headline: claim(x.title), context: x.why, hmax: 67,
      pairs: !!pairs, pairsText: pairs, author: x.author && x.author !== 'demandsense' ? x.author : '', art: { id: x.icon, zoom: 1, frame: 'bleed' } as never }) };
  };
  const quote = (text: string, name: string, role: string, photo: string, about: string, author?: string): Tpl => ({ group: 'Quote cards', name: `${name}: ${about}`, s: B({
    format: 'portrait', layout: 'none', vpos: 'center', qmark: true, labelText: about, headline: text, hmax: 76, rule: false,
    ...(author ? { author } : { aCustom: true, aName: name, aRole: role, aPhoto: photo }) }) });

  D.scenarios.forEach((x) => T.push(scenario(x)));
  D.skills.forEach((x) => T.push(skill(x)));
  D.rules.forEach((x) => T.push(rule(x)));
  D.quotes.forEach((q) => T.push(quote(q.text, q.name, q.company, q.photo, 'Why the Standard exists')));
  D.rules.forEach((r) => r.voices.forEach((v) => {
    const a = authorById(v.author);
    T.push(quote(v.quote, v.name, v.company, a?.photo || D.quotes.find((q) => q.name === v.name)?.photo || '', `On rule ${String(r.number).padStart(2, '0')}`, a ? a.id : undefined));
  }));

  // Authors: what each one added, most first; one card per contributor
  const adds = new Map<string, string[]>();
  const add = (id: string | undefined, line: string) => { if (id && id !== 'demandsense') adds.set(id, [...(adds.get(id) ?? []), line]); };
  D.scenarios.forEach((x) => add(x.author, `Scenario | ${x.title}`));
  D.skills.forEach((x) => add(x.author, `Skill | ${x.title}`));
  D.rules.forEach((x) => { add(x.author, `Rule ${String(x.number).padStart(2, '0')} | ${x.title}`); x.voices.forEach((v) => add(v.author, `On rule ${String(x.number).padStart(2, '0')} | ${x.title}`)); });
  [...adds].sort((a, b) => b[1].length - a[1].length).forEach(([id, items]) => T.push(authorCard(id, items)));
  // Email: each card type at 1200 wide, text left and art right; pick another item under Content → About
  const E = 'Email (1200 wide)', first = (g: string) => T.find((t) => t.group === g);
  ['Scenario cards', 'Skill cards', 'Rule cards', 'Quote cards', 'Author cards'].forEach((g) => {
    const tp = first(g);
    if (tp) T.push({ group: E, name: g.replace(' cards', ''), note: tp.name, s: merge(clone(tp.s), { format: 'wide', hmax: Math.round(tp.s.hmax * 1.3), layout: tp.s.layout === 'none' ? 'none' : 'a', steps: false, list: false }) });
  });
  return T;
}

// ---------- Export ----------
let fontCSS: Promise<string> | undefined;
const download = (blob: Blob, name: string) => { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); };
const slug = (s: State) => (s.headline || s.labelText || 'post').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) + `-${s.format}`;

async function layers(post: HTMLElement, R: number) {
  const W = post.offsetWidth, H = post.offsetHeight;
  fontCSS ??= getFontEmbedCSS(post);
  const opts = { width: W, height: H, pixelRatio: R, fontEmbedCSS: await fontCSS, style: { transform: 'none' } };
  // Hairlines are thickened for the scaled-down preview; the export draws them at their true 1px
  post.style.setProperty('--hair', '1px');
  post.classList.add('x-bg'); const bg = await toCanvas(post, opts); post.classList.remove('x-bg');
  post.classList.add('x-copy'); const copy = await toCanvas(post, opts); post.classList.remove('x-copy');
  post.style.removeProperty('--hair');
  return { bg, copy, W, H };
}
// Where the art box sits inside the post, in post pixels (the preview is scaled)
function artRect(post: HTMLElement) {
  const box = post.querySelector<HTMLElement>('.p-art');
  if (!box) return undefined;
  const p = post.getBoundingClientRect(), b = box.getBoundingClientRect(), k = p.width / post.offsetWidth;
  return { box, x: (b.left - p.left) / k, y: (b.top - p.top) / k, w: box.offsetWidth, h: box.offsetHeight };
}
// A figure's SVG as an image: every part gets its computed paint inlined (the page CSS does not travel with it).
// Strokes are non-scaling on the page, so their widths are multiplied by the export ratio to look the same
const PAINT = ['fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'opacity', 'fill-opacity', 'stroke-opacity', 'filter', 'display', 'vector-effect'];
function svgImage(svg: SVGSVGElement, w: number, h: number, R: number) {
  const out = svg.cloneNode(true) as SVGSVGElement, src = [svg, ...svg.querySelectorAll('*')], dst = [out, ...out.querySelectorAll('*')];
  src.forEach((el, i) => {
    if (el.closest('defs')) return;
    const cs = getComputedStyle(el);
    dst[i].setAttribute('style', PAINT.map((p) => { const v = cs.getPropertyValue(p); return `${p}:${/^stroke-(width|dash)/.test(p) ? v.replace(/([\d.]+)px/g, (_, n) => `${+n * R}px`) : v}`; }).join(';'));
  });
  Object.entries({ xmlns: 'http://www.w3.org/2000/svg', width: String(w * R), height: String(h * R) }).forEach(([k, v]) => out.setAttribute(k, v));
  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(out)], { type: 'image/svg+xml' }));
  return new Promise<HTMLImageElement>((ok, no) => { const im = new Image(); im.onload = () => { URL.revokeObjectURL(url); ok(im); }; im.onerror = no; im.src = url; });
}

async function drawArt(ctx: CanvasRenderingContext2D, post: HTMLElement, R: number) {
  const r = artRect(post);
  if (!r || !r.w || !r.h) return;
  const cs = getComputedStyle(r.box), k = post.getBoundingClientRect().width / post.offsetWidth, p = post.getBoundingClientRect();
  ctx.save();
  if (cs.overflow !== 'visible') { ctx.beginPath(); ctx.roundRect(r.x * R, r.y * R, r.w * R, r.h * R, (parseFloat(cs.borderRadius) || 0) * R); ctx.clip(); }
  if (cs.backgroundColor !== 'rgba(0, 0, 0, 0)') { ctx.fillStyle = cs.backgroundColor; ctx.fillRect(r.x * R, r.y * R, r.w * R, r.h * R); }
  const wave = r.box.querySelector<HTMLElement & { wave?: Wave }>('.p-wave'), svg = r.box.querySelector<SVGSVGElement>('svg.iso-art');
  if (wave?.wave) { const b = wave.wave.canvas.getBoundingClientRect(); ctx.drawImage(wave.wave.canvas, (b.left - p.left) / k * R, (b.top - p.top) / k * R, b.width / k * R, b.height / k * R); }
  else if (svg) {
    const b = svg.getBoundingClientRect(), x = (b.left - p.left) / k, y = (b.top - p.top) / k, w = b.width / k, h = b.height / k;
    ctx.drawImage(await svgImage(svg, w, h, R), x * R, y * R, w * R, h * R);
  } else {
    const c = await toCanvas(r.box, { width: r.w, height: r.h, pixelRatio: R, skipFonts: true, style: { margin: '0', position: 'static', gridArea: 'auto' } });
    ctx.drawImage(c, r.x * R, r.y * R);
  }
  ctx.restore();
}

export async function exportPNG(post: HTMLElement, s: State, R = 2) {
  const { bg, copy, W, H } = await layers(post, R);
  const out = Object.assign(document.createElement('canvas'), { width: W * R, height: H * R }), ctx = out.getContext('2d')!;
  ctx.drawImage(bg, 0, 0);
  if (s.art.id === 'wave') waveHost?.wave?.seek(s.wave.time);
  await drawArt(ctx, post, R);
  ctx.drawImage(copy, 0, 0);
  out.toBlob((b) => b && download(b, `${slug(s)}@${R}x.png`), 'image/png');
}

// One loop of the figure (or 8 s of wave) at 30 fps, encoded frame by frame, so the video is smooth however slow the drawing is
export async function exportMP4(post: HTMLElement, s: State, piece: Piece | undefined, progress: (p: number) => void) {
  if (!('VideoEncoder' in window)) throw new Error('This browser cannot encode video. Use Chrome, Edge or Safari 17+.');
  let R = 2;
  const W = post.offsetWidth, H = post.offsetHeight;
  // H.264 at 2x where the browser can, else 1x; VP9 in MP4 only when H.264 is missing (e.g. open-source Chromium)
  let codec = 'avc1.640034';
  const config = (r: number) => ({ codec, width: W * r, height: H * r, bitrate: 14e6 * r / 2, framerate: FPS });
  const can = async (r: number) => (await VideoEncoder.isConfigSupported(config(r))).supported;
  if (!(await can(2))) { if (await can(1)) R = 1; else { codec = 'vp09.00.51.08'; if (!(await can(2))) R = 1; } }
  const { bg, copy } = await layers(post, R);
  const out = Object.assign(document.createElement('canvas'), { width: W * R, height: H * R }), ctx = out.getContext('2d')!;
  const muxer = new Muxer({ target: new ArrayBufferTarget(), video: { codec: codec.startsWith('avc') ? 'avc' : 'vp9', width: W * R, height: H * R }, fastStart: 'in-memory' });
  let err: unknown;
  const enc = new VideoEncoder({ output: (chunk, meta) => muxer.addVideoChunk(chunk, meta), error: (e) => (err = e) });
  enc.configure(config(R));
  const wave = s.art.id === 'wave' ? waveHost?.wave : undefined;
  const secs = piece ? Math.min(piece.period / SPEED, 20) : 8, n = Math.round(secs * FPS);
  const frame = post.querySelector('[data-frame]');
  wave?.hold(true);
  try {
    for (let i = 0; i < n; i++) {
      if (err) throw err;
      const t = i / FPS;
      if (piece && frame) { const pt = piece.rest + s.art.t + t * SPEED; frame.innerHTML = piece.draw(pt); post.querySelector<HTMLElement>('.iso-panel')?.style.setProperty('--march', String(-(pt * 12) % 14)); }
      if (wave) wave.seek(s.wave.time + t);
      ctx.clearRect(0, 0, out.width, out.height);
      ctx.drawImage(bg, 0, 0);
      await drawArt(ctx, post, R);
      ctx.drawImage(copy, 0, 0);
      const vf = new VideoFrame(out, { timestamp: Math.round(i * 1e6 / FPS), duration: Math.round(1e6 / FPS) });
      enc.encode(vf, { keyFrame: i % (FPS * 2) === 0 });
      vf.close();
      if (enc.encodeQueueSize > 8) await new Promise((r) => setTimeout(r, 0));
      progress((i + 1) / n);
    }
    await enc.flush();
    muxer.finalize();
    download(new Blob([(muxer.target as ArrayBufferTarget).buffer], { type: 'video/mp4' }), `${slug(s)}.mp4`);
  } finally { wave?.hold(!s.art.animate || reduced.matches); }
}

// ---------- Page ----------
const get = (s: any, k: string) => k.split('.').reduce((o, p) => o?.[p], s);
const set = (s: any, k: string, v: unknown) => { const ps = k.split('.'), last = ps.pop()!; ps.reduce((o, p) => o[p], s)[last] = v; };
// An uploaded photo stays in this tab: a data URL is too long for the link
const encode = (s: State) => btoa(unescape(encodeURIComponent(JSON.stringify(s, (k, v) => (typeof v === 'string' && v.startsWith('data:') ? '' : v))))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const decode = (h: string): State | undefined => { try { return merge(clone(DEFAULTS), JSON.parse(decodeURIComponent(escape(atob(h.replace(/-/g, '+').replace(/_/g, '/')))))); } catch { return undefined; } };

// Panel layout: every control sits on its own card; a toggle's card also holds what the toggle reveals
function cardify(root: HTMLElement) {
  const card = (before: Element, cls = 'cc') => { const d = document.createElement('div'); d.className = cls; before.before(d); return d; };
  root.querySelectorAll<HTMLElement>('.tg').forEach((tg) => {
    const k = tg.querySelector<HTMLInputElement>('input')!.dataset.k, box = card(tg, 'cc tc');
    if (tg.dataset.if) { box.dataset.if = tg.dataset.if; delete tg.dataset.if; }
    let n = tg.nextElementSibling;
    box.append(tg);
    while (n && n.getAttribute('data-if')?.startsWith(`${k}=`)) { const nx = n.nextElementSibling; box.append(n); n = nx; }
  });
  const run = (box: Element) => {
    let cur: Element | null = null, join = false;
    for (const el of [...box.children]) {
      if (el.tagName === 'LEGEND') { cur = null; continue; }
      if (el.classList.contains('cc')) { cur = el; continue; }
      if (el.tagName === 'DIV' && el.hasAttribute('data-if') && !el.className) { run(el); cur = null; continue; }
      if (cur && (join || el.matches('.hint, .btn, .art-grid, [data-if]:not(div)'))) { cur.append(el); join = false; continue; }
      if (!cur && el.matches('.hint')) continue;
      cur = card(el); cur.append(el); join = el.matches('.lbl-2');
    }
  };
  root.querySelectorAll('fieldset').forEach(run);
}
export function boot() {
  D = JSON.parse(document.getElementById('pb-data')!.textContent!);
  const $ = <T extends Element = HTMLElement>(q: string) => document.querySelector<T>(q)!;
  const panel = $('[data-panel]'), scaleBox = $('[data-scale]'), fitBox = $('[data-fit]'), toast = $('[data-toast]');
  cardify(panel);
  const TPL = templates();
  let S: State = clone(DEFAULTS), base: State = clone(DEFAULTS), tname = 'Blank', current: { post: HTMLElement; piece?: Piece } | undefined, raf = 0, t = 0, last = 0, busy = false;

  const say = (msg: string) => { toast.textContent = msg; toast.classList.add('on'); clearTimeout((say as any).h); (say as any).h = setTimeout(() => toast.classList.remove('on'), 2600); };
  const view = (v: string) => {
    document.querySelectorAll<HTMLElement>('[data-view]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.view === v)));
    document.querySelectorAll<HTMLElement>('[data-pane]').forEach((p) => (p.hidden = p.dataset.pane !== v));
    if (v === 'editor') draw(); else observeThumbs();
  };
  document.querySelectorAll<HTMLElement>('[data-view]').forEach((b) => b.addEventListener('click', () => view(b.dataset.view!)));

  // Every slider gets a number field beside it for typing an exact value
  panel.querySelectorAll<HTMLInputElement>('input[type=range][data-k]').forEach((r) => {
    const row = document.createElement('span'), n = document.createElement('input');
    row.className = 'rng';
    Object.assign(n, { type: 'number', min: r.min, max: r.max, step: r.step, className: 'num' });
    n.dataset.k = r.dataset.k;
    n.setAttribute('aria-label', r.closest('label')?.firstChild?.textContent?.trim() || 'Value');
    r.replaceWith(row); row.append(r, n);
  });
  // Panel ← state
  const sync = () => {
    panel.querySelectorAll<HTMLInputElement>('[data-k]').forEach((el) => {
      const v = get(S, el.dataset.k!);
      if (el.type === 'checkbox') el.checked = !!v; else el.value = /^data:/.test(String(v)) ? 'Uploaded file' : String(v ?? '');
      if (el.type === 'color') (el.parentElement as HTMLElement).style.setProperty('--c', String(v));
    });
    panel.querySelectorAll<HTMLElement>('[data-seg]').forEach((g) => g.querySelectorAll<HTMLElement>('[data-v]').forEach((b) => b.setAttribute('aria-selected', String(String(get(S, g.dataset.seg!)) === b.dataset.v))));
    panel.querySelectorAll<HTMLElement>('[data-swatch]').forEach((g) => g.querySelectorAll<HTMLElement>('[data-v]').forEach((b) => b.setAttribute('aria-pressed', String(String(get(S, g.dataset.swatch!)) === b.dataset.v))));
    panel.querySelectorAll<HTMLElement>('[data-if]').forEach((el) => {
      const [, k, op, v] = el.dataset.if!.match(/^([\w.]+)(!?=)(.*)$/)!;
      const cur = String(get(S, k) ?? '');
      el.hidden = op === '=' ? cur !== v : cur === v;
    });
    const wide = FORMATS[S.format][0] > FORMATS[S.format][1] * 1.2;
    panel.querySelectorAll<HTMLElement>('[data-seg=layout] [data-wide]').forEach((b) => { b.dataset.tall ??= b.textContent!; b.textContent = wide ? b.dataset.wide! : b.dataset.tall; });
    panel.querySelectorAll<HTMLElement>('[data-seg=layout] [data-v=over], [data-seg=layout] [data-v=none]').forEach((b) => (b.hidden = wide));
    $('[data-tname]').textContent = tname;
    const tools = S.toolsText.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
    panel.querySelectorAll<HTMLInputElement>('[data-tool]').forEach((el) => (el.checked = tools.includes(el.dataset.tool!.toLowerCase())));
    $('[data-ms-sum]').textContent = S.toolsText.trim() || 'Pick tools';
    itemGrid();
    ownRows();
    panel.querySelectorAll<HTMLElement>('[data-art]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.art === S.art.id)));
  };

  // Own tools: a name and a logo per row; rows are rebuilt only when their count changes so typing keeps focus
  const own = $('[data-own]'), logoOpts = Object.keys(D.logos).map((k) => `<option value="${k}">${k}</option>`).join('');
  const ownRows = () => {
    if (own.children.length !== S.toolsOwn.length) own.innerHTML = S.toolsOwn.map((_, i) => `<div class="own"><input type="text" data-own-name="${i}" placeholder="Clay"><select data-own-logo="${i}" aria-label="Logo">${logoOpts}</select><button type="button" class="x" data-own-del="${i}" aria-label="Remove">×</button></div>`).join('');
    S.toolsOwn.forEach((t, i) => {
      const n = own.querySelector<HTMLInputElement>(`[data-own-name="${i}"]`)!, l = own.querySelector<HTMLSelectElement>(`[data-own-logo="${i}"]`)!;
      if (n.value !== t.name) n.value = t.name;
      l.value = t.logo;
    });
  };
  // Settings tabs
  const ptab = (id: string) => {
    panel.querySelectorAll<HTMLElement>('[data-ptab-btn]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.ptabBtn === id)));
    panel.querySelectorAll<HTMLElement>('[data-ptab]').forEach((p) => (p.hidden = p.dataset.ptab !== id));
    if (id === 'art') artcat(S.about ? 'item' : panel.querySelector<HTMLElement>(`[data-cat]:not([data-cat=item]) [data-art="${CSS.escape(S.art.id)}"]`)?.closest<HTMLElement>('[data-cat]')!.dataset.cat ?? 'scenario');
  };
  // Art picker: one grid per category, thumbnails drawn the first time a grid shows
  const artcat = (id: string) => {
    panel.querySelectorAll<HTMLElement>('[data-artcat]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.artcat === id)));
    panel.querySelectorAll<HTMLElement>('[data-artgrid]').forEach((g) => (g.hidden = g.dataset.cat !== id));
    thumbs(panel.querySelector<HTMLElement>(`[data-artgrid][data-cat=${id}]`)!);
  };
  const thumbs = (grid: HTMLElement) => grid.querySelectorAll<HTMLElement>('[data-art]').forEach((b) => {
    if (b.firstElementChild) return;
    const piece = pieceOf(b.dataset.art!);
    if (piece) b.append(figureEl(merge(clone(DEFAULTS), { bg: 'white', cover: S.cover }), piece));
  });
  // "This item": the item's own art, then the alternatives drawn for it
  let itemKey = '';
  const itemArt = () => {
    const [kind, id] = S.about.split(':');
    if (kind === 'scenario') return D.scenarios.find((x) => x.id === id)?.art?.piece ?? 'sorter';
    if (kind === 'skill') return D.skills.find((x) => x.id === id)?.icon;
    if (kind === 'rule') return D.rules.find((x) => x.id === id)?.icon;
    if (kind === 'author') return 'photo';
  };
  const itemGrid = () => {
    const art = itemArt() ?? '', key = `${art}|${S.cover}`;
    if (key === itemKey) return;
    itemKey = key;
    const grid = panel.querySelector<HTMLElement>('[data-artgrid][data-cat=item]')!;
    const names = art && art !== 'photo' ? [art, ...Object.entries(alts).filter(([, a]) => a.of === art || `i-${a.of}` === art).map(([n]) => `alt:${n}`)] : [];
    grid.innerHTML = names.map((n) => `<button type="button" data-art="${esc(n)}" title="${esc(n)}" aria-label="${esc(n)}"></button>`).join('') || '<p class="hint">An author card uses their photo: Art → Photo.</p>';
    if (!grid.hidden) thumbs(grid);
  };
  // Picking the item takes its colour and art
  const about = () => {
    const [kind, id] = S.about.split(':');
    const x = kind === 'scenario' ? D.scenarios.find((y) => y.id === id) : kind === 'skill' ? D.skills.find((y) => y.id === id) : kind === 'rule' ? D.rules.find((y) => y.id === id) : undefined;
    if (x) { S.cover = x.cover; if (S.bg.startsWith('pastel-')) S.bg = `pastel-${x.cover}`; }
    const art = itemArt();
    if (art && !(art === 'photo' && S.avatar)) { S.art.id = art; if (art === 'photo') { S.art.photo = ''; S.author = id; } if (S.layout === 'none') S.layout = 'a'; }
  };
  const CONTENT = ['label', 'labelText', 'headline', 'context', 'qmark', 'avatar', 'chips', 'chipsText', 'rule', 'body', 'bodyText', 'pairs', 'pairsCms', 'pairsText', 'steps', 'stepsLabel', 'stepsText', 'tools', 'toolsLabel', 'toolsText', 'toolsCustom', 'toolsOwn', 'github', 'list', 'listText', 'author', 'aCustom', 'aName', 'aRole', 'aPhoto'] as const;

  const tick = (now: number) => {
    raf = 0;
    const p = current?.piece, frame = current?.post.querySelector('[data-frame]');
    if (!p || !frame || !S.art.animate || reduced.matches || busy) return;
    t += Math.min((now - last) / 1000, .05) * SPEED; last = now;
    frame.innerHTML = p.draw(t);
    current!.post.querySelector<HTMLElement>('.iso-panel')?.style.setProperty('--march', String(-(t * 12) % 14));
    raf = requestAnimationFrame(tick);
  };
  const scale = () => {
    if (!current) return;
    const [W, H] = FORMATS[S.format], r = fitBox.getBoundingClientRect(), k = Math.min((r.width - 48) / W, (r.height - 48) / H, 1);
    scaleBox.style.transform = `translate(-50%, -50%) scale(${k})`;
    // 1px lines vanish between pixels once the post is scaled down; keep each at least one screen pixel
    scaleBox.style.setProperty('--hair', `${Math.max(1, 1 / k).toFixed(3)}px`);
    $('[data-size]').textContent = `${W} × ${H} · exports ${W * 2} × ${H * 2}`;
  };
  let pending = 0;
  const draw = () => {
    cancelAnimationFrame(pending);
    pending = requestAnimationFrame(() => {
      if ($('[data-pane=editor]').hidden) return;
      current = renderInto(scaleBox, S, true);
      t = (current.piece?.rest ?? 0) + S.art.t;
      scale();
      cancelAnimationFrame(raf); last = performance.now(); raf = requestAnimationFrame(tick);
      history.replaceState(null, '', `#${encode(S)}`);
    });
  };
  new ResizeObserver(scale).observe(fitBox);

  const change = () => { sync(); draw(); };
  panel.addEventListener('change', (e) => {
    const el = e.target as HTMLInputElement, f = el.dataset.file && el.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => { set(S, el.dataset.file!, r.result as string); el.value = ''; change(); };
    r.readAsDataURL(f);
  });
  panel.addEventListener('input', (e) => {
    const el = e.target as HTMLInputElement;
    if (el.dataset.ownName) { S.toolsOwn[+el.dataset.ownName].name = el.value; return change(); }
    if (el.dataset.ownLogo) { S.toolsOwn[+el.dataset.ownLogo].logo = el.value; return change(); }
    if (el.dataset.tool) { S.toolsText = [...panel.querySelectorAll<HTMLInputElement>('[data-tool]:checked')].map((t) => t.dataset.tool).join(', '); return change(); }
    if (!el.dataset.k) return;
    if (el.type === 'number' && el.value === '') return;
    set(S, el.dataset.k, el.type === 'checkbox' ? el.checked : el.type === 'range' || el.type === 'number' ? +el.value : el.value);
    if (el.dataset.k === 'bgCustom') S.bg = 'custom';
    if (el.dataset.k === 'hueCustom') S.hue = 'custom';
    if (el.dataset.k === 'about') about();
    change();
  });
  panel.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-v], [data-act], [data-wave-preset], [data-art], [data-artcat], [data-ptab-btn], [data-own-del]');
    if (!b) return;
    if (b.dataset.ownDel) { S.toolsOwn.splice(+b.dataset.ownDel, 1); if (!S.toolsOwn.length) S.toolsOwn.push({ name: '', logo: 'list' }); return change(); }
    if (b.dataset.act === 'own-add') { S.toolsOwn.push({ name: '', logo: 'list' }); return change(); }
    if (b.dataset.ptabBtn) return ptab(b.dataset.ptabBtn);
    if (b.dataset.artcat) return artcat(b.dataset.artcat);
    const g = b.closest<HTMLElement>('[data-seg], [data-swatch]');
    if (g && b.dataset.v) set(S, g.dataset.seg ?? g.dataset.swatch!, b.dataset.v);
    if (b.dataset.art) S.art.id = b.dataset.art;
    // Text on art sits on the whole figure: a panel would box it in
    if (g?.dataset.seg === 'layout' && S.layout === 'over') S.art.frame = 'bleed';
    // The wave is a background: picking it fills the whole post, text on top
    if ((b.dataset.art || g?.dataset.seg === 'art.id') && S.art.id === 'wave') { S.layout = 'over'; S.art.frame = 'bleed'; }
    else if ((b.dataset.art || g?.dataset.seg === 'art.id') && S.art.id !== 'none' && S.layout === 'none') S.layout = 'a';
    if (b.dataset.act === 'fill') { const tp = TPL.find((x) => x.s.about === S.about) ?? (S.about.startsWith('author:') && authorById(S.about.slice(7)) ? authorCard(S.about.slice(7)) : undefined); if (tp) CONTENT.forEach((k) => ((S as any)[k] = clone(tp.s[k]))); }
    if (b.dataset.wavePreset) Object.assign(S.wave, WAVES[b.dataset.wavePreset as keyof typeof WAVES]);
    if (b.dataset.act === 'templates') return view('templates');
    if (b.dataset.act === 'reset') S = clone(base); // back to the template as it opened
    change();
  });

  const run = async (fn: () => Promise<void>) => {
    if (busy || !current) return;
    busy = true;
    const bar = $('[data-progress]'), set = (p: number) => (bar.firstElementChild as HTMLElement).style.setProperty('--p', String(p));
    bar.hidden = false; set(0);
    document.querySelectorAll<HTMLButtonElement>('.pb-actions .btn').forEach((b) => (b.disabled = true));
    try { await fn(); } catch (e) { say(e instanceof Error ? e.message : 'Export failed'); console.error(e); }
    busy = false; bar.hidden = true;
    document.querySelectorAll<HTMLButtonElement>('.pb-actions .btn').forEach((b) => (b.disabled = false));
    draw();
  };
  document.querySelectorAll<HTMLElement>('.pb-actions [data-act]').forEach((b) => b.addEventListener('click', () => {
    const a = b.dataset.act;
    if (a === 'png') run(async () => { await exportPNG(current!.post, S); say('PNG saved'); });
    if (a === 'mp4') {
      if (!current?.piece && S.art.id !== 'wave') return say('MP4 needs a figure or the wave');
      run(async () => { await exportMP4(current!.post, S, current!.piece, (p) => ($('[data-progress] > span') as HTMLElement).style.setProperty('--p', String(p))); say('MP4 saved'); });
    }
    if (a === 'link') navigator.clipboard.writeText(location.href).then(() => say('Link to this post copied'));
  }));

  // Gallery: groups of cards, each a live post drawn small once it scrolls near
  const groups = $('[data-groups]');
  const byGroup = TPL.reduce((m, tp, i) => m.set(tp.group, [...(m.get(tp.group) ?? []), i]), new Map<string, number[]>());
  const NOTES: Record<string, string> = {
    'Launch and promo': 'The promo visual in each cut (square, 4:5, 16:9), launch posts and the site-preview frames',
    'Newsletter (Demand Wire)': 'Launch header 1200×480 and the recurring “From the Standard” block 1200×240',
    'Scenario cards': 'Name, steps, tools, author. The figure moves: export MP4 for a moving post',
    'Skill cards': 'Name, one line, what it runs on, author',
    'Rule cards': 'Number, title, the rule in a line, LinkedIn’s default against the Standard',
    'Quote cards': 'One line a contributor said, their photo, name and company, the rule it is about',
    'Author cards': 'Contributors with what they added, most first',
    'Email (1200 wide)': 'One of each card at 1200 wide for email. Switch the item under Content → About, then Fill the text from it',
  };
  groups.innerHTML = [...byGroup].map(([g, ids]) => `<section class="pb-group"><header><h2 class="marker">${esc(g)} · ${ids.length}</h2><p class="t-p2">${esc(NOTES[g] ?? '')}</p></header><div class="pb-cards">${ids.map((i) => `<button type="button" class="pb-card" data-tpl="${i}"><span class="pb-thumb"><div></div></span><span class="t-p2">${esc(TPL[i].name)}</span>${TPL[i].note ? `<span class="t-p3">${esc(TPL[i].note!)}</span>` : ''}</button>`).join('')}</div></section>`).join('');
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    const btn = e.target as HTMLElement, holder = btn.querySelector<HTMLElement>('.pb-thumb > div')!, s = TPL[+btn.dataset.tpl!].s;
    const [W, H] = FORMATS[s.format], box = btn.querySelector('.pb-thumb')!.getBoundingClientRect().width;
    renderInto(holder, s);
    holder.style.transform = `translate(-50%, -50%) scale(${(box - 24) / Math.max(W, H)})`;
    holder.style.setProperty('--hair', `${(Math.max(W, H) / (box - 24)).toFixed(3)}px`);
  }), { rootMargin: '400px 0px' });
  const observeThumbs = () => groups.querySelectorAll('.pb-card').forEach((c) => { if (!c.querySelector('.post')) io.observe(c); });
  groups.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-tpl]');
    if (!b) return;
    const tp = TPL[+b.dataset.tpl!];
    S = clone(tp.s); base = clone(tp.s); tname = `${tp.group}: ${tp.name}`;
    sync(); view('editor'); ptab('content'); scrollTo({ top: 0 });
  });

  // Wave thumbnails share one still frame of the brand wave
  loadWave().then(() => {
    const h = document.createElement('div');
    h.style.cssText = 'position:fixed;left:-2000px;top:0;width:600px;height:600px';
    document.body.append(h);
    const w: Wave = (window as any).DSWave.mount(h, { frame: { x: 0, y: 0, w: 1, h: 1, k: 1.4, t0: 0 } });
    if (w) { w.hold(true); w.seek(6); waveSnap = w.canvas.toDataURL('image/jpeg', .85); }
    h.remove();
    groups.querySelectorAll<HTMLElement>('.pb-card').forEach((c) => { if (TPL[+c.dataset.tpl!].s.art.id === 'wave' && c.querySelector('.post')) { c.querySelector('.post')!.remove(); io.observe(c); } });
  });

  const fromHash = location.hash.length > 1 ? decode(location.hash.slice(1)) : undefined;
  if (fromHash) { S = fromHash; base = clone(fromHash); tname = 'From link'; sync(); view('editor'); } else { sync(); view('templates'); }
}
