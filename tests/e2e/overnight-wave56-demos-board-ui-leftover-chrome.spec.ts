/**
 * Wave 56 leftover after #256 — demos + juggle/ramrod board-ui chrome.
 * Distinct from #256 kings/hex/par and #252 wave55 leftover selectors.
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

test.describe('Wave 56 leftover — juggle roll chrome', () => {
  test('opening shows Roll Dice on /game/juggle', async ({ page }) => {
    await page.goto('/#/game/juggle');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.juggle-board').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.juggle-roll-btn')).toHaveText(/Roll Dice/);
    await expect(page.locator('.juggle-board.active, .juggle-board').first()).toBeVisible();
  });
});

test.describe('Wave 56 leftover — ramrod sum labels chrome', () => {
  test('opening boxes show Sum labels on /game/ramrod', async ({ page }) => {
    await page.goto('/#/game/ramrod');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.ramrod-board, .ramrod-grid').first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('.ramrod-box-label').first()).toContainText(/Sum:/);
    await expect(page.locator('.ramrod-scores .label').first()).toContainText(/Blue/i);
  });
});

test.describe('Wave 56 leftover — graph star template chrome', () => {
  test('star template selects and fills Nodes info on /demo/graph', async ({
    page,
  }) => {
    await page.goto('/#/demo/graph');
    await expect(page.locator('h1')).toContainText(/Graph/i);
    await page.locator('.template-btn[data-template="star"]').click();
    await expect(page.locator('.template-btn[data-template="star"]')).toHaveClass(
      /selected/
    );
    await expect(page.locator('#template-info')).toContainText(/Nodes:\s*7/);
    await expect(page.locator('#template-graph .graph-node').first()).toBeVisible();
  });
});

test.describe('Wave 56 leftover — dice Possible Sums chrome', () => {
  test('Possible Sums section mounts on /demo/dice', async ({ page }) => {
    await page.goto('/#/demo/dice');
    await expect(page.locator('h1')).toContainText(/Dice/i);
    await expect(
      page.getByRole('heading', { name: 'Possible Sums Display' })
    ).toBeVisible();
    await expect(page.locator('#selector-sums')).toBeVisible();
  });
});

test.describe('Wave 56 leftover — attr filtering chrome', () => {
  test('Attribute Filtering heading mounts on /demo/attributes', async ({ page }) => {
    await page.goto('/#/demo/attributes');
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 10000 });
    await expect(
      page.getByRole('heading', { name: 'Attribute Filtering' })
    ).toBeVisible();
    await expect(page.locator('.set-btn[data-set="basic"]')).toContainText(/Basic/);
  });
});
