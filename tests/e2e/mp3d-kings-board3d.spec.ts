/**
 * MP-3D — Kings & Quadraphages Three.js board behind board3d flag.
 * Captures a screenshot of the 3D canvas for PR evidence.
 */
import { test, expect, Page } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

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

test.describe('mp3d Kings 3D board', () => {
  test('flag off keeps classic 2D DOM board', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('mp-board3d');
    });
    await page.goto('/#/game/kings-quadraphages');
    await dismissModeIfNeeded(page);
    await expect(page.locator('#board .board .cell').first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('canvas[data-mp3d="kings"]')).toHaveCount(0);
  });

  test('flag on mounts Three.js canvas and screenshot', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('mp-board3d', '1');
    });
    // Prefer search-param form so the hash path stays a clean route.
    // Hash query (`#/game/...?board3d=1`) also works after router strip.
    await page.goto('/?board3d=1#/game/kings-quadraphages');
    await dismissModeIfNeeded(page);

    const canvas = page.locator('canvas[data-mp3d="kings"]');
    await expect(canvas).toBeVisible({ timeout: 15000 });
    await expect(page.locator('#board .board .cell')).toHaveCount(0);

    // Wait a beat for WebGL first paint
    await page.waitForTimeout(600);

    const outDir = path.resolve('docs/screenshots/mp3d');
    fs.mkdirSync(outDir, { recursive: true });
    const shotPath = path.join(outDir, 'kings-board-3d.png');
    await canvas.screenshot({ path: shotPath });
    expect(fs.existsSync(shotPath)).toBe(true);
    expect(fs.statSync(shotPath).size).toBeGreaterThan(1000);
  });
});
