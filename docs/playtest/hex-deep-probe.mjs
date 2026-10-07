/**
 * Hex deep-playtest probe + full harness (Chromium).
 * Usage:
 *   node docs/playtest/hex-deep-probe.mjs            # full 60 games
 *   node docs/playtest/hex-deep-probe.mjs --probe     # 1 game × 6 buckets + metrics
 */
import { chromium, devices } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, 'hex-deep-2026-10-07');
const BASE = process.env.HEX_PLAYTEST_URL || 'http://127.0.0.1:5173';
const PROBE = process.argv.includes('--probe');
const GAMES_PER = PROBE ? 1 : 10;

mkdirSync(OUT, { recursive: true });

const VIEWPORTS = {
  desktop: { width: 1280, height: 800, hasTouch: false, isMobile: false },
  tablet: {
    width: 768,
    height: 1024,
    hasTouch: true,
    isMobile: true,
    ...devices['iPad Mini'],
    viewport: { width: 768, height: 1024 },
  },
};

const DIFFS = ['easy', 'medium', 'hard'];

async function dismissOwl(page) {
  await page.evaluate(() => {
    const el = document.getElementById('ollie-owl');
    if (el) el.style.pointerEvents = 'none';
  });
}

async function startVsAi(page, difficulty) {
  await page.goto(`${BASE}/#/game/hex`);
  await page.getByTestId('game-loading').waitFor({ state: 'hidden', timeout: 20_000 }).catch(() => {});
  await page.locator('#new-game-btn').waitFor({ state: 'visible', timeout: 20_000 });
  await dismissOwl(page);
  await page.locator('#new-game-btn').click();
  await page.locator('#new-game-modal').waitFor({ state: 'visible', timeout: 10_000 });
  await page.locator('.mode-option[data-mode="human-vs-ai"]').click();
  await page.locator(`.difficulty-btn.${difficulty}`).click();
  await page.locator('#start-game-btn').click();
  await page.locator('#new-game-modal').waitFor({ state: 'hidden', timeout: 10_000 }).catch(async () => {
    await expectHidden(page, '#new-game-modal');
  });
  await dismissOwl(page);
  await page.locator('svg.hex-board').waitFor({ state: 'visible', timeout: 15_000 });
}

async function expectHidden(page, sel) {
  await page.waitForFunction(
    (s) => {
      const el = document.querySelector(s);
      return !el || el.classList.contains('hidden') || getComputedStyle(el).display === 'none';
    },
    sel,
    { timeout: 10_000 }
  );
}

async function measureCells(page) {
  return page.evaluate(() => {
    const poly = document.querySelector('.hex-cell-empty, .hex-cell');
    const svg = document.querySelector('svg.hex-board');
    if (!poly || !svg) return null;
    const pr = poly.getBoundingClientRect();
    const sr = svg.getBoundingClientRect();
    return {
      cellW: Math.round(pr.width * 10) / 10,
      cellH: Math.round(pr.height * 10) / 10,
      svgW: Math.round(sr.width * 10) / 10,
      svgH: Math.round(sr.height * 10) / 10,
      status: document.querySelector('.hex-status .status-turn')?.textContent || '',
      legend: document.querySelector('.hex-legend')?.textContent || '',
    };
  });
}

/** Prefer empties that advance Blue (player1) top→bottom: bias mid columns, progressing rows. */
async function playHumanMove(page) {
  return page.evaluate(() => {
    const groups = [...document.querySelectorAll('.hex-cell-group')];
    const empties = groups.filter((g) => {
      const poly = g.querySelector('.hex-cell-empty');
      return !!poly && g.style.cursor === 'pointer';
    });
    if (!empties.length) return false;
    // Score: prefer center columns and lower rows (Blue connects top-bottom)
    empties.sort((a, b) => {
      const ar = +a.getAttribute('data-row');
      const ac = +a.getAttribute('data-col');
      const br = +b.getAttribute('data-row');
      const bc = +b.getAttribute('data-col');
      const as = Math.abs(ac - 5) * 2 - ar;
      const bs = Math.abs(bc - 5) * 2 - br;
      return as - bs;
    });
    // Slight randomness among top 8
    const pool = empties.slice(0, Math.min(8, empties.length));
    const pick = pool[Math.floor(Math.random() * pool.length)];
    pick.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    return true;
  });
}

