/**
 * MP-3D — Kwatro-Sinko Three.js board behind board3d flag.
 * Captures before (2D) + after (3D) screenshots for PR evidence.
 */
import { test } from './fixtures';
import { expect, Page } from '@playwright/test';
import {
  MP3D_HEAVY_TEST_TIMEOUT_MS,
  board3dUrl,
  disableBoard3d,
  enableBoard3dLowQuality,
  waitForMp3dReady,
} from './helpers/mp3d';
import * as fs from 'node:fs';
import * as path from 'node:path';

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'tablet', width: 768, height: 1024 },
] as const;

async function waitForKwatroShell(page: Page) {
  // After #369 the game chunk loads async — wait past the loading state.
  await expect(page.getByRole('heading', { name: 'Kwatro-Sinko' })).toBeVisible(
    { timeout: 15000 }
  );
  await expect(page.locator('[data-testid="game-loading"]')).toHaveCount(0);
}

async function dismissKwatroModeIfNeeded(page: Page) {
  await waitForKwatroShell(page);
  const modal = page.locator('#new-game-modal');
  if (await modal.isVisible().catch(() => false)) {
    const human = page.locator(
      'input[value="human-vs-human"], input[value="vs-human"]'
    );
    if (await human.count()) {
      await human
        .first()
        .check({ force: true })
        .catch(() => undefined);
    }
    const start = page.locator('#start-game-btn');
    if (await start.isVisible().catch(() => false)) {
      await start.click();
    }
  }
}

async function clickBoardNode(page: Page, nodeId: string) {
  await page.waitForFunction(
    () =>
      typeof (
        window as unknown as {
          __mp3dKwatroSinko?: { nodeToClientPoint: unknown };
        }
      ).__mp3dKwatroSinko?.nodeToClientPoint === 'function'
  );
  const pt = await page.evaluate((id) => {
    const api = (
      window as unknown as {
        __mp3dKwatroSinko: {
          nodeToClientPoint: (
            nodeId: string
          ) => { x: number; y: number } | null;
        };
      }
    ).__mp3dKwatroSinko;
    return api.nodeToClientPoint(id);
  }, nodeId);
  expect(pt).toBeTruthy();
  await page.mouse.click(pt!.x, pt!.y);
  await page.waitForTimeout(150);
}

