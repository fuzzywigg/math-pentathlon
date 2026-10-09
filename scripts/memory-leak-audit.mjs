#!/usr/bin/env node
/**
 * Memory-leak audit — Playwright + CDP heap snapshots.
 *
 * For each of the 20 available games:
 *  - open from the menu, start human-vs-human (full shell mount), close via ← Games
 *  - repeat 10 times after a one-shot warm open/close
 *  - measure retained JS heap (Performance.getMetrics + snapshot self_size)
 *    and Detached DOM node counts from HeapProfiler.takeHeapSnapshot
 *
 * Usage:
 *   npm run audit:memory
 *   MEM_LEAK_LABEL=before npm run audit:memory
 *   MEM_LEAK_GAMES=hex,fiar npm run audit:memory
 *   MEM_LEAK_CYCLES=10 MEM_LEAK_PORT=5181 npm run audit:memory
 */

import { chromium } from '@playwright/test';
import { createServer } from 'vite';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const LABEL = process.env.MEM_LEAK_LABEL || 'run';
const CYCLES = Number(process.env.MEM_LEAK_CYCLES || 10);
const PORT = Number(process.env.MEM_LEAK_PORT || 5181);
/** Optional date stem so re-runs can avoid clobbering the Oct 7 baseline twins. */
const MEM_DATE = process.env.MEM_LEAK_DATE || '2026-10-07';
const OUT_JSON = resolve(ROOT, `docs/memory-leaks-${LABEL}-${MEM_DATE}.json`);

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

/** id → menu card name + division tab */
const ALL_GAMES = [
  { id: 'kings-quadraphages', name: 'Kings & Quadraphages', division: 'Division I' },
  { id: 'hex', name: 'Hex', division: 'Division I' },
  { id: 'star-track', name: 'Star Track', division: 'Division I' },
  { id: 'hex-a-gone', name: 'Hex-a-Gone!', division: 'Division I' },
  { id: 'calla', name: 'Calla', division: 'Division I' },
  { id: 'sum-dominoes', name: 'Sum Dominoes & Dice', division: 'Division II' },
  { id: 'par-55', name: 'Par 55', division: 'Division II' },
  { id: 'ramrod', name: 'Ramrod', division: 'Division II' },
  { id: 'kwatro-sinko', name: 'Kwatro-Sinko', division: 'Division II' },
  { id: 'fiar', name: 'FIAR', division: 'Division II' },
  { id: 'juggle', name: 'Juggle', division: 'Division III' },
  { id: 'contig-60', name: 'Contig 60', division: 'Division III' },
  { id: 'stars-bars', name: 'Stars & Bars', division: 'Division III' },
  { id: 'fab-a-diffy', name: 'Fab-a-Diffy', division: 'Division III' },
  { id: 'queens-guards', name: 'Queens & Guards', division: 'Division III' },
  { id: 'prime-gold', name: 'Prime Gold', division: 'Division IV' },
  { id: 'remainder-islands', name: 'Remainder Islands', division: 'Division IV' },
  { id: 'pent-em-in', name: "Pent'Em In", division: 'Division IV' },
  { id: 'frac-fact', name: 'Frac Fact', division: 'Division IV' },
  { id: 'fraction-pinball', name: 'Fraction Pinball', division: 'Division IV' },
];

