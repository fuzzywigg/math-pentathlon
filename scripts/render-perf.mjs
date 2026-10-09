#!/usr/bin/env node
/**
 * Render / input latency harness (Playwright + CDP + Performance API).
 *
 * Profiles in-game RENDER and INPUT (not AI) for every board:
 *  - time-to-interactive (shell ready → human-vs-human start → board usable)
 *  - per-move render cost (click → next paint / long-task window)
 *  - long tasks > 50ms during play
 *  - layout-forcing reads (getBoundingClientRect / offset* / client* / scroll*)
 *
 * Runs with CPU throttling 4× and a tablet viewport (768×1024).
 * Report-only — never fails on thresholds.
 *
 * Usage:
 *   npm run perf:render
 *   PERF_PHASE=before|after npm run perf:render
 *   PERF_GAMES=hex,juggle PERF_MOVES=20 npm run perf:render
 */

import { chromium } from '@playwright/test';
import { createServer } from 'vite';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PHASE = process.env.PERF_PHASE || 'snapshot';
const OUT_DIR = resolve(ROOT, 'docs/dev');
const REPORT_MD = resolve(OUT_DIR, 'render-perf-2026-10.md');
const REPORT_JSON = resolve(OUT_DIR, `render-perf-2026-10-${PHASE}.json`);

const MOVE_TARGET = Number(process.env.PERF_MOVES || 20);
const TABLET = { width: 768, height: 1024 };
const CPU_RATE = Number(process.env.PERF_CPU_RATE || 4);

const BOARD3D_GAMES = new Set([
  'kings-quadraphages',
  'star-track',
  'hex-a-gone',
  'fiar',
  'queens-guards',
  'kwatro-sinko',
  'prime-gold',
  'pent-em-in',
]);

const ALL_GAMES = [
  'kings-quadraphages',
  'hex',
  'star-track',
  'hex-a-gone',
  'calla',
  'sum-dominoes',
  'par-55',
  'ramrod',
  'kwatro-sinko',
  'fiar',
  'juggle',
  'contig-60',
  'stars-bars',
  'fab-a-diffy',
  'queens-guards',
  'prime-gold',
  'remainder-islands',
  'pent-em-in',
  'frac-fact',
  'fraction-pinball',
];

const filter = (process.env.PERF_GAMES || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const GAMES = filter.length
  ? ALL_GAMES.filter((g) => filter.includes(g))
  : ALL_GAMES;

async function dismissOwl(page) {
  await page.evaluate(() => {
    const el = document.getElementById('ollie-owl');
    if (el) el.style.pointerEvents = 'none';
  });
}

async function waitReady(page) {
  await page
    .locator('[data-testid="game-loading"]')
    .waitFor({ state: 'hidden', timeout: 20_000 })
    .catch(() => {});
  await page.locator('#new-game-btn, h1').first().waitFor({ timeout: 20_000 });
}

async function gotoGame(page, baseURL, gameId, board3d) {
  const q = board3d ? '?board3d=1' : '';
  await page.goto(`${baseURL}/${q}#/game/${gameId}`, {
    waitUntil: 'domcontentloaded',
  });
  await waitReady(page);
  await dismissOwl(page);
}

async function startHuman(page) {
  await dismissOwl(page);
  const modal = page.locator('#new-game-modal');
  if (await modal.isVisible().catch(() => false)) {
    const human = page.locator('.mode-option[data-mode="human-vs-human"]');
    if (await human.isVisible().catch(() => false)) await human.click();
    await page.locator('#start-game-btn').click();
    await modal.waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => {});
  }
  await dismissOwl(page);
}

