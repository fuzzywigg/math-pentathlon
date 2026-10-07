/**
 * Queens & Guards playability e2e — touch targets, AI-seat lock, full Easy game.
 * Chromium only (matches deep playtest harness).
 */
import { test, expect, type Page } from '@playwright/test';

test.describe('Queens & Guards playability', () => {
  test.describe.configure({ mode: 'serial' });

  test.skip(
    ({ browserName }) => browserName !== 'chromium',
    'Deep playtest targets Chromium'
  );

  async function waitReady(page: Page) {
    await expect(page.getByTestId('game-loading')).toBeHidden({
      timeout: 15_000,
    });
    await expect(page.locator('#new-game-btn')).toBeVisible({ timeout: 15_000 });
  }

  async function dismissOwl(page: Page) {
    await page.evaluate(() => {
      const el = document.getElementById('ollie-owl');
      if (el) (el as HTMLElement).style.pointerEvents = 'none';
    });
  }

  async function startVsAi(page: Page, difficulty: 'easy' | 'medium' | 'hard') {
    await waitReady(page);
    await dismissOwl(page);
    await page.locator('#new-game-btn').click();
    await expect(page.locator('#new-game-modal')).toBeVisible();
    await page.locator('.mode-option[data-mode="human-vs-ai"]').click();
    await page.locator(`.difficulty-btn.${difficulty}`).click();
    await page.locator('#start-game-btn').click();
    await expect(page.locator('#new-game-modal')).toHaveClass(/hidden/);
    await dismissOwl(page);
    await expect(page.locator('.qg-board-container svg.qg-board')).toBeVisible({
      timeout: 10_000,
    });
  }

  test('tablet hex cells clear 44px CSS tap targets', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 768, height: 1024 },
      hasTouch: true,
      isMobile: true,
    });
    const page = await context.newPage();
    await page.goto('/#/game/queens-guards');
    await startVsAi(page, 'easy');

    const metrics = await page.evaluate(() => {
      const svg = document.querySelector('.qg-board-container svg');
      const path = document.querySelector(
        '.qg-board-container svg g[data-cell-key] path'
      );
      if (!svg || !path) throw new Error('board missing');
      const pb = path.getBoundingClientRect();
      return {
        svgW: svg.getBoundingClientRect().width,
        pathW: pb.width,
        pathH: pb.height,
      };
    });
    expect(metrics.svgW).toBeGreaterThanOrEqual(650);
    expect(metrics.pathW).toBeGreaterThanOrEqual(44);
    expect(metrics.pathH).toBeGreaterThanOrEqual(44);
    await context.close();
  });

  test('AI thinking locks board aria and suppresses valid-move chrome', async ({
    page,
  }) => {
    await page.goto('/#/game/queens-guards');
    await startVsAi(page, 'hard');

    // Select + move a Blue piece via aria labels.
    await page.evaluate(() => {
      const blues = [
        ...document.querySelectorAll(
          '.qg-board-container svg g[aria-label*="Blue"]'
        ),
      ] as SVGGElement[];
      for (const g of blues) {
        g.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        const valids = [
          ...document.querySelectorAll(
            '.qg-board-container svg g[aria-label*="valid move"]'
          ),
        ] as SVGGElement[];
        if (valids[0]) {
          valids[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
          return;
        }
      }
      throw new Error('no legal blue move');
    });

    await expect(page.locator('.status-ai-thinking')).toBeVisible({
      timeout: 5_000,
    });
    await expect(page.locator('.qg-status')).toContainText(/thinking/i);

    const locked = await page.evaluate(() => {
      const cells = [
        ...document.querySelectorAll('.qg-board-container svg g[data-cell-key]'),
      ];
      return {
        allDisabled: cells.every(
          (c) => c.getAttribute('aria-disabled') === 'true'
        ),
        anyValid: cells.some((c) =>
          (c.getAttribute('aria-label') || '').includes('valid move')
        ),
        anySelectable: cells.some((c) =>
          (c.getAttribute('aria-label') || '').includes('selectable')
        ),
        sample: cells[0]?.getAttribute('aria-label') || '',
      };
    });
    expect(locked.allDisabled).toBe(true);
    expect(locked.anyValid).toBe(false);
    expect(locked.anySelectable).toBe(false);
    expect(locked.sample).toMatch(/not available/);

    // Wait for human seat to return (Hard budget ≤2.5s + paint).
    await expect(page.locator('.qg-status')).toContainText(/Blue's turn/i, {
      timeout: 12_000,
    });
  });

  test('Easy vs AI completes a full game without console errors', async ({
    page,
  }) => {
    test.setTimeout(180_000);
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/#/game/queens-guards');
    await startVsAi(page, 'easy');

    const deadline = Date.now() + 150_000;
    while (Date.now() < deadline) {
      const status =
        (await page.locator('.qg-status, .qg-winner-banner').textContent()) ||
        '';
      if (/wins/i.test(status)) break;

      if (
        /thinking/i.test(status) ||
        (/Red's turn/i.test(status) && !/Blue's turn/i.test(status))
      ) {
        await expect(page.locator('.qg-status, .qg-winner-banner')).toContainText(
          /Blue's turn|wins/i,
          { timeout: 20_000 }
        );
        continue;
      }

      // Complete one Blue ply: select a piece that has moves, then tap a target
      // (and finish restore if a capture left pieces pending).
      for (let step = 0; step < 10; step++) {
        const phase = await page.evaluate(() => {
          const cells = [
            ...document.querySelectorAll(
              '.qg-board-container svg g[data-cell-key]'
            ),
          ] as SVGGElement[];
          const label = (g: Element) => g.getAttribute('aria-label') || '';
          const statusText =
            document.querySelector('.qg-status, .qg-winner-banner')
              ?.textContent || '';
          if (/wins|thinking/i.test(statusText)) return 'done';
          if (/Red's turn/i.test(statusText) && !/Blue's turn/i.test(statusText)) {
            return 'ai';
          }

          const captured = cells.filter((g) => label(g).includes('captured'));
          const valids = cells.filter((g) => label(g).includes('valid move'));
          if (captured.length && valids.length) {
            valids[Math.floor(Math.random() * valids.length)]!.dispatchEvent(
              new MouseEvent('click', { bubbles: true })
            );
            return 'restore-place';
          }
          if (captured.length) {
            captured[0]!.dispatchEvent(
              new MouseEvent('click', { bubbles: true })
            );
            return 'restore-select';
          }
          if (valids.length) {
            valids[Math.floor(Math.random() * valids.length)]!.dispatchEvent(
              new MouseEvent('click', { bubbles: true })
            );
            return 'moved';
          }
          const blue = cells.filter(
            (g) =>
              label(g).includes('Blue') &&
              (label(g).includes('Guard') || label(g).includes('Queen'))
          );
          for (const piece of [...blue].sort(() => Math.random() - 0.5)) {
            piece.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            // Re-query after click (board may re-render)
            return 'try-select';
          }
          return 'stuck';
        });
        await page.waitForTimeout(60);
        if (phase === 'done' || phase === 'ai' || phase === 'moved' || phase === 'restore-place') {
          break;
        }
        if (phase === 'stuck') break;
      }
    }

    await expect(page.locator('.qg-winner-banner')).toBeVisible({
      timeout: 10_000,
    });
    expect(errors.filter((e) => !/favicon/i.test(e))).toEqual([]);
  });
});
