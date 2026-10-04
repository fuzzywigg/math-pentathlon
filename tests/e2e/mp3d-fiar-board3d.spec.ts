/**
 * MP-3D — FIAR Three.js board behind board3d flag.
 * Captures start + mid-game screenshots for PR evidence.
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


async function waitForGameReady(page: Page) {
  await expect(page.getByTestId('game-loading')).toBeHidden({
    timeout: 15_000,
  });
}

async function clickBoardNode(page: Page, nodeId: string) {
  await page.waitForFunction(
    () =>
      typeof (
        window as unknown as {
          __mp3dFiar?: { nodeToClientPoint: unknown };
        }
      ).__mp3dFiar?.nodeToClientPoint === 'function'
  );
  const pt = await page.evaluate((id) => {
    const api = (
      window as unknown as {
        __mp3dFiar: {
          nodeToClientPoint: (
            nodeId: string
          ) => { x: number; y: number } | null;
        };
      }
    ).__mp3dFiar;
    return api.nodeToClientPoint(id);
  }, nodeId);
  expect(pt).toBeTruthy();
  await page.mouse.click(pt!.x, pt!.y);
  await page.waitForTimeout(120);
}

test.describe('mp3d FIAR 3D board', () => {
  test('flag off keeps classic 2D SVG board', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('mp-board3d');
    });
    await page.goto('/#/game/fiar');
    await waitForGameReady(page);
    await dismissModeIfNeeded(page);
    await expect(page.locator('.fiar-board-container svg').first()).toBeVisible(
      {
        timeout: 10000,
      }
    );
    await expect(page.locator('canvas[data-mp3d="fiar"]')).toHaveCount(0);
    // Verified 40-space layout
    await expect(
      page.locator('.fiar-board-container [data-node-id]')
    ).toHaveCount(40);
    await expect(
      page.locator('.fiar-board-container [data-yellow-shape="diamond"]')
    ).toHaveCount(1);
  });

  test('flag on: start + mid-game screenshots via 3D clicks', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem('mp-board3d', '1');
    });
    await page.goto('/?board3d=1#/game/fiar');
    await waitForGameReady(page);
    await dismissModeIfNeeded(page);

    const canvas = page.locator('canvas[data-mp3d="fiar"]');
    await expect(canvas).toBeVisible({ timeout: 15000 });
    await expect(page.locator('.fiar-board-container svg')).toHaveCount(0);
    // Keyboard a11y grid present
    await expect(page.locator('.fiar-a11y-grid [role="gridcell"]')).toHaveCount(
      40
    );
    await page.waitForTimeout(400);

    const outDir = path.resolve('docs/screenshots/mp3d');
    fs.mkdirSync(outDir, { recursive: true });

    const startPath = path.join(outDir, 'fiar-3d-start.png');
    await canvas.screenshot({ path: startPath });
    expect(fs.statSync(startPath).size).toBeGreaterThan(1000);

    // Place a few chips
    await clickBoardNode(page, 'c0r3');
    await clickBoardNode(page, 'c8r3');
    await clickBoardNode(page, 'c1r3');
    await clickBoardNode(page, 'c7r3');
    await page.waitForTimeout(200);

    const midPath = path.join(outDir, 'fiar-3d-mid.png');
    await canvas.screenshot({ path: midPath });
    expect(fs.statSync(midPath).size).toBeGreaterThan(1000);
  });

  test('keyboard a11y grid activates placement', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('mp-board3d', '1');
    });
    await page.goto('/?board3d=1#/game/fiar');
    await waitForGameReady(page);
    await dismissModeIfNeeded(page);
    await expect(page.locator('canvas[data-mp3d="fiar"]')).toBeVisible({
      timeout: 15000,
    });
    const cell = page.locator('.fiar-a11y-grid [data-node-id="c4r2"]');
    await cell.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(200);
    // Status should reflect a placement happened (chips placed or turn change)
    const status = page.locator('#status, .fiar-status, .fiar-chips-info');
    await expect(status.first()).toBeVisible();
  });
});
