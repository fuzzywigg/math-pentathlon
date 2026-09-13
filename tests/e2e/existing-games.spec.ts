import { test, expect, Page } from '@playwright/test';

async function dismissModeIfNeeded(page: Page) {
  const modal = page.locator('#new-game-modal');
  if (await modal.isVisible().catch(() => false)) {
    const start = page.locator('#start-game-btn');
    if (await start.isVisible().catch(() => false)) {
      await start.click();
    }
  }
}

test.describe('Contig 60 — e2e smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/contig-60');
    await dismissModeIfNeeded(page);
  });

  test('loads title, board, and scores', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Contig 60');
    await expect(page.locator('.contig-board')).toBeVisible();
    await expect(page.locator('.contig-cell')).toHaveCount(60);
    await expect(page.locator('.contig-score-p1')).toBeVisible();
    await expect(page.locator('.contig-score-p2')).toBeVisible();
  });

  test('rolls dice and offers expressions or pass', async ({ page }) => {
    await page.locator('.contig-roll-btn').click();
    await expect(page.locator('.contig-dice-display')).toBeVisible();

    const expressions = page.locator('.contig-expressions');
    await expect(expressions).toBeVisible();

    const valid = page.locator('.contig-cell-valid');
    const pass = page.locator('.contig-pass-btn');
    const validCount = await valid.count();
    if (validCount > 0) {
      await valid.first().click();
      await expect(page.locator('.contig-roll-btn')).toBeVisible();
      await expect(page.locator('.contig-cell-p1')).toHaveCount(1);
    } else {
      await expect(pass).toBeVisible();
      await pass.click();
      await expect(page.locator('.contig-roll-btn')).toBeVisible();
    }
  });

  test('how to play modal opens', async ({ page }) => {
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
  });
});

test.describe('Sum Dominoes — e2e smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/sum-dominoes');
    await dismissModeIfNeeded(page);
  });

  test('loads title, board, hands, and dice CTA', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Sum Dominoes');
    await expect(page.locator('.sd-board')).toBeVisible();
    await expect(page.locator('.sd-hand-player1 .sd-hand-domino')).toHaveCount(
      7
    );
    await expect(page.locator('.sd-hand-player2 .sd-hand-domino')).toHaveCount(
      7
    );
    await expect(page.locator('.sd-roll-btn')).toBeVisible();
  });

  test('roll advances to place or pass UI', async ({ page }) => {
    await page.locator('.sd-roll-btn').click();
    await expect(page.locator('.sd-dice-display')).toBeVisible();

    const playable = page.locator('.sd-hand-domino-playable');
    const passBtn = page.locator('.sd-pass-btn');

    if ((await playable.count()) > 0) {
      await playable.first().click();
      await expect(page.locator('.sd-hand-domino-selected')).toBeVisible();
      const valid = page.locator('.sd-cell-valid');
      if ((await valid.count()) > 0) {
        await valid.first().click({ force: true });
        await expect(page.locator('.sd-roll-btn')).toBeVisible();
      }
    } else {
      await expect(passBtn).toBeVisible();
      await passBtn.click();
      await expect(page.locator('.sd-roll-btn')).toBeVisible();
    }
  });
});

test.describe('Star Track — e2e smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/star-track');
    await dismissModeIfNeeded(page);
  });

  test('loads title and track chrome', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Star Track');
    await expect(page.locator('.star-track-board')).toBeVisible();
    await expect(page.locator('.star-track-draw-btn')).toBeVisible();
    await expect(page.locator('.star-track-piece-p1')).toBeVisible();
    await expect(page.locator('.star-track-piece-p2')).toBeVisible();
  });

  test('draw → choose chain advances Blue progress', async ({ page }) => {
    await page.locator('.star-track-draw-btn').click();
    await expect(page.locator('.star-track-chain-btn')).toHaveCount(2);

    await page.locator('.star-track-chain-btn').first().click();
    // After P1 move, either draw button returns (P2 turn) or choices for next
    await expect(page.locator('.star-track-draw-btn')).toBeVisible();
    await expect(page.locator('.progress-p1')).toBeVisible();
  });

  test('new game modal resets to draw phase', async ({ page }) => {
    await page.locator('.star-track-draw-btn').click();
    await page.locator('.star-track-chain-btn').first().click();

    await page.click('#new-game-btn');
    await expect(page.locator('#new-game-modal')).not.toHaveClass(/hidden/);
    await page.click('#start-game-btn');
    await expect(page.locator('.star-track-draw-btn')).toBeVisible();
  });
});

test.describe('Kings & Quadraphages — e2e turn integrity', () => {
  test('illegal far click keeps selection; legal turn flips seat', async ({
    page,
  }) => {
    await page.goto('/#/game/kings-quadraphages');

    await page.locator('.cell[data-row="1"][data-col="5"]').click({ force: true });
    await expect(page.locator('.cell-selected')).toBeVisible();
    await expect(page.locator('.cell-valid-move')).toHaveCount(5);

    // Invalid destination — stay in move phase
    await page.locator('.cell[data-row="5"][data-col="5"]').click({ force: true });
    await expect(page.locator('.status-turn')).toContainText('green square');

    await page.locator('.cell[data-row="2"][data-col="5"]').click({ force: true });
    await expect(page.locator('.status-turn')).toContainText('Quadraphage');
    await page.locator('.cell[data-row="5"][data-col="5"]').click({ force: true });

    await expect(page.locator('.status-turn')).toContainText('Player 2');
    await expect(page.locator('.supply-p1')).toContainText('29');
  });
});