/** Attempt one scripted legal action for the active seat. */
async function attemptScriptedMove(page, gameId) {
  const clickFirst = async (sel) => {
    const loc = page.locator(sel).first();
    if ((await loc.count()) === 0) return false;
    if (!(await loc.isVisible().catch(() => false))) return false;
    await loc.click({ force: true }).catch(() => {});
    return true;
  };

  switch (gameId) {
    case 'kings-quadraphages': {
      const valid = page.locator(
        '.cell.valid, .cell[aria-label*="valid"], .cell-king'
      );
      if ((await valid.count()) > 0) {
        await valid
          .nth(Math.floor(Math.random() * Math.min(3, await valid.count())))
          .click({ force: true });
        return true;
      }
      return clickFirst('.cell:not(.cell-blocked)');
    }
    case 'hex': {
      // Prefer empty cell groups (polygon .hex-cell matches first in DOM order
      // and can re-click an already-filled hex without advancing state).
      return clickFirst(
        '.hex-cell-group:not(.occupied)[style*="pointer"], .hex-cell-group:not(.occupied)'
      );
    }
    case 'star-track': {
      if (await clickFirst('.star-track-draw-btn')) {
        await page.waitForTimeout(200);
        return clickFirst('.star-track-chain-btn');
      }
      return clickFirst('.star-track-chain-btn');
    }
    case 'hex-a-gone': {
      await clickFirst('.hex-a-gone-block-btn:not(.empty)');
      await clickFirst('.hex-a-gone-confirm-btn');
      return clickFirst(
        '.hex-a-gone-board [data-q], .hex-a-gone-cell, [data-mp3d-a11y] button'
      );
    }
    case 'calla':
      return (
        (await clickFirst('.calla-pit-valid')) ||
        (await clickFirst('.calla-pit'))
      );
    case 'sum-dominoes': {
      await clickFirst('.sd-roll-btn');
      if (await clickFirst('.sd-hand-domino-playable')) {
        return clickFirst('.sd-cell-valid');
      }
      return clickFirst('.sd-pass-btn');
    }
    case 'par-55': {
      if (await clickFirst('.par55-hand-block.clickable')) {
        return (
          (await clickFirst('.par55-valid-base')) ||
          (await clickFirst('.par55-cell.valid'))
        );
      }
      return false;
    }
    case 'ramrod': {
      const rod = page.locator('.ramrod-rod-wrapper.selectable').first();
      if ((await rod.count()) > 0) {
        await rod.evaluate((el) => el.click());
        return clickFirst('.ramrod-slot.valid');
      }
      return false;
    }
    case 'kwatro-sinko': {
      if (await clickFirst('.kwa-selectable-chip')) {
        return clickFirst('.kwa-valid-node');
      }
      return false;
    }
    case 'fiar':
      return clickFirst(
        '[data-node-id]:has(.pulse-highlight), .fiar-board-container [data-node-id], [data-mp3d-a11y] button'
      );
    case 'juggle': {
      await clickFirst('.juggle-roll-btn');
      await clickFirst('.juggle-die.selectable');
      await clickFirst('.juggle-shape-option');
      const cell = page.locator('.juggle-cell').first();
      if ((await cell.count()) > 0) {
        await cell.evaluate((el) => el.click());
        return true;
      }
      return false;
    }
    case 'contig-60': {
      await clickFirst('.contig-roll-btn');
      if (await clickFirst('.contig-cell-valid')) return true;
      return clickFirst('.contig-pass-btn');
    }
    case 'stars-bars': {
      if (await clickFirst('.stars-card:not(.disabled)')) {
        return clickFirst('.stars-cell.valid');
      }
      return false;
    }
    case 'fab-a-diffy': {
      if (await clickFirst('.fab-bar-wrapper:not(.fab-bar-disabled)')) {
        return clickFirst('.fab-op-valid, .fab-op-btn:not(.fab-op-disabled)');
      }
      return false;
    }
    case 'queens-guards': {
      const pieces = page.locator(
        '[data-cell-key][aria-label*="Queen"], [data-cell-key][aria-label*="Guard"], [data-cell-key]'
      );
      if ((await pieces.count()) > 0) {
        await pieces.first().click({ force: true });
        return clickFirst(
          '[data-cell-key][aria-label*="valid"], [data-mp3d-a11y] button'
        );
      }
      return false;
    }
    case 'prime-gold': {
      await clickFirst('.pg-roll-btn, .prime-roll-btn');
      if (await clickFirst('.pg-cell.valid, .prime-cell.valid')) return true;
      return clickFirst(
        '.pg-btn-secondary, .pg-pass-btn, button:has-text("Pass")'
      );
    }
    case 'remainder-islands': {
      await clickFirst('.remainder-btn-roll, button:has-text("Roll")');
      const island = page.locator('.island.valid').first();
      if ((await island.count()) > 0) {
        await island.evaluate((el) => {
          const hit = el.querySelector('polygon:last-of-type') ?? el;
          hit.dispatchEvent(
            new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window,
            })
          );
        });
        return true;
      }
      return false;
    }
    case 'pent-em-in': {
      await clickFirst('.pent-piece-option');
      return clickFirst(
        '.pent-board .interaction rect, .pent-board rect[data-row], [data-mp3d-a11y] button'
      );
    }
    case 'frac-fact': {
      if (await clickFirst('.frac-choice-btn')) {
        await page.waitForTimeout(100);
        await clickFirst('.frac-continue-btn, button:has-text("Continue")');
        return true;
      }
      return false;
    }
    case 'fraction-pinball': {
      if (await clickFirst('.pinball-choice-btn')) {
        await page.waitForTimeout(100);
        await clickFirst('.pinball-continue-btn, button:has-text("Continue")');
        return true;
      }
      return false;
    }
    default:
      return false;
  }
}

