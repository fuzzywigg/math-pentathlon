/**
 * Kings deep-playtest e2e guards (tablet + desktop Chromium):
 * touch cell size, vs-AI You copy, AI input lock, full game reaches end.
 */
import { test, expect, devices, type Page } from '@playwright/test';
import {
  waitForGameReady,
  startVsAiAt,
} from './helpers/page';

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
    test.setTimeout(120_000);
    await startVsAiAt(page, 'kings-quadraphages', 'easy');

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
    // Input lock: human clicks during AI think must not append 🔵 entries.
    // AI may still append 🟣 history while the thinking chrome is up (especially
    // with compressed setTimeout in this harness), so do not freeze total count.
    const humanHist = page.locator('.move-history-entry').filter({ hasText: '🔵' });
    const humanBefore = await humanHist.count();
    await page.locator('.cell').nth(4).click({ force: true });
    await page.locator('.cell-king.cell-p1').click({ force: true }).catch(() => {});
    expect(await humanHist.count()).toBe(humanBefore);

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
  // Omit defaultBrowserType (webkit) so this stays on the chromium project worker.
  const iPadMini = devices['iPad Mini'];
  test.use({
    userAgent: iPadMini.userAgent,
    viewport: iPadMini.viewport,
    deviceScaleFactor: iPadMini.deviceScaleFactor,
    isMobile: iPadMini.isMobile,
    hasTouch: iPadMini.hasTouch,
  });

  test('tablet: 44px cells + Medium reaches end without Player N copy', async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await startVsAiAt(page, 'kings-quadraphages', 'medium');

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
