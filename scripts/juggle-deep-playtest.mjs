/**
 * Deep Juggle playtest harness (headless Chromium).
 * Runs 10+ full Human-vs-AI games per difficulty on tablet + desktop.
 * Drives the live controller via window.__jugglePlaytest (same Pass/AI paths).
 *
 * Usage: node scripts/juggle-deep-playtest.mjs
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
  await page.waitForFunction(
    () => Boolean(window.__jugglePlaytest?.advanceHuman),
    null,
    { timeout: 15000 }
  );
  await dismissOwl(page);
}

async function waitHumanSeat(page, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const snap = await page.evaluate(() => {
      const api = window.__jugglePlaytest;
      if (!api) return { ready: false };
      const s = api.getState();
      return {
        ready: true,
        winner: s.winner,
        phase: s.phase,
        player: s.currentPlayer,
        thinking: Boolean(
          document.querySelector('.status-ai-thinking')
        ),
      };
    });
    if (!snap.ready) {
      await page.waitForTimeout(50);
      continue;
    }
    if (snap.winner || snap.phase === 'gameOver') return 'winner';
    if (snap.player === 'player1' && !snap.thinking) return 'human';
    await page.waitForTimeout(40);
  }
  return 'timeout';
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
  let touch = null;

  try {
    await startVsAi(page, difficulty);

    // Capture early UI screenshot (setup chrome + boards).
    if (gameIndex === 0) {
      await page.screenshot({
        path: path.join(OUT, `${viewport.name}-${difficulty}-start.png`),
        fullPage: true,
      });
    }

    for (let turn = 0; turn < 200; turn++) {
      turns = turn + 1;
      const seat = await waitHumanSeat(page, 20000);
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
        softLock = true;
        outcome = 'ai-stall';
        break;
      }

      const before = await page.evaluate(() => {
        const s = window.__jugglePlaytest.getState();
        return {
          moves: s.moveHistory.length,
          player: s.currentPlayer,
          phase: s.phase,
        };
      });

      const advanced = await page.evaluate(() => {
        const beforePass = window.__jugglePlaytest.getState();
        window.__jugglePlaytest.advanceHuman('medium');
        let after = window.__jugglePlaytest.getState();
        // Retry once if the seat did not progress (timer race with AI chrome).
        if (
          after.currentPlayer === beforePass.currentPlayer &&
          after.moveHistory.length === beforePass.moveHistory.length &&
          !after.winner
        ) {
          window.__jugglePlaytest.advanceHuman('medium');
          after = window.__jugglePlaytest.getState();
        }
        return {
          passed:
            beforePass.currentDice &&
            !after.currentDice &&
            after.moveHistory.length === beforePass.moveHistory.length &&
            after.currentPlayer !== beforePass.currentPlayer,
          winner: after.winner,
          player: after.currentPlayer,
          moves: after.moveHistory.length,
          phase: after.phase,
          sameSeat:
            after.currentPlayer === beforePass.currentPlayer &&
            after.moveHistory.length === beforePass.moveHistory.length &&
            !after.winner,
        };
      });

      if (advanced.passed) passes += 1;

      if (advanced.winner) {
        outcome =
          advanced.winner === 'player2'
            ? 'ai-win'
            : advanced.winner === 'player1'
              ? 'human-win'
              : 'ended';
        break;
      }

      if (advanced.sameSeat) {
        softLock = true;
        outcome = 'soft-lock';
        break;
      }

      // Wait for AI reply back to Blue (or win).
      const aiStart = Date.now();
      const afterSeat = await waitHumanSeat(page, 25000);
      maxAiThinkMs = Math.max(maxAiThinkMs, Date.now() - aiStart);

      lastStatus =
        (await page
          .locator('.juggle-status, .juggle-winner-banner')
          .textContent()) || '';

      if (afterSeat === 'winner' || /wins/i.test(lastStatus)) {
        outcome = /Red/i.test(lastStatus)
          ? 'ai-win'
          : /Blue/i.test(lastStatus)
            ? 'human-win'
            : 'ended';
        break;
      }
      if (afterSeat === 'timeout') {
        softLock = true;
        outcome = 'ai-stall';
        break;
      }

      void before; // retained for debugging clarity in failure screenshots
    }

    if (outcome === 'unknown') {
      outcome = softLock ? 'soft-lock' : 'timeout-budget';
    }

    lastStatus =
      (await page
        .locator('.juggle-status, .juggle-winner-banner')
        .textContent()) || lastStatus;

    if (viewport.name === 'tablet') {
      touch = await page.evaluate(() => {
        const cell = document.querySelector('.juggle-cell');
        const control = document.querySelector(
          '.juggle-roll-btn, .juggle-pass-btn, .juggle-control-btn, .juggle-shape-option'
        );
        const c = cell?.getBoundingClientRect();
        const r = control?.getBoundingClientRect();
        return {
          coarse: window.matchMedia('(pointer: coarse)').matches,
          hoverNone: window.matchMedia('(hover: none)').matches,
          cell: c ? { w: Math.round(c.width), h: Math.round(c.height) } : null,
          control: r
            ? { w: Math.round(r.width), h: Math.round(r.height) }
            : null,
        };
      });
    }

    const shotName = `${viewport.name}-${difficulty}-g${gameIndex + 1}-${outcome}.png`;
    await page.screenshot({
      path: path.join(OUT, shotName),
      fullPage: true,
    });

    // Copy a few representative shots into artifacts for the walkthrough.
    if (gameIndex === 0 || outcome.includes('win') || softLock) {
      await page.screenshot({
        path: path.join(
          '/opt/cursor/artifacts',
          `juggle-${viewport.name}-${difficulty}-g${gameIndex + 1}-${outcome}.png`
        ),
        fullPage: true,
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
      lastStatus: (lastStatus || '').trim(),
      consoleErrors,
      touch,
      screenshot: shotName,
    };
  } catch (err) {
    const shotName = `${viewport.name}-${difficulty}-g${gameIndex + 1}-crash.png`;
    await page
      .screenshot({ path: path.join(OUT, shotName), fullPage: true })
      .catch(() => undefined);
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
  // Clear prior partial runs
  for (const f of fs.readdirSync(OUT)) {
    if (f.endsWith('.png') || f === 'results.json') {
      fs.unlinkSync(path.join(OUT, f));
    }
  }

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

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  await browser.close();

  results.sort((a, b) =>
    `${a.viewport}-${a.difficulty}-${a.gameIndex}`.localeCompare(
      `${b.viewport}-${b.difficulty}-${b.gameIndex}`
    )
  );

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
    tabletTouchOk: results
      .filter((r) => r.touch)
      .every(
        (r) =>
          r.touch.cell &&
          r.touch.cell.w >= 44 &&
          r.touch.cell.h >= 44
      ),
    results,
  };

  fs.writeFileSync(
    path.join(OUT, 'results.json'),
    JSON.stringify(summary, null, 2)
  );
  console.log('\nWrote', path.join(OUT, 'results.json'));
  console.log('Outcomes:', summary.outcomes);
  console.log('Soft-locks:', summary.softLocks);
  console.log('Console-error games:', summary.consoleErrorGames);
  console.log('Tablet touch OK:', summary.tabletTouchOk);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