async function installRenderObservers(page) {
  await page.evaluate(() => {
    const w = window;
    w.__mpRenderPerf = {
      longTasks: [],
      layoutReads: 0,
      moveCosts: [],
      started: performance.now(),
    };

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

    // Count layout-forcing geometric reads (layout thrash signal).
    const bump = () => {
      w.__mpRenderPerf.layoutReads += 1;
    };
    const proto = Element.prototype;
    for (const key of ['getBoundingClientRect', 'getClientRects']) {
      const orig = proto[key];
      if (typeof orig !== 'function') continue;
      proto[key] = function (...args) {
        bump();
        return orig.apply(this, args);
      };
    }
    for (const key of [
      'offsetWidth',
      'offsetHeight',
      'clientWidth',
      'clientHeight',
      'scrollWidth',
      'scrollHeight',
    ]) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (!desc?.get) continue;
      Object.defineProperty(proto, key, {
        configurable: true,
        enumerable: desc.enumerable,
        get() {
          bump();
          return desc.get.call(this);
        },
      });
    }
  });
}

async function beginMoveMeasure(page) {
  await page.evaluate(() => {
    const w = window;
    w.__mpRenderPerf._moveStart = performance.now();
    w.__mpRenderPerf._ltBefore = w.__mpRenderPerf.longTasks.length;
    w.__mpRenderPerf._layoutBefore = w.__mpRenderPerf.layoutReads;
  });
}

async function endMoveMeasure(page) {
  return page.evaluate(async () => {
    const w = window;
    const start = w.__mpRenderPerf._moveStart ?? performance.now();
    // Wait for next paint so render work lands in the window.
    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(r))
    );
    const end = performance.now();
    const cost = end - start;
    const ltSlice = w.__mpRenderPerf.longTasks.slice(
      w.__mpRenderPerf._ltBefore ?? 0
    );
    const layoutDelta =
      w.__mpRenderPerf.layoutReads - (w.__mpRenderPerf._layoutBefore ?? 0);
    const sample = {
      costMs: cost,
      longTasks: ltSlice.length,
      longTaskMaxMs: ltSlice.reduce((m, e) => Math.max(m, e.duration), 0),
      layoutReads: layoutDelta,
    };
    w.__mpRenderPerf.moveCosts.push(sample);
    return sample;
  });
}

