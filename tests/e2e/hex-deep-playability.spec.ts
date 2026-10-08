/**
 * Hex deep playability e2e — 44px cells, AI-seat chrome, Easy full game.
 * Chromium only (matches deep playtest harness).
 */
import { test, expect, type Page } from '@playwright/test';
import {
  dismissOwl,
  startVsAiAt,
} from './helpers/page';

test.describe('Hex deep playability', () => {
  test.describe.configure({ mode: 'serial' });

  test.skip(
    ({ browserName }) => browserName !== 'chromium',
    'Deep playtest targets Chromium'
  );

  test('desktop + tablet hex cells clear 44px CSS tap targets', async ({
    browser,
  }) => {
    for (const vp of [
      { width: 1280, height: 800, hasTouch: false, isMobile: false },
      { width: 768, height: 1024, hasTouch: true, isMobile: true },
    ]) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        hasTouch: vp.hasTouch,
        isMobile: vp.isMobile,
      });
      const page = await context.newPage();
      await startVsAiAt(page, 'hex', 'easy');

      const metrics = await page.evaluate(() => {
        const svg = document.querySelector('svg.hex-board');
        const poly = document.querySelector('.hex-cell-empty, .hex-cell');
        if (!svg || !poly) throw new Error('board missing');
        const pb = poly.getBoundingClientRect();
        const sb = svg.getBoundingClientRect();
        return {
          svgW: sb.width,
          cellW: pb.width,
          cellH: pb.height,
          status:
            document.querySelector('.hex-status .status-turn')?.textContent ||
            '',
        };
      });

      expect(metrics.svgW).toBeGreaterThanOrEqual(790);
      expect(metrics.cellW).toBeGreaterThanOrEqual(44);
      expect(metrics.cellH).toBeGreaterThanOrEqual(44);
      expect(metrics.status).toMatch(/Your turn — Tap an empty hex/);
      expect(metrics.status).not.toMatch(/Click/);

      await context.close();
    }
  });

  test('AI thinking chrome appears after human place; Easy game completes', async ({
    page,
  }) => {
    test.setTimeout(180_000);
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await startVsAiAt(page, 'hex', 'easy');

    let maxThink = 0;
    const deadline = Date.now() + 150_000;
    while (Date.now() < deadline) {
      const status =
        (await page.locator('.hex-status .status-turn').textContent()) || '';
      if (/win/i.test(status)) break;

      if (await page.locator('.status-ai-thinking').isVisible()) {
        const t0 = Date.now();
        await page.locator('.status-ai-thinking').waitFor({
          state: 'hidden',
          timeout: 15_000,
        });
        maxThink = Math.max(maxThink, Date.now() - t0);
        continue;
      }

      await page.evaluate(() => {
        const empties = [
          ...document.querySelectorAll('.hex-cell-group'),
        ].filter((g) => g.querySelector('.hex-cell-empty'));
        empties.sort((a, b) => {
          const ar = +a.getAttribute('data-row')!;
          const ac = +a.getAttribute('data-col')!;
          const br = +b.getAttribute('data-row')!;
          const bc = +b.getAttribute('data-col')!;
          return Math.abs(ac - 5) - Math.abs(bc - 5) || br - ar;
        });
        const pick = empties[Math.floor(Math.random() * Math.min(6, empties.length))];
        pick?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });

      await page
        .locator('.status-ai-thinking, .status-winner')
        .first()
        .waitFor({ state: 'visible', timeout: 4_000 })
        .catch(() => {});
    }

    await expect(page.locator('.status-winner')).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('.status-winner')).toContainText(
      /You win!|AI Wins!/i
    );
    expect(maxThink).toBeLessThan(4000);
    expect(errors).toEqual([]);
  });
});
