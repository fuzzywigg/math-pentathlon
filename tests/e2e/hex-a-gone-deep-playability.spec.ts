/**
 * Hex-a-Gone deep playability e2e: full vs-AI games, AI think budget,
 * tablet cell hit targets ≥44px, HvA status copy.
 */
import { test, expect, type Page } from '@playwright/test';

async function dismissOwl(page: Page) {
  await page.evaluate(() => {
    const el = document.getElementById('ollie-owl');
    if (el) (el as HTMLElement).style.pointerEvents = 'none';
  });
}

async function startVsAi(page: Page, difficulty: 'easy' | 'medium' | 'hard') {
  await page.goto('/#/game/hex-a-gone');
  await expect(page.getByTestId('game-loading')).toBeHidden({ timeout: 15_000 });
  await expect(page.locator('#new-game-btn')).toBeVisible({ timeout: 15_000 });
  await dismissOwl(page);
  await page.locator('#new-game-btn').click();
  const modal = page.locator('#new-game-modal');
  await expect(modal).toBeVisible({ timeout: 10_000 });
  await page.locator('.mode-option[data-mode="human-vs-ai"]').click();
  await page.locator(`.difficulty-btn.${difficulty}`).click();
  await page.locator('#start-game-btn').click();
  await expect(modal).toHaveClass(/hidden/);
  await expect(page.locator('.hex-a-gone-board').first()).toBeVisible({
    timeout: 15_000,
  });
  await dismissOwl(page);
}

async function playHumanTriangleTurn(page: Page) {
  const tri = page.locator(
    '.hex-a-gone-block-btn[data-shape="triangle"]:not(.empty)'
  );
  await expect(tri).toBeVisible({ timeout: 10_000 });
  await tri.click();
  await page.locator('.hex-a-gone-confirm-btn').click();
  const valid = page.locator('.hex-a-gone-cell-valid').first();
  await expect(valid).toBeVisible({ timeout: 5_000 });
  await valid.click();
}

test.describe('Hex-a-Gone deep playability', () => {
  test('Easy vs AI completes a full game; AI think stays under 3s', async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await startVsAi(page, 'easy');

    // Opening status should say Your turn (not Blue)
    await expect(page.locator('.hex-a-gone-status .status-turn')).toContainText(
      /Your turn|You:/
    );

    let maxThink = 0;
    for (let turn = 0; turn < 30; turn++) {
      const status = page.locator('.hex-a-gone-status .status-turn');
      const text = await status.innerText();
      if (/win/i.test(text)) break;

      await playHumanTriangleTurn(page);

      const thinking = page.locator('.status-ai-thinking');
      const saw = await thinking
        .waitFor({ state: 'visible', timeout: 2500 })
        .then(() => true)
        .catch(() => false);
      if (saw) {
        const t0 = Date.now();
        await thinking.waitFor({ state: 'hidden', timeout: 5000 });
        maxThink = Math.max(maxThink, Date.now() - t0);
      }

      const after = await status.innerText();
      if (/win/i.test(after)) break;
    }

    await expect(page.locator('.status-winner, .hex-a-gone-winner')).toBeVisible(
      { timeout: 15_000 }
    );
    expect(maxThink).toBeLessThan(3000);
  });

  test('tablet viewport: bank/confirm/cells meet 44px floor', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await startVsAi(page, 'medium');

    await page
      .locator('.hex-a-gone-block-btn[data-shape="triangle"]:not(.empty)')
      .click();

    const sizes = await page.evaluate(() => {
      const box = (sel: string) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { w: r.width, h: r.height };
      };
      return {
        block: box('.hex-a-gone-block-btn:not(.empty)'),
        confirm: box('.hex-a-gone-confirm-btn'),
        cell: box('.hex-a-gone-cell'),
      };
    });

    expect(sizes.block).toBeTruthy();
    expect(sizes.block!.h).toBeGreaterThanOrEqual(44);
    expect(sizes.block!.w).toBeGreaterThanOrEqual(44);
    expect(sizes.confirm).toBeTruthy();
    expect(sizes.confirm!.h).toBeGreaterThanOrEqual(44);
    expect(sizes.cell).toBeTruthy();
    // Bounding box of pointy hex — both axes should clear 44 after size bump
    expect(Math.min(sizes.cell!.w, sizes.cell!.h)).toBeGreaterThanOrEqual(44);
  });
});
