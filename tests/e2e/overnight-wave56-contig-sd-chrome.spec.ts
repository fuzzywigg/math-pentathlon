/**
 * Wave 56 leftover after #243 — Contig/SD Escape remount chrome.
 * Distinct from wave53 contig-only and open #257–#268 slices.
 * Existing selectors only. Tests-only.
 */
import { test, expect, Page } from '@playwright/test';

async function dismissModeIfNeeded(page: Page) {
  const modal = page.locator('#new-game-modal');
  if (await modal.isVisible().catch(() => false)) {
    const human = page.locator(
      'input[value="human-vs-human"], input[value="vs-human"]'
    );
    if (await human.count()) {
      await human.first().check({ force: true }).catch(() => undefined);
    }
    const start = page.locator('#start-game-btn');
    if (await start.isVisible().catch(() => false)) {
      await start.click();
    }
  }
}

const leftovers = [
  {
    id: 'contig-60',
    sel: '.contig-board, .contig-dice-area, .contig-scores, .contig-status',
  },
  {
    id: 'sum-dominoes',
    sel: '.sd-board, .sd-dice-area, .sd-status, .sd-game-area',
  },
] as const;

for (const game of leftovers) {
  test.describe(`Wave 56 — ${game.id} leftover chrome`, () => {
    test('help Escape keeps status/board leftover chrome mounted', async ({
      page,
    }) => {
      await page.goto(`/#/game/${game.id}`);
      await dismissModeIfNeeded(page);
      await expect(page.locator(game.sel).first()).toBeVisible({
        timeout: 10000,
      });
      await page.click('#help-btn');
      await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
      await page.keyboard.press('Escape');
      await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
      await expect(page.locator(game.sel).first()).toBeVisible();
    });
  });
}