async function readAggregate(page) {
  return page.evaluate(() => {
    const w = window;
    const moves = w.__mpRenderPerf?.moveCosts ?? [];
    const costs = moves.map((m) => m.costMs).sort((a, b) => a - b);
    const pct = (arr, p) =>
      arr.length
        ? arr[Math.min(arr.length - 1, Math.floor(arr.length * p))]
        : null;
    const lt = w.__mpRenderPerf?.longTasks ?? [];
    const ltOver50 = lt.filter((e) => e.duration > 50);
    return {
      moveCount: moves.length,
      moveP50Ms: pct(costs, 0.5),
      moveP95Ms: pct(costs, 0.95),
      moveMaxMs: costs.length ? costs[costs.length - 1] : null,
      moveMeanMs: costs.length
        ? costs.reduce((s, v) => s + v, 0) / costs.length
        : null,
      longTaskCount: lt.length,
      longTaskOver50Count: ltOver50.length,
      longTaskMaxMs: lt.reduce((m, e) => Math.max(m, e.duration), 0),
      layoutReadsTotal: w.__mpRenderPerf?.layoutReads ?? 0,
      layoutReadsPerMove:
        moves.length > 0
          ? moves.reduce((s, m) => s + m.layoutReads, 0) / moves.length
          : 0,
    };
  });
}

async function ensurePlacePhaseForHover(page, gameId) {
  if (gameId === 'juggle') {
    for (let i = 0; i < 8; i++) {
      const placing = await page
        .locator('.juggle-cell-valid, .juggle-cell.preview-valid')
        .count();
      if (placing > 0) return true;
      await attemptScriptedMove(page, gameId);
      await page.waitForTimeout(100);
    }
  }
  if (gameId === 'pent-em-in') {
    for (let i = 0; i < 8; i++) {
      const placing = await page
        .locator('.pent-cell-valid, .pent-board g.preview')
        .count();
      if (placing > 0) return true;
      // Prefer selecting a piece if present
      await page
        .locator('.pent-piece-option')
        .first()
        .click({ force: true })
        .catch(() => {});
      await page.waitForTimeout(100);
      const hasInteract = await page
        .locator('.pent-board .interaction rect')
        .count();
      if (hasInteract > 0) return true;
      await attemptScriptedMove(page, gameId);
      await page.waitForTimeout(100);
    }
  }
  return false;
}

/**
 * Burst-click the same board N times and measure pure handler→paint cost.
 * Amplifies DOM rebuild vs sync differences beyond single-move Playwright noise.
 */
async function measureDomBurst(page, gameId) {
  const selectors = {
    hex: '.hex-cell-group:not(.occupied)',
    juggle: '.juggle-board.active .juggle-cell:not([class*="occupied"])',
    'remainder-islands': '.island.valid',
    'pent-em-in': '.pent-board .interaction rect',
    'kings-quadraphages': '.cell.valid, .cell:not(.cell-blocked)',
  };
  const sel = selectors[gameId];
  if (!sel) return null;

  return page.evaluate(async (selector) => {
    const nodes = Array.from(document.querySelectorAll(selector)).slice(0, 10);
    if (nodes.length === 0) return null;
    const w = window;
    const before = { ...(w.__mpRenderStats || {}) };
    const t0 = performance.now();
    for (let i = 0; i < 20; i++) {
      const el = nodes[i % nodes.length];
      el.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );
      el.dispatchEvent(
        new MouseEvent('mouseenter', {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );
    }
    const syncMs = performance.now() - t0;
    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(r))
    );
    const totalMs = performance.now() - t0;
    const after = { ...(w.__mpRenderStats || {}) };
    const deltaStats = {};
    for (const k of new Set([...Object.keys(before), ...Object.keys(after)])) {
      deltaStats[k] = (after[k] || 0) - (before[k] || 0);
    }
    return {
      burstEvents: 40,
      burstSyncMs: syncMs,
      burstTotalMs: totalMs,
      deltaStats,
    };
  }, sel);
}

