#!/usr/bin/env node
/**
 * Report-only runtime perf harness (Playwright + CDP).
 *
 * For each available game:
 *  - load with board3d when supported
 *  - play up to 30 scripted legal moves (both seats; human-vs-human)
 *  - sample long tasks + rAF frame times during play
 *  - navigate away and back 5×; sample JS heap after each return
 *
 * Never fails the process on perf thresholds — writes markdown + JSON only.
 *
 * Usage:
 *   npm run perf:runtime
 *   PERF_BASE_URL=http://localhost:5173 node scripts/runtime-perf.mjs
 *   PERF_GAMES=hex,fiar node scripts/runtime-perf.mjs   # optional subset
 */

import { chromium } from '@playwright/test';
import { createServer } from 'vite';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  CPU_THROTTLE,
  MOVE_TARGET_RENDER,
  finalizeGameResult,
  installRenderObservers,
  measureHoverCosts,
  measureMoveCost,
  measureTTI,
  readRenderSummary,
  setupRenderContext,
  writeRenderReport,
} from './render-perf-mode.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const RENDER_MODE = process.env.PERF_MODE === 'render';
/** Optional date stem so re-runs can avoid clobbering the Oct 7 baseline. */
const PERF_DATE = process.env.PERF_DATE || '2026-10-07';
const REPORT_MD = resolve(ROOT, `docs/runtime-perf-${PERF_DATE}.md`);
const REPORT_JSON = resolve(ROOT, `docs/runtime-perf-${PERF_DATE}.json`);

const MOVE_TARGET = RENDER_MODE
  ? MOVE_TARGET_RENDER
  : Number(process.env.PERF_MOVES || 30);
const NAV_CYCLES = Number(process.env.PERF_NAV_CYCLES || 5);
const FRAME_SAMPLE_MS = Number(process.env.PERF_FRAME_MS || 2000);
const PERF_PHASE = process.env.PERF_PHASE || 'baseline';

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
    case 'hex':
      return clickFirst(
        '.hex-cell-group:not(.occupied), .hex-cell:not(.occupied)'
      );
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

async function installObservers(page) {
  await page.evaluate(() => {
    const w = window;
    w.__mpPerf = {
      longTasks: [],
      frames: [],
      started: performance.now(),
    };
    try {
      const po = new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          w.__mpPerf.longTasks.push({
            duration: e.duration,
            startTime: e.startTime,
          });
        }
      });
      po.observe({ type: 'longtask', buffered: true });
      w.__mpPerf._po = po;
    } catch {
      /* longtask unsupported */
    }
  });
}

async function sampleFrames(page, ms) {
  return page.evaluate(async (durationMs) => {
    const w = window;
    const deltas = [];
    let last = performance.now();
    const end = last + durationMs;
    await new Promise((resolve) => {
      const tick = (t) => {
        deltas.push(t - last);
        last = t;
        if (t < end) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });
    w.__mpPerf.frames.push(...deltas);
    return deltas;
  }, ms);
}

async function readPerf(page) {
  return page.evaluate(() => {
    const w = window;
    const lt = w.__mpPerf?.longTasks ?? [];
    const frames = w.__mpPerf?.frames ?? [];
    const sorted = [...frames].sort((a, b) => a - b);
    const pct = (p) =>
      sorted.length
        ? sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))]
        : null;
    return {
      longTaskCount: lt.length,
      longTaskMaxMs: lt.reduce((m, e) => Math.max(m, e.duration), 0),
      longTaskSumMs: lt.reduce((s, e) => s + e.duration, 0),
      frameCount: frames.length,
      frameP50Ms: pct(0.5),
      frameP95Ms: pct(0.95),
      frameMaxMs: sorted.length ? sorted[sorted.length - 1] : null,
    };
  });
}

async function heapUsed(cdp) {
  try {
    await cdp.send('HeapProfiler.enable').catch(() => {});
    await cdp.send('HeapProfiler.collectGarbage').catch(() => {});
  } catch {
    /* ignore */
  }
  const { metrics } = await cdp.send('Performance.getMetrics');
  const jsHeap = metrics.find((m) => m.name === 'JSHeapUsedSize');
  return jsHeap?.value ?? null;
}

