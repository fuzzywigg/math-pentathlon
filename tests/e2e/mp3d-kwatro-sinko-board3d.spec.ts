/**
 * MP-3D — Kwatro-Sinko Three.js board behind board3d flag.
 * Captures before (2D) + after (3D) screenshots for PR evidence.
 */
import { test, expect, Page } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'tablet', width: 768, height: 1024 },
] as const;

async function dismissModeIfNeeded(page: Page) {
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
      if (req.url().includes('vendor/three') || req.url().includes('/three')) {
        threeRequests.push(req.url());
      }
    });

    await page.addInitScript(() => {
      localStorage.removeItem('mp-board3d');
    });

    const outDir = path.resolve('docs/screenshots/mp3d');
    fs.mkdirSync(outDir, { recursive: true });

    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`/?board3d=0&vp=${vp.name}&t=${Date.now()}#/game/kwatro-sinko`);
      await dismissModeIfNeeded(page);
      await expect(page.locator('.kwa-board svg').first()).toBeVisible({
        timeout: 10000,
      });
      await expect(page.locator('canvas[data-mp3d="kwatro-sinko"]')).toHaveCount(
        0
      );
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
    await page.addInitScript(() => {
      localStorage.setItem('mp-board3d', '1');
    });

    const outDir = path.resolve('docs/screenshots/mp3d');
    fs.mkdirSync(outDir, { recursive: true });

    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(
        `/?board3d=1&vp=${vp.name}&t=${Date.now()}#/game/kwatro-sinko`
      );
      await dismissModeIfNeeded(page);

      const canvas = page.locator('canvas[data-mp3d="kwatro-sinko"]');
      await expect(canvas).toBeVisible({ timeout: 15000 });
      await expect(page.locator('.kwa-board svg')).toHaveCount(0);
      await expect(page.locator('.kwa-a11y-grid [data-node-id]')).toHaveCount(
        25
      );
      await page.waitForTimeout(400);

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
    await page.addInitScript(() => {
      localStorage.setItem('mp-board3d', '1');
    });
    await page.goto('/?board3d=1#/game/kwatro-sinko');
    await dismissModeIfNeeded(page);
    await expect(page.locator('canvas[data-mp3d="kwatro-sinko"]')).toBeVisible({
      timeout: 15000,
    });

    const cell = page.locator('.kwa-a11y-grid [data-node-id="n0-0"]');
    await cell.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(200);
    await expect(page.locator('.kwa-status')).toContainText(/green space/i);
  });
});
