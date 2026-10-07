/**
 * Deep playtest harness for Fraction Pinball.
 * Desktop + tablet Chromium, Easy/Medium/Hard, 10+ full games each.
 * Outputs JSON summary + screenshots under docs/playtest/fraction-pinball-deep-2026-10-07/
 */
import { chromium, devices } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.PLAYTEST_BASE || 'http://localhost:5173';
const OUT = path.resolve('docs/playtest/fraction-pinball-deep-2026-10-07');
const GAMES_PER = Number(process.env.PLAYTEST_GAMES || 10);
const DIFFICULTIES = ['easy', 'medium', 'hard'];

fs.mkdirSync(OUT, { recursive: true });

async function dismissOwl(page) {
  await page.evaluate(() => {
    const el = document.getElementById('ollie-owl');
    if (el) el.style.pointerEvents = 'none';
  });
}

async function startVsAi(page, difficulty) {
  await page.goto(`${BASE}/#/game/fraction-pinball`);
  await page.getByTestId('game-loading').waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
  await page.locator('#new-game-btn, h1').first().waitFor({ timeout: 15000 });
  await dismissOwl(page);
  await page.locator('#new-game-btn').click();
  const modal = page.locator('#new-game-modal');
  await modal.waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('.mode-option[data-mode="human-vs-ai"]').click();
  await page.locator(`.difficulty-btn.${difficulty}`).click();
  await page.locator('#start-game-btn').click();
  await modal.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  await dismissOwl(page);
}

async function measureTouch(page) {
  return page.evaluate(() => {
    const pick = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { sel, w: Math.round(r.width), h: Math.round(r.height) };
    };
    return {
      choice: pick('.pinball-choice-btn'),
      continueBtn: pick('.pinball-continue-btn'),
      newGame: pick('#new-game-btn'),
    };
  });
}

async function playOneGame(page, { profile, difficulty, gameIndex, forceWrong }) {
  const consoleErrors = [];
  const pageErrors = [];
  const onConsole = (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  };
  const onPageError = (err) => pageErrors.push(String(err));
  page.on('console', onConsole);
  page.on('pageerror', onPageError);

  const t0 = Date.now();
  let aiThinkSamples = [];
  let stalled = false;
  let ended = false;
  let crash = false;
  let turns = 0;
  let touch = null;

  try {
    await startVsAi(page, difficulty);
    touch = await measureTouch(page);

    if (gameIndex === 0) {
      await page.screenshot({
        path: path.join(OUT, `${profile}-${difficulty}-start.png`),
        fullPage: true,
      });
    }

    const deadline = Date.now() + 120_000;
    while (Date.now() < deadline) {
      // Game over?
      if (await page.locator('.pinball-game-over').isVisible().catch(() => false)) {
        ended = true;
        if (gameIndex === 0) {
          await page.screenshot({
            path: path.join(OUT, `${profile}-${difficulty}-gameover.png`),
            fullPage: true,
          });
        }
        break;
      }

      const thinking = await page.locator('.status-ai-thinking').isVisible().catch(() => false);
      if (thinking) {
        const thinkStart = Date.now();
        await page.locator('.status-ai-thinking').waitFor({ state: 'hidden', timeout: 8000 }).catch(() => {});
        aiThinkSamples.push(Date.now() - thinkStart);
        continue;
      }

      const continueBtn = page.locator('.pinball-continue-btn');
      if (await continueBtn.isVisible().catch(() => false)) {
        await continueBtn.click({ timeout: 3000 }).catch(() => {});
        turns++;
        await page.waitForTimeout(50);
        continue;
      }

      // AI result auto-advances (no Continue) — wait briefly for next challenge
      if (await page.locator('.pinball-auto-advance').isVisible().catch(() => false)) {
        await page
          .locator('.pinball-choice-btn:not([disabled]), .pinball-game-over')
          .first()
          .waitFor({ timeout: 3000 })
          .catch(() => {});
        turns++;
        continue;
      }

      const choices = page.locator('.pinball-choice-btn:not([disabled])');
      const count = await choices.count();
      if (count > 0) {
        // Prefer correct when visible in challenge? We don't know correct from DOM easily
        // except after miss. For forceWrong, always click last; else click first (human play).
        const idx = forceWrong ? count - 1 : 0;
        await choices.nth(idx).click({ timeout: 3000 });
        turns++;
        await page.waitForTimeout(80);
        // If miss, continue appears with correct answer — click continue
        if (await continueBtn.isVisible().catch(() => false)) {
          await continueBtn.click({ timeout: 3000 }).catch(() => {});
        }
        continue;
      }

      // Soft stall: nothing actionable
      await page.waitForTimeout(200);
      const stillNothing =
        !(await page.locator('.pinball-choice-btn:not([disabled])').count()) &&
        !(await page.locator('.pinball-continue-btn').isVisible().catch(() => false)) &&
        !(await page.locator('.pinball-auto-advance').isVisible().catch(() => false)) &&
        !(await page.locator('.status-ai-thinking').isVisible().catch(() => false)) &&
        !(await page.locator('.pinball-game-over').isVisible().catch(() => false));
      if (stillNothing) {
        // brief grace for AI think / auto-advance
        await page.waitForTimeout(1500);
        const still =
          !(await page.locator('.pinball-choice-btn:not([disabled])').count()) &&
          !(await page.locator('.pinball-continue-btn').isVisible().catch(() => false)) &&
          !(await page.locator('.pinball-auto-advance').isVisible().catch(() => false)) &&
          !(await page.locator('.status-ai-thinking').isVisible().catch(() => false)) &&
          !(await page.locator('.pinball-game-over').isVisible().catch(() => false));
        if (still) {
          stalled = true;
          await page.screenshot({
            path: path.join(OUT, `${profile}-${difficulty}-stall-g${gameIndex}.png`),
            fullPage: true,
          });
          break;
        }
      }
    }

    if (!ended && !stalled && Date.now() >= deadline) stalled = true;
  } catch (e) {
    crash = true;
    pageErrors.push(String(e));
    await page.screenshot({
      path: path.join(OUT, `${profile}-${difficulty}-crash-g${gameIndex}.png`),
      fullPage: true,
    }).catch(() => {});
  } finally {
    page.off('console', onConsole);
    page.off('pageerror', onPageError);
  }

  const avgThink =
    aiThinkSamples.length > 0
      ? Math.round(aiThinkSamples.reduce((a, b) => a + b, 0) / aiThinkSamples.length)
      : null;

  return {
    profile,
    difficulty,
    gameIndex,
    forceWrong,
    ended,
    stalled,
    crash,
    turns,
    durationMs: Date.now() - t0,
    avgAiThinkMs: avgThink,
    aiThinkSamples,
    touch,
    consoleErrors,
    pageErrors,
  };
}

