/**
 * RENDER/INPUT latency probe (extends runtime-perf harness patterns).
 *
 * Used when PERF_MODE=render is set on `npm run perf:runtime`.
 * Measures TTI, per-move paint cost, hover preview cost (when applicable),
 * long tasks >50ms, and layout-forcing DOM reads under CPU 4× + tablet viewport.
 *
 * Does not replace the leak/remount report in docs/runtime-perf-*.md.
 *
 * This file is a library module. Direct CLI entry prints usage only:
 *   node scripts/render-perf-mode.mjs [--help]
 * Unknown flags exit 2. Measurement contracts are unchanged — run via:
 *   PERF_MODE=render npm run perf:runtime
 */

import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { requireEnvNumber } from './lib/env-number.mjs';
import { parseHelpOnlyArgv } from './lib/help-only-cli.mjs';
import { waitForGameReady } from './lib/page-ready.mjs';
import { waitDoubleRaf } from './lib/page-settle.mjs';

export const RENDER_PERF_MODE_USAGE = `Usage: node scripts/render-perf-mode.mjs [--help]

Library module for PERF_MODE=render measurements (imported by scripts/runtime-perf.mjs).
Not a standalone harness — run measurements with:

  PERF_MODE=render npm run perf:runtime

Options:
  -h, --help    Show this help and exit`;

const TABLET_VIEWPORT = { width: 768, height: 1024 };

/**
 * Lazy PERF_* env (q-mp-1000): validate on first measure / accessor call, not
 * on import — so `import './render-perf-mode.mjs'` and `--help` stay clean under
 * junk PERF_MOVES / PERF_CPU_THROTTLE / PERF_HOVER_SAMPLES. Defaults and
 * requireEnvNumber messages stay byte-identical to the former module-level
 * reads once a measurement path (or accessor) runs.
 */
let cachedCpuThrottle;
let cachedHoverSamples;
let cachedMoveTargetRender;

/** @returns {number} */
export function getCpuThrottle() {
  if (cachedCpuThrottle === undefined) {
    cachedCpuThrottle = requireEnvNumber('PERF_CPU_THROTTLE', 4);
  }
  return cachedCpuThrottle;
}

/** @returns {number} */
export function getHoverSamples() {
  if (cachedHoverSamples === undefined) {
    cachedHoverSamples = requireEnvNumber('PERF_HOVER_SAMPLES', 12);
  }
  return cachedHoverSamples;
}

/** @returns {number} */
export function getMoveTargetRender() {
  if (cachedMoveTargetRender === undefined) {
    cachedMoveTargetRender = requireEnvNumber('PERF_MOVES', 20);
  }
  return cachedMoveTargetRender;
}

const HOVER_GAMES = new Set(['juggle', 'pent-em-in']);

function renderReportPaths(root) {
  /** Optional stem so re-runs can avoid clobbering the Oct render baseline. */
  const stem = process.env.PERF_RENDER_STEM || 'render-perf-2026-10';
  return {
    md: resolve(root, `docs/dev/${stem}.md`),
    json: resolve(root, `docs/dev/${stem}.json`),
  };
}

export async function setupRenderContext(browser, baseURL) {
  const context = await browser.newContext({
    baseURL,
    viewport: TABLET_VIEWPORT,
    deviceScaleFactor: 2,
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', {
    rate: getCpuThrottle(),
  });
  await cdp.send('Performance.enable').catch(() => {});
  return { context, page, cdp };
}

