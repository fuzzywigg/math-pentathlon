/**
 * Headless Chromium deep playtest — Fab-a-Diffy human vs AI.
 * Runs ≥10 full games per difficulty × (desktop, tablet).
 * Writes JSON summary + screenshots under docs/playtest/.
 *
 * Usage: node tests/playtest/fab-a-diffy-deep.mjs
 * Requires: npm run dev on :5173 (or PLAYTEST_BASE_URL).
 */
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.PLAYTEST_BASE_URL || 'http://localhost:5173';
const GAMES_PER = Number(process.env.PLAYTEST_GAMES_PER || 10);
const OUT_DIR = path.resolve('docs/playtest');
const SHOT_DIR = path.join(OUT_DIR, 'fab-a-diffy-deep-2026-10-07');
const ART_DIR = '/opt/cursor/artifacts/fab-a-diffy-playtest';

const ALL_VIEWPORTS = {
  desktop: { width: 1280, height: 800 },
  tablet: { width: 768, height: 1024 },
};
const ONLY_VP = process.env.PLAYTEST_ONLY_VP;
const ONLY_DIFF = process.env.PLAYTEST_ONLY_DIFF;
const VIEWPORTS = ONLY_VP
  ? { [ONLY_VP]: ALL_VIEWPORTS[ONLY_VP] }
  : ALL_VIEWPORTS;

const DIFFICULTIES = ONLY_DIFF ? [ONLY_DIFF] : ['easy', 'medium', 'hard'];

async function dismissOwl(page) {
  await page.evaluate(() => {
    const el = document.getElementById('ollie-owl');
    if (el) el.style.pointerEvents = 'none';
  });
}

