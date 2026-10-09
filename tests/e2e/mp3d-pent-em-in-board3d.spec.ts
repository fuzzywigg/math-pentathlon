/**
 * MP-3D — Pent'Em In Three.js board behind board3d flag.
 * Captures start / mid / game-over screenshots at phone + tablet sizes.
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

const VIEWPORTS = [
  { name: 'phone', width: 390, height: 844 },
  { name: 'tablet-portrait', width: 800, height: 1280 },
  { name: 'tablet-landscape', width: 1024, height: 768 },
] as const;



async function startVsHuman(page: Page) {
  await waitForGameReady(page);
  // Force a fresh human-vs-human game so AI never consumes a turn mid-script.
  const newGame = page.locator('#new-game-btn, button:has-text("New Game")');
  await expect(newGame.first()).toBeVisible({ timeout: 10000 });
  await newGame.first().click();
  const modal = page.locator('#new-game-modal');
  await expect(modal).toBeVisible({ timeout: 5000 });
  const human = page.locator(
    'input[value="human-vs-human"], input[value="vs-human"]'
  );
  if (await human.count()) {
    await human.first().check({ force: true });
  }
  await page.locator('#start-game-btn').click();
  await expect(modal).toBeHidden({ timeout: 5000 });
  await expect(page.locator('.pent-status')).toContainText(/Select a piece/i, {
    timeout: 5000,
  });
}

async function clickBoardCell(page: Page, row: number, col: number) {
  await page.waitForFunction(
    () =>
      typeof (
        window as unknown as {
          __mp3dPentEmIn?: { cellToClientPoint: unknown };
        }
      ).__mp3dPentEmIn?.cellToClientPoint === 'function'
  );
  const pt = await page.evaluate(
    ({ r, c }) => {
      const api = (
        window as unknown as {
          __mp3dPentEmIn: {
            cellToClientPoint: (
              row: number,
              col: number
            ) => { x: number; y: number };
          };
        }
      ).__mp3dPentEmIn;
      return api.cellToClientPoint(r, c);
    },
    { r: row, c: col }
  );
  await page.mouse.click(pt.x, pt.y);
  await page.waitForTimeout(150);
}

async function selectPiece(page: Page, shapeId: string) {
  const opt = page.locator(`.pent-piece-option[data-piece="${shapeId}"]`).first();
  await expect(opt).toBeVisible({ timeout: 10000 });
  await opt.click();
  await expect(page.locator('.pent-status')).toContainText(
    new RegExp(`Place the ${shapeId}`, 'i'),
    { timeout: 5000 }
  );
}

test.describe("mp3d Pent'Em In 3D board", () => {
  test('flag off keeps classic 2D SVG and never requests vendor/three', async ({
    page,
  }) => {
    const threeRequests: string[] = [];
    page.on('request', (req) => {
      if (req.url().includes('vendor/three')) threeRequests.push(req.url());
    });

    await disableBoard3d(page);
    await page.goto('/#/game/pent-em-in');
    await waitForGameReady(page);
    await startVsHuman(page);
    await expect(page.locator('svg.pent-board').first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('canvas[data-mp3d="pent-em-in"]')).toHaveCount(0);
    expect(threeRequests).toEqual([]);
  });

  test('flag on: start / mid / game-over screenshots at 3 viewports', async ({
    page,
  }) => {
    test.setTimeout(MP3D_HEAVY_TEST_TIMEOUT_MS);
    await enableBoard3dLowQuality(page);

    const outDir = path.resolve('docs/screenshots/mp3d');
    fs.mkdirSync(outDir, { recursive: true });

    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(board3dUrl('#/game/pent-em-in'));
      await waitForGameReady(page);
      await startVsHuman(page);

      const canvas = page.locator('canvas[data-mp3d="pent-em-in"]');
      if ((await waitForMp3dReady(page, 'pent-em-in')) === 'fallback') {
        return;
      }
      await expect(page.locator('svg.pent-board')).toHaveCount(0);
      await expect(
        page.locator('.pent-a11y-grid [role="gridcell"]')
      ).toHaveCount(100);

      // Board should stay in the first viewport (not below the fold)
      const box = await canvas.boundingBox();
      expect(box).toBeTruthy();
      expect(box!.y).toBeLessThan(vp.height);
      expect(box!.y + Math.min(box!.height, 80)).toBeLessThan(vp.height);
      const startPath = path.join(
        outDir,
        `pent-em-in-3d-start-${vp.name}.png`
      );
      await page.screenshot({ path: startPath, fullPage: false });
      expect(fs.statSync(startPath).size).toBeGreaterThan(1000);

      // Mid-game: Blue places X, Red places U (distinct pieces; human-vs-human)
      await selectPiece(page, 'X');
      await clickBoardCell(page, 4, 4);
      await expect(page.locator('.pent-status')).toContainText(/Select a piece/i, {
        timeout: 5000,
      });
      await selectPiece(page, 'U');
      await clickBoardCell(page, 1, 1);
      await expect(page.locator('.pent-status')).toContainText(/Select a piece/i, {
        timeout: 5000,
      });

      await page.waitForTimeout(250);
      const midPath = path.join(outDir, `pent-em-in-3d-mid-${vp.name}.png`);
      await page.screenshot({ path: midPath, fullPage: false });
      expect(fs.statSync(midPath).size).toBeGreaterThan(1000);
    }

    // Game-over evidence at phone size via injected near-end state
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(board3dUrl('#/game/pent-em-in'));
    await waitForGameReady(page);
    await startVsHuman(page);
    if ((await waitForMp3dReady(page, 'pent-em-in')) === 'fallback') {
      return;
    }
    await page.waitForFunction(
      () =>
        typeof (
          window as unknown as { __mpPentEmInController?: { setState: unknown } }
        ).__mpPentEmInController?.setState === 'function'
    );
    await page.evaluate(() => {
      const api = (
        window as unknown as {
          __mpPentEmInController: {
            setState: (state: unknown) => void;
            getState: () => {
              board: unknown;
              player1Pieces: unknown;
              player2Pieces: unknown;
            };
          };
        }
      ).__mpPentEmInController;
      const prev = api.getState();
      const BOARD_SIZE = 10;
      const board = [];
      for (let row = 0; row < BOARD_SIZE; row++) {
        const r = [];
        for (let col = 0; col < BOARD_SIZE; col++) {
          r.push({
            row,
            col,
            occupied: true,
            owner: 'player2',
            pieceId: 'fill',
          });
        }
        board.push(r);
      }
      for (const c of [
        { row: 1, col: 2 },
        { row: 2, col: 1 },
        { row: 2, col: 2 },
        { row: 2, col: 3 },
        { row: 3, col: 2 },
      ]) {
        board[c.row][c.col] = {
          row: c.row,
          col: c.col,
          occupied: false,
          owner: null,
          pieceId: null,
        };
      }
      api.setState({
        ...prev,
        board,
        placedPieces: [],
        currentPlayer: 'player1',
        phase: 'placePiece',
        selectedPiece: 'X',
        selectedRotation: 0,
        selectedFlipped: false,
        previewPosition: null,
        moveHistory: [],
        winner: null,
        player1Pieces: { available: ['X'], placed: [] },
        player2Pieces: { available: ['I5', 'X'], placed: [] },
      });
    });

    await clickBoardCell(page, 1, 1);
    await expect(page.locator('.pent-winner-banner')).toBeVisible({
      timeout: 5000,
    });
    const overPath = path.join(
      path.resolve('docs/screenshots/mp3d'),
      'pent-em-in-3d-gameover-phone.png'
    );
    await page.screenshot({ path: overPath, fullPage: false });
    expect(fs.statSync(overPath).size).toBeGreaterThan(1000);

    // Canonical names expected by the brief
    const canonicalStart = path.join(
      path.resolve('docs/screenshots/mp3d'),
      'pent-em-in-3d-start.png'
    );
    const canonicalMid = path.join(
      path.resolve('docs/screenshots/mp3d'),
      'pent-em-in-3d-midgame.png'
    );
    fs.copyFileSync(
      path.join(path.resolve('docs/screenshots/mp3d'), 'pent-em-in-3d-start-phone.png'),
      canonicalStart
    );
    fs.copyFileSync(
      path.join(path.resolve('docs/screenshots/mp3d'), 'pent-em-in-3d-mid-phone.png'),
      canonicalMid
    );
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
    await page.goto(board3dUrl('#/game/pent-em-in'));
    await waitForGameReady(page);
    await startVsHuman(page);
    await expect(page.locator('svg.pent-board').first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('canvas[data-mp3d="pent-em-in"]')).toHaveCount(0);
  });

  test('keyboard a11y grid places a piece with 3D on', async ({ page }) => {
    await enableBoard3dLowQuality(page);
    await page.goto(board3dUrl('#/game/pent-em-in'));
    await waitForGameReady(page);
    await startVsHuman(page);
    if ((await waitForMp3dReady(page, 'pent-em-in')) === 'fallback') {
      return;
    }
    await selectPiece(page, 'X');
    const cell = page.locator(
      '.pent-a11y-grid [role="gridcell"][data-row="4"][data-col="4"]'
    );
    await cell.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.pent-status')).toContainText(/turn/i, {
      timeout: 8_000,
    });
    // After a successful place, phase returns to select for the other player
    await expect(page.locator('.pent-piece-option').first()).toBeVisible({
      timeout: 8_000,
    });
  });
});
