/**
 * MP-3D — Kings & Quadraphages Three.js board behind board3d flag.
 * Captures start + mid-game screenshots for PR evidence.
 */
import { test } from './fixtures';
import { expect, Page } from '@playwright/test';
import {
  MP3D_HEAVY_TEST_TIMEOUT_MS,
  board3dUrl,
  disableBoard3d,
  dismissModeIfNeeded,
  enableBoard3dLowQuality,
  waitForGameReady,
  waitForMp3dReady,
} from './helpers/mp3d';
import * as fs from 'node:fs';
import * as path from 'node:path';



async function clickBoardCell(page: Page, row: number, col: number) {
  await page.waitForFunction(
    () =>
      typeof (
        window as unknown as {
          __mp3dKingsQuadraphages?: { cellToClientPoint: unknown };
        }
      ).__mp3dKingsQuadraphages?.cellToClientPoint === 'function'
  );
  const pt = await page.evaluate(
    ({ r, c }) => {
      const api = (
        window as unknown as {
          __mp3dKingsQuadraphages: {
            cellToClientPoint: (
              row: number,
              col: number
            ) => { x: number; y: number };
          };
        }
      ).__mp3dKingsQuadraphages;
      return api.cellToClientPoint(r, c);
    },
    { r: row, c: col }
  );
  await page.mouse.click(pt.x, pt.y);
  await page.waitForTimeout(120);
}

test.describe('mp3d Kings & Quadraphages 3D board', () => {
  test('flag off keeps classic 2D DOM board', async ({ page }) => {
    await disableBoard3d(page);
    await page.goto('/#/game/kings-quadraphages');
    await waitForGameReady(page);
    await dismissModeIfNeeded(page);
    await expect(page.locator('#board .board .cell').first()).toBeVisible({
      timeout: 10000,
    });
    await expect(
      page.locator('canvas[data-mp3d="kings-quadraphages"]')
    ).toHaveCount(0);
    await expect(page.locator('canvas[data-mp3d="kings"]')).toHaveCount(0);
  });

  test('flag on: start + mid-game screenshots via 3D clicks', async ({
    page,
  }) => {
    test.setTimeout(MP3D_HEAVY_TEST_TIMEOUT_MS);
    await enableBoard3dLowQuality(page);
    await page.goto(board3dUrl('#/game/kings-quadraphages'));
    await waitForGameReady(page);
    await dismissModeIfNeeded(page);

    const canvas = page.locator('canvas[data-mp3d="kings-quadraphages"]');
    if ((await waitForMp3dReady(page, 'kings-quadraphages')) === 'fallback') {
      return;
    }
    await expect(page.locator('#board .board .cell')).toHaveCount(0);

    const outDir = path.resolve('docs/screenshots/mp3d');
    fs.mkdirSync(outDir, { recursive: true });

    const startPath = path.join(outDir, 'kings-quadraphages-3d-start.png');
    await canvas.screenshot({ path: startPath });
    expect(fs.statSync(startPath).size).toBeGreaterThan(1000);

    // Four full Human-vs-Human turns by clicking the 3D canvas.
    // 1. Blue: King E1→E2, chip A1
    await clickBoardCell(page, 1, 5);
    await clickBoardCell(page, 2, 5);
    await clickBoardCell(page, 1, 1);
    // 2. Red: King E9→D8, chip E3
    await clickBoardCell(page, 9, 5);
    await clickBoardCell(page, 8, 4);
    await clickBoardCell(page, 3, 5);
    // 3. Blue: King E2→D2, chip I9
    await clickBoardCell(page, 2, 5);
    await clickBoardCell(page, 2, 4);
    await clickBoardCell(page, 9, 9);
    // 4. Red: King D8→D7, chip C3
    await clickBoardCell(page, 8, 4);
    await clickBoardCell(page, 7, 4);
    await clickBoardCell(page, 3, 3);

    await expect(page.locator('.supply-p1')).toContainText('28');
    await expect(page.locator('.supply-p2')).toContainText('28');
    await expect(page.locator('.move-history-entry')).toHaveCount(8);
    const midPath = path.join(outDir, 'kings-quadraphages-3d-midgame.png');
    await canvas.screenshot({ path: midPath });
    expect(fs.statSync(midPath).size).toBeGreaterThan(1000);
  });
});