async function runProfile(browser, profile) {
  const contextOptions =
    profile === 'tablet'
      ? {
          ...devices['iPad Mini'],
          hasTouch: true,
        }
      : {
          viewport: { width: 1280, height: 800 },
          deviceScaleFactor: 1,
        };

  const results = [];
  for (const difficulty of DIFFICULTIES) {
    for (let g = 0; g < GAMES_PER; g++) {
      const context = await browser.newContext(contextOptions);
      const page = await context.newPage();
      const forceWrong = g === GAMES_PER - 1; // last game: hammer wrong answers to stress balls
      const r = await playOneGame(page, { profile, difficulty, gameIndex: g, forceWrong });
      results.push(r);
      console.log(
        JSON.stringify({
          profile,
          difficulty,
          g,
          ended: r.ended,
          stalled: r.stalled,
          crash: r.crash,
          ms: r.durationMs,
          avgThink: r.avgAiThinkMs,
          errs: r.consoleErrors.length + r.pageErrors.length,
        })
      );
      await context.close();
    }
  }
  return results;
}

const browser = await chromium.launch({ headless: true });
const all = [];
all.push(...(await runProfile(browser, 'desktop')));
all.push(...(await runProfile(browser, 'tablet')));
await browser.close();

const summary = {
  generatedAt: new Date().toISOString(),
  gamesPerDifficulty: GAMES_PER,
  totalGames: all.length,
  ended: all.filter((r) => r.ended).length,
  stalled: all.filter((r) => r.stalled).length,
  crashed: all.filter((r) => r.crash).length,
  withConsoleErrors: all.filter((r) => r.consoleErrors.length).length,
  withPageErrors: all.filter((r) => r.pageErrors.length).length,
  avgDurationMs: Math.round(all.reduce((a, b) => a + b.durationMs, 0) / all.length),
  touchSamples: all.filter((r) => r.touch?.choice).map((r) => ({
    profile: r.profile,
    difficulty: r.difficulty,
    choice: r.touch.choice,
    continueBtn: r.touch.continueBtn,
  })),
  pageErrorSamples: all.flatMap((r) =>
    r.pageErrors.map((e) => ({ profile: r.profile, difficulty: r.difficulty, gameIndex: r.gameIndex, e }))
  ),
  consoleErrorSamples: all.flatMap((r) =>
    r.consoleErrors.map((e) => ({ profile: r.profile, difficulty: r.difficulty, gameIndex: r.gameIndex, e }))
  ),
  results: all,
};

fs.writeFileSync(path.join(OUT, 'summary.json'), JSON.stringify(summary, null, 2));
console.log('SUMMARY', JSON.stringify({
  totalGames: summary.totalGames,
  ended: summary.ended,
  stalled: summary.stalled,
  crashed: summary.crashed,
  withPageErrors: summary.withPageErrors,
  pageErrorSamples: summary.pageErrorSamples.slice(0, 10),
  touchSamples: summary.touchSamples.slice(0, 6),
}, null, 2));