async function playOneGame(browser, viewportName, difficulty, gameIndex, shotFlags) {
  const vp = VIEWPORTS[viewportName];
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    hasTouch: vp.hasTouch,
    isMobile: vp.isMobile,
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
  });

  const thinkTimes = [];
  let outcome = 'unknown';
  let humanTurns = 0;
  let stallReason = null;
  let metrics = null;
  const t0 = Date.now();

  try {
    await startVsAi(page, difficulty);
    metrics = await measureCells(page);

    if (shotFlags?.start) {
      await page.screenshot({
        path: join(OUT, `${viewportName}-${difficulty}-start.png`),
        fullPage: false,
      });
    }

    const deadline = Date.now() + (difficulty === 'hard' ? 240_000 : 180_000);
    while (Date.now() < deadline) {
      const statusText =
        (await page.locator('.hex-status .status-turn').textContent()) || '';

      if (/win/i.test(statusText)) {
        if (/You/i.test(statusText)) outcome = 'you-win';
        else if (/AI/i.test(statusText)) outcome = 'ai-win';
        else outcome = 'win';
        break;
      }

      const thinking = page.locator('.status-ai-thinking');
      if (await thinking.isVisible().catch(() => false)) {
        if (shotFlags?.thinking) {
          await page.screenshot({
            path: join(OUT, `${viewportName}-${difficulty}-ai-thinking.png`),
            fullPage: false,
          });
          shotFlags.thinking = false;
        }
        const thinkStart = Date.now();
        await thinking.waitFor({ state: 'hidden', timeout: 8_000 }).catch(() => {
          stallReason = 'ai-think-timeout';
        });
        if (stallReason) break;
        thinkTimes.push(Date.now() - thinkStart);
        continue;
      }

      // Human seat
      if (!/Your|Blue/i.test(statusText) && /AI/i.test(statusText)) {
        // AI seat without thinking chrome — soft-lock / race
        await page.waitForTimeout(800);
        const again =
          (await page.locator('.hex-status .status-turn').textContent()) || '';
        if (!/thinking|Your|win/i.test(again)) {
          stallReason = 'ai-seat-no-thinking';
          await page.screenshot({
            path: join(OUT, `${viewportName}-${difficulty}-g${gameIndex}-stall.png`),
          });
          break;
        }
        continue;
      }

      const moved = await playHumanMove(page);
      if (!moved) {
        stallReason = 'no-human-move';
        break;
      }
      humanTurns++;

      // Brief wait for AI thinking chrome or win
      await page
        .locator('.status-ai-thinking, .status-winner')
        .first()
        .waitFor({ state: 'visible', timeout: 3_000 })
        .catch(() => {});
    }

    if (outcome === 'unknown' && !stallReason) {
      stallReason = 'game-timeout';
      await page.screenshot({
        path: join(OUT, `${viewportName}-${difficulty}-g${gameIndex}-timeout.png`),
      });
    }

    if (shotFlags?.end && /win/i.test(outcome)) {
      await page.screenshot({
        path: join(OUT, `${viewportName}-${difficulty}-g${gameIndex}-end.png`),
        fullPage: false,
      });
    }
  } catch (e) {
    stallReason = `harness-error: ${e.message}`;
    errors.push(stallReason);
    await page.screenshot({
      path: join(OUT, `${viewportName}-${difficulty}-g${gameIndex}-error.png`),
    }).catch(() => {});
  }

  await context.close();

  const sorted = [...thinkTimes].sort((a, b) => a - b);
  const median = sorted.length
    ? sorted[Math.floor(sorted.length / 2)]
    : null;

  return {
    viewport: viewportName,
    difficulty,
    gameIndex,
    outcome: stallReason ? stallReason : outcome,
    humanTurns,
    thinkCount: thinkTimes.length,
    thinkMedianMs: median,
    thinkMaxMs: thinkTimes.length ? Math.max(...thinkTimes) : null,
    thinkMinMs: thinkTimes.length ? Math.min(...thinkTimes) : null,
    cellW: metrics?.cellW ?? null,
    cellH: metrics?.cellH ?? null,
    svgW: metrics?.svgW ?? null,
    statusOpen: metrics?.status ?? null,
    errors,
    elapsedMs: Date.now() - t0,
  };
}

function summarize(results) {
  const byBucket = {};
  for (const r of results) {
    const key = `${r.viewport}/${r.difficulty}`;
    if (!byBucket[key]) byBucket[key] = [];
    byBucket[key].push(r);
  }
  const summary = {};
  for (const [key, rows] of Object.entries(byBucket)) {
    const outcomes = {};
    for (const r of rows) outcomes[r.outcome] = (outcomes[r.outcome] || 0) + 1;
    const medians = rows.map((r) => r.thinkMedianMs).filter((x) => x != null);
    const cellMins = rows
      .map((r) => (r.cellW != null && r.cellH != null ? Math.min(r.cellW, r.cellH) : null))
      .filter((x) => x != null);
    summary[key] = {
      games: rows.length,
      outcomes,
      thinkMedianOfMedians: medians.length
        ? medians.sort((a, b) => a - b)[Math.floor(medians.length / 2)]
        : null,
      thinkGlobalMax: Math.max(0, ...rows.map((r) => r.thinkMaxMs || 0)),
      cellMinPx: cellMins.length ? Math.min(...cellMins) : null,
      cellSample: rows[0] ? `${rows[0].cellW}×${rows[0].cellH}` : null,
      consoleErrors: rows.reduce((n, r) => n + r.errors.length, 0),
    };
  }
  return summary;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  // Serial per bucket to avoid Hard AI contention artifacts
  for (const viewportName of ['tablet', 'desktop']) {
    for (const difficulty of DIFFS) {
      for (let i = 0; i < GAMES_PER; i++) {
        const shotFlags = {
          start: i === 0,
          thinking: i === 0 && difficulty === 'medium',
          end: i === 0,
        };
        console.log(`▶ ${viewportName} ${difficulty} g${i}`);
        const r = await playOneGame(browser, viewportName, difficulty, i, shotFlags);
        results.push(r);
        console.log(
          `  → ${r.outcome} turns=${r.humanTurns} thinkMed=${r.thinkMedianMs} cell=${r.cellW}×${r.cellH} errs=${r.errors.length} ${r.elapsedMs}ms`
        );
      }
    }
  }

  await browser.close();

  const summary = summarize(results);
  const payload = { generatedAt: new Date().toISOString(), probe: PROBE, results, summary };
  writeFileSync(join(OUT, 'results.json'), JSON.stringify(payload, null, 2));
  writeFileSync(join(OUT, 'summary.json'), JSON.stringify(summary, null, 2));
  console.log('\n=== SUMMARY ===');
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
