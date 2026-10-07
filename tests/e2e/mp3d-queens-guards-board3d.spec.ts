/**
 * MP-3D — Queens & Guards Three.js board behind board3d flag.
 * Captures start / mid-game / game-over screenshots at phone + tablet sizes.
 */
import { test, expect, Page } from '@playwright/test';
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



async function clickBoardCell(page: Page, ring: number, position: number) {
  await page.waitForFunction(
    () =>
      typeof (
        window as unknown as {
          __mp3dQueensGuards?: { cellToClientPoint: unknown };
        }
      ).__mp3dQueensGuards?.cellToClientPoint === 'function'
  );
  const pt = await page.evaluate(
    ({ r, p }) => {
      const api = (
        window as unknown as {
          __mp3dQueensGuards: {
            cellToClientPoint: (
              ring: number,
              position: number
            ) => { x: number; y: number } | null;
          };
        }
      ).__mp3dQueensGuards;
      return api.cellToClientPoint(r, p);
    },
    { r: ring, p: position }
  );
  expect(pt).toBeTruthy();
  await page.mouse.click(pt!.x, pt!.y);
  await page.waitForTimeout(150);
}

/** Activate a cell via the visually-hidden a11y grid (same click path as canvas). */
async function activateA11yCell(page: Page, ring: number, position: number) {
  await page.evaluate(
    ({ r, p }) => {
      const el = document.querySelector(
        `.qg-a11y-grid [data-row="${r}"][data-col="${p}"]`
      ) as HTMLButtonElement | null;
      if (!el) throw new Error(`a11y cell ${r}-${p} missing`);
      el.click();
    },
    { r: ring, p: position }
  );
  await page.waitForTimeout(150);
}

async function getMoveCount(page: Page): Promise<number> {
  return page.evaluate(() => {
    const ctrl = (
      window as unknown as {
        __mp3dQueensGuardsCtrl?: { getMoveCount: () => number };
      }
    ).__mp3dQueensGuardsCtrl;
    if (!ctrl) throw new Error('__mp3dQueensGuardsCtrl missing (DEV hook)');
    return ctrl.getMoveCount();
  });
}

async function getCapturedCount(page: Page): Promise<number> {
  return page.evaluate(() => {
    const ctrl = (
      window as unknown as {
        __mp3dQueensGuardsCtrl?: { getCapturedCount: () => number };
      }
    ).__mp3dQueensGuardsCtrl;
    if (!ctrl) throw new Error('__mp3dQueensGuardsCtrl missing (DEV hook)');
    return ctrl.getCapturedCount();
  });
}

async function seedCapturedRestore(page: Page): Promise<void> {
  await page.waitForFunction(
    () =>
      typeof (
        window as unknown as {
          __mp3dQueensGuardsCtrl?: { seedCapturedRestore?: unknown };
        }
      ).__mp3dQueensGuardsCtrl?.seedCapturedRestore === 'function'
  );
  await page.evaluate(() => {
    (
      window as unknown as {
        __mp3dQueensGuardsCtrl: { seedCapturedRestore: () => void };
      }
    ).__mp3dQueensGuardsCtrl.seedCapturedRestore();
  });
}

const VIEWPORTS = [
  { name: 'phone', width: 390, height: 844 },
  { name: 'tablet-portrait', width: 800, height: 1280 },
  { name: 'tablet-landscape', width: 1024, height: 768 },
] as const;