async function measureHoverCost(page, gameId) {
  // Hover thrash probe for placement games.
  if (gameId !== 'juggle' && gameId !== 'pent-em-in') return null;

  await ensurePlacePhaseForHover(page, gameId);

  return page.evaluate(async (id) => {
    const w = window;
    const cells =
      id === 'juggle'
        ? Array.from(
            document.querySelectorAll(
              '.juggle-board.active .juggle-cell:not([class*="occupied"])'
            )
          ).slice(0, 16)
        : Array.from(
            document.querySelectorAll('.pent-board .interaction rect')
          ).slice(0, 16);
    if (cells.length < 2) return null;

    const beforeLt = w.__mpRenderPerf.longTasks.length;
    const beforeLayout = w.__mpRenderPerf.layoutReads;
    const t0 = performance.now();
    // Fire hover bursts synchronously so rebuild cost is not hidden by rAF waits.
    for (const cell of cells) {
      cell.dispatchEvent(
        new MouseEvent('mouseenter', {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );
    }
    const syncMs = performance.now() - t0;
    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(r))
    );
    const t1 = performance.now();
    const lt = w.__mpRenderPerf.longTasks.slice(beforeLt);
    return {
      hoverSamples: cells.length,
      hoverSyncTotalMs: syncMs,
      hoverSyncMeanMs: syncMs / cells.length,
      hoverTotalMs: t1 - t0,
      hoverMeanMs: syncMs / cells.length,
      hoverLongTasks: lt.length,
      hoverLongTaskMaxMs: lt.reduce((m, e) => Math.max(m, e.duration), 0),
      hoverLayoutReads: w.__mpRenderPerf.layoutReads - beforeLayout,
    };
  }, gameId);
}

async function measureGame(browser, baseURL, gameId) {
  // Prefer 2D path for render/DOM profiling (3D paint is a different path).
  const board3d = false;
  const context = await browser.newContext({
    baseURL,
    viewport: TABLET,
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU_RATE });
  await cdp.send('Performance.enable').catch(() => {});

  const result = {
    gameId,
    board3d,
    viewport: TABLET,
    cpuRate: CPU_RATE,
    ttiMs: null,
    movesLanded: 0,
    movesAttempted: 0,
    play: null,
    hover: null,
    error: null,
  };

  try {
    const navStart = Date.now();
    await gotoGame(page, baseURL, gameId, board3d);
    await installRenderObservers(page);
    await startHuman(page);

    // TTI: board interactive after human start (first actionable control / cell).
    const interactiveSel = [
      '.hex-cell-group',
      '.juggle-cell',
      '.juggle-roll-btn',
      '.pent-board',
      '.pent-piece-option',
      '.remainder-btn-roll',
      '.remainder-board',
      '.cell',
      '.sd-cell',
      '.calla-pit',
      '.fiar-board-container',
      '[data-cell-key]',
      '.stars-cell',
      '.contig-cell',
      '.pg-cell',
      '.prime-cell',
      '.fab-bar-wrapper',
      '.ramrod-rod-wrapper',
      '.par55-cell',
      '.kwa-chip',
      '.frac-choice-btn',
      '.pinball-choice-btn',
      '.star-track-draw-btn',
      '.hex-a-gone-board',
      '#new-game-btn',
    ].join(', ');
    await page.locator(interactiveSel).first().waitFor({ timeout: 15_000 });
    result.ttiMs = Date.now() - navStart;

    let landed = 0;
    let attempts = 0;
    const maxAttempts = MOVE_TARGET * 4;
    while (landed < MOVE_TARGET && attempts < maxAttempts) {
      attempts++;
      const before = await page.evaluate(() => document.body.innerHTML.length);
      await beginMoveMeasure(page);
      const ok = await attemptScriptedMove(page, gameId);
      await endMoveMeasure(page);
      await page.waitForTimeout(80);
      const after = await page.evaluate(() => document.body.innerHTML.length);
      if (ok || before !== after) {
        landed++;
      }
      const over = await page
        .locator('.game-over, .status-winner, text=/wins|draw|game over/i')
        .first()
        .isVisible()
        .catch(() => false);
      if (over && landed < MOVE_TARGET) {
        await page
          .locator('#new-game-btn')
          .click()
          .catch(() => {});
        await startHuman(page);
      }
    }
    result.movesAttempted = attempts;
    result.movesLanded = landed;
    result.play = await readAggregate(page);
    result.hover = await measureHoverCost(page, gameId);
    result.renderStats = await page
      .evaluate(() => window.__mpRenderStats ?? null)
      .catch(() => null);
    result.domBurst = await measureDomBurst(page, gameId);
  } catch (err) {
    result.error = err instanceof Error ? err.message : String(err);
  } finally {
    await context.close().catch(() => {});
  }

  return result;
}

