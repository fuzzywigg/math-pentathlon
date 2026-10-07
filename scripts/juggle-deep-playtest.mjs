/**
 * Deep Juggle playtest harness (headless Chromium).
 * Runs 10+ full Human-vs-AI games per difficulty on tablet + desktop.
 * Writes JSON + PNG screenshots under docs/playtest/juggle-deep-2026-10-07/.
 *
 * Usage: node scripts/juggle-deep-playtest.mjs
 * Requires: Vite on :5173 and `npx playwright` browsers.
 */
import { chromium, devices } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.JUGGLE_PLAYTEST_BASE || 'http://127.0.0.1:5173';
const OUT = path.resolve('docs/playtest/juggle-deep-2026-10-07');
const GAMES_PER = Number(process.env.JUGGLE_PLAYTEST_GAMES || 10);
const DIFFICULTIES = ['easy', 'medium', 'hard'];
const VIEWPORTS = [
  {
    name: 'desktop',
    ...devices['Desktop Chrome'],
    viewport: { width: 1280, height: 800 },
  },
  {
    name: 'tablet',
    ...devices['iPad Mini'],
  },
];

fs.mkdirSync(OUT, { recursive: true });

async function dismissOwl(page) {
  await page.evaluate(() => {
    const el = document.getElementById('ollie-owl');
    if (el) el.style.pointerEvents = 'none';
  });
}

async function startVsAi(page, difficulty) {
  await page.goto(`${BASE}/#/game/juggle`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#new-game-btn, h1', { timeout: 20000 });
  await dismissOwl(page);
  await page.locator('#new-game-btn').click();
  await page.locator('.mode-option[data-mode="human-vs-ai"]').click();
  await page.locator(`.difficulty-btn.${difficulty}`).click();
  await page.locator('#start-game-btn').click();
  await page.waitForSelector('.juggle-board', { timeout: 15000 });
  await dismissOwl(page);
}

async function waitHumanSeat(page, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const thinking = await page
      .locator('.status-ai-thinking')
      .isVisible()
      .catch(() => false);
    const winner = await page
      .locator('.juggle-winner-banner')
      .isVisible()
      .catch(() => false);
    if (winner) return 'winner';
    if (!thinking) {
      const status =
        (await page.locator('.juggle-status, .juggle-winner-banner').textContent()) ||
        '';
      if (/Blue/i.test(status) || /Pass/i.test(status)) return 'human';
      if (/wins/i.test(status)) return 'winner';
    }
    await page.waitForTimeout(200);
  }
  return 'timeout';
}

async function humanTurn(page) {
  const consoleErrors = [];
  // Roll
  const roll = page.locator('.juggle-roll-btn');
  if (await roll.isVisible().catch(() => false)) {
    await roll.click({ force: true });
    await page.waitForTimeout(150);
  }

  if (await page.locator('.juggle-pass-btn').isVisible().catch(() => false)) {
    await page.locator('.juggle-pass-btn').click({ force: true });
    return { action: 'pass', consoleErrors };
  }

  // Prefer selectable (placeable) die
  const die = page.locator('.juggle-die.selectable').first();
  if (await die.count()) {
    await die.click({ force: true });
    await page.waitForTimeout(120);
  }

  if (await page.locator('.juggle-pass-btn').isVisible().catch(() => false)) {
    await page.locator('.juggle-pass-btn').click({ force: true });
    return { action: 'pass', consoleErrors };
  }

  const shape = page.locator('.juggle-shape-option:not(.disabled)').first();
  if (await shape.count()) {
    await shape.click({ force: true });
    await page.waitForTimeout(120);
  }

  // Try rotate a couple times if first placements fail
  for (let attempt = 0; attempt < 8; attempt++) {
    if (await page.locator('.juggle-pass-btn').isVisible().catch(() => false)) {
      await page.locator('.juggle-pass-btn').click({ force: true });
      return { action: 'pass', consoleErrors };
    }
    const empties = page.locator(
      '.juggle-board.player1.active .juggle-cell:not([class*="occupied"])'
    );
    const n = await empties.count();
    if (n === 0) break;
    for (let i = 0; i < Math.min(n, 12); i++) {
      const cell = empties.nth(i);
      await cell.hover({ force: true }).catch(() => undefined);
      const valid = await page
        .locator('.juggle-board.player1 .juggle-cell.preview-valid')
        .count();
      if (valid > 0) {
        await page
          .locator('.juggle-board.player1 .juggle-cell.preview-valid')
          .first()
          .evaluate((el) => el.click());
        return { action: 'place', consoleErrors };
      }
    }
    const rotate = page.locator('.juggle-control-btn').first();
    if (await rotate.isVisible().catch(() => false)) {
      await rotate.click({ force: true });
    } else {
      break;
    }
  }

  // Last resort: click first empty
  const fallback = page
    .locator('.juggle-board.player1.active .juggle-cell:not([class*="occupied"])')
    .first();
  if (await fallback.count()) {
    await fallback.evaluate((el) => el.click());
    return { action: 'place-fallback', consoleErrors };
  }
  return { action: 'stuck', consoleErrors };
}

