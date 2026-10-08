/**
 * RENDER/INPUT latency probe (extends runtime-perf harness patterns).
 *
 * Used when PERF_MODE=render is set on `npm run perf:runtime`.
 * Measures TTI, per-move paint cost, hover preview cost (when applicable),
 * long tasks >50ms, and layout-forcing DOM reads under CPU 4× + tablet viewport.
 *
 * Does not replace the leak/remount report in docs/runtime-perf-*.md.
 */

import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

export const TABLET_VIEWPORT = { width: 768, height: 1024 };
export const CPU_THROTTLE = Number(process.env.PERF_CPU_THROTTLE || 4);
export const HOVER_SAMPLES = Number(process.env.PERF_HOVER_SAMPLES || 12);
export const MOVE_TARGET_RENDER = Number(process.env.PERF_MOVES || 20);

const HOVER_GAMES = new Set(['juggle', 'pent-em-in']);

export function renderReportPaths(root) {
  return {
    md: resolve(root, 'docs/dev/render-perf-2026-10.md'),
    json: resolve(root, 'docs/dev/render-perf-2026-10.json'),
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
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU_THROTTLE });
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

async function waitDoubleRaf(page) {
  await page.evaluate(
    () =>
      new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      })
  );
}

export async function measureTTI(page, navigateFn) {
  const t0 = await page.evaluate(() => performance.now());
  await navigateFn();
  // Interactive: loading gone + new-game control or board chrome present
  await page
    .locator('[data-testid="game-loading"]')
    .waitFor({ state: 'hidden', timeout: 20_000 })
    .catch(() => {});
  await page.locator('#new-game-btn, h1').first().waitFor({ timeout: 20_000 });
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
  // One more frame so layout/paint settle under throttle
  await page.waitForTimeout(16);

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
export async function enterHoverPhase(page, gameId) {
  if (gameId === 'juggle') {
    // Roll → pick die → pick first shape → placing
    await page.locator('.juggle-roll-btn').click({ force: true }).catch(() => {});
    await page.waitForTimeout(80);
    await page
      .locator('.juggle-die.selectable')
      .first()
      .click({ force: true })
      .catch(() => {});
    await page.waitForTimeout(80);
    await page
      .locator('.juggle-shape-option')
      .first()
      .click({ force: true })
      .catch(() => {});
    await page.waitForTimeout(80);
  } else if (gameId === 'pent-em-in') {
    await page
      .locator('.pent-piece-option')
      .first()
      .click({ force: true })
      .catch(() => {});
    await page.waitForTimeout(100);
  }
}

export async function measureHoverCosts(page, gameId) {
  if (!HOVER_GAMES.has(gameId)) return [];

  await enterHoverPhase(page, gameId);

  const samples = [];
  for (let i = 0; i < HOVER_SAMPLES; i++) {
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
  const {
    moveSamples: _m,
    hoverSamples: _h,
    ...rest
  } = raw;
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
  lines.push(`- CPU throttle: **${CPU_THROTTLE}×** via CDP \`Emulation.setCPUThrottlingRate\`.`);
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
  lines.push(
    '|---|---|---:|---:|---:|---:|---:|---:|---:|'
  );

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
          bv != null && av != null && typeof bv === 'number' && typeof av === 'number'
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

export { HOVER_GAMES };