function fmt(n, digits = 1) {
  if (n == null || Number.isNaN(n)) return '—';
  return Number(n).toFixed(digits);
}

async function loadPhaseJson(phase) {
  const path = resolve(OUT_DIR, `render-perf-2026-10-${phase}.json`);
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch {
    return null;
  }
}

async function writeCombinedMarkdown(currentMeta, currentResults) {
  const beforeDoc = await loadPhaseJson('before').catch(() => null);
  const afterDoc = await loadPhaseJson('after').catch(() => null);

  // Prefer disk before/after; fall back to current phase as the only column.
  const beforeMap = new Map(
    (beforeDoc?.results || []).map((r) => [r.gameId, r])
  );
  const afterMap = new Map((afterDoc?.results || []).map((r) => [r.gameId, r]));
  if (PHASE === 'before') {
    for (const r of currentResults) beforeMap.set(r.gameId, r);
  } else if (PHASE === 'after') {
    for (const r of currentResults) afterMap.set(r.gameId, r);
  }

  const games = ALL_GAMES.filter(
    (g) =>
      beforeMap.has(g) ||
      afterMap.has(g) ||
      currentResults.some((r) => r.gameId === g)
  );

  const lines = [];
  lines.push('# Render / input latency — 2026-10');
  lines.push('');
  lines.push(`Task id: \`burn-1007-mp-render-perf\``);
  lines.push('');
  lines.push('## Method');
  lines.push('');
  lines.push(
    `- Harness: \`scripts/render-perf.mjs\` (\`npm run perf:render\`) — Playwright + CDP + Performance API`
  );
  lines.push(
    `- Viewport: **${TABLET.width}×${TABLET.height}** (tablet), deviceScaleFactor 2`
  );
  lines.push(
    `- CPU throttle: **${CPU_RATE}×** via CDP \`Emulation.setCPUThrottlingRate\``
  );
  lines.push(
    `- Per game: human-vs-human, up to **${MOVE_TARGET}** scripted UI actions; **2D board path** (\`board3d\` off) so DOM render/input dominates`
  );
  lines.push(
    '- Metrics: time-to-interactive (nav → first board control), per-move cost (click → double-rAF), long tasks >50ms, layout-forcing Element geometry reads'
  );
  lines.push(
    '- Hover probe (juggle, pent-em-in): 12 synthetic `mouseenter` events during place phase when cells exist'
  );
  lines.push(
    '- Deliberately left alone: AI search/scoring/timing, #489 menu first-load, #463 runtime harness shape, #501 leak cleanup, Stars & Bars history cap, Hex Hard 450ms assert, visual baselines, gzip budgets'
  );
  lines.push('');
  lines.push('## Per-game table');
  lines.push('');

  if (beforeMap.size && afterMap.size) {
    lines.push(
      '| Game | TTI before (ms) | TTI after (ms) | Move p50 before | Move p50 after | Move p95 before | Move p95 after | LT>50 before | LT>50 after | Layout reads/move before | Layout reads/move after | Hover mean before (ms) | Hover mean after (ms) |'
    );
    lines.push(
      '|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|'
    );
    for (const g of games) {
      const b = beforeMap.get(g);
      const a = afterMap.get(g);
      lines.push(
        `| ${g} | ${fmt(b?.ttiMs, 0)} | ${fmt(a?.ttiMs, 0)} | ${fmt(b?.play?.moveP50Ms)} | ${fmt(a?.play?.moveP50Ms)} | ${fmt(b?.play?.moveP95Ms)} | ${fmt(a?.play?.moveP95Ms)} | ${b?.play?.longTaskOver50Count ?? '—'} | ${a?.play?.longTaskOver50Count ?? '—'} | ${fmt(b?.play?.layoutReadsPerMove)} | ${fmt(a?.play?.layoutReadsPerMove)} | ${fmt(b?.hover?.hoverMeanMs)} | ${fmt(a?.hover?.hoverMeanMs)} |`
      );
    }
  } else {
    const map =
      PHASE === 'after'
        ? afterMap
        : beforeMap.size
          ? beforeMap
          : new Map(currentResults.map((r) => [r.gameId, r]));
    lines.push(
      `| Game | Phase | TTI (ms) | Moves | Move p50/p95 (ms) | LT>50 | Max LT (ms) | Layout reads/move | Hover mean (ms) |`
    );
    lines.push('|---|---|---:|---:|---:|---:|---:|---:|---:|');
    for (const g of games) {
      const r = map.get(g) || currentResults.find((x) => x.gameId === g);
      if (!r) continue;
      lines.push(
        `| ${r.gameId} | ${PHASE} | ${fmt(r.ttiMs, 0)} | ${r.movesLanded}/${MOVE_TARGET} | ${fmt(r.play?.moveP50Ms)}/${fmt(r.play?.moveP95Ms)} | ${r.play?.longTaskOver50Count ?? '—'} | ${fmt(r.play?.longTaskMaxMs)} | ${fmt(r.play?.layoutReadsPerMove)} | ${fmt(r.hover?.hoverMeanMs)} |`
      );
    }
  }

  lines.push('');
  lines.push('## Fixes (non-AI render/input)');
  lines.push('');
  lines.push(
    'See the PR description / Findings section below once before+after JSON both exist. Code changes target unnecessary full-board rebuilds on hover/move, repeated DOM queries, and unbatched updates — no AI timing/search/scoring changes.'
  );
  lines.push('');
  lines.push('## How to re-run');
  lines.push('');
  lines.push('```bash');
  lines.push('PERF_PHASE=before npm run perf:render');
  lines.push('# apply fixes…');
  lines.push('PERF_PHASE=after npm run perf:render');
  lines.push('# optional subset:');
  lines.push(
    'PERF_GAMES=juggle,pent-em-in,hex,remainder-islands PERF_PHASE=after npm run perf:render'
  );
  lines.push('```');
  lines.push('');
  lines.push(`Generated: ${currentMeta.generatedAt} (phase=${PHASE})`);
  lines.push('');

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(REPORT_MD, lines.join('\n'), 'utf8');
}