async function playOneGame(browser, viewport, difficulty, gameIndex) {
  const context = await browser.newContext({
    ...viewport,
    hasTouch: viewport.name === 'tablet',
  });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(String(err)));

  const started = Date.now();
  let outcome = 'unknown';
  let turns = 0;
  let passes = 0;
  let softLock = false;
  let maxAiThinkMs = 0;
  let lastStatus = '';

  try {
    await startVsAi(page, difficulty);

    for (let turn = 0; turn < 120; turn++) {
      turns = turn + 1;
      const seat = await waitHumanSeat(page, 25000);
      lastStatus =
        (await page
          .locator('.juggle-status, .juggle-winner-banner')
          .textContent()) || '';

      if (seat === 'winner' || /wins/i.test(lastStatus)) {
        outcome = /Red/i.test(lastStatus)
          ? 'ai-win'
          : /Blue/i.test(lastStatus)
            ? 'human-win'
            : 'ended';
        break;
      }
      if (seat === 'timeout') {
        // Measure AI think stall
        const thinking = await page
          .locator('.status-ai-thinking')
          .isVisible()
          .catch(() => false);
        if (thinking) {
          softLock = true;
          outcome = 'ai-stall';
        } else {
          softLock = true;
          outcome = 'soft-lock';
        }
        break;
      }

      const thinkStart = Date.now();
      // If still showing AI thinking at loop entry we already waited.
      void thinkStart;

      const beforeBlue = await page
        .locator('.juggle-cell.occupied-player1')
        .count();
      const beforeRed = await page
        .locator('.juggle-cell.occupied-player2')
        .count();
      const beforeStatus = lastStatus;

      const result = await humanTurn(page);
      if (result.action === 'pass') passes += 1;
      if (result.action === 'stuck') {
        softLock = true;
        outcome = 'soft-lock';
        break;
      }

      // Wait for AI reply or return to Blue / winner
      const aiStart = Date.now();
      const after = await waitHumanSeat(page, 30000);
      maxAiThinkMs = Math.max(maxAiThinkMs, Date.now() - aiStart);

      lastStatus =
        (await page
          .locator('.juggle-status, .juggle-winner-banner')
          .textContent()) || '';

      if (after === 'winner' || /wins/i.test(lastStatus)) {
        outcome = /Red/i.test(lastStatus)
          ? 'ai-win'
          : /Blue/i.test(lastStatus)
            ? 'human-win'
            : 'ended';
        break;
      }
      if (after === 'timeout') {
        softLock = true;
        outcome = 'ai-stall';
        break;
      }

      const afterBlue = await page
        .locator('.juggle-cell.occupied-player1')
        .count();
      const afterRed = await page
        .locator('.juggle-cell.occupied-player2')
        .count();
      // No board progress and same status after a full cycle → soft-lock.
      if (
        afterBlue === beforeBlue &&
        afterRed === beforeRed &&
        result.action !== 'pass' &&
        lastStatus === beforeStatus &&
        !/Pass/i.test(lastStatus)
      ) {
        // Allow one more retry; if still stuck next loop will catch.
      }
    }

    if (outcome === 'unknown') {
      outcome = softLock ? 'soft-lock' : 'timeout-budget';
    }

    const shotName = `${viewport.name}-${difficulty}-g${gameIndex + 1}-${outcome}.png`;
    await page.screenshot({
      path: path.join(OUT, shotName),
      fullPage: true,
    });

    // Touch target sample on tablet mid-game screenshot companion
    let touch = null;
    if (viewport.name === 'tablet') {
      touch = await page.evaluate(() => {
        const cell = document.querySelector('.juggle-cell');
        const roll = document.querySelector('.juggle-roll-btn, .juggle-pass-btn, .juggle-control-btn');
        const c = cell?.getBoundingClientRect();
        const r = roll?.getBoundingClientRect();
        return {
          cell: c ? { w: Math.round(c.width), h: Math.round(c.height) } : null,
          control: r
            ? { w: Math.round(r.width), h: Math.round(r.height) }
            : null,
        };
      });
    }

    await context.close();
    return {
      viewport: viewport.name,
      difficulty,
      gameIndex: gameIndex + 1,
      outcome,
      turns,
      passes,
      softLock,
      maxAiThinkMs,
      durationMs: Date.now() - started,
      lastStatus: lastStatus.trim(),
      consoleErrors: [...consoleErrors, ...[]],
      touch,
      screenshot: shotName,
    };
  } catch (err) {
    const shotName = `${viewport.name}-${difficulty}-g${gameIndex + 1}-crash.png`;
    await page.screenshot({ path: path.join(OUT, shotName), fullPage: true }).catch(() => undefined);
    await context.close().catch(() => undefined);
    return {
      viewport: viewport.name,
      difficulty,
      gameIndex: gameIndex + 1,
      outcome: 'crash',
      turns,
      passes,
      softLock: true,
      maxAiThinkMs,
      durationMs: Date.now() - started,
      lastStatus: String(err),
      consoleErrors,
      touch: null,
      screenshot: shotName,
    };
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const jobs = [];
  for (const viewport of VIEWPORTS) {
    for (const difficulty of DIFFICULTIES) {
      for (let g = 0; g < GAMES_PER; g++) {
        jobs.push({ viewport, difficulty, g });
      }
    }
  }

  const results = [];
  const concurrency = Number(process.env.JUGGLE_PLAYTEST_CONCURRENCY || 3);
  let cursor = 0;

  async function worker() {
    while (cursor < jobs.length) {
      const idx = cursor++;
      const job = jobs[idx];
      process.stdout.write(
        `play ${job.viewport.name}/${job.difficulty} #${job.g + 1}… `
      );
      const row = await playOneGame(
        browser,
        job.viewport,
        job.difficulty,
        job.g
      );
      results.push(row);
      console.log(`${row.outcome} (${row.turns} turns, ${row.durationMs}ms)`);
    }
  }

  await Promise.all(
    Array.from({ length: concurrency }, () => worker())
  );

  await browser.close();

  const summary = {
    generatedAt: new Date().toISOString(),
    base: BASE,
    gamesPerDifficultyPerViewport: GAMES_PER,
    totalGames: results.length,
    outcomes: results.reduce((acc, r) => {
      acc[r.outcome] = (acc[r.outcome] || 0) + 1;
      return acc;
    }, {}),
    softLocks: results.filter((r) => r.softLock).length,
    consoleErrorGames: results.filter((r) => r.consoleErrors.length).length,
    maxAiThinkMs: Math.max(...results.map((r) => r.maxAiThinkMs), 0),
    results,
  };

  fs.writeFileSync(
    path.join(OUT, 'results.json'),
    JSON.stringify(summary, null, 2)
  );
  console.log('\nWrote', path.join(OUT, 'results.json'));
  console.log('Outcomes:', summary.outcomes);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
