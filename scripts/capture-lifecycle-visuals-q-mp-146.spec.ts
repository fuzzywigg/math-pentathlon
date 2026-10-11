/**
 * Capture contributor lifecycle screenshots for q-mp-146:
 *   menu → game mount → ← Games (destroy) → crash-boundary UI
 *
 * Crash UI is triggered the same way as tests/e2e/console-clean-on-load.spec.ts
 * (ErrorEvent with .error) — test-only harness, no product code edits.
 *
 * Run (not CI):
 *   npx playwright test -c playwright.lifecycle-visuals.config.ts
 *
 * Writes under docs/visuals/2026-10/lifecycle-*.png
 */
import { test, expect, type Page } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { dismissOwl } from './lib/dismiss-owl.mjs';
import { waitForGameReady as waitForShellReady } from './lib/page-ready.mjs';

const OUT_DIR = path.resolve('docs/visuals/2026-10');
const VIEWPORT = { width: 1024, height: 768 } as const;
const GAME_ID = 'hex';
const READY_TIMEOUT_MS = 15_000;

/** Shell ready (shared) plus Hex mount surface for lifecycle shots. */
async function waitForHexMounted(page: Page) {
  await waitForShellReady(page, { timeoutMs: READY_TIMEOUT_MS });
  await expect(page.locator('.hex-board, #board').first()).toBeVisible({
    timeout: READY_TIMEOUT_MS,
  });
}

async function waitForMenu(page: Page) {
  await expect(page.locator('.game-selector, .game-card').first()).toBeVisible({
    timeout: 15_000,
  });
}

async function shot(page: Page, filename: string) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const dest = path.join(OUT_DIR, filename);
  await page.screenshot({ path: dest, fullPage: false });
  expect(fs.existsSync(dest)).toBe(true);
  const stat = fs.statSync(dest);
  expect(stat.size).toBeGreaterThan(2_000);
}

test.describe('q-mp-146 lifecycle contributor visuals', () => {
  test('menu → mount → ← Games destroy → crash boundary', async ({ page }) => {
    await page.setViewportSize(VIEWPORT);

    // 1) Menu (game selector)
    await page.goto('/?board3d=0#/');
    await waitForMenu(page);
    await dismissOwl(page);
    await shot(page, 'lifecycle-menu.png');

    // 2) Mount Hex via registry card / hash route
    await page.goto(`/?board3d=0#/game/${GAME_ID}`);
    await waitForHexMounted(page);
    await dismissOwl(page);
    await expect(page.locator('#back-btn')).toBeVisible();
    await shot(page, 'lifecycle-game-mounted-hex.png');

    // 3) ← Games destroys the route (shell cleanup + destroyGame)
    await page.locator('#back-btn').click();
    await waitForMenu(page);
    await dismissOwl(page);
    await expect(page.getByTestId('game-error-boundary')).toHaveCount(0);
    await shot(page, 'lifecycle-after-back-to-games.png');

    // 4) Crash-boundary reset UI (test-only ErrorEvent; mirrors unit/e2e pins)
    await page.goto(`/?board3d=0#/game/${GAME_ID}`);
    await waitForHexMounted(page);
    await dismissOwl(page);

    await page.evaluate(() => {
      window.dispatchEvent(
        new ErrorEvent('error', {
          error: new Error('q-mp-146-lifecycle-boundary-probe'),
          message: 'q-mp-146-lifecycle-boundary-probe',
        })
      );
    });

    const boundary = page.getByTestId('game-error-boundary');
    await expect(boundary).toBeVisible({ timeout: 5_000 });
    await expect(boundary).toContainText(/Something went wrong/i);
    await expect(page.locator('[data-action="reset"]')).toBeVisible();
    await shot(page, 'lifecycle-crash-boundary-hex.png');

    // 5) Try again remounts (reset path pinned in game-error-boundary tests)
    await page.locator('[data-action="reset"]').click();
    await waitForHexMounted(page);
    await dismissOwl(page);
    await expect(page.getByTestId('game-error-boundary')).toHaveCount(0);
    await expect(page.locator('h1')).toContainText('Hex');
    await shot(page, 'lifecycle-crash-boundary-reset-hex.png');
  });
});
