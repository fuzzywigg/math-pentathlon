/**
 * Wave 55 leftover after #250 — demos + juggle/ramrod board-ui chrome.
 * Distinct from #251 calla leftover pit/help and #243 contig dice/board.
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

test.describe('Wave 55 leftover — juggle fill-percent chrome', () => {
  test('opening board shows 0% fill on /game/juggle', async ({ page }) => {
    await page.goto('/#/game/juggle');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.juggle-board').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.fill-percent').first()).toHaveText(/0%/);
    await expect(page.locator('.juggle-roll-btn, .juggle-dice-area').first()).toBeVisible();
  });
});

test.describe('Wave 55 leftover — ramrod scores/hand chrome', () => {
  test('Goal cm scores and in-hand rods stay mounted on /game/ramrod', async ({
    page,
  }) => {
    await page.goto('/#/game/ramrod');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.ramrod-board, .ramrod-grid').first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('.ramrod-scores')).toContainText(/Goal:\s*24cm/);
    await expect(page.locator('.ramrod-rod.in-hand').first()).toBeVisible();
    await expect(page.locator('.ramrod-hand-label.player1')).toContainText(/Blue/i);
  });
});

test.describe('Wave 55 leftover — poly pentominoes Can Flip chrome', () => {
  test('pentominoes shape-info shows Can Flip on /demo/polyomino', async ({ page }) => {
    await page.goto('/#/demo/polyomino');
    await expect(page.locator('h1')).toContainText(/Polyomino/i);
    await page.locator('.set-btn[data-set="pentominoes"]').click();
    await page.locator('#shape-gallery > *').first().click();
    await expect(page.locator('#shape-info')).toContainText(/Can Flip/);
    await expect(page.locator('#selected-shape svg')).toBeVisible();
  });
});

test.describe('Wave 55 leftover — graph hex template chrome', () => {
  test('hex lattice template selects and fills Nodes info on /demo/graph', async ({
    page,
  }) => {
    await page.goto('/#/demo/graph');
    await expect(page.locator('h1')).toContainText(/Graph/i);
    await page.locator('.template-btn[data-template="hex"]').click();
    await expect(page.locator('.template-btn[data-template="hex"]')).toHaveClass(/selected/);
    await expect(page.locator('#template-info')).toContainText(/Nodes:/);
    await expect(page.locator('#template-graph .graph-node').first()).toBeVisible();
  });
});
