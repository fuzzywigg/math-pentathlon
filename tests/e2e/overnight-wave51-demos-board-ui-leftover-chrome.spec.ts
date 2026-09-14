/**
 * Overnight TOKENMAXX HEAVY leftovers after #234 — demos + prime/frac/pent chrome.
 * Distinct from #235/#236 hex/par/kwatro/sum/stars/remainder/fiar drafts.
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

test.describe('Wave 51 leftover — dice confirm log chrome', () => {
  test('2d6 Confirm paints ✓ Confirmed on /demo/dice', async ({ page }) => {
    await page.goto('/#/demo/dice');
    await expect(page.locator('h1')).toContainText(/Dice/i);
    const box = page.locator('#selector-2d6');
    await expect(box).toBeVisible({ timeout: 8000 });
    await box.getByRole('button', { name: /^Roll$/i }).click();
    await page.waitForTimeout(1100);
    await box.locator('.die-wrapper').first().click();
    await box.getByRole('button', { name: /Confirm/i }).click();
    await expect(page.locator('#log-2d6')).toContainText(/Confirmed/i);
  });
});

test.describe('Wave 51 leftover — fraction gallery decimal chrome', () => {
  test('gallery items expose .decimal on /demo/fractions', async ({ page }) => {
    await page.goto('/#/demo/fractions');
    await expect(page.locator('h1')).toContainText(/Fraction/i);
    await expect(page.locator('#fraction-gallery .gallery-item').first()).toBeVisible({
      timeout: 8000,
    });
    await expect(
      page.locator('#fraction-gallery .gallery-item .decimal').first()
    ).toBeVisible();
    await expect(page.locator('#back-btn')).toBeVisible();
  });
});

test.describe('Wave 51 leftover — poly CW chrome', () => {
  test('Rotate clockwise stays visible after shape select on /demo/polyomino', async ({
    page,
  }) => {
    await page.goto('/#/demo/polyomino');
    await expect(page.locator('h1')).toContainText(/Polyomino/i);
    await page.locator('.set-btn[data-set="tetrominoes"]').click();
    await page.locator('#shape-gallery > *').first().click();
    await expect(
      page.locator('#rotation-controls button[title="Rotate clockwise"]')
    ).toBeVisible();
    await page.locator('#rotation-controls button[title="Rotate clockwise"]').click();
    await expect(page.locator('#selected-shape svg')).toBeVisible();
  });
});

for (const game of [
  { id: 'prime-gold', sel: '.pg-board, .pg-board-container, .pg-move-history' },
  { id: 'frac-fact', sel: '.frac-scores, .frac-problem' },
  { id: 'pent-em-in', sel: '.pent-board, .pent-piece-selector' },
] as const) {
  test.describe(`Wave 51 leftover — ${game.id} residual chrome`, () => {
    test('help Escape keeps residual board chrome', async ({ page }) => {
      await page.goto(`/#/game/${game.id}`);
      await dismissModeIfNeeded(page);
      await expect(page.locator(game.sel).first()).toBeVisible({ timeout: 10000 });
      await page.click('#help-btn');
      await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
      await page.keyboard.press('Escape');
      await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
      await expect(page.locator(game.sel).first()).toBeVisible();
    });
  });
}