export async function installRenderObservers(page) {
  await page.evaluate(() => {
    const w = window;
    const prior = w.__mpRenderPerf;
    w.__mpRenderPerf = {
      longTasks: prior?.longTasks ?? [],
      layoutReads: 0,
      moveSamples: prior?.moveSamples ?? [],
      hoverSamples: prior?.hoverSamples ?? [],
      started: prior?.started ?? performance.now(),
      _patched: prior?._patched ?? false,
      _po: prior?._po,
      _counting: false,
    };

    if (!w.__mpRenderPerf._po) {
      try {
        const po = new PerformanceObserver((list) => {
          for (const e of list.getEntries()) {
            w.__mpRenderPerf.longTasks.push({
              duration: e.duration,
              startTime: e.startTime,
            });
          }
        });
        po.observe({ type: 'longtask', buffered: true });
        w.__mpRenderPerf._po = po;
      } catch {
        /* longtask unsupported */
      }
    }

    // Patch layout getters once — re-entry must not stack wrappers.
    if (w.__mpRenderPerf._patched) return;
    w.__mpRenderPerf._patched = true;

    const bump = () => {
      if (w.__mpRenderPerf._counting) w.__mpRenderPerf.layoutReads += 1;
    };
    const proto = Element.prototype;
    for (const prop of [
      'offsetWidth',
      'offsetHeight',
      'clientWidth',
      'clientHeight',
      'scrollWidth',
      'scrollHeight',
    ]) {
      const desc = Object.getOwnPropertyDescriptor(proto, prop);
      if (!desc?.get) continue;
      const original = desc.get;
      Object.defineProperty(proto, prop, {
        configurable: true,
        get: function () {
          bump();
          return original.call(this);
        },
      });
    }
    const gbr = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = function (...args) {
      bump();
      return gbr.apply(this, args);
    };
    const gcs = window.getComputedStyle;
    window.getComputedStyle = function (...args) {
      bump();
      return gcs.apply(this, args);
    };
  });
}

/** Soft condition wait + paint settle (no fixed sleep). */
async function waitForReadySoft(page, selector, timeout = 2_000) {
  await page
    .locator(selector)
    .first()
    .waitFor({ state: 'visible', timeout })
    .catch(() => {});
  await waitDoubleRaf(page);
}

export async function measureTTI(page, navigateFn) {
  const t0 = await page.evaluate(() => performance.now());
  await navigateFn();
  // Interactive: loading gone + new-game control or board chrome present
  await waitForGameReady(page, { timeoutMs: 20_000 });
  await waitDoubleRaf(page);
  const t1 = await page.evaluate(() => performance.now());
  return t1 - t0;
}

export async function measureMoveCost(page, attemptMove) {
  await page.evaluate(() => {
    const w = window;
    w.__mpRenderPerf._counting = true;
    w.__mpRenderPerf.layoutReads = 0;
    w.__mpRenderPerf._moveMark = performance.now();
    w.__mpRenderPerf._ltBefore = w.__mpRenderPerf.longTasks.length;
  });

  const ok = await attemptMove();
  await waitDoubleRaf(page);
  // Extra paint settle under CPU throttle (rAF, not fixed sleep)
  await waitDoubleRaf(page);

  const sample = await page.evaluate(() => {
    const w = window;
    w.__mpRenderPerf._counting = false;
    const durationMs = performance.now() - w.__mpRenderPerf._moveMark;
    const ltSlice = w.__mpRenderPerf.longTasks.slice(
      w.__mpRenderPerf._ltBefore
    );
    const longTasksOver50 = ltSlice.filter((e) => e.duration > 50);
    const sample = {
      durationMs,
      layoutReads: w.__mpRenderPerf.layoutReads,
      longTaskCount: ltSlice.length,
      longTasksOver50: longTasksOver50.length,
      longTaskMaxMs: ltSlice.reduce((m, e) => Math.max(m, e.duration), 0),
    };
    w.__mpRenderPerf.moveSamples.push(sample);
    return sample;
  });

  return { ok, sample };
}

/** Drive UI into a hover-relevant placing phase when possible. */
async function enterHoverPhase(page, gameId) {
  if (gameId === 'juggle') {
    // Roll → pick die → pick first shape → placing
    await page
      .locator('.juggle-roll-btn')
      .click({ force: true })
      .catch(() => {});
    await waitForReadySoft(page, '.juggle-die.selectable');
    await page
      .locator('.juggle-die.selectable')
      .first()
      .click({ force: true })
      .catch(() => {});
    await waitForReadySoft(page, '.juggle-shape-option:not(.disabled)');
    await page
      .locator('.juggle-shape-option')
      .first()
      .click({ force: true })
      .catch(() => {});
    await waitForReadySoft(page, '.juggle-cell[style*="pointer"]');
  } else if (gameId === 'pent-em-in') {
    await page
      .locator('.pent-piece-option')
      .first()
      .click({ force: true })
      .catch(() => {});
    await waitForReadySoft(
      page,
      '.pent-piece-option.selected, .pent-board .interaction rect[data-row]'
    );
  }
}

