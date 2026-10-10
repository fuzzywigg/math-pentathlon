/**
 * Shared page-ready / navigation helpers for Playwright harness scripts
 * under `scripts/`.
 *
 * Canonical behavior matches the former `runtime-perf.mjs` /
 * `render-perf.mjs` copies (hash-route goto + board3d query, loading chrome
 * wait, human-vs-human modal start). Imports shared `dismissOwl` so harnesses
 * do not re-define owl dismissal.
 *
 * e2e specs should keep using `tests/e2e/helpers/page.ts` — this module is
 * for plain `.mjs` harnesses that cannot import that TypeScript helper.
 */

import { dismissOwl } from './dismiss-owl.mjs';

/**
 * Wait until the game shell is past the loading marker and chrome is visible.
 *
 * @param {import('@playwright/test').Page} page
 * @param {{ timeoutMs?: number }} [options]
 * @returns {Promise<void>}
 */
export async function waitForGameReady(page, options = {}) {
  const timeoutMs = options.timeoutMs ?? 20_000;
  await page
    .locator('[data-testid="game-loading"]')
    .waitFor({ state: 'hidden', timeout: timeoutMs })
    .catch(() => {});
  await page
    .locator('#new-game-btn, h1')
    .first()
    .waitFor({ timeout: timeoutMs });
}

/**
 * Navigate to a game hash route (optional `?board3d=1`), wait for ready, dismiss owl.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} baseURL
 * @param {string} gameId
 * @param {boolean} [board3d]
 * @returns {Promise<void>}
 */
export async function gotoGame(page, baseURL, gameId, board3d = false) {
  const q = board3d ? '?board3d=1' : '';
  await page.goto(`${baseURL}/${q}#/game/${gameId}`, {
    waitUntil: 'domcontentloaded',
  });
  await waitForGameReady(page);
  await dismissOwl(page);
}

/**
 * Start human-vs-human when the New Game modal is visible; always dismiss owl.
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
export async function startHuman(page) {
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
