/**
 * Mobile viewport smoke: every available game loads on phone-sized
 * viewports with no horizontal document scroll.
 *
 * Devices match the 2026-10-07 mobile audit (iPhone SE 375×667, Pixel 7).
 */
import { test, expect, devices, type Page } from '@playwright/test';
import { GAMES } from '../../src/core/game-registry';

const AVAILABLE_GAMES = GAMES.filter((g) => g.available);

const MOUNT: Record<string, string> = {
  'kings-quadraphages': '#board .board .cell, .cell-king',
  hex: '.hex-board',
  'star-track': '.star-track-board',
  'hex-a-gone': '.hex-a-gone-board',
  calla: '.calla-wrapper, .calla-pit',
  'sum-dominoes': '.sd-board',
  'par-55': '.par55-board',
  ramrod: '.ramrod-board',
  'kwatro-sinko': '.kwa-board',
  fiar: '.fiar-board-container',
  juggle: '.juggle-board',
  'contig-60': '.contig-board',
  'stars-bars': '.stars-board',
  'fab-a-diffy': '.fab-bar-pool, .fab-answer-board',
  'queens-guards': '.qg-board-container',
  'prime-gold': '.pg-board, .prime-board',
  'remainder-islands': '.remainder-board',
  'pent-em-in': '.pent-board',
  'frac-fact': '.frac-problem, .frac-choice-btn',
  'fraction-pinball':
    '.pinball-board, .pinball-challenge, .pinball-game-container, .pinball-choice-btn',
};

const PHONES = [
  {
    name: 'iPhone SE',
    ...devices['iPhone SE'],
    viewport: { width: 375, height: 667 },
  },
  {
    name: 'Pixel 7',
    ...devices['Pixel 7'],
    viewport: { width: 412, height: 915 },
  },
] as const;

async function waitForGameReady(page: Page) {
  await expect(page.getByTestId('game-loading')).toBeHidden({
    timeout: 15_000,
  });
  await expect(page.locator('#new-game-btn, h1').first()).toBeVisible({
    timeout: 15_000,
  });
}

async function startHuman(page: Page) {
  await waitForGameReady(page);
  const modal = page.locator('#new-game-modal');
  if (await modal.isVisible().catch(() => false)) {
    const human = page.locator('.mode-option[data-mode="human-vs-human"]');
    if (await human.isVisible().catch(() => false)) {
      await human.click();
    }
    await page.locator('#start-game-btn').click();
    await expect(modal).toHaveClass(/hidden/);
  }
}

async function assertNoHorizontalScroll(page: Page) {
  const metrics = await page.evaluate(() => {
    const de = document.documentElement;
    const body = document.body;
    return {
      scrollWidth: Math.max(de.scrollWidth, body.scrollWidth),
      clientWidth: Math.max(de.clientWidth, body.clientWidth),
    };
  });
  expect(
    metrics.scrollWidth,
    `horizontal overflow: scrollWidth=${metrics.scrollWidth} clientWidth=${metrics.clientWidth}`
  ).toBeLessThanOrEqual(metrics.clientWidth + 1);
}

for (const phone of PHONES) {
  test.describe(`Mobile viewport smoke — ${phone.name}`, () => {
    test.use({
      ...phone,
      hasTouch: true,
      isMobile: true,
    });

    for (const game of AVAILABLE_GAMES) {
      test(`${game.id} loads without horizontal scroll`, async ({ page }) => {
        test.setTimeout(60_000);
        await page.goto(`/#/game/${game.id}`);
        await startHuman(page);

        const mountSel = MOUNT[game.id] ?? '#board, #game-container, main';
        await expect(page.locator(mountSel).first()).toBeVisible({
          timeout: 15_000,
        });

        await assertNoHorizontalScroll(page);
      });
    }
  });
}
