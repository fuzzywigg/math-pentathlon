/**
 * Kings deep-playtest e2e guards (tablet + desktop Chromium):
 * touch cell size, vs-AI You copy, AI input lock, full game reaches end.
 */
import { test, expect, devices, type Page } from '@playwright/test';

async function waitForGameReady(page: Page) {
  await expect(page.getByTestId('game-loading')).toBeHidden({
    timeout: 15_000,
  });
  await expect(page.locator('#new-game-btn, h1').first()).toBeVisible({
    timeout: 15_000,
  });
}

async function startVsAi(page: Page, difficulty: 'easy' | 'medium' | 'hard') {
  await page.goto('/#/game/kings-quadraphages');
  await waitForGameReady(page);

  const modal = page.locator('#new-game-modal');
  if (!(await modal.isVisible().catch(() => false))) {
    await page.locator('#new-game-btn').click();
  }
  await expect(modal).toBeVisible();

  const aiOpt = page.locator('.mode-option[data-mode="human-vs-ai"]');
  if (await aiOpt.isVisible().catch(() => false)) {
    await aiOpt.click();
  }
  const diffBtn = page.locator(
    `.difficulty-btn[data-difficulty="${difficulty}"]`
  );
  if (await diffBtn.isVisible().catch(() => false)) {
    await diffBtn.click();
  }
  await page.locator('#start-game-btn').click();
  await expect(modal).toHaveClass(/hidden/);
  await expect(page.locator('.board.kings-board .cell').first()).toBeVisible();
}

async function playHumanTurn(page: Page) {
  const status = page.locator('.status-turn');
  const text = (await status.textContent()) || '';
  if (/Win|Tie|Game Over|thinking/i.test(text)) return;

  if (!(await page.locator('.cell-selected').count())) {
    await page.locator('.cell-king.cell-p1').first().click({ force: true });
  }
  const move = page.locator('.cell-valid-move').first();
  await expect(move).toBeVisible({ timeout: 3000 });
  await move.click({ force: true });
  const place = page.locator('.cell-valid-placement').first();
  await expect(place).toBeVisible({ timeout: 3000 });
  await place.click({ force: true });
}

test.describe('Kings deep playability', () => {
  test('desktop: You copy, ≥44px cells, AI lock, Easy game ends', async ({
    page,
  }) => {
    await startVsAi(page, 'easy');

    await expect(page.locator('.status-mode')).toContainText('vs AI (Easy)');
    await expect(page.locator('.status-turn')).toHaveText(
      'You: Click your King to select it'
    );
    await expect(page.locator('.supply-p1')).toContainText('You');
    await expect(page.locator('.supply-p2')).toContainText('AI');

    const cellBox = await page.locator('.board .cell').first().boundingBox();
    expect(cellBox).toBeTruthy();
    expect(cellBox!.width).toBeGreaterThanOrEqual(44);
    expect(cellBox!.height).toBeGreaterThanOrEqual(44);

    await playHumanTurn(page);
    await expect(page.locator('.status-ai-thinking')).toBeVisible({
      timeout: 2000,
    });
    const histBefore = await page.locator('.move-history-entry').count();
    await page.locator('.cell').nth(4).click({ force: true });
    await page.locator('.cell-king.cell-p1').click({ force: true }).catch(() => {});
    expect(await page.locator('.move-history-entry').count()).toBe(histBefore);

    await expect(page.locator('.status-ai-thinking')).toBeHidden({
      timeout: 10_000,
    });
    await expect(page.locator('.status-turn')).toContainText('You:');

    // Finish a short Easy game (cap turns; supply-tie or trap both OK).
    for (let i = 0; i < 80; i++) {
      const turn = (await page.locator('.status-turn').textContent()) || '';
      if (/Win|Tie|Game Over/i.test(turn)) break;
      if (/thinking/i.test(turn)) {
        await page
          .locator('.status-ai-thinking')
          .waitFor({ state: 'hidden', timeout: 10_000 })
          .catch(() => {});
        continue;
      }
      await playHumanTurn(page);
      await page
        .locator('.status-ai-thinking')
        .waitFor({ state: 'visible', timeout: 1500 })
        .catch(() => {});
      await page
        .locator('.status-ai-thinking')
        .waitFor({ state: 'hidden', timeout: 10_000 })
        .catch(() => {});
    }

    const end = (await page.locator('.status-turn').textContent()) || '';
    const winner = (await page.locator('.status-winner').textContent()) || '';
    expect(`${end} ${winner}`).toMatch(/Win|Tie|Game Over/i);
    // Must not leak HvH "Player 1/2 wins" wording in vs-AI end chrome.
    expect(end).not.toMatch(/Player [12] wins/i);
  });
});

test.describe('Kings deep playability (tablet)', () => {
  test.use({ ...devices['iPad Mini'] });

  test('tablet: 44px cells + Medium reaches end without Player N copy', async ({
    page,
  }) => {
    await startVsAi(page, 'medium');

    await expect(page.locator('.status-turn')).toHaveText(
      'You: Click your King to select it'
    );

    const cellBox = await page.locator('.board .cell').first().boundingBox();
    expect(cellBox).toBeTruthy();
    expect(cellBox!.width).toBeGreaterThanOrEqual(43.5);
    expect(cellBox!.height).toBeGreaterThanOrEqual(43.5);

    for (let i = 0; i < 90; i++) {
      const turn = (await page.locator('.status-turn').textContent()) || '';
      if (/Win|Tie|Game Over/i.test(turn)) break;
      if (/thinking/i.test(turn)) {
        await page
          .locator('.status-ai-thinking')
          .waitFor({ state: 'hidden', timeout: 10_000 })
          .catch(() => {});
        continue;
      }
      await playHumanTurn(page);
      await page
        .locator('.status-ai-thinking')
        .waitFor({ state: 'visible', timeout: 1500 })
        .catch(() => {});
      await page
        .locator('.status-ai-thinking')
        .waitFor({ state: 'hidden', timeout: 10_000 })
        .catch(() => {});
    }

    const end = (await page.locator('.status-turn').textContent()) || '';
    const winner = (await page.locator('.status-winner').textContent()) || '';
    expect(`${end} ${winner}`).toMatch(/Win|Tie|Game Over/i);
    expect(end).not.toMatch(/Player [12]/);
  });
});
