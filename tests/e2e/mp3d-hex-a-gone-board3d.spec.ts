/**
 * MP-3D — Hex-a-Gone! Three.js board behind board3d flag.
 * Screenshots at phone / tablet portrait / tablet landscape for PR evidence.
 */
import { test, expect, Page } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

const VIEWPORTS = [
  { name: 'phone', width: 390, height: 844 },
  { name: 'tablet-portrait', width: 800, height: 1280 },
  { name: 'tablet-landscape', width: 1024, height: 768 },
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

async function waitFor3dApi(page: Page) {
  await page.waitForFunction(
    () =>
      typeof (
        window as unknown as {
          __mp3dHexAGone?: { cellToClientPoint: unknown };
        }
      ).__mp3dHexAGone?.cellToClientPoint === 'function'
  );
}

async function clickBoardCell(page: Page, q: number, r: number) {
  await waitFor3dApi(page);
  const pt = await page.evaluate(
    ({ qq, rr }) => {
      const api = (
        window as unknown as {
          __mp3dHexAGone: {
            cellToClientPoint: (
              q: number,
              r: number
            ) => { x: number; y: number } | null;
          };
        }
      ).__mp3dHexAGone;
      return api.cellToClientPoint(qq, rr);
    },
    { qq: q, rr: r }
  );
  expect(pt).toBeTruthy();
  await page.mouse.click(pt!.x, pt!.y);
  await page.waitForTimeout(80);
}

async function selectAndConfirm(page: Page, shape = 'triangle') {
  const btn = page.locator(`.hex-a-gone-block-btn[data-shape="${shape}"]`);
  await expect(btn).toBeVisible({ timeout: 5000 });
  await btn.click();
  const confirm = page.locator('.hex-a-gone-confirm-btn');
  await expect(confirm).toBeVisible();
  await confirm.click();
}

/** Fast path to game-over via DOM bank + a11y cell clicks (same click handlers as 3D). */
async function playToGameOver(page: Page) {
  await page.waitForFunction(() => {
    return !!document.querySelector('.hex-a-gone-a11y-grid');
  });

  for (let i = 0; i < 80; i++) {
    const done = await page.evaluate(() => {
      const winner = document.querySelector(
        '.hex-a-gone-winner, .status-winner'
      );
      if (winner) return 'done';

      const confirm = document.querySelector<HTMLButtonElement>(
        '.hex-a-gone-confirm-btn'
      );
      if (confirm) {
        confirm.click();
        return 'continue';
      }

      const shape = document.querySelector<HTMLButtonElement>(
        '.hex-a-gone-block-btn:not(.empty)'
      );
      if (shape && document.querySelector('.hex-a-gone-selection-status')) {
        shape.click();
        return 'continue';
      }

      const empty = Array.from(
        document.querySelectorAll<HTMLButtonElement>(
          '.hex-a-gone-a11y-grid button'
        )
      ).find((b) => (b.getAttribute('aria-label') || '').includes('empty'));
      if (empty && empty.tabIndex === 0) {
        empty.click();
        return 'continue';
      }

      // place phase but tabIndex not yet 0 — click first empty anyway
      if (empty) {
        empty.click();
        return 'continue';
      }
      return 'stuck';
    });

    if (done === 'done') return;
    if (done === 'stuck') {
      await page.waitForTimeout(50);
    }
  }
}

test.describe('mp3d Hex-a-Gone 3D board', () => {
  test('flag off keeps classic 2D SVG and never requests vendor/three', async ({
    page,
  }) => {
    const threeRequests: string[] = [];
    page.on('request', (req) => {
      if (req.url().includes('vendor/three')) threeRequests.push(req.url());
    });

    await page.addInitScript(() => {
      localStorage.removeItem('mp-board3d');
    });
    await page.goto('/#/game/hex-a-gone');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.hex-a-gone-board').first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('canvas[data-mp3d="hex-a-gone"]')).toHaveCount(0);
    await page.waitForTimeout(400);
    expect(threeRequests).toEqual([]);
  });

  test('flag on: start / mid / game-over screenshots at three viewports', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem('mp-board3d', '1');
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/?board3d=1#/game/hex-a-gone');
    await dismissModeIfNeeded(page);

    const canvas = page.locator('canvas[data-mp3d="hex-a-gone"]');
    await expect(canvas).toBeVisible({ timeout: 15000 });
    await expect(page.locator('.hex-a-gone-board')).toHaveCount(0);
    await expect(
      page.locator('.hex-a-gone-a11y-grid [role="gridcell"]')
    ).toHaveCount(37);
    await page.waitForTimeout(400);

    const outDir = path.resolve('docs/screenshots/mp3d');
    fs.mkdirSync(outDir, { recursive: true });

    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(250);
      const startPath = path.join(
        outDir,
        `hex-a-gone-3d-start-${vp.name}.png`
      );
      await page.screenshot({ path: startPath, fullPage: false });
      expect(fs.statSync(startPath).size).toBeGreaterThan(1000);
    }

    // Mid-game: a few human-vs-human placements
    await selectAndConfirm(page, 'triangle');
    await clickBoardCell(page, 0, 0);
    await selectAndConfirm(page, 'triangle');
    await clickBoardCell(page, 1, 0);
    await selectAndConfirm(page, 'square');
    await clickBoardCell(page, -1, 0);
    await selectAndConfirm(page, 'rhombus');
    await clickBoardCell(page, 0, 1);
    await page.waitForTimeout(200);

    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(250);
      const midPath = path.join(outDir, `hex-a-gone-3d-mid-${vp.name}.png`);
      await page.screenshot({ path: midPath, fullPage: false });
      expect(fs.statSync(midPath).size).toBeGreaterThan(1000);
    }

    await playToGameOver(page);
    await expect(
      page.locator('.hex-a-gone-winner, .status-winner').first()
    ).toBeVisible({ timeout: 60000 });

    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(250);
      const endPath = path.join(
        outDir,
        `hex-a-gone-3d-gameover-${vp.name}.png`
      );
      await page.screenshot({ path: endPath, fullPage: false });
      expect(fs.statSync(endPath).size).toBeGreaterThan(1000);
    }
  });

  test('WebGL failure falls back to 2D board', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('mp-board3d', '1');
      const proto = HTMLCanvasElement.prototype;
      const original = proto.getContext;
      proto.getContext = function (
        this: HTMLCanvasElement,
        type: string,
        attrs?: unknown
      ) {
        if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') {
          return null;
        }
        return original.call(this, type as '2d', attrs as never);
      } as typeof proto.getContext;
    });
    await page.goto('/?board3d=1#/game/hex-a-gone');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.hex-a-gone-board').first()).toBeVisible({
      timeout: 15000,
    });
    await expect(page.locator('canvas[data-mp3d="hex-a-gone"]')).toHaveCount(0);
  });

  test('keyboard a11y grid places with Enter while 3D is on', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem('mp-board3d', '1');
    });
    await page.goto('/?board3d=1#/game/hex-a-gone');
    await dismissModeIfNeeded(page);
    await expect(page.locator('canvas[data-mp3d="hex-a-gone"]')).toBeVisible({
      timeout: 15000,
    });

    await selectAndConfirm(page, 'triangle');
    const cell = page.locator(
      '.hex-a-gone-a11y-grid [data-q="0"][data-r="0"]'
    );
    await cell.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(200);
    await expect(page.locator('.hex-a-gone-coverage')).toContainText('1/37');
  });
});