test.describe('mp3d Kwatro-Sinko 3D board', () => {
  test.describe.configure({ mode: 'serial' });

  test('flag off keeps classic 2D SVG and captures before screenshots', async ({
    page,
  }) => {
    const threeRequests: string[] = [];
    page.on('request', (req) => {
      // Only the Three.js vendor chunk — not `/src/ui/three/*` helpers
      // (tablet-gl readiness/fallback is safe to import with board3d off).
      if (req.url().includes('vendor/three')) {
        threeRequests.push(req.url());
      }
    });

    await disableBoard3d(page);

    const outDir = path.resolve('docs/screenshots/mp3d');
    fs.mkdirSync(outDir, { recursive: true });

    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(
        `/?board3d=0&vp=${vp.name}&t=${Date.now()}#/game/kwatro-sinko`
      );
      await dismissKwatroModeIfNeeded(page);
      await expect(page.locator('.kwa-board svg').first()).toBeVisible({
        timeout: 10000,
      });
      await expect(
        page.locator('canvas[data-mp3d="kwatro-sinko"]')
      ).toHaveCount(0);
      await expect(page.locator('.kwa-board [data-node-id]')).toHaveCount(25);
      await page.waitForTimeout(300);

      const beforePath = path.join(
        outDir,
        `kwatro-sinko-2d-before-${vp.name}.png`
      );
      await page.locator('.kwa-board').screenshot({ path: beforePath });
      expect(fs.statSync(beforePath).size).toBeGreaterThan(1000);
    }

    await page.waitForTimeout(200);
    expect(threeRequests).toEqual([]);
  });

  test('flag on: start + mid-game screenshots via 3D clicks', async ({
    page,
  }) => {
    test.setTimeout(MP3D_HEAVY_TEST_TIMEOUT_MS);
    await enableBoard3dLowQuality(page);

    const outDir = path.resolve('docs/screenshots/mp3d');
    fs.mkdirSync(outDir, { recursive: true });

    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(
        `/?board3d=1&board3dLQ=1&vp=${vp.name}&t=${Date.now()}#/game/kwatro-sinko`
      );
      await dismissKwatroModeIfNeeded(page);

      const canvas = page.locator('canvas[data-mp3d="kwatro-sinko"]');
      await waitForMp3dReady(page, 'kwatro-sinko');
      await expect(page.locator('.kwa-board svg')).toHaveCount(0);
      await expect(page.locator('.kwa-a11y-grid [data-node-id]')).toHaveCount(
        25
      );

      const startPath = path.join(
        outDir,
        `kwatro-sinko-3d-start-${vp.name}.png`
      );
      await canvas.screenshot({ path: startPath });
      expect(fs.statSync(startPath).size).toBeGreaterThan(1000);

      // Blue chip at n0-2 (value 4) → first step toward center n1-2
      await clickBoardNode(page, 'n0-2');
      await clickBoardNode(page, 'n1-2');
      // Red reply: n4-2 → n3-2
      await clickBoardNode(page, 'n4-2');
      await clickBoardNode(page, 'n3-2');
      await page.waitForTimeout(250);

      const midPath = path.join(outDir, `kwatro-sinko-3d-mid-${vp.name}.png`);
      await canvas.screenshot({ path: midPath });
      expect(fs.statSync(midPath).size).toBeGreaterThan(1000);
    }
  });

  test('keyboard a11y grid can select a chip', async ({ page }) => {
    await enableBoard3dLowQuality(page);
    await page.goto(board3dUrl('#/game/kwatro-sinko'));
    await dismissKwatroModeIfNeeded(page);
    await waitForMp3dReady(page, 'kwatro-sinko');

    const cell = page.locator('.kwa-a11y-grid [data-node-id="n0-0"]');
    await cell.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.kwa-status')).toContainText(/green space/i, {
      timeout: 8_000,
    });
  });

  test('smoke selectors drive a human move + AI reply on 3D host', async ({
    page,
  }) => {
    test.setTimeout(MP3D_HEAVY_TEST_TIMEOUT_MS);
    await enableBoard3dLowQuality(page);
    await page.goto(board3dUrl('#/game/kwatro-sinko'));
    await waitForKwatroShell(page);

    // Same New Game → vs AI → Easy path as tests/e2e/smoke.spec.ts
    await page.locator('#new-game-btn').click();
    const modal = page.locator('#new-game-modal');
    await expect(modal).toBeVisible({ timeout: 10_000 });
    await page.locator('.mode-option[data-mode="human-vs-ai"]').click();
    const easy = page.locator('.difficulty-btn.easy');
    if (await easy.isVisible().catch(() => false)) {
      await easy.click();
    }
    await page.locator('#start-game-btn').click();
    await expect(modal).toHaveClass(/hidden/);

    // waitForMp3dReady skips on Firefox when WebGL never mounts (harness).
    await waitForMp3dReady(page, 'kwatro-sinko');
    await expect(page.locator('.kwa-board')).toHaveCount(1);
    await expect(page.locator('.kwa-board')).toBeVisible();
    await expect(page.locator('.kwa-board svg')).toHaveCount(0);

    const historyBefore = await page.locator('.kwa-history li').count();

    const chip = page.locator('.kwa-selectable-chip').first();
    await expect(chip).toBeVisible({ timeout: 5000 });
    await chip.click({ force: true });
    const dest = page.locator('.kwa-valid-node').first();
    await expect(dest).toBeVisible({ timeout: 5000 });
    await dest.click({ force: true });

    await expect
      .poll(async () => page.locator('.kwa-history li').count(), {
        timeout: 45_000,
      })
      .toBeGreaterThan(historyBefore);
  });
});