const filter = (process.env.MEM_LEAK_GAMES || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const GAMES = filter.length
  ? ALL_GAMES.filter((g) => filter.includes(g.id))
  : ALL_GAMES;

function fmtMb(bytes) {
  if (bytes == null) return 'n/a';
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function dismissOwl(page) {
  await page.evaluate(() => {
    const el = document.getElementById('ollie-owl');
    if (el) el.style.pointerEvents = 'none';
  });
}

async function waitMenu(page) {
  await page.locator('.game-card').first().waitFor({ timeout: 20_000 });
  await page.locator('.division-tabs').waitFor({ timeout: 10_000 });
}

async function openDivision(page, division) {
  const tab = page.locator(`.division-tab[data-division="${division}"]`);
  await tab.click();
  await page
    .locator(
      `.division-accordion[data-division="${division}"].accordion-open`
    )
    .waitFor({ timeout: 10_000 });
  // Accordion max-height animation
  await page.waitForTimeout(150);
}

async function waitGameReady(page) {
  await page
    .locator('[data-testid="game-loading"]')
    .waitFor({ state: 'hidden', timeout: 25_000 })
    .catch(() => {});
  await page.locator('#back-btn, #new-game-btn, h1').first().waitFor({
    timeout: 25_000,
  });
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

async function openGameFromMenu(page, game) {
  await waitMenu(page);
  await dismissOwl(page);
  await openDivision(page, game.division);
  // Exact aria-label — avoids Hex matching Hex-a-Gone!
  const card = page.getByRole('button', {
    name: `${game.name} - Available`,
    exact: true,
  });
  // Accordion remounts can detach the card mid-scroll; force-click is enough
  // for the audit harness (sticky tabs already require force).
  await card.click({ force: true }).catch(async () => {
    await openDivision(page, game.division);
    await page
      .getByRole('button', {
        name: `${game.name} - Available`,
        exact: true,
      })
      .click({ force: true });
  });
  await waitGameReady(page);
  await startHuman(page);
  // Let 3D / first paint settle before closing.
  await page.waitForTimeout(BOARD3D_GAMES.has(game.id) ? 600 : 200);
}

async function closeToMenu(page) {
  await dismissOwl(page);
  const back = page.locator('#back-btn');
  if (await back.isVisible().catch(() => false)) {
    await back.click();
  } else {
    await page.evaluate(() => {
      window.location.hash = '#/';
    });
  }
  await waitMenu(page);
  await dismissOwl(page);
}

/** Parse Chrome heap snapshot for Detached DOM counts + total self size. */
function analyzeHeapSnapshot(jsonText) {
  const data = JSON.parse(jsonText);
  const meta = data.snapshot.meta;
  const nodeFields = meta.node_fields;
  const strings = data.strings;
  const nodes = data.nodes;
  const fieldCount = nodeFields.length;
  const nameOffset = nodeFields.indexOf('name');
  const selfSizeOffset = nodeFields.indexOf('self_size');

  let detachedDomNodes = 0;
  let detachedSelfSize = 0;
  let totalSelfSize = 0;

  for (let i = 0; i < nodes.length; i += fieldCount) {
    const selfSize = nodes[i + selfSizeOffset];
    totalSelfSize += selfSize;
    const name = strings[nodes[i + nameOffset]];
    if (typeof name === 'string' && name.startsWith('Detached ')) {
      detachedDomNodes += 1;
      detachedSelfSize += selfSize;
    }
  }

  return { detachedDomNodes, detachedSelfSize, totalSelfSize };
}

async function measureHeap(cdp) {
  await cdp.send('HeapProfiler.enable').catch(() => {});
  await cdp.send('HeapProfiler.collectGarbage').catch(() => {});
  // Second GC pass — Chrome often needs it after detaching canvases.
  await cdp.send('HeapProfiler.collectGarbage').catch(() => {});

  const { metrics } = await cdp.send('Performance.getMetrics');
  const jsHeap =
    metrics.find((m) => m.name === 'JSHeapUsedSize')?.value ?? null;
  const nodesMetric = metrics.find((m) => m.name === 'Nodes')?.value ?? null;
  const jsEventListeners =
    metrics.find((m) => m.name === 'JSEventListeners')?.value ?? null;

  const chunks = [];
  const onChunk = ({ chunk }) => {
    chunks.push(chunk);
  };
  cdp.on('HeapProfiler.addHeapSnapshotChunk', onChunk);
  try {
    await cdp.send('HeapProfiler.takeHeapSnapshot', {
      reportProgress: false,
      treatGlobalObjectsAsRoots: true,
    });
  } finally {
    cdp.off('HeapProfiler.addHeapSnapshotChunk', onChunk);
  }

  const snap = analyzeHeapSnapshot(chunks.join(''));
  return {
    jsHeapUsedBytes: jsHeap,
    domNodes: nodesMetric,
    jsEventListeners,
    detachedDomNodes: snap.detachedDomNodes,
    detachedSelfSizeBytes: snap.detachedSelfSize,
    snapshotSelfSizeBytes: snap.totalSelfSize,
  };
}

async function prepareMenu(page, baseURL, board3d) {
  const q = board3d ? '?board3d=1' : '';
  await page.goto(`${baseURL}/${q}#/`, { waitUntil: 'domcontentloaded' });
  await waitMenu(page);
  await dismissOwl(page);
}

async function auditGame(browser, baseURL, game) {
  const board3d = BOARD3D_GAMES.has(game.id);
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send('Performance.enable').catch(() => {});
  await cdp.send('HeapProfiler.enable').catch(() => {});

  const result = {
    gameId: game.id,
    name: game.name,
    board3d,
    cycles: CYCLES,
    samples: [],
    afterWarm: null,
    afterCycles: null,
    deltaJsHeapBytes: null,
    deltaDetachedDom: null,
    deltaSnapshotSelfBytes: null,
    error: null,
  };

  try {
    await prepareMenu(page, baseURL, board3d);

    // Warm: one open/close so module graph / CSS is paid once.
    await openGameFromMenu(page, game);
    await closeToMenu(page);
    await page.waitForTimeout(300);

    const afterWarm = await measureHeap(cdp);
    result.afterWarm = afterWarm;
    result.samples.push({ label: 'after-warm', ...afterWarm });

    for (let i = 1; i <= CYCLES; i++) {
      await openGameFromMenu(page, game);
      await closeToMenu(page);
      // Light metric each cycle (no full snapshot — those are expensive).
      await cdp.send('HeapProfiler.collectGarbage').catch(() => {});
      const { metrics } = await cdp.send('Performance.getMetrics');
      const jsHeap =
        metrics.find((m) => m.name === 'JSHeapUsedSize')?.value ?? null;
      const detachedProxy =
        metrics.find((m) => m.name === 'Nodes')?.value ?? null;
      result.samples.push({
        label: `cycle-${i}`,
        jsHeapUsedBytes: jsHeap,
        domNodes: detachedProxy,
      });
    }

    await page.waitForTimeout(400);
    const afterCycles = await measureHeap(cdp);
    result.afterCycles = afterCycles;
    result.samples.push({ label: 'after-cycles', ...afterCycles });

    result.deltaJsHeapBytes =
      (afterCycles.jsHeapUsedBytes ?? 0) - (afterWarm.jsHeapUsedBytes ?? 0);
    result.deltaDetachedDom =
      (afterCycles.detachedDomNodes ?? 0) - (afterWarm.detachedDomNodes ?? 0);
    result.deltaSnapshotSelfBytes =
      (afterCycles.snapshotSelfSizeBytes ?? 0) -
      (afterWarm.snapshotSelfSizeBytes ?? 0);
  } catch (err) {
    result.error = err instanceof Error ? err.message : String(err);
  } finally {
    await context.close().catch(() => {});
  }

  return result;
}

async function main() {
  let baseURL = process.env.MEM_LEAK_BASE_URL || '';
  let server = null;
  if (!baseURL) {
    server = await createServer({
      root: ROOT,
      server: { host: '127.0.0.1', port: PORT, strictPort: true },
      logLevel: 'error',
    });
    await server.listen();
    const addr = server.httpServer?.address();
    const port = typeof addr === 'object' && addr ? addr.port : PORT;
    baseURL = `http://127.0.0.1:${port}`;
  }

  const browser = await chromium.launch({
    headless: true,
    args: ['--enable-precise-memory-info'],
  });
  const results = [];

  console.log(
    `Memory-leak audit (${LABEL}): ${GAMES.length} games × ${CYCLES} cycles @ ${baseURL}`
  );

  try {
    for (const game of GAMES) {
      process.stdout.write(`  ${game.id} ... `);
      const r = await auditGame(browser, baseURL, game);
      results.push(r);
      if (r.error) {
        console.log(`ERROR ${r.error}`);
      } else {
        console.log(
          `Δheap=${fmtMb(r.deltaJsHeapBytes)} Δdetached=${r.deltaDetachedDom}`
        );
      }
    }
  } finally {
    await browser.close();
    if (server) await server.close();
  }

  await mkdir(dirname(OUT_JSON), { recursive: true });
  const payload = {
    label: LABEL,
    date: MEM_DATE,
    cycles: CYCLES,
    baseURL,
    method:
      'Playwright menu open/close; CDP HeapProfiler.takeHeapSnapshot + Performance.getMetrics; GC before samples',
    results,
  };
  await writeFile(OUT_JSON, JSON.stringify(payload, null, 2));
  console.log(`Wrote ${OUT_JSON}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
