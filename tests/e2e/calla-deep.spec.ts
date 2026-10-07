/**
 * Calla deep playtest e2e — human-vs-AI finish paths, seat copy, touch targets.
 * Desktop + tablet Chromium. Complements the offline harness script.
 */
import { test, expect, type Page } from '@playwright/test';

async function dismissOwl(page: Page) {
  await page.evaluate(() => {
    const el = document.getElementById('ollie-owl');
    if (el) (el as HTMLElement).style.pointerEvents = 'none';
  });
}

async function startCallaVsAi(
  page: Page,
  difficulty: 'easy' | 'medium' | 'hard'
) {
  await page.goto('/#/game/calla');
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
  await dismissOwl(page);
  await expect(page.locator('.calla-wrapper').first()).toBeVisible();
}

async function playToEnd(page: Page, maxSteps = 80) {
  for (let i = 0; i < maxSteps; i++) {
    const status = (
      (await page.locator('.status-turn').textContent()) || ''
    ).replace(/\s+/g, ' ');
    if (/win|tie/i.test(status)) return status.trim();

    if (/thinking/i.test(status)) {
      await page
        .waitForFunction(() => {
          const t = (
            document.querySelector('.status-turn')?.textContent || ''
          ).toLowerCase();
          return !t.includes('thinking');
        }, undefined, { timeout: 12_000 })
        .catch(() => undefined);
      continue;
    }

    const valid = page.locator('.calla-pit-valid');
    if ((await valid.count()) === 0) {
      await page.waitForTimeout(300);
      continue;
    }
    await valid.first().click({ force: true });
    await page.waitForTimeout(50);
  }
  return ((await page.locator('.status-turn').textContent()) || '').trim();
}

for (const viewport of [
  { name: 'desktop', width: 1280, height: 800, hasTouch: false },
  { name: 'tablet', width: 768, height: 1024, hasTouch: true },
] as const) {
  test.describe(`Calla deep (${viewport.name})`, () => {
    test.use({
      viewport: { width: viewport.width, height: viewport.height },
      hasTouch: viewport.hasTouch,
      isMobile: viewport.name === 'tablet',
    });

    test('vs-AI Easy reaches an end with You/AI copy (not Blue)', async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(String(e)));
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
      });

      await startCallaVsAi(page, 'easy');

      // Opening seat copy should say Your turn, not Blue's
      await expect(page.locator('.status-turn')).toContainText(/Your turn/i);
      await expect(page.locator('.status-turn')).not.toContainText(/Blue/i);

      // Pit hit targets measure ≥44 CSS px on this viewport
      const minHit = await page.evaluate(() => {
        const board = document.querySelector('.calla-board') as SVGSVGElement | null;
        const hit = document.querySelector('.calla-pit-hit');
        if (!board || !hit) return 0;
        const r = Number(hit.getAttribute('r') || 0);
        const vb = board.viewBox.baseVal.width || 500;
        const cssW = board.getBoundingClientRect().width;
        return (r * 2 * cssW) / vb;
      });
      expect(minHit).toBeGreaterThanOrEqual(44);

      const end = await playToEnd(page);
      expect(end).toMatch(/win|tie/i);
      expect(end).not.toMatch(/You Wins/i);
      expect(end).not.toMatch(/\bBlue\b|\bRed\b/);
      expect(errors).toEqual([]);
    });

    test('vs-AI Medium finishes without stall', async ({ page }) => {
      await startCallaVsAi(page, 'medium');
      const end = await playToEnd(page);
      expect(end).toMatch(/win|tie/i);
    });

    test('vs-AI Hard finishes; AI think chrome stays under 5s samples', async ({
      page,
    }) => {
      await startCallaVsAi(page, 'hard');
      const thinkTimes: number[] = [];

      for (let i = 0; i < 60; i++) {
        const status = (
          (await page.locator('.status-turn').textContent()) || ''
        ).replace(/\s+/g, ' ');
        if (/win|tie/i.test(status)) break;
        if (/thinking/i.test(status)) {
          const t0 = Date.now();
          await page.waitForFunction(() => {
            const t = (
              document.querySelector('.status-turn')?.textContent || ''
            ).toLowerCase();
            return !t.includes('thinking');
          }, undefined, { timeout: 12_000 });
          thinkTimes.push(Date.now() - t0);
          continue;
        }
        const valid = page.locator('.calla-pit-valid');
        if ((await valid.count()) === 0) {
          await page.waitForTimeout(200);
          continue;
        }
        await valid.first().click({ force: true });
      }

      const end = (
        (await page.locator('.status-turn').textContent()) || ''
      ).trim();
      expect(end).toMatch(/win|tie/i);
      // Free-turn chains keep thinking chrome continuously (delay × chain length).
      for (const ms of thinkTimes) {
        expect(ms).toBeLessThan(5000);
      }
    });
  });
}
