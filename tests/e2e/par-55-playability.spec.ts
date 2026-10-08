/**
 * Par 55 playability — Chromium tablet + desktop × Easy/Med/Hard + New Game race.
 */
import { test, expect, devices } from '@playwright/test';
import { dismissOwl } from './helpers/page';

const DIFFS = ['easy', 'medium', 'hard'] as const;

async function startVsAi(
  page: import('@playwright/test').Page,
  difficulty: (typeof DIFFS)[number]
) {
  await page.goto('/#/game/par-55', { waitUntil: 'domcontentloaded' });
  await page
    .getByTestId('game-loading')
    .waitFor({ state: 'hidden', timeout: 20_000 })
    .catch(() => {});
  await page.locator('.par55-board, #new-game-btn').first().waitFor({
    timeout: 20_000,
  });
  await dismissOwl(page);
  await page.locator('#new-game-btn').click();
  const modal = page.locator('#new-game-modal');
  await modal.waitFor({ state: 'visible', timeout: 10_000 });
  await page.locator('.mode-option[data-mode="human-vs-ai"]').click();
  await page.locator(`.difficulty-btn.${difficulty}`).click();
  await page.locator('#start-game-btn').click();
  await expect(modal).toBeHidden({ timeout: 10_000 }).catch(async () => {
    const cls = await modal.getAttribute('class');
    expect(cls ?? '').toContain('hidden');
  });
  await dismissOwl(page);
  await expect(page.locator('.par55-board')).toBeVisible({ timeout: 10_000 });
}

async function playOneHumanTurn(page: import('@playwright/test').Page) {
  const action = await page.evaluate(() => {
    const pass = [
      ...document.querySelectorAll('.par55-controls .par55-btn'),
    ].find((b) => /pass/i.test(b.textContent || ''));
    if (pass) {
      pass.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      return 'pass';
    }
    const block = document.querySelector(
      '.par55-hand-block.clickable'
    ) as HTMLElement | null;
    if (!block) return 'no-block';
    block.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const hit =
      document.querySelector('.par55-base-hit') ||
      document.querySelector('.par55-valid-base');
    if (!hit) return 'no-base';
    hit.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    return 'place';
  });
  expect(['pass', 'place']).toContain(action);
}

test.describe('Par 55 playability', () => {
  for (const difficulty of DIFFS) {
    test(`desktop vs AI ${difficulty} — one full handoff`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await startVsAi(page, difficulty);
      await expect(page.locator('.par55-status')).toContainText(
        /Tap a block from your hand/
      );

      const hand = page.locator('.par55-hand-block.clickable').first();
      const box = await hand.boundingBox();
      expect(box).toBeTruthy();
      expect(box!.width).toBeGreaterThanOrEqual(44);
      expect(box!.height).toBeGreaterThanOrEqual(44);

      await playOneHumanTurn(page);
      await expect(page.locator('.par55-status')).toContainText(
        /Computer is thinking|Tap a block from your hand|wins!|tie/i,
        { timeout: 8_000 }
      );
      // Eventually Blue to move again or game over
      await expect
        .poll(
          async () => {
            const t =
              (await page.locator('.par55-status').textContent()) || '';
            return /Tap a block|wins!|tie/i.test(t);
          },
          { timeout: 12_000 }
        )
        .toBe(true);
    });
  }

  test('tablet touch floors + New Game race', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPad Mini'],
      viewport: { width: 768, height: 1024 },
    });
    const page = await context.newPage();
    await startVsAi(page, 'medium');

    const hand = page.locator('.par55-hand-block.clickable').first();
    const handBox = await hand.boundingBox();
    expect(handBox).toBeTruthy();
    expect(handBox!.width).toBeGreaterThanOrEqual(44);
    expect(handBox!.height).toBeGreaterThanOrEqual(44);

    await playOneHumanTurn(page);
    await expect(page.locator('.par55-status')).toContainText(
      /Computer is thinking/i,
      { timeout: 5_000 }
    );

    await page.locator('#new-game-btn').click();
    const modal = page.locator('#new-game-modal');
    await modal.waitFor({ state: 'visible', timeout: 10_000 });
    await page.locator('.mode-option[data-mode="human-vs-ai"]').click();
    await page.locator('.difficulty-btn.medium').click();
    await page.locator('#start-game-btn').click();
    await page.waitForTimeout(1000);

    const after = await page.evaluate(() => ({
      status:
        document.querySelector('.par55-status')?.textContent?.trim() ?? '',
      history: document.querySelectorAll('.par55-history-move').length,
      clickable: document.querySelectorAll('.par55-hand-block.clickable')
        .length,
    }));
    expect(after.history).toBe(0);
    expect(after.clickable).toBeGreaterThan(0);
    expect(after.status).toMatch(/Tap a block from your hand/);
    expect(after.status).not.toMatch(/Computer is thinking/i);

    await context.close();
  });
});