test.describe('mp3d Queens & Guards 3D board', () => {
  test.describe.configure({ mode: 'serial' });

  test('flag off keeps classic 2D SVG and never requests vendor/three', async ({
    page,
  }) => {
    const threeRequests: string[] = [];
    page.on('request', (req) => {
      if (req.url().includes('vendor/three')) threeRequests.push(req.url());
    });

    await disableBoard3d(page);
    await page.goto('/#/game/queens-guards');
    await waitForGameReady(page);
    await dismissModeIfNeeded(page);
    await expect(page.locator('.qg-board-container svg').first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('canvas[data-mp3d="queens-guards"]')).toHaveCount(
      0
    );
    expect(threeRequests).toEqual([]);
  });

  test('flag on: start + mid + game-over screenshots at three viewports', async ({
    page,
  }) => {
    test.setTimeout(MP3D_HEAVY_TEST_TIMEOUT_MS);
    await enableBoard3dLowQuality(page);

    const outDir = path.resolve('docs/screenshots/mp3d');
    fs.mkdirSync(outDir, { recursive: true });

    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      // Cache-bust so each viewport gets a fresh module mount / opening position.
      await page.goto(
        `/?board3d=1&board3dLQ=1&vp=${vp.name}&t=${Date.now()}#/game/queens-guards`
      );
      await waitForGameReady(page);
      await dismissModeIfNeeded(page);

      const canvas = page.locator('canvas[data-mp3d="queens-guards"]');
      await waitForMp3dReady(page, 'queens-guards');
      await expect(page.locator('.qg-board-container svg')).toHaveCount(0);
      await expect(page.locator('.qg-a11y-grid [role="gridcell"]')).toHaveCount(
        91
      );
      await page.waitForFunction(() => {
        const label = document
          .querySelector('.qg-a11y-grid [data-cell-key="5-7"]')
          ?.getAttribute('aria-label');
        return !!label && /Blue Queen/.test(label);
      });

      const startPath = path.join(
        outDir,
        `queens-guards-3d-start-${vp.name}.png`
      );
      await canvas.screenshot({ path: startPath });
      expect(fs.statSync(startPath).size).toBeGreaterThan(1000);
      if (vp.name === 'phone') {
        await canvas.screenshot({
          path: path.join(outDir, 'queens-guards-3d-start.png'),
        });
      }

      // Blue queen 5-7 → 4-5
      const beforeBlue = await getMoveCount(page);
      await activateA11yCell(page, 5, 7);
      await activateA11yCell(page, 4, 5);
      expect(await getMoveCount(page)).toBeGreaterThan(beforeBlue);

      // Canvas pick select Red queen, a11y move to 4-17
      await clickBoardCell(page, 5, 22);
      const beforeRed = await getMoveCount(page);
      await activateA11yCell(page, 4, 17);
      expect(await getMoveCount(page)).toBeGreaterThan(beforeRed);

      await page.waitForTimeout(300);
      const midPath = path.join(
        outDir,
        `queens-guards-3d-midgame-${vp.name}.png`
      );
      await canvas.screenshot({ path: midPath });
      expect(fs.statSync(midPath).size).toBeGreaterThan(1000);
      if (vp.name === 'phone') {
        await canvas.screenshot({
          path: path.join(outDir, 'queens-guards-3d-midgame.png'),
        });
      }

      await page.evaluate(() => {
        (
          window as unknown as {
            __mp3dQueensGuardsCtrl: { seedWinnerFormation: () => void };
          }
        ).__mp3dQueensGuardsCtrl.seedWinnerFormation();
      });
      await expect(page.locator('.qg-winner-banner')).toBeVisible({
        timeout: 5000,
      });
      await page.waitForTimeout(200);
      const endPath = path.join(
        outDir,
        `queens-guards-3d-gameover-${vp.name}.png`
      );
      await canvas.screenshot({ path: endPath });
      expect(fs.statSync(endPath).size).toBeGreaterThan(1000);
      if (vp.name === 'phone') {
        await canvas.screenshot({
          path: path.join(outDir, 'queens-guards-3d-gameover.png'),
        });
      }
    }
  });

  test('WebGL failure falls back to 2D SVG board', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('mp-board3d', '1');
      const proto = HTMLCanvasElement.prototype;
      const original = proto.getContext;
      proto.getContext = function (
        this: HTMLCanvasElement,
        type: string,
        attrs?: unknown
      ) {
        if (
          type === 'webgl' ||
          type === 'webgl2' ||
          type === 'experimental-webgl'
        ) {
          return null;
        }
        return original.call(this, type as '2d', attrs as never);
      } as typeof proto.getContext;
    });
    await page.goto(board3dUrl('#/game/queens-guards'));
    await waitForGameReady(page);
    await dismissModeIfNeeded(page);
    await expect(page.locator('.qg-board-container svg').first()).toBeVisible({
      timeout: 15000,
    });
    await expect(page.locator('canvas[data-mp3d="queens-guards"]')).toHaveCount(
      0
    );
  });

  test('keyboard a11y grid activates selection/move with 3D on', async ({
    page,
  }) => {
    await enableBoard3dLowQuality(page);
    await page.goto(board3dUrl('#/game/queens-guards'));
    await waitForGameReady(page);
    await dismissModeIfNeeded(page);
    await expect(page.locator('canvas[data-mp3d="queens-guards"]')).toBeVisible(
      {
        timeout: 15000,
      }
    );
    await page.waitForFunction(() => {
      const label = document
        .querySelector('.qg-a11y-grid [data-cell-key="5-7"]')
        ?.getAttribute('aria-label');
      return !!label && /Blue Queen/.test(label);
    });

    const queenCell = page.locator('.qg-a11y-grid [data-cell-key="5-7"]');
    await queenCell.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(150);

    const legal = page.locator(
      '.qg-a11y-grid button[tabindex="0"][aria-label*="legal move"]'
    );
    await expect(legal.first()).toBeVisible({ timeout: 5000 });
    await legal.first().evaluate((el) => (el as HTMLButtonElement).click());
    await page.waitForTimeout(200);

    const moves = await getMoveCount(page);
    expect(moves).toBeGreaterThan(0);
  });

  test('human restores a captured piece to the outer ring (3D + 2D)', async ({
    page,
  }) => {
    const outDir = path.resolve('docs/screenshots/mp3d');
    fs.mkdirSync(outDir, { recursive: true });

    // 3D — phone + tablet
    for (const vp of [
      { name: 'phone', width: 390, height: 844 },
      { name: 'tablet-portrait', width: 800, height: 1280 },
    ] as const) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await enableBoard3dLowQuality(page);
      await page.goto(
        `/?board3d=1&board3dLQ=1&restore=1&vp=${vp.name}&t=${Date.now()}#/game/queens-guards`
      );
      await waitForGameReady(page);
      await dismissModeIfNeeded(page);
      const canvas = page.locator('canvas[data-mp3d="queens-guards"]');
      await waitForMp3dReady(page, 'queens-guards');
      await seedCapturedRestore(page);
      await expect(page.locator('.qg-status')).toContainText(/outer ring/i);
      expect(await getCapturedCount(page)).toBe(1);
      await page.waitForTimeout(250);
      const pendingPath = path.join(
        outDir,
        `queens-guards-3d-restore-pending-${vp.name}.png`
      );
      await canvas.screenshot({ path: pendingPath });
      expect(fs.statSync(pendingPath).size).toBeGreaterThan(1000);

      await activateA11yCell(page, 2, 0);
      await activateA11yCell(page, 5, 0);
      expect(await getCapturedCount(page)).toBe(0);
      await expect(
        page.locator('.qg-a11y-grid [data-cell-key="5-0"]')
      ).toHaveAttribute('aria-label', /Guard/i);
      await page.waitForTimeout(200);
      const donePath = path.join(
        outDir,
        `queens-guards-3d-restore-done-${vp.name}.png`
      );
      await canvas.screenshot({ path: donePath });
      expect(fs.statSync(donePath).size).toBeGreaterThan(1000);
    }

    // 2D SVG fallback path
    await disableBoard3d(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/?board3d=0&t=${Date.now()}#/game/queens-guards`);
    await waitForGameReady(page);
    await dismissModeIfNeeded(page);
    await expect(page.locator('.qg-board-container svg').first()).toBeVisible({
      timeout: 10000,
    });
    await seedCapturedRestore(page);
    expect(await getCapturedCount(page)).toBe(1);
    await page.locator('[data-cell-key="2-0"]').click();
    await page.locator('[data-cell-key="5-0"]').click();
    expect(await getCapturedCount(page)).toBe(0);
    const svgPath = path.join(
      outDir,
      'queens-guards-2d-restore-done-phone.png'
    );
    await page.locator('.qg-board-container svg').first().screenshot({
      path: svgPath,
    });
    expect(fs.statSync(svgPath).size).toBeGreaterThan(1000);
  });
});