function fmtMb(bytes) {
  if (bytes == null) return 'n/a';
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function suspectLeaks(gameId, heapGrowthBytes, board3d) {
  const suspects = [];
  const growthMb = (heapGrowthBytes ?? 0) / (1024 * 1024);
  if (growthMb >= 8) {
    suspects.push(
      `JS heap grew ${growthMb.toFixed(1)} MB across ${NAV_CYCLES} navigate-away/back cycles (possible retained controllers/timers/WebGL).`
    );
  } else if (growthMb >= 3) {
    suspects.push(
      `Moderate heap growth (${growthMb.toFixed(1)} MB) after remount cycles — watch timers/listeners.`
    );
  }
  if (board3d && growthMb >= 5) {
    suspects.push(
      '3D path enabled — check three.js geometry/material/renderer.dispose and pointer/resize listeners on unmount.'
    );
  }
  if (
    [
      'prime-gold',
      'star-track',
      'hex-a-gone',
      'kings-quadraphages',
      'frac-fact',
      'fraction-pinball',
      'hex',
    ].includes(gameId)
  ) {
    suspects.push(
      'Controller cleanup audited in this PR (AI timer/generation + destroyGame wiring).'
    );
  }
  if (suspects.length === 0) {
    suspects.push('No strong leak signal from heap remount cycles.');
  }
  return suspects;
}

async function measureGameRender(browser, baseURL, gameId) {
  const board3d = BOARD3D_GAMES.has(gameId);
  const { context, page } = await setupRenderContext(browser, baseURL);

  let result = {
    gameId,
    board3d,
    ttiMs: null,
    movesAttempted: 0,
    movesLanded: 0,
    moveSamples: [],
    hoverSamples: [],
    longTasksOver50: 0,
    longTaskMaxMs: 0,
    error: null,
  };

  try {
    // Tracing for one game at a time (kept brief; discarded after metrics).
    await context.tracing
      .start({ screenshots: false, snapshots: true, sources: false })
      .catch(() => {});

    result.ttiMs = await measureTTI(page, async () => {
      await gotoGame(page, baseURL, gameId, board3d);
      await startHuman(page);
    });
    await installRenderObservers(page);

    // Warm up pointer/DOM before counted samples so first-move mouse-travel
    // outliers do not dominate layoutReadsP95 (n=20 → harness p95 ≈ max).
    for (let w = 0; w < 2; w++) {
      await attemptScriptedMove(page, gameId).catch(() => {});
      await page.waitForTimeout(80);
    }

    let landed = 0;
    let attempts = 0;
    const maxAttempts = MOVE_TARGET * 4;
    while (landed < MOVE_TARGET && attempts < maxAttempts) {
      attempts++;
      const before = await page.evaluate(() => document.body.innerHTML.length);
      const { ok, sample } = await measureMoveCost(page, () =>
        attemptScriptedMove(page, gameId)
      );
      result.moveSamples.push(sample);
      await page.waitForTimeout(80);
      const after = await page.evaluate(() => document.body.innerHTML.length);
      const thinking = await page
        .locator('.status-ai-thinking')
        .isVisible()
        .catch(() => false);
      if (ok || before !== after || thinking) {
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
        await installRenderObservers(page);
      }
    }
    result.movesAttempted = attempts;
    result.movesLanded = landed;

    // Hover preview cost (juggle / pent-em-in) — INPUT path, not AI.
    // Pent'Em In 2D SVG hover is the hotspot we fix; under board3d the
    // interaction layer is a canvas, so re-open 2D for hover samples only.
    if (gameId === 'pent-em-in' && board3d) {
      await gotoGame(page, baseURL, gameId, false);
      await startHuman(page);
      await installRenderObservers(page);
    }
    result.hoverSamples = await measureHoverCosts(page, gameId);

    const summary = await readRenderSummary(page);
    result.longTasksOver50 = summary.longTasksOver50;
    result.longTaskMaxMs = summary.longTaskMaxMs;
    // Prefer samples collected via measureMoveCost / measureHoverCosts
    if (summary.moveSamples?.length) result.moveSamples = summary.moveSamples;
    if (summary.hoverSamples?.length)
      result.hoverSamples = summary.hoverSamples;

    await context.tracing.stop({ path: undefined }).catch(() => {});
  } catch (err) {
    result.error = err instanceof Error ? err.message : String(err);
  } finally {
    await context.close().catch(() => {});
  }

  return finalizeGameResult(result);
}

async function measureGame(browser, baseURL, gameId) {
  if (RENDER_MODE) {
    return measureGameRender(browser, baseURL, gameId);
  }

  const board3d = BOARD3D_GAMES.has(gameId);
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send('Performance.enable').catch(() => {});

  const result = {
    gameId,
    board3d,
    movesAttempted: 0,
    movesLanded: 0,
    play: null,
    heapSamples: [],
    heapGrowthBytes: null,
    suspects: [],
    error: null,
  };

  try {
    await gotoGame(page, baseURL, gameId, board3d);
    await startHuman(page);
    await installObservers(page);

    // Baseline heap after first mount
    const heap0 = await heapUsed(cdp);
    result.heapSamples.push({ label: 'after-mount', bytes: heap0 });

    let landed = 0;
    let attempts = 0;
    const maxAttempts = MOVE_TARGET * 4;
    while (landed < MOVE_TARGET && attempts < maxAttempts) {
      attempts++;
      const before = await page.evaluate(() => document.body.innerHTML.length);
      const ok = await attemptScriptedMove(page, gameId);
      await page.waitForTimeout(120);
      const after = await page.evaluate(() => document.body.innerHTML.length);
      const thinking = await page
        .locator('.status-ai-thinking')
        .isVisible()
        .catch(() => false);
      if (ok || before !== after || thinking) {
        landed++;
      }
      // Restart if game over mid-session
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

    await sampleFrames(page, FRAME_SAMPLE_MS);
    result.play = await readPerf(page);

    // Navigate away / back cycles
    for (let i = 1; i <= NAV_CYCLES; i++) {
      await page.goto(`${baseURL}/#/`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(200);
      await gotoGame(page, baseURL, gameId, board3d);
      await startHuman(page);
      await page.waitForTimeout(300);
      const h = await heapUsed(cdp);
      result.heapSamples.push({ label: `remount-${i}`, bytes: h });
    }

    const first = result.heapSamples[0]?.bytes;
    const last = result.heapSamples[result.heapSamples.length - 1]?.bytes;
    result.heapGrowthBytes =
      first != null && last != null ? last - first : null;
    result.suspects = suspectLeaks(gameId, result.heapGrowthBytes, board3d);
  } catch (err) {
    result.error = err instanceof Error ? err.message : String(err);
    result.suspects = [`Measurement error: ${result.error}`];
  } finally {
    await context.close().catch(() => {});
  }

  return result;
}

function renderMarkdown(results, meta) {
  const lines = [];
  lines.push('# Runtime perf — 2026-10-07');
  lines.push('');
  lines.push(
    'Playwright + Chrome DevTools Protocol harness (`scripts/runtime-perf.mjs`). Report-only: no CI fail thresholds.'
  );
  lines.push('');
  lines.push('## Method');
  lines.push('');
  lines.push(`- Base URL: \`${meta.baseURL}\``);
  lines.push(
    `- Per game: up to **${MOVE_TARGET}** scripted legal moves (human-vs-human, both seats), then **${NAV_CYCLES}** navigate-away/back cycles.`
  );
  lines.push(
    '- Metrics: `PerformanceObserver` long tasks, rAF frame deltas (~2s sample), CDP `Performance.getMetrics` JSHeapUsedSize (with GC best-effort).'
  );
  lines.push(
    '- 3D games loaded with `?board3d=1`: ' + [...BOARD3D_GAMES].join(', ')
  );
  lines.push('');
  lines.push('## Per-game results');
  lines.push('');
  lines.push(
    '| Game | 3D | Moves | Long tasks | Max LT (ms) | Frame p50/p95 (ms) | Heap mount → last | Δ heap | Suspected leaks |'
  );
  lines.push('|---|---|---:|---:|---:|---:|---:|---:|---|');

  for (const r of results) {
    const play = r.play || {};
    const first = r.heapSamples[0]?.bytes;
    const last = r.heapSamples[r.heapSamples.length - 1]?.bytes;
    const suspects = (r.suspects || []).join(' ');
    lines.push(
      `| ${r.gameId} | ${r.board3d ? 'yes' : 'no'} | ${r.movesLanded}/${MOVE_TARGET} | ${play.longTaskCount ?? '—'} | ${play.longTaskMaxMs != null ? play.longTaskMaxMs.toFixed(1) : '—'} | ${play.frameP50Ms != null ? play.frameP50Ms.toFixed(1) : '—'}/${play.frameP95Ms != null ? play.frameP95Ms.toFixed(1) : '—'} | ${fmtMb(first)} → ${fmtMb(last)} | ${fmtMb(r.heapGrowthBytes)} | ${suspects}${r.error ? ` ERROR: ${r.error}` : ''} |`
    );
  }

  lines.push('');
  lines.push('## Suspected leaks & cleanup notes');
  lines.push('');
  lines.push(
    'Clear unmount leaks fixed in this change set (no rules/scoring changes):'
  );
  lines.push('');
  lines.push(
    '1. **prime-gold** — `destroyGame()` now calls `clearAiTimer()` so pending `makeAIMove` cannot run after route leave.'
  );
  lines.push(
    '2. **star-track / hex-a-gone / kings-quadraphages** — AI turn chains guarded with `aiGeneration`; `destroyGame()` invalidates in-flight timeouts/async delays.'
  );
  lines.push(
    '3. **hex** — new `destroyGame()` bumps generation, cancels worker AI requests, clears mounts; wired in `main.ts`.'
  );
  lines.push(
    '4. **frac-fact** — new `destroyGame()` clears AI + result timers; wired in `main.ts`.'
  );
  lines.push(
    '5. **fraction-pinball** — new `destroyGame()` bumps `aiGeneration`; wired in `main.ts`.'
  );
  lines.push('');
  lines.push(
    'Three.js boards already dispose geometries/materials/renderer and remove pointer/resize/contextlost listeners in `unmount`; remount Δheap ≥ ~5 MB on a 3D game still warrants a follow-up GPU resource audit.'
  );
  lines.push('');
  lines.push('## How to re-run');
  lines.push('');
  lines.push('```bash');
  lines.push('npm run perf:runtime');
  lines.push(
    '# optional: PERF_GAMES=hex,fiar PERF_MOVES=30 npm run perf:runtime'
  );
  lines.push('```');
  lines.push('');
  lines.push(`Generated: ${meta.generatedAt}`);
  lines.push('');
  return lines.join('\n');
}

async function main() {
  let baseURL = process.env.PERF_BASE_URL || '';
  let server = null;
  if (!baseURL) {
    server = await createServer({
      root: ROOT,
      server: { host: '127.0.0.1', port: 5179, strictPort: true },
      logLevel: 'error',
    });
    await server.listen();
    const addr = server.httpServer?.address();
    const port = typeof addr === 'object' && addr ? addr.port : 5179;
    baseURL = `http://127.0.0.1:${port}`;
  }

  const browser = await chromium.launch({
    headless: true,
    args: ['--enable-precise-memory-info'],
  });

  const results = [];
  const modeLabel = RENDER_MODE
    ? `render CPU=${CPU_THROTTLE}x tablet phase=${PERF_PHASE}`
    : 'runtime/leak';
  console.log(
    `Runtime perf [${modeLabel}] → ${baseURL} (${GAMES.length} games)`
  );
  for (const gameId of GAMES) {
    process.stdout.write(`  … ${gameId} `);
    const r = await measureGame(browser, baseURL, gameId);
    results.push(r);
    if (RENDER_MODE) {
      console.log(
        `tti=${r.ttiMs?.toFixed?.(0) ?? '—'} moveP95=${r.move?.p95Ms?.toFixed?.(1) ?? '—'} hoverP95=${r.hover?.p95Ms?.toFixed?.(1) ?? '—'} lt50=${r.longTasksOver50 ?? 0}${r.error ? ' ERR' : ''}`
      );
    } else {
      console.log(
        `moves=${r.movesLanded} Δheap=${fmtMb(r.heapGrowthBytes)}${r.error ? ' ERR' : ''}`
      );
    }
  }

  await browser.close();
  if (server) await server.close();

  const meta = {
    generatedAt: new Date().toISOString(),
    baseURL,
    moveTarget: MOVE_TARGET,
    navCycles: NAV_CYCLES,
    mode: RENDER_MODE ? 'render' : 'runtime',
    phase: PERF_PHASE,
    cpuThrottle: RENDER_MODE ? CPU_THROTTLE : 1,
    fixedGames: (process.env.PERF_FIXED_GAMES || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    fixNotes: (process.env.PERF_FIX_NOTES || '')
      .split('|')
      .map((s) => s.trim())
      .filter(Boolean),
  };

  if (RENDER_MODE) {
    const paths = await writeRenderReport(ROOT, results, meta);
    console.log(`Wrote ${paths.md}`);
    console.log(`Wrote ${paths.json}`);
  } else {
    await mkdir(dirname(REPORT_MD), { recursive: true });
    await writeFile(
      REPORT_JSON,
      JSON.stringify({ meta, results }, null, 2),
      'utf8'
    );
    await writeFile(REPORT_MD, renderMarkdown(results, meta), 'utf8');
    console.log(`Wrote ${REPORT_MD}`);
    console.log(`Wrote ${REPORT_JSON}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