export async function measureHoverCosts(page, gameId) {
  if (!HOVER_GAMES.has(gameId)) return [];

  await enterHoverPhase(page, gameId);

  const samples = [];
  for (let i = 0; i < getHoverSamples(); i++) {
    const sample = await page.evaluate(async (idx) => {
      const w = window;
      const cells = Array.from(
        document.querySelectorAll(
          '.juggle-cell[style*="pointer"], .pent-board .interaction rect[data-row]'
        )
      );
      if (cells.length === 0) return null;
      const el = cells[idx % cells.length];
      w.__mpRenderPerf._counting = true;
      w.__mpRenderPerf.layoutReads = 0;
      w.__mpRenderPerf._ltBefore = w.__mpRenderPerf.longTasks.length;
      const t0 = performance.now();
      el.dispatchEvent(
        new MouseEvent('mouseenter', {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );
      await new Promise((r) =>
        requestAnimationFrame(() =>
          requestAnimationFrame(() => requestAnimationFrame(r))
        )
      );
      const durationMs = performance.now() - t0;
      w.__mpRenderPerf._counting = false;
      const ltSlice = w.__mpRenderPerf.longTasks.slice(
        w.__mpRenderPerf._ltBefore
      );
      const out = {
        durationMs,
        layoutReads: w.__mpRenderPerf.layoutReads,
        longTasksOver50: ltSlice.filter((e) => e.duration > 50).length,
        longTaskMaxMs: ltSlice.reduce((m, e) => Math.max(m, e.duration), 0),
      };
      w.__mpRenderPerf.hoverSamples.push(out);
      el.dispatchEvent(
        new MouseEvent('mouseleave', {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );
      await new Promise((r) => requestAnimationFrame(r));
      return out;
    }, i);
    if (sample) samples.push(sample);
  }
  return samples;
}

function pct(sorted, p) {
  if (!sorted.length) return null;
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))];
}

function summarizeSamples(samples) {
  if (!samples.length) {
    return {
      count: 0,
      p50Ms: null,
      p95Ms: null,
      maxMs: null,
      meanMs: null,
      layoutReadsP95: null,
      longTasksOver50: 0,
      longTaskMaxMs: 0,
    };
  }
  const durations = samples.map((s) => s.durationMs).sort((a, b) => a - b);
  const layouts = samples.map((s) => s.layoutReads).sort((a, b) => a - b);
  return {
    count: samples.length,
    p50Ms: pct(durations, 0.5),
    p95Ms: pct(durations, 0.95),
    maxMs: durations[durations.length - 1],
    meanMs: durations.reduce((a, b) => a + b, 0) / durations.length,
    layoutReadsP95: pct(layouts, 0.95),
    longTasksOver50: samples.reduce((n, s) => n + (s.longTasksOver50 || 0), 0),
    longTaskMaxMs: samples.reduce(
      (m, s) => Math.max(m, s.longTaskMaxMs || 0),
      0
    ),
  };
}

export async function readRenderSummary(page) {
  return page.evaluate(() => {
    const w = window;
    const lt = w.__mpRenderPerf?.longTasks ?? [];
    const over50 = lt.filter((e) => e.duration > 50);
    return {
      longTaskTotal: lt.length,
      longTasksOver50: over50.length,
      longTaskMaxMs: lt.reduce((m, e) => Math.max(m, e.duration), 0),
      longTaskSumOver50Ms: over50.reduce((s, e) => s + e.duration, 0),
      moveSamples: w.__mpRenderPerf?.moveSamples ?? [],
      hoverSamples: w.__mpRenderPerf?.hoverSamples ?? [],
    };
  });
}

export function finalizeGameResult(raw) {
  const move = summarizeSamples(raw.moveSamples || []);
  const hover = summarizeSamples(raw.hoverSamples || []);
  // Drop raw sample arrays from committed reports (keep summaries only).
  const { moveSamples: _m, hoverSamples: _h, ...rest } = raw;
  return {
    ...rest,
    move,
    hover,
  };
}

function fmt(n, digits = 1) {
  if (n == null || Number.isNaN(n)) return '—';
  return typeof n === 'number' ? n.toFixed(digits) : String(n);
}

export async function writeRenderReport(root, results, meta) {
  const { md, json } = renderReportPaths(root);
  await mkdir(dirname(md), { recursive: true });

  // Merge before/after if prior phase exists
  let prior = null;
  try {
    const existing = JSON.parse(await readFile(json, 'utf8'));
    prior = existing;
  } catch {
    prior = null;
  }

  const phase = meta.phase || 'baseline';
  const payload = {
    meta,
    results,
    phases: {
      ...(prior?.phases || {}),
      [phase]: { meta, results },
    },
  };

  // Prefer keeping both before and after in one doc when available
  const before =
    payload.phases.before?.results ||
    (phase === 'before' ? results : null) ||
    prior?.phases?.before?.results ||
    null;
  const after =
    payload.phases.after?.results ||
    (phase === 'after' ? results : null) ||
    prior?.phases?.after?.results ||
    null;

  // Merge: prefer after per gameId, fall back to before so a focus re-run
  // does not drop the full per-game table.
  function mergeByGame(primary, secondary) {
    const map = new Map();
    for (const r of secondary || []) map.set(r.gameId, r);
    for (const r of primary || []) map.set(r.gameId, r);
    const order = (secondary || primary || []).map((r) => r.gameId);
    const seen = new Set();
    const out = [];
    for (const id of order) {
      if (seen.has(id)) continue;
      seen.add(id);
      const row = map.get(id);
      if (row) out.push(row);
    }
    for (const [id, row] of map) {
      if (!seen.has(id)) out.push(row);
    }
    return out;
  }
  const baseline = mergeByGame(after, before).length
    ? mergeByGame(after, before)
    : results;

  const lines = [];
  lines.push('# Render / input latency — 2026-10');
  lines.push('');
  lines.push(`Task: \`burn-1007-mp-render-perf\``);
  lines.push('');
  lines.push('## Method');
  lines.push('');
  lines.push(
    `- Harness: \`npm run perf:runtime\` with \`PERF_MODE=render\` (\`scripts/runtime-perf.mjs\` + \`scripts/render-perf-mode.mjs\`).`
  );
  lines.push(
    `- Viewport: tablet **${TABLET_VIEWPORT.width}×${TABLET_VIEWPORT.height}** (touch).`
  );
  lines.push(
    `- CPU throttle: **${getCpuThrottle()}×** via CDP \`Emulation.setCPUThrottlingRate\`.`
  );
  lines.push(
    `- Per game: human-vs-human, up to **${meta.moveTarget}** scripted moves; double-` +
      '`rAF` after each click for paint cost.'
  );
  lines.push(
    '- Metrics: time-to-interactive (nav → board ready), per-move paint ms, hover preview ms (juggle / pent-em-in), `longtask` >50ms, layout-forcing DOM reads (`offset*` / `getBoundingClientRect` / `getComputedStyle`) during instrumented windows.'
  );
  lines.push(
    '- Scope: RENDER/INPUT only — AI search/scoring/timing untouched. Not a redo of #489 / #463 / #501.'
  );
  lines.push('');

  lines.push('## Per-game table');
  lines.push('');
  lines.push(
    '| Game | 3D | TTI (ms) | Moves | Move p50/p95 (ms) | Hover p50/p95 (ms) | LT >50 | Max LT (ms) | Layout reads p95 |'
  );
  lines.push('|---|---|---:|---:|---:|---:|---:|---:|---:|');

  for (const r of baseline) {
    const move = r.move || {};
    const hover = r.hover || {};
    lines.push(
      `| ${r.gameId} | ${r.board3d ? 'yes' : 'no'} | ${fmt(r.ttiMs)} | ${r.movesLanded}/${meta.moveTarget} | ${fmt(move.p50Ms)}/${fmt(move.p95Ms)} | ${fmt(hover.p50Ms)}/${fmt(hover.p95Ms)} | ${r.longTasksOver50 ?? '—'} | ${fmt(r.longTaskMaxMs)} | ${fmt(move.layoutReadsP95, 0)} |${r.error ? ` ERROR: ${r.error}` : ''}`
    );
  }

  lines.push('');

  if (before && after) {
    lines.push('## Before / after (fixed games)');
    lines.push('');
    lines.push(
      'Clear non-AI hotspots only (hover full-rebuilds, repeated DOM queries, unbatched board wipes). No visible UI change intended.'
    );
    lines.push('');

    const fixedIds = new Set(
      (meta.fixedGames || []).length
        ? meta.fixedGames
        : after
            .filter((a) => {
              const b = before.find((x) => x.gameId === a.gameId);
              if (!b) return false;
              const moveImprove =
                (b.move?.p95Ms ?? 0) > 0 &&
                (a.move?.p95Ms ?? Infinity) < (b.move?.p95Ms ?? 0) * 0.95;
              const hoverImprove =
                (b.hover?.p95Ms ?? 0) > 0 &&
                (a.hover?.p95Ms ?? Infinity) < (b.hover?.p95Ms ?? 0) * 0.95;
              return moveImprove || hoverImprove;
            })
            .map((a) => a.gameId)
    );

    for (const gameId of [...fixedIds].sort()) {
      const b = before.find((x) => x.gameId === gameId);
      const a = after.find((x) => x.gameId === gameId);
      if (!b || !a) continue;
      lines.push(`### ${gameId}`);
      lines.push('');
      lines.push('| Metric | Before | After | Δ |');
      lines.push('|---|---:|---:|---:|');
      const rows = [
        ['TTI (ms)', b.ttiMs, a.ttiMs],
        ['Move p50 (ms)', b.move?.p50Ms, a.move?.p50Ms],
        ['Move p95 (ms)', b.move?.p95Ms, a.move?.p95Ms],
        ['Hover p50 (ms)', b.hover?.p50Ms, a.hover?.p50Ms],
        ['Hover p95 (ms)', b.hover?.p95Ms, a.hover?.p95Ms],
        ['LT >50 count', b.longTasksOver50, a.longTasksOver50],
        ['Max LT (ms)', b.longTaskMaxMs, a.longTaskMaxMs],
        [
          'Move layout-reads p95',
          b.move?.layoutReadsP95,
          a.move?.layoutReadsP95,
        ],
      ];
      for (const [label, bv, av] of rows) {
        if (bv == null && av == null) continue;
        const delta =
          bv != null &&
          av != null &&
          typeof bv === 'number' &&
          typeof av === 'number'
            ? av - bv
            : null;
        const deltaStr =
          delta == null
            ? '—'
            : `${delta > 0 ? '+' : ''}${fmt(delta)}${label.includes('ms') || label.includes('LT') ? '' : ''}`;
        lines.push(`| ${label} | ${fmt(bv)} | ${fmt(av)} | ${deltaStr} |`);
      }
      lines.push('');
    }
  }

  lines.push('## Fixes shipped with this report');
  lines.push('');
  if ((meta.fixedGames || []).length) {
    for (const note of meta.fixNotes || []) {
      lines.push(`- ${note}`);
    }
  } else {
    lines.push(
      '- Baseline phase only (or no fix notes provided). Re-run with `PERF_PHASE=after` after code changes.'
    );
  }
  lines.push('');
  lines.push('## How to re-run');
  lines.push('');
  lines.push('```bash');
  lines.push('PERF_MODE=render PERF_PHASE=before npm run perf:runtime');
  lines.push('PERF_MODE=render PERF_PHASE=after npm run perf:runtime');
  lines.push('# optional: PERF_GAMES=juggle,pent-em-in,hex PERF_MOVES=20');
  lines.push('```');
  lines.push('');
  lines.push(`Generated: ${meta.generatedAt} (phase=${phase})`);
  lines.push('');

  await writeFile(json, JSON.stringify(payload, null, 2), 'utf8');
  await writeFile(md, lines.join('\n'), 'utf8');
  return { md, json };
}

/**
 * CLI entry when this file is executed directly (q-mp-919).
 * Import-as-library path is unchanged (no side effects on import).
 *
 * @param {string[]} [argv]
 */
export function main(argv = process.argv.slice(2)) {
  const parsed = parseHelpOnlyArgv(argv);
  if (parsed.kind === 'error') {
    console.error(`Unknown flag: ${parsed.flag}`);
    console.error(RENDER_PERF_MODE_USAGE);
    process.exit(2);
  }
  // --help / -h, bare main, or stray positionals: usage only (not runnable).
  console.log(RENDER_PERF_MODE_USAGE);
  process.exit(0);
}

const isMain =
  Boolean(process.argv[1]) &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isMain) {
  main();
}