async function main() {
  let baseURL = process.env.PERF_BASE_URL || '';
  let server = null;
  if (!baseURL) {
    server = await createServer({
      root: ROOT,
      server: { host: '127.0.0.1', port: 5181, strictPort: true },
      logLevel: 'error',
    });
    await server.listen();
    const addr = server.httpServer?.address();
    const port = typeof addr === 'object' && addr ? addr.port : 5181;
    baseURL = `http://127.0.0.1:${port}`;
  }

  const browser = await chromium.launch({
    headless: true,
    args: ['--enable-precise-memory-info'],
  });

  const results = [];
  console.log(
    `Render perf [${PHASE}] → ${baseURL} (${GAMES.length} games, CPU ${CPU_RATE}×, ${TABLET.width}×${TABLET.height})`
  );
  for (const gameId of GAMES) {
    process.stdout.write(`  … ${gameId} `);
    const r = await measureGame(browser, baseURL, gameId);
    results.push(r);
    console.log(
      `tti=${fmt(r.ttiMs, 0)} moveP50=${fmt(r.play?.moveP50Ms)} lt50=${r.play?.longTaskOver50Count ?? '—'}${r.error ? ' ERR' : ''}`
    );
  }

  await browser.close();
  if (server) await server.close();

  const meta = {
    generatedAt: new Date().toISOString(),
    baseURL,
    phase: PHASE,
    moveTarget: MOVE_TARGET,
    cpuRate: CPU_RATE,
    viewport: TABLET,
  };

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(
    REPORT_JSON,
    JSON.stringify({ meta, results }, null, 2),
    'utf8'
  );
  await writeCombinedMarkdown(meta, results);
  console.log(`Wrote ${REPORT_JSON}`);
  console.log(`Wrote ${REPORT_MD}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
