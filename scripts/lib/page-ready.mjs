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
 *
 * This file is a library module. Direct CLI entry prints usage only:
 *   node scripts/lib/page-ready.mjs [--help]
 * Unknown flags exit 2. Import from harnesses (e.g. runtime-perf, mobile-audit).
 */

import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { dismissOwl } from './dismiss-owl.mjs';
import { parseHelpOnlyArgv } from './help-only-cli.mjs';

export const PAGE_READY_USAGE = `Usage: node scripts/lib/page-ready.mjs [--help]

Library module — import from harness scripts (e.g. scripts/runtime-perf.mjs,
scripts/render-perf.mjs, scripts/mobile-audit.mjs, scripts/console-sweep.mjs).
Not a standalone CLI.

Options:
  -h, --help    Show this help and exit`;

/**
 * Wait until the game shell is past the loading marker and chrome is visible.
 * `[data-testid="game-load-error"]` fails readiness (waits until cleared or
 * times out) — shell `h1` / `#new-game-btn` alone are not enough when a lazy
 * chunk failed (q-mp-1294). Success chrome: `#new-game-btn, h1` after the
 * load-error slot is clear (that alert occupies the game mount).
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
  // Detached = already clear; visible stuck error → timeout (not ready).
  await page
    .locator('[data-testid="game-load-error"]')
    .waitFor({ state: 'hidden', timeout: timeoutMs });
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
  // Strip trailing slashes so `baseURL/` does not become `//#/game/…`.
  const base = String(baseURL ?? '').replace(/\/+$/, '');
  const q = board3d ? '?board3d=1' : '';
  await page.goto(`${base}/${q}#/game/${gameId}`, {
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

/**
 * CLI entry when this file is executed directly (q-mp-958).
 * Import-as-library path is unchanged (no side effects on import).
 *
 * @param {string[]} [argv]
 */
export function main(argv = process.argv.slice(2)) {
  const parsed = parseHelpOnlyArgv(argv);
  if (parsed.kind === 'error') {
    console.error(`Unknown flag: ${parsed.flag}`);
    console.error(PAGE_READY_USAGE);
    process.exit(2);
  }
  // --help / -h, bare main, or stray positionals: usage only (not runnable).
  console.log(PAGE_READY_USAGE);
  process.exit(0);
}

const isMain =
  Boolean(process.argv[1]) &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isMain) {
  main();
}
