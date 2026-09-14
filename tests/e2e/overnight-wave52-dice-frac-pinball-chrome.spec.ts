/**
 * Overnight HEAVY leftover after #234 — dice/fractions demos + frac/pinball game chrome.
 * Distinct from wave50 prime/frac/pent and open #235/#236 hex chrome. Tests-only.
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

test.describe('Wave 52 — dice demo chrome', () => {
  test('selector + quick-roll mount on /demo/dice', async ({ page }) => {
    await page.goto('/#/demo/dice');
    await expect(page.locator('h1, .dice-demo').first()).toBeVisible({ timeout: 10000 });
    await expect(
      page.locator('.dice-selector, .quick-roll-btn').first()
    ).toBeVisible();
    await expect(page.locator('.back-link, #back-btn').first()).toBeVisible();
  });
});

test.describe('Wave 52 — fractions demo chrome', () => {
  test('fraction bar chrome mounts on /demo/fractions', async ({ page }) => {
    await page.goto('/#/demo/fractions');
    await expect(page.locator('h1')).toContainText(/Fraction/i, { timeout: 10000 });
    await expect(
      page.locator('.fraction-bar, svg.fraction-bar, #fraction-bars, .frac-demo').first()
    ).toBeVisible();
    await expect(page.locator('.back-link, #back-btn').first()).toBeVisible();
  });
});

for (const game of [
  {
    id: 'frac-fact',
    sel: '.frac-progress-text, .frac-problem, .frac-scores',
  },
  {
    id: 'fraction-pinball',
    sel: '.pinball-board, .pinball-challenge, .pinball-balls',
  },
] as const) {
  test.describe(`Wave 52 — ${game.id} leftover chrome`, () => {
    test('help Escape keeps board chrome mounted', async ({ page }) => {
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
