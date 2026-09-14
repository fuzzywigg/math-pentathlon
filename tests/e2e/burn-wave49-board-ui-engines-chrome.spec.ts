
/**
 * Wave 49 leftover after #221/#226/#227 — board-ui engine chrome (help Escape).
 * Distinct from wave47 leftover engines / wave48 calla-juggle-ramrod / demos/dice/graph.
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

for (const game of [
  { id: 'kwatro-sinko', sel: '.kwa-board, .kwa-svg, svg' },
  { id: 'par-55', sel: '.par55-board, .par55-svg, svg' },
  { id: 'queens-guards', sel: '.qg-board-container, svg, [data-cell-key]' },
  { id: 'contig-60', sel: '.contig-board, .contig-cell' },
] as const) {
  test.describe(`Wave 49 — ${game.id} board-ui chrome`, () => {
    test('help Escape keeps board mounted', async ({ page }) => {
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