async function startVsAi(page, difficulty) {
  await page.goto(`${BASE}/#/game/fab-a-diffy`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#new-game-btn', { timeout: 20_000 });
  await dismissOwl(page);
  await page.locator('#new-game-btn').click();
  await page.locator('.mode-option[data-mode="human-vs-ai"]').click();
  await page.locator(`.difficulty-btn.${difficulty}`).click();
  await page.locator('#start-game-btn').click();
  await page.waitForSelector('.fab-bar-pool', { timeout: 15_000 });
  await dismissOwl(page);
}

async function waitNotThinking(page, timeout = 25_000) {
  const thinking = page.locator('.fab-status.status-ai-thinking');
  if (await thinking.isVisible().catch(() => false)) {
    await thinking.waitFor({ state: 'hidden', timeout });
  }
}

/** Find a valid human claim via DOM probing. */
async function humanClaim(page) {
  await waitNotThinking(page);
  if (await page.locator('.fab-winner-banner').isVisible().catch(() => false)) {
    return 'ended';
  }
  const passBtn = page.locator('.fab-btn-secondary', { hasText: 'Pass Turn' });
  if (await passBtn.isVisible().catch(() => false)) {
    await passBtn.click({ force: true });
    return 'pass';
  }

  const clear = page.locator('.fab-btn-secondary', { hasText: 'Clear Selection' });
  const ids = await page.$$eval(
    '.fab-bar-wrapper:not(.fab-bar-disabled)',
    (els) => els.map((e) => e.getAttribute('data-bar-id')).filter(Boolean)
  );
  if (ids.length < 2) return 'stuck';

  for (let i = 0; i < ids.length; i++) {
    for (let j = 0; j < ids.length; j++) {
      if (i === j) continue;
      await waitNotThinking(page);
      if (await page.locator('.fab-winner-banner').isVisible().catch(() => false)) {
        return 'ended';
      }
      if (await clear.isVisible().catch(() => false)) {
        await clear.click({ force: true });
      }
      const b1 = page.locator(`[data-bar-id="${ids[i]}"]`);
      const b2 = page.locator(`[data-bar-id="${ids[j]}"]`);
      if ((await b1.count()) === 0 || (await b2.count()) === 0) continue;
      if (await b1.evaluate((el) => el.classList.contains('fab-bar-disabled'))) {
        continue;
      }
      await b1.click({ force: true });
      if (await b2.evaluate((el) => el.classList.contains('fab-bar-disabled'))) {
        if (await clear.isVisible().catch(() => false)) await clear.click({ force: true });
        continue;
      }
      await b2.click({ force: true });
      const validOp = page.locator('.fab-op-valid').first();
      if (!(await validOp.isVisible().catch(() => false))) {
        if (await clear.isVisible().catch(() => false)) await clear.click({ force: true });
        continue;
      }
      await validOp.click({ force: true });
      const match = page.locator('.fab-answer-matchable').first();
      try {
        await match.waitFor({ state: 'attached', timeout: 2_000 });
        await match.scrollIntoViewIfNeeded();
        await match.click({ force: true });
        return 'claim';
      } catch {
        if (await clear.isVisible().catch(() => false)) await clear.click({ force: true });
        continue;
      }
    }
  }
  if (await passBtn.isVisible().catch(() => false)) {
    await passBtn.click({ force: true });
    return 'pass';
  }
  // Recover soft-stuck confirmingMove before reporting stall
  if (await clear.isVisible().catch(() => false)) {
    await clear.click({ force: true });
  }
  return 'stuck';
}

async function playOneGame(page, difficulty) {
  const errors = [];
  const onConsole = (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  };
  page.on('console', onConsole);
  const pageErrors = [];
  page.on('pageerror', (err) => pageErrors.push(String(err)));

  const t0 = Date.now();
  await startVsAi(page, difficulty);

  let claims = 0;
  let passes = 0;
  let stalls = 0;
  let aiThinkMs = 0;
  let maxAiThink = 0;

  for (let ply = 0; ply < 50; ply++) {
    if (await page.locator('.fab-winner-banner').isVisible().catch(() => false)) {
      break;
    }
    const result = await humanClaim(page);
    if (result === 'claim') claims++;
    else if (result === 'pass') passes++;
    else if (result === 'ended') break;
    else {
      stalls++;
      break;
    }

    const thinking = page.locator('.fab-status.status-ai-thinking');
    if (await thinking.isVisible().catch(() => false)) {
      // Verify input lock while thinking
      const selectable = await page
        .locator('.fab-bar-wrapper:not(.fab-bar-disabled)')
        .count();
      if (selectable !== 0) {
        errors.push('AI-seat lock failed: selectable bars while thinking');
      }
      const tThink = Date.now();
      await thinking.waitFor({ state: 'hidden', timeout: 30_000 }).catch(() => {
        errors.push('AI think stall (>30s)');
      });
      const dt = Date.now() - tThink;
      aiThinkMs += dt;
      maxAiThink = Math.max(maxAiThink, dt);
    }
  }

  const winnerVisible = await page
    .locator('.fab-winner-banner')
    .isVisible()
    .catch(() => false);
  const history = await page.locator('.fab-history-move').count();
  const scores = await page.locator('.fab-score-value').allTextContents();
  const status = (await page.locator('.fab-status').textContent()) || '';

  page.off('console', onConsole);

  return {
    difficulty,
    durationMs: Date.now() - t0,
    claims,
    passes,
    stalls,
    history,
    scores,
    winnerVisible,
    status: status.trim(),
    aiThinkMs,
    maxAiThink,
    consoleErrors: errors.filter((e) => !/favicon/i.test(e)),
    pageErrors,
    ok:
      stalls === 0 &&
      pageErrors.length === 0 &&
      errors.filter((e) => /stall|lock failed|AI:/i.test(e)).length === 0 &&
      (winnerVisible || history > 0 || claims + passes > 0),
  };
}

async function main() {
  fs.mkdirSync(SHOT_DIR, { recursive: true });
  fs.mkdirSync(ART_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const summary = {
    base: BASE,
    gamesPer: GAMES_PER,
    startedAt: new Date().toISOString(),
    results: [],
    screenshots: [],
  };

  for (const [vpName, viewport] of Object.entries(VIEWPORTS)) {
    for (const difficulty of DIFFICULTIES) {
      for (let g = 1; g <= GAMES_PER; g++) {
        const context = await browser.newContext({
          viewport,
          hasTouch: vpName === 'tablet',
          isMobile: vpName === 'tablet',
        });
        const page = await context.newPage();
        let result;
        try {
          result = await playOneGame(page, difficulty);
          result.viewport = vpName;
          result.gameIndex = g;

          // Screenshots: first game of each combo + any failure
          if (g === 1 || !result.ok) {
            const name = `fab-${vpName}-${difficulty}-g${g}.png`;
            const p1 = path.join(SHOT_DIR, name);
            const p2 = path.join(ART_DIR, name);
            await page.screenshot({ path: p1, fullPage: true });
            fs.copyFileSync(p1, p2);
            summary.screenshots.push(name);
            // Mid-think shot when possible
            if (g === 1 && difficulty === 'hard') {
              // restart briefly for thinking chrome
            }
          }
        } catch (err) {
          result = {
            viewport: vpName,
            difficulty,
            gameIndex: g,
            ok: false,
            error: String(err),
            consoleErrors: [],
            pageErrors: [String(err)],
          };
          const name = `fab-${vpName}-${difficulty}-g${g}-error.png`;
          try {
            await page.screenshot({
              path: path.join(SHOT_DIR, name),
              fullPage: true,
            });
            summary.screenshots.push(name);
          } catch {
            /* ignore */
          }
        }
        summary.results.push(result);
        console.log(
          JSON.stringify({
            viewport: vpName,
            difficulty,
            game: g,
            ok: result.ok,
            history: result.history,
            maxAiThink: result.maxAiThink,
            errors: result.consoleErrors?.length || 0,
          })
        );
        await context.close();
      }
    }
  }

  // Dedicated thinking / human-turn screenshots
  if (!process.env.PLAYTEST_SKIP_EXTRA_SHOTS) {
    const context = await browser.newContext({ viewport: VIEWPORTS.desktop });
    const page = await context.newPage();
    await startVsAi(page, 'medium');
    await page.screenshot({
      path: path.join(SHOT_DIR, 'fab-desktop-human-turn.png'),
      fullPage: true,
    });
    fs.copyFileSync(
      path.join(SHOT_DIR, 'fab-desktop-human-turn.png'),
      path.join(ART_DIR, 'fab-desktop-human-turn.png')
    );
    summary.screenshots.push('fab-desktop-human-turn.png');

    // Trigger AI think
    await humanClaim(page);
    const thinking = page.locator('.fab-status.status-ai-thinking');
    if (await thinking.isVisible().catch(() => false)) {
      await page.screenshot({
        path: path.join(SHOT_DIR, 'fab-desktop-ai-thinking.png'),
        fullPage: true,
      });
      fs.copyFileSync(
        path.join(SHOT_DIR, 'fab-desktop-ai-thinking.png'),
        path.join(ART_DIR, 'fab-desktop-ai-thinking.png')
      );
      summary.screenshots.push('fab-desktop-ai-thinking.png');
    }

    const contextT = await browser.newContext({
      viewport: VIEWPORTS.tablet,
      hasTouch: true,
      isMobile: true,
    });
    const pageT = await contextT.newPage();
    await startVsAi(pageT, 'easy');
    await pageT.screenshot({
      path: path.join(SHOT_DIR, 'fab-tablet-human-turn.png'),
      fullPage: true,
    });
    fs.copyFileSync(
      path.join(SHOT_DIR, 'fab-tablet-human-turn.png'),
      path.join(ART_DIR, 'fab-tablet-human-turn.png')
    );
    summary.screenshots.push('fab-tablet-human-turn.png');
    await contextT.close();
    await context.close();
  }

  summary.finishedAt = new Date().toISOString();
  const passed = summary.results.filter((r) => r.ok).length;
  const failed = summary.results.filter((r) => !r.ok).length;
  summary.totals = {
    games: summary.results.length,
    passed,
    failed,
    consoleErrorGames: summary.results.filter(
      (r) => (r.consoleErrors || []).length > 0
    ).length,
    stallGames: summary.results.filter((r) => (r.stalls || 0) > 0).length,
    avgMaxAiThink: Math.round(
      summary.results.reduce((n, r) => n + (r.maxAiThink || 0), 0) /
        Math.max(1, summary.results.length)
    ),
  };

  const suffix =
    ONLY_VP || ONLY_DIFF
      ? `-${ONLY_VP || 'all'}-${ONLY_DIFF || 'all'}`
      : '';
  const jsonPath = path.join(SHOT_DIR, `summary${suffix}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(summary, null, 2));
  fs.copyFileSync(jsonPath, path.join(ART_DIR, path.basename(jsonPath)));
  if (!suffix) {
    fs.copyFileSync(jsonPath, path.join(ART_DIR, 'summary.json'));
  }
  console.log('SUMMARY', JSON.stringify(summary.totals, null, 2));
  await browser.close();
  if (failed > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
