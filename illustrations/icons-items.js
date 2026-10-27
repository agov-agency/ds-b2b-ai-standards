// Item icons for skills and rules (one object each, from the metaphor list of 27 Oct). Same kernel and helpers as
// icons.js (scene, box, cyl, line, dot share its script scope); exported to icons/<name>.svg by export-icons.mjs.
// One bright mark per icon ("hi"), no text.
(() => {
  const { solid, mk, poly, hull, circ } = HL;
  const R = (n, f) => Array.from({ length: n }, (_, i) => f(i / n * Math.PI * 2, i));
  // A solid shape standing in the x-z plane, extruded along y (front face at y1)
  function vs(s, pts, y0, y1, cls) {
    const a = pts.map(([x, z]) => s.P(x, y0, z)), b = pts.map(([x, z]) => s.P(x, y1, z)), el = solid(s.g);
    el.sil.setAttribute("d", poly(hull([...a, ...b])));
    el.cr.setAttribute("d", poly(b));
    if (cls) el.sil.classList.add(cls);
    return el;
  }
  // The same in the y-z plane, extruded along x (front face at x1)
  function xs(s, pts, x0, x1, cls) {
    const a = pts.map(([y, z]) => s.P(x0, y, z)), b = pts.map(([y, z]) => s.P(x1, y, z)), el = solid(s.g);
    el.sil.setAttribute("d", poly(hull([...a, ...b])));
    el.cr.setAttribute("d", poly(b));
    if (cls) el.sil.classList.add(cls);
    return el;
  }
  const disc = (cx, cz, r, n = 28) => R(n, (a) => [cx + r * Math.cos(a), cz + r * Math.sin(a)]);
  const rect = (x0, z0, x1, z1) => [[x0, z0], [x1, z0], [x1, z1], [x0, z1]];
  // Anything convex given by 3D points: the hull of their projections
  const blob = (s, pts, cls = "sil") => mk("path", { class: cls, d: poly(hull(pts.map((p) => s.P(...p)))) }, s.g);
  const sphere = (s, x, y, z, r, cls = "sil") => blob(s, R(12, (a) => R(8, (b) => [x + r * Math.cos(a) * Math.sin(b / 2), y + r * Math.sin(a) * Math.sin(b / 2), z + r * Math.cos(b / 2)])).flat(), cls);
  const path = (s, pts, cls = "sil nf", closed = false) => mk("path", { class: cls, d: (closed ? poly : HL.open)(pts.map((p) => s.P(...p))) }, s.g);
  const flat = (s, pts, cls = "sil") => path(s, pts, cls, true);
  const I = window.ICONS;

  // ---------- Skills ----------

  // Landing-page CPC report: a turnstile with a coin slot; the coin is spent only when it turns.
  I.turnstile = (svg) => {
    const s = scene(svg, [[0, 0, 0], [36, 30, 0], [0, 30, 0], [36, 0, 0], [12, 12, 40]]);
    box(s, 2, 2, 22, 22, 0, 3);
    box(s, 6, 6, 18, 18, 3, 28);
    line(s, [9, 12, 28], [15, 12, 28], "sil nf");
    vs(s, disc(12, 34, 5), 11.4, 12.6, "hi");
    xs(s, disc(12, 18, 3.4, 16), 18, 21);
    for (const a of [Math.PI / 2 + 0.2, Math.PI * 7 / 6 + 0.2, -Math.PI / 6 + 0.2]) {
      const c = Math.cos(a), d = Math.sin(a), w = 1.1, L = 15;
      xs(s, [[12 - d * w, 18 + c * w], [12 + c * L - d * w, 18 + d * L + c * w], [12 + c * L + d * w, 18 + d * L - c * w], [12 + d * w, 18 - c * w]], 20, 22.4);
    }
  };

  // Lowest bid that still spends: a feed regulator turned one notch lower, its flow wheel still turning.
  I.regulator = (svg) => {
    const s = scene(svg, [[0, 0, 0], [40, 18, 0], [0, 18, 0], [40, 0, 0], [16, 9, 30]]);
    box(s, 0, 0, 30, 14, 0, 3);
    box(s, 2, 2, 28, 12, 3, 24);
    for (let i = 0; i < 6; i++) line(s, [6 + i * 3.4, 12, 8 + i * 2.6], [6 + i * 3.4, 12, 11 + i * 2.6]);
    path(s, [[15, 12, 7], [11.8, 12, 16]], "sil nf");
    vs(s, rect(10, 14.6, 13.6, 18.2), 12, 14.5, "hi");
    xs(s, disc(7, 13, 6), 30, 32);
    for (const a of [0, 1, 2]) { const b = a * 2.09 + .4; line(s, [32, 7, 13], [32, 7 + 5 * Math.cos(b), 13 + 5 * Math.sin(b)]); }
  };
  // Cost per retargetable member: a re-entry pass and the coin it costs.
  I.passcard = (svg) => {
    const s = scene(svg, [[0, 0, 0], [40, 24, 0], [0, 24, 0], [40, 0, 0], [20, 12, 8]]);
    box(s, 0, 0, 26, 20, 0, 1.6, false, 1.2, 0.5);
    line(s, [3, 5, 1.6], [23, 5, 1.6]);
    line(s, [3, 14, 1.6], [12, 14, 1.6]);
    dot(s, 20, 14, 1.6, "dot m", 1.6);
    cyl(s, 33, 17, 6, 0, 2.4);
    cyl(s, 33, 15, 6, 3.2, 5.6, true);
  };
  // Retargeting guardrails: two stanchions with a rope across the way.
  I.stanchions = (svg) => {
    const s = scene(svg, [[0, 0, 0], [40, 10, 0], [0, 10, 0], [40, 0, 0], [20, 5, 30]]);
    for (const x of [4, 34]) { cyl(s, x, 5, 4.5, 0, 2); cyl(s, x, 5, 1.6, 2, 24); cyl(s, x, 5, 2.4, 24, 27); }
    path(s, R(17, (_, i) => { const u = i / 16; return [4 + 30 * u, 5, 24 - 9 * Math.sin(Math.PI * u)]; }).slice(0, 17), "hi nf");
  };
  // Matched audience lists: a plug adapter; any plug goes in.
  I.adapter = (svg) => {
    const s = scene(svg, [[0, 0, 0], [24, 32, 0], [0, 32, 0], [24, 0, 0], [12, 16, 28]]);
    for (const x of [7, 15]) cyl(s, x, 8, 1.2, 0, 8);
    box(s, 2, 2, 22, 16, 8, 26);
    for (const x of [8, 14]) line(s, [x, 16, 15], [x, 16, 20]);
    line(s, [11, 16, 11], [11, 16, 12]);
    for (const x of [8, 14]) path(s, [[x, 17, 17.5], [x, 22, 17.5]], "dash nf");
    box(s, 4, 22, 18, 30, 12, 23, true, 1.4, 0.6);
    path(s, [[11, 30, 17.5], [11, 34, 17.5], [11, 34, 6]], "sil nf");
  };
  // No-deal warm leads: a key board; most keys carry an owner's tag, two hang bare.
  I.keyrack = (svg) => {
    const s = scene(svg, [[0, 0, 0], [40, 6, 0], [0, 6, 0], [40, 0, 0], [20, 3, 30]]);
    box(s, 0, 0, 40, 3, 0, 28);
    for (let i = 0; i < 5; i++) {
      const x = 5 + i * 7.5, bare = i === 1 || i === 3, y = 4;
      cyl(s, x, 3.6, 0.8, 22, 23);
      path(s, R(14, (a) => [x + 2.2 * Math.cos(a), y, 18.6 + 2.2 * Math.sin(a)]).concat([[x + 2.2, y, 18.6]]), bare ? "hi nf" : "sil nf");
      path(s, [[x, y, 16.4], [x, y, 8], [x + 1.6, y, 8], [x, y, 10], [x + 1.4, y, 10]], bare ? "hi nf" : "sil nf");
      if (!bare) vs(s, rect(x - 2.6, 3, x + 2.6, 9), 4.4, 5);
    }
  };
  // Silent watchers: a raised periscope turned toward you, watching and never answering.
  I.periscope = (svg) => {
    const s = scene(svg, [[0, 0, 0], [30, 30, 0], [0, 30, 0], [30, 0, 0], [14, 22, 40]]);
    box(s, 0, 0, 28, 28, 0, 4);
    cyl(s, 14, 14, 6, 4, 7);
    box(s, 11, 11, 17, 17, 7, 34);
    box(s, 10, 10, 18, 24, 32, 39);
    vs(s, rect(11.5, 33.5, 16.5, 37.5), 24, 24.6, "hi");
  };
  // Account health check: a clipboard; the first item is the one to fix first.
  I.clipboard = (svg) => {
    const s = scene(svg, [[0, 0, 0], [28, 36, 0], [0, 36, 0], [28, 0, 0], [14, 18, 6]]);
    box(s, 0, 0, 26, 34, 0, 1.6, false, 1.2, 0.5);
    box(s, 2.5, 4, 23.5, 32, 1.6, 2.2, false, 0.4, 0.2);
    box(s, 8, -1, 18, 5, 1.6, 4.5, false, 1, 0.4);
    for (let k = 0; k < 3; k++) {
      flat(s, [[5, 9 + k * 7, 2.2], [8, 9 + k * 7, 2.2], [8, 12 + k * 7, 2.2], [5, 12 + k * 7, 2.2]], k ? "sil nf" : "hi nf");
      line(s, [10, 10.5 + k * 7, 2.2], [k ? 18 : 21, 10.5 + k * 7, 2.2], k ? "lo nf" : "hi nf");
    }
  };
  // CRM data health: a wobbly table, one leg short; you can't put anything on it.
  I.table = (svg) => {
    const s = scene(svg, [[0, 0, 0], [34, 26, 0], [0, 26, 0], [34, 0, 0], [17, 13, 20]]);
    for (const [x, y] of [[2, 2], [29, 2], [2, 21]]) box(s, x, y, x + 3, y + 3, 0, 15, false, 0.6, 0.3);
    box(s, 29, 21, 32, 24, 4, 15, true, 0.6, 0.3);
    path(s, [[30.5, 22.5, 0], [30.5, 22.5, 3]], "dash nf");
    box(s, 0, 0, 34, 26, 15, 18);
  };
  // Who's looking at your buying pages: a tally counter clipped to a price tag.
  I.tagcounter = (svg) => {
    const s = scene(svg, [[0, 0, 0], [36, 26, 0], [0, 26, 0], [36, 0, 0], [24, 12, 16]]);
    flat(s, [[0, 6, 0], [6, 0, 0], [30, 0, 0], [30, 24, 0], [6, 24, 0], [0, 18, 0]]);
    flat(s, [[0, 6, 1.4], [6, 0, 1.4], [30, 0, 1.4], [30, 24, 1.4], [6, 24, 1.4], [0, 18, 1.4]]);
    dot(s, 6, 12, 1.4, "dot m", 1.6);
    box(s, 14, 5, 28, 19, 1.4, 11);
    vs(s, rect(16, 5, 26, 9), 19, 19.5);
    cyl(s, 21, 12, 2.4, 11, 14.5, true);
  };
  // Creative decay watchlist: two identical batteries, one running down, one charging up.
  I.batteries = (svg) => {
    const s = scene(svg, [[-8, -8, 0], [26, 10, 0], [-8, 10, 0], [26, -8, 0], [9, 0, 30]]);
    for (const [x, lvl, hi] of [[0, 6, false], [18, 20, true]]) {
      cyl(s, x, 0, 6.5, 0, 24);
      cyl(s, x, 0, 2.4, 24, 26.5);
      const r = HL.circ(6.5, 32).filter((q) => q.nu + q.nv > -0.2);
      mk("path", { class: hi ? "hi nf" : "lo nf", d: HL.open(r.map((q) => s.P(x + q.u, q.v, lvl))) }, s.g);
      if (hi) for (const z of [lvl - 3, lvl - 6]) mk("path", { class: "lo nf", d: HL.open(r.map((q) => s.P(x + q.u, q.v, z))) }, s.g);
    }
  };
  // Video quality check: two film reels; almost all the film has wound onto the right one.
  I.reels = (svg) => {
    const s = scene(svg, [[0, -2, 0], [6, 40, 0], [0, 40, 0], [6, -2, 0], [3, 18, 32]]);
    box(s, 0, -2, 6, 40, 0, 2);
    xs(s, disc(6, 16, 12), 1.5, 4.5);
    xs(s, disc(6, 16, 3.6), 4.5, 5);
    xs(s, disc(30, 16, 12), 1.5, 4.5);
    xs(s, disc(30, 16, 10), 4.5, 5.2, "hi");
    path(s, [[3, 9.6, 16], [3, 22, 6]], "sil nf");
    for (const [y, z] of [[6, 23], [6, 9]]) dot(s, 5, y, z, "dot off", 0.8);
  };
  // Waste budget detection: an open tap running straight into the drain, no bucket under it.
  I.tap = (svg) => {
    const s = scene(svg, [[0, 0, 0], [30, 34, 0], [0, 34, 0], [30, 0, 0], [15, 4, 36]]);
    box(s, 0, 0, 30, 4, 0, 34);
    box(s, 11, 4, 19, 18, 22, 27);
    box(s, 12, 14, 18, 20, 18, 27);
    cyl(s, 15, 10, 1.4, 27, 31);
    box(s, 9, 9, 21, 11, 31, 33, true, 0.6, 0.2);
    mk("path", { class: "sil", d: poly(HL.circ(7, 32).map((q) => s.P(15 + q.u, 26 + q.v, 0))) }, s.g);
    for (const d of [-3, 0, 3]) line(s, [15 - 5, 26 + d, 0], [15 + 5, 26 + d, 0]);
    path(s, [[15, 17, 17], [15, 26, 1]], "dash nf");
  };
  // Campaign group scoreboard: three steps, cups on the two top ones.
  I.trophies = (svg) => {
    const s = scene(svg, [[0, 0, 0], [14, 36, 0], [0, 36, 0], [14, 0, 0], [7, 18, 40]]);
    box(s, 0, 0, 14, 12, 0, 12);
    box(s, 0, 12, 14, 24, 0, 22);
    box(s, 0, 24, 14, 36, 0, 8);
    const cup = (y, z, hi) => { cyl(s, 7, y, 3, z, z + 1.4); cyl(s, 7, y, 0.9, z + 1.4, z + 5); blob(s, R(16, (a) => [[7 + 4.4 * Math.cos(a), y + 4.4 * Math.sin(a), z + 11], [7 + 2 * Math.cos(a), y + 2 * Math.sin(a), z + 5]]).flat(), hi ? "sil hi" : "sil"); };
    cup(6, 12, false);
    cup(18, 22, true);
  };
  // Market benchmark comparison: your ruler beside the reference one; the marks don't line up.
  I.rulers = (svg) => {
    const s = scene(svg, [[0, 0, 0], [40, 22, 0], [0, 22, 0], [40, 0, 0], [20, 10, 4]]);
    box(s, 0, 0, 40, 8, 0, 2, false, 0.6, 0.3);
    box(s, 0, 12, 40, 20, 0, 2, true, 0.6, 0.3);
    for (let i = 0; i < 9; i++) line(s, [3 + i * 4.2, 0.5, 2], [3 + i * 4.2, i % 2 ? 3 : 4.5, 2]);
    for (let i = 0; i < 8; i++) line(s, [3 + i * 4.9, 12.5, 2], [3 + i * 4.9, i % 2 ? 15 : 16.5, 2], "hi nf");
  };
  // Manager monthly report: a hardbound log with a ribbon at this month's page.
  I.logbook = (svg) => {
    const s = scene(svg, [[0, 0, 0], [30, 36, 0], [0, 36, 0], [30, 0, 0], [15, 18, 10]]);
    box(s, 0, 0, 28, 34, 0, 1.6, false, 0.8, 0.3);
    box(s, 1, 1, 27, 33, 1.6, 6.4, false, 0.4, 0.2);
    box(s, 0, 0, 28, 34, 6.4, 8, false, 0.8, 0.3);
    flat(s, [[18, 34, 4.2], [21, 34, 4.2], [21, 34, -2], [19.5, 34, -0.6], [18, 34, -2]], "hi");
    line(s, [4, 6, 8], [20, 6, 8]);
  };
  // Pausing low performers: a knife switch pulled down, locked out with a padlock and a tag.
  I.lockout = (svg) => {
    const s = scene(svg, [[0, 0, 0], [30, 16, 0], [0, 16, 0], [30, 0, 0], [15, 7, 36]]);
    box(s, 0, 0, 30, 6, 0, 34);
    box(s, 6, 6, 24, 8, 24, 30);
    cyl(s, 15, 7, 2, 25.5, 28);
    box(s, 13.8, 7, 16.2, 10, 9, 26, false, 0.4, 0.2);
    box(s, 10, 8, 20, 12, 6, 10);
    path(s, R(13, (a, i) => [15 + 2.6 * Math.cos(Math.PI * i / 12), 12.6, 4 + 3.4 * Math.sin(Math.PI * i / 12)]), "hi nf");
    box(s, 11, 11, 19, 14, -4, 4, true, 0.8, 0.3);
    dot(s, 15, 14, 1, "dot", 0.7);
  };

  // Weekly reporting: one week of a desk pad, three tabs (one per platform).
  I.weekpad = (svg) => {
    const s = scene(svg, [[0, 0, 0], [38, 26, 0], [0, 26, 0], [38, 0, 0], [19, 4, 16]]);
    box(s, 0, 0, 38, 26, 0, 5);
    for (let i = 1; i < 7; i++) line(s, [i * 5.4, 8, 5], [i * 5.4, 24, 5]);
    line(s, [1, 7, 5], [37, 7, 5]);
    for (const [x, hi] of [[5, false], [15, true], [25, false]]) vs(s, rect(x, 5, x + 7, 12), 1, 1.8, hi ? "hi" : "");
  };
  // Capping recommendation: a door knocker and a long row of tally marks beside it: knocked too often.
  I.knocker = (svg) => {
    const s = scene(svg, [[0, 0, 0], [40, 6, 0], [0, 6, 0], [40, 0, 0], [20, 3, 32]]);
    box(s, 0, 0, 40, 3, 0, 32);
    cyl(s, 8, 3.5, 1.5, 20, 21.5);
    path(s, R(21, (a) => [8 + 5 * Math.cos(a), 4, 15 + 5 * Math.sin(a)]).concat([[13, 4, 15]]), "hi nf");
    for (let i = 0; i < 9; i++) line(s, [17 + i * 2.4, 3, 12], [17 + i * 2.4 + (i % 5 === 4 ? -8 : 0), 3, 20], i % 5 === 4 ? "sil nf" : "sil nf");
  };
  // Pacing check: a metronome swinging evenly between its marks.
  I.metronome = (svg) => {
    const s = scene(svg, [[0, 0, 0], [26, 20, 0], [0, 20, 0], [26, 0, 0], [13, 10, 38]]);
    vs(s, [[0, 0], [26, 0], [17, 34], [9, 34]], 0, 16);
    for (const dx of [-5, 5]) line(s, [13 + dx, 16, 4], [13 + dx * 1.2, 16, 6.5]);
    path(s, [[13, 16.5, 5], [19, 16.5, 30]], "sil nf");
    vs(s, rect(15.4, 19, 19.6, 23), 16.5, 18, "hi");
  };
  // Budget re-allocation: a siphon moving water from the standing tank to the working one.
  I.siphon = (svg) => {
    const s = scene(svg, [[0, 0, 0], [40, 16, 0], [0, 16, 0], [40, 0, 0], [16, 8, 38]]);
    box(s, 0, 0, 16, 16, 0, 12);
    box(s, 0, 0, 16, 16, 12, 30);
    flat(s, [[1.6, 1.6, 30], [14.4, 1.6, 30], [14.4, 14.4, 30], [1.6, 14.4, 30]]);
    box(s, 24, 0, 40, 16, 0, 16);
    flat(s, [[25.6, 1.6, 16], [38.4, 1.6, 16], [38.4, 14.4, 16], [25.6, 14.4, 16]]);
    path(s, [[8, 8, 22], [8, 8, 34], [11, 8, 37], [29, 8, 37], [32, 8, 34], [32, 8, 9]], "hi nf");
  };

  // Account engagement: a puzzle frame with gaps, and the pieces that aren't in it lying beside.
  I.puzzle = (svg) => {
    const s = scene(svg, [[0, 0, 0], [40, 30, 0], [0, 30, 0], [40, 0, 0], [16, 15, 4]]);
    box(s, 0, 0, 30, 30, 0, 2);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      if ((i === 1 && j === 0) || (i === 2 && j === 2)) continue;
      box(s, 2 + i * 9, 2 + j * 9, 10 + i * 9, 10 + j * 9, 2, 4, false, 0.6, 0.3);
      cyl(s, 10 + i * 9, 6 + j * 9, 1.4, 2, 4);
    }
    box(s, 32, 18, 40, 26, 0, 2, true, 0.6, 0.3);
    cyl(s, 36, 26, 1.4, 0, 2, true);
  };
  // Ad-hoc query: a service bell on the counter: ring it, get an answer.
  I.bell = (svg) => {
    const s = scene(svg, [[-14, -14, 0], [14, 14, 0], [-14, 14, 0], [14, -14, 0], [0, 0, 24]]);
    cyl(s, 0, 0, 13, 0, 2.4);
    blob(s, R(24, (a) => [[11 * Math.cos(a), 11 * Math.sin(a), 2.4], [7 * Math.cos(a), 7 * Math.sin(a), 12], [3 * Math.cos(a), 3 * Math.sin(a), 15]]).flat());
    cyl(s, 0, 0, 1, 15, 18);
    cyl(s, 0, 0, 3.2, 18, 20, true);
  };
  // Benchmark comparison: a thermometer whose column stands inside the shaded normal band.
  I.thermometer = (svg) => {
    const s = scene(svg, [[0, 0, 0], [20, 8, 0], [0, 8, 0], [20, 0, 0], [10, 4, 42]]);
    box(s, 0, 0, 20, 3, 0, 40);
    for (let z = 22; z <= 30; z += 2) line(s, [3, 3, z], [8, 3, z - 2], "lo nf");
    line(s, [3, 3, 22], [17, 3, 22]);
    line(s, [3, 3, 30], [17, 3, 30]);
    cyl(s, 10, 6, 1.8, 7, 36);
    sphere(s, 10, 6, 6, 3.4);
    path(s, [[10, 7.6, 8], [10, 7.6, 26]], "hi nf");
  };
  // ABM account penetration: three blocks drilled to different depths.
  I.drilled = (svg) => {
    const s = scene(svg, [[0, 0, 0], [40, 12, 0], [0, 12, 0], [40, 0, 0], [20, 6, 18]]);
    [6, 11, 15].forEach((d, i) => {
      const x = i * 14;
      box(s, x, 0, x + 12, 12, 0, 16);
      mk("path", { class: i === 2 ? "hi" : "sil", d: poly(HL.circ(2.6, 24).map((q) => s.P(x + 6 + q.u, 6 + q.v, 16))) }, s.g);
      path(s, [[x + 4, 12, 16], [x + 4, 12, 16 - d], [x + 8, 12, 16 - d], [x + 8, 12, 16]], i === 2 ? "hi nf" : "dash nf");
    });
  };
  // Audience demographics: a tiered sorter; a handful of parts falls through finer and finer sieves.
  I.sieve = (svg) => {
    const s = scene(svg, [[0, 0, 0], [30, 30, 0], [0, 30, 0], [30, 0, 0], [15, 15, 34]]);
    for (const x of [1, 27]) for (const y of [1, 27]) box(s, x, y, x + 2, y + 2, 0, 30, false, 0.4, 0.2);
    [[0, 2.2, 2], [11, 1.6, 2.6], [22, 1.1, 3.2]].forEach(([z, r, g], t) => {
      box(s, 0, 0, 30, 30, z, z + 3);
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) dot(s, 6 + i * 6, 6 + j * 6, z + 3, t === 1 ? "dot" : "dot m", r * 0.6);
      void g;
    });
  };
  // Benchmark context: the rear-view mirror on the windscreen: your past first, the market ahead.
  I.mirror = (svg) => {
    const s = scene(svg, [[0, 0, 0], [40, 10, 0], [0, 10, 0], [40, 0, 0], [20, 5, 32]]);
    vs(s, [[0, 0], [40, 0], [36, 28], [4, 28]], 0, 1.4);
    vs(s, [[3, 2.5], [37, 2.5], [33.6, 25.5], [6.4, 25.5]], 1.4, 1.6);
    for (const x of [10, 26]) path(s, [[x, 1.8, 3], [x + 8, 1.8, 9]], "lo nf");
    box(s, 19, 1.6, 21, 3.4, 22, 28, false, 0.4, 0.2);
    box(s, 11, 2.6, 29, 7.6, 16, 23, true, 1.2, 0.5);
  };

  // Creative performance: a case of screwdriver bits; each screw takes its own.
  I.bits = (svg) => {
    const s = scene(svg, [[0, 0, 0], [40, 16, 0], [0, 16, 0], [40, 0, 0], [20, 8, 18]]);
    box(s, 0, 0, 40, 14, 0, 5);
    for (let i = 0; i < 6; i++) {
      const x = 4.5 + i * 6.2, hi = i === 3;
      const el = solid(s.g);
      HL.put(el, HL.prism(s.P, s.front, at(HL.circ(2, 6), x, 7), null, 5, 13));
      if (hi) el.sil.classList.add("hi");
      if (i % 3 === 0) blob(s, [[x - 2, 7, 13], [x + 2, 7, 13], [x, 7, 16.5], [x, 5.5, 13], [x, 8.5, 13]], hi ? "sil hi" : "sil");
      else if (i % 3 === 1) box(s, x - 1.6, 6.4, x + 1.6, 7.6, 13, 16, hi, 0.3, 0.1);
      else cyl(s, x, 7, 1.2, 13, 16, hi);
    }
  };
  // Performance KPIs: a dial with today's needle and a pale needle for last period.
  I.dial = (svg) => {
    const s = scene(svg, [[0, 0, 0], [36, 8, 0], [0, 8, 0], [36, 0, 0], [18, 4, 36]]);
    box(s, 4, 0, 32, 6, 0, 4);
    vs(s, disc(18, 20, 15, 40), 1, 4);
    for (let i = 0; i <= 8; i++) { const a = Math.PI * (1.1 - i * 0.15); line(s, [18 + 11 * Math.cos(a), 4, 20 + 11 * Math.sin(a)], [18 + 13 * Math.cos(a), 4, 20 + 13 * Math.sin(a)]); }
    path(s, [[18, 4.2, 20], [18 + 11 * Math.cos(2.2), 4.2, 20 + 11 * Math.sin(2.2)]], "lo nf");
    path(s, [[18, 4.4, 20], [18 + 11 * Math.cos(.9), 4.4, 20 + 11 * Math.sin(.9)]], "hi nf");
    dot(s, 18, 4.6, 20, "dot", 1.2);
  };
  // Multichannel rollup: an abacus with different beads on each wire; they never cross wires.
  I.abacus = (svg) => {
    const s = scene(svg, [[0, 0, 0], [40, 6, 0], [0, 6, 0], [40, 0, 0], [20, 3, 32]]);
    box(s, 0, 0, 3, 6, 0, 30);
    [6, 13, 20, 27].forEach((z, w) => {
      line(s, [3, 3, z], [37, 3, z]);
      for (let b = 0; b < 4; b++) {
        const x = 6 + b * 4.2 + (w % 2 ? 8 : 0);
        if (w === 0) xs(s, disc(3, z, 2.4, 16), x, x + 3);
        else if (w === 1) box(s, x, 1, x + 3, 5, z - 2, z + 2, false, 0.4, 0.2);
        else if (w === 2) xs(s, disc(3, z, 2.2, 16), x, x + 3, "hi");
        else xs(s, [[3, z - 2.4], [5.4, z], [3, z + 2.4], [0.6, z]], x, x + 3);
      }
    });
    box(s, 37, 0, 40, 6, 0, 30);
  };
  // Traffic analysis: a patch panel; every cable carries a label ring except one.
  I.patchpanel = (svg) => {
    const s = scene(svg, [[0, 0, 0], [40, 26, 0], [0, 26, 0], [40, 0, 0], [20, 4, 26]]);
    box(s, 0, 0, 40, 6, 12, 24);
    for (let i = 0; i < 8; i++) for (let j = 0; j < 2; j++) vs(s, rect(3 + i * 4.6, 15 + j * 5, 5.6 + i * 4.6, 17.4 + j * 5), 6, 6.5);
    [[0, 0], [2, 1], [4, 0], [6, 1]].forEach(([i, j], c) => {
      const x = 4.3 + i * 4.6, z = 16.2 + j * 5, bare = c === 2;
      path(s, [[x, 7, z], [x, 14, z - 4], [x + 2, 22, 0]], bare ? "hi nf" : "sil nf");
      if (!bare) box(s, x - 1.4, 11, x + 1.4, 14, z - 5, z - 1.6, false, 0.3, 0.1);
    });
  };

  // ---------- Rules ----------

  // 01 Frequency with reach: a clock needs both hands to tell the time.
  I.clock = (svg) => {
    const s = scene(svg, [[0, 0, 0], [36, 8, 0], [0, 8, 0], [36, 0, 0], [18, 4, 38]]);
    vs(s, disc(18, 18, 17, 40), 0, 3);
    vs(s, disc(18, 18, 15, 40), 3, 3.4);
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; line(s, [18 + 12.5 * Math.cos(a), 3.4, 18 + 12.5 * Math.sin(a)], [18 + 14 * Math.cos(a), 3.4, 18 + 14 * Math.sin(a)]); }
    path(s, [[18, 3.6, 18], [18 + 8 * Math.cos(2.4), 3.6, 18 + 8 * Math.sin(2.4)]], "sil nf");
    path(s, [[18, 3.8, 18], [18 + 12 * Math.cos(.35), 3.8, 18 + 12 * Math.sin(.35)]], "hi nf");
    dot(s, 18, 4, 18, "dot", 1.1);
  };
  // 02 Small audiences: a wide roller covers ground easily; a stamp hits the same spot again and again.
  I.rollerstamp = (svg) => {
    const s = scene(svg, [[0, 0, 0], [40, 30, 0], [0, 30, 0], [40, 0, 0], [30, 20, 26]]);
    flat(s, [[0, 0, 0], [22, 0, 0], [22, 30, 0], [0, 30, 0]], "lo nf");
    xs(s, disc(14, 5, 5, 24), 2, 20, "hi");
    path(s, [[20, 14, 5], [24, 14, 5], [24, 14, 14], [24, 6, 22]], "sil nf");
    box(s, 22, 4, 26, 8, 20, 24, false, 0.8, 0.3);
    for (const r of [5, 3.4]) mk("path", { class: "lo nf", d: poly(HL.circ(r, 24).map((q) => s.P(33 + q.u, 22 + q.v, 0))) }, s.g);
    box(s, 29, 18, 37, 26, 4, 8);
    cyl(s, 33, 22, 1.4, 8, 16);
    cyl(s, 33, 22, 3, 16, 21);
  };
  // 03 Two conditions: a door opens only when both bolts are drawn back.
  I.bolts = (svg) => {
    const s = scene(svg, [[0, 0, 0], [34, 8, 0], [0, 8, 0], [34, 0, 0], [17, 4, 42]]);
    box(s, 0, 0, 34, 3, 0, 40);
    box(s, 3, 3, 31, 3.6, 3, 37, false, 0.4, 0.2);
    for (const [z, hi] of [[30, false], [9, true]]) {
      box(s, 18, 3.6, 28, 5.6, z - 2, z + 2, false, 0.4, 0.2);
      cyl(s, 19, 6.6, 0.9, z, z + 0.1);
      box(s, 12, 4.2, 22, 6, z - 1, z + 1, hi, 0.4, 0.2);
      box(s, 15, 6, 16.4, 9, z - 0.7, z + 0.7, hi, 0.3, 0.1);
    }
    box(s, 31, 3, 33, 6, 18, 22);
  };
  // 04 Impressions over clicks: a billboard on its posts is measured by how often it is seen.
  I.billboard = (svg) => {
    const s = scene(svg, [[0, 0, 0], [40, 6, 0], [0, 6, 0], [40, 0, 0], [20, 3, 36]]);
    for (const x of [8, 30]) box(s, x, 2, x + 3, 5, 0, 16, false, 0.6, 0.2);
    box(s, 0, 0, 40, 3, 15, 35);
    vs(s, rect(2, 17, 38, 33), 3, 3.4, "hi");
    line(s, [6, 3.6, 28], [24, 3.6, 28]);
    line(s, [6, 3.6, 23], [17, 3.6, 23]);
    box(s, 2, 3, 38, 6, 13, 15, false, 0.4, 0.2);
  };
  // 05 Lean into what already works: the wedge only goes in where the block has already cracked.
  I.wedge = (svg) => {
    const s = scene(svg, [[0, 0, 0], [36, 26, 0], [0, 26, 0], [36, 0, 0], [18, 13, 30]]);
    box(s, 0, 0, 36, 24, 0, 18);
    path(s, [[16, 0, 18], [19, 6, 18], [16, 12, 18], [20, 18, 18], [18, 24, 18], [18, 24, 12], [21, 24, 6], [19, 24, 0]], "sil nf");
    blob(s, [[15, 9, 15], [21, 9, 15], [15, 15, 15], [21, 15, 15], [11, 9, 28], [25, 9, 28], [11, 15, 28], [25, 15, 28]], "sil hi");
    line(s, [11, 15, 28], [25, 15, 28]);
  };
  // 06 Budget drift: a tilted tray; the balls roll to the low end, a divider keeps some in place.
  I.tilttray = (svg) => {
    const s = scene(svg, [[0, 0, 0], [40, 20, 0], [0, 20, 0], [40, 0, 0], [0, 10, 18]]);
    const z = (x) => 14 - x * 0.3;
    box(s, 34, 6, 40, 14, 0, 2);
    vs(s, [[2, 0], [6, 0], [6, 12], [2, 12]], 8, 12);
    flat(s, [[0, 0, z(0)], [40, 0, z(40)], [40, 20, z(40)], [0, 20, z(0)]]);
    flat(s, [[0, 0, z(0)], [40, 0, z(40)], [40, 0, z(40) + 3], [0, 0, z(0) + 3]]);
    for (const [x, y] of [[35, 5], [35, 11], [31, 8], [35, 16.5]]) sphere(s, x, y, z(x) + 1.8, 1.8);
    flat(s, [[16, 0, z(16)], [16, 20, z(16)], [16, 20, z(16) + 4], [16, 0, z(16) + 4]], "sil hi");
    for (const [x, y] of [[13, 5], [13, 12]]) sphere(s, x, y, z(x) + 1.8, 1.8);
    flat(s, [[0, 20, z(0)], [40, 20, z(40)], [40, 20, z(40) + 3], [0, 20, z(0) + 3]]);
  };
  // 07 Don't throw out the winners: a bin about to be taken out, a gold bar inside.
  I.binbar = (svg) => {
    const s = scene(svg, [[-14, -14, 0], [14, 14, 0], [-14, 14, 0], [14, -14, 0], [0, 0, 34]]);
    blob(s, R(28, (a) => [[9 * Math.cos(a), 9 * Math.sin(a), 0], [12 * Math.cos(a), 12 * Math.sin(a), 26]]).flat());
    mk("path", { class: "sil", d: poly(HL.circ(12, 40).map((q) => s.P(q.u, q.v, 26))) }, s.g);
    mk("path", { class: "nf lo", d: poly(HL.circ(10.6, 40).map((q) => s.P(q.u, q.v, 26))) }, s.g);
    blob(s, [[-6, -2, 22], [6, -2, 22], [-6, 4, 22], [6, 4, 22], [-4, -1, 31], [4, -1, 31], [-4, 3, 31], [4, 3, 31]], "sil hi");
    line(s, [-4, 3, 31], [4, 3, 31]);
  };
  // 08 Check what you pay for: a parcel in an X-ray frame; inside is not what's on the label.
  I.xray = (svg) => {
    const s = scene(svg, [[0, 0, 0], [40, 24, 0], [0, 24, 0], [40, 0, 0], [20, 12, 34]]);
    box(s, 0, 0, 40, 24, 0, 3);
    box(s, 2, 2, 6, 22, 3, 32);
    box(s, 2, 2, 38, 22, 30, 33);
    for (const x of [12, 28]) line(s, [x, 2, 30], [x, 22, 30], "lo nf");
    const el = box(s, 12, 6, 28, 18, 3, 17);
    el.sil.classList.add("nf", "dash");
    sphere(s, 18, 12, 7.5, 4, "sil hi");
    box(s, 22, 10, 25, 13, 3, 9, true, 0.4, 0.2);
    box(s, 34, 2, 38, 22, 3, 32);
  };
  // 09 Thresholds: a spring scale; the pointer hasn't reached the mark, so nothing starts yet.
  I.springscale = (svg) => {
    const s = scene(svg, [[-10, -10, 0], [10, 10, 0], [-10, 10, 0], [10, -10, 0], [0, 0, 46]]);
    path(s, R(13, (a, i) => [0, 3 * Math.cos(Math.PI * i / 12), 43 + 3 * Math.sin(Math.PI * i / 12)]), "sil nf");
    cyl(s, 0, 0, 1, 38, 40.4);
    cyl(s, 0, 0, 5, 14, 38);
    flat(s, [[3.2, 3.8, 18], [3.2, 3.8, 34], [-0.6, 5, 34], [-0.6, 5, 18]]);
    for (const z of [22, 30]) path(s, [[3.4, 4, z], [-0.8, 5.2, z]], z === 22 ? "sil nf" : "lo nf");
    flat(s, [[3.4, 4, 26], [-0.8, 5.2, 26], [-0.8, 5.2, 27.4], [3.4, 4, 27.4]], "hi");
    path(s, [[0, 0, 14], [0, 0, 10]], "sil nf");
    box(s, -6, -6, 6, 6, 0, 9);
  };

  // 10 Fill one before the next: a cascade of three bowls; the top one fills, then spills down.
  I.cascade = (svg) => {
    const s = scene(svg, [[-16, -16, 0], [16, 16, 0], [-16, 16, 0], [16, -16, 0], [0, 0, 40]]);
    cyl(s, 0, 0, 1.4, 0, 34);
    const bowl = (z, r, cls) => blob(s, R(24, (a) => [[r * 0.4 * Math.cos(a), r * 0.4 * Math.sin(a), z], [r * Math.cos(a), r * Math.sin(a), z + 5]]).flat(), cls);
    bowl(2, 15, "sil");
    mk("path", { class: "nf lo", d: poly(HL.circ(13.6, 40).map((q) => s.P(q.u, q.v, 7))) }, s.g);
    bowl(15, 10.5, "sil");
    mk("path", { class: "nf lo", d: poly(HL.circ(9.4, 40).map((q) => s.P(q.u, q.v, 20))) }, s.g);
    bowl(28, 7, "sil hi");
    mk("path", { class: "nf hi", d: poly(HL.circ(6, 40).map((q) => s.P(q.u, q.v, 33))) }, s.g);
  };
  // 11 Narrow as you go: an iris diaphragm closing from wide to narrow.
  I.aperture = (svg) => {
    const s = scene(svg, [[0, 0, 0], [36, 10, 0], [0, 10, 0], [36, 0, 0], [18, 5, 36]]);
    vs(s, disc(18, 18, 17, 40), 0, 6);
    vs(s, disc(18, 18, 13.5, 40), 6, 6.4);
    const hx = R(6, (a) => [18 + 6 * Math.cos(a + .3), 18 + 6 * Math.sin(a + .3)]);
    hx.forEach(([x, z], i) => { const a = i * Math.PI / 3 + .3 + 1.2; line(s, [x, 6.6, z], [x + 9 * Math.cos(a), 6.6, z + 9 * Math.sin(a)]); });
    flat(s, hx.map(([x, z]) => [x, 6.8, z]), "hi nf");
  };
  // 12 Keep lists separate: three sealed canisters, never poured into one.
  I.canisters = (svg) => {
    const s = scene(svg, [[0, 0, 0], [42, 14, 0], [0, 14, 0], [42, 0, 0], [20, 7, 30]]);
    for (let i = 0; i < 3; i++) {
      const x = i * 15, hi = i === 1;
      box(s, x, 0, x + 12, 12, 0, 22, hi);
      box(s, x + 2, 4, x + 7, 8, 22, 26, false, 0.6, 0.2);
      cyl(s, x + 9.5, 6, 1.6, 22, 25);
      cyl(s, x + 9.5, 6, 2, 25, 26.5, hi);
      line(s, [x + 2, 12, 16], [x + 10, 12, 6]);
    }
  };
  // 13 One step at a time: an airlock; the inner door opens only after the outer one has shut.
  I.airlock = (svg) => {
    const s = scene(svg, [[0, 0, 0], [42, 34, 0], [0, 20, 0], [42, 0, 0], [21, 10, 26]]);
    box(s, 0, 0, 42, 20, 0, 2);
    box(s, 0, 0, 42, 2, 2, 24);
    box(s, 0, 2, 2, 20, 2, 24);
    box(s, 15, 6, 27, 15, 2, 12, true);
    const a = 1.15, ex = 42 + 16 * Math.cos(a) * 0.35, ey = 2 + 16 * Math.sin(a);
    flat(s, [[42, 2, 2], [ex, ey, 2], [ex, ey, 24], [42, 2, 24]]);
    flat(s, [[42, 2, 24], [ex, ey, 24], [ex + 1, ey, 24], [43, 2, 24]]);
    dot(s, ex - 1, ey - 2, 13, "dot m", 0.8);
  };

  // 14 Grow from the same market: a chain built from identical links; the odd link is set aside.
  I.chain = (svg) => {
    const s = scene(svg, [[0, 0, 0], [40, 22, 0], [0, 22, 0], [40, 0, 0], [20, 6, 10]]);
    for (let i = 0; i < 5; i++) {
      const cx = 4 + i * 6.4;
      const ring = R(24, (a) => (i % 2 ? [cx + 4.6 * Math.cos(a), 6 + 2.6 * Math.sin(a), 3] : [cx + 4.6 * Math.cos(a), 6, 3 + 2.6 * Math.sin(a)]));
      path(s, ring, "sil nf", true);
      path(s, R(24, (a) => (i % 2 ? [cx + 3.2 * Math.cos(a), 6 + 1.2 * Math.sin(a), 3] : [cx + 3.2 * Math.cos(a), 6, 3 + 1.2 * Math.sin(a)])), "lo nf", true);
    }
    path(s, [[30, 14, 0], [38, 14, 0], [38, 20, 0], [30, 20, 0]], "hi nf", true);
    path(s, [[31.6, 15.6, 0], [36.4, 15.6, 0], [36.4, 18.4, 0], [31.6, 18.4, 0]], "hi nf", true);
  };

  // 15 Judge by what it collects: a horseshoe magnet passes over filings and comes out covered.
  I.magnet = (svg) => {
    const s = scene(svg, [[0, 0, 0], [30, 10, 0], [0, 10, 0], [30, 0, 0], [15, 5, 36]]);
    vs(s, [[2, 10], [9, 10], [9, 26], [2, 26]], 0, 8);
    vs(s, [[21, 10], [28, 10], [28, 26], [21, 26]], 0, 8);
    vs(s, R(13, (a, i) => { const t = Math.PI * i / 12; return [15 - 13 * Math.cos(t), 26 + 10 * Math.sin(t)]; }).concat(R(13, (a, i) => { const t = Math.PI * (12 - i) / 12; return [15 - 6 * Math.cos(t), 26 + 4 * Math.sin(t)]; })), 0, 8);
    vs(s, rect(2, 4, 9, 10), 0, 8, "hi");
    vs(s, rect(21, 4, 28, 10), 0, 8, "hi");
    for (const [x, z] of [[3, 2.5], [5.5, 1.5], [8, 2.6], [22.5, 2], [25, 1.2], [27, 2.8]]) dot(s, x, 8.4, z, "dot m", 0.8);
  };
})();
