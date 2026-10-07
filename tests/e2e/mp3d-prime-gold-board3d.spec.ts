/**
 * MP-3D — Prime Gold Three.js board behind board3d flag.
 * Captures start / mid-game / game-over screenshots at phone + tablet sizes.
 */
import { test, expect, Page } from '@playwright/test';
import {
  MP3D_HEAVY_TEST_TIMEOUT_MS,
  board3dUrl,
  disableBoard3d,
  dismissModeIfNeeded,
  enableBoard3dLowQuality,
  keyboardActivateA11yCell,
  waitForGameReady,
  waitForHumanStatus,
  waitForMp3dReady,
} from './helpers/mp3d';
import * as fs from 'node:fs';
import * as path from 'node:path';

const VIEWPORTS = [
  { name: 'phone', width: 390, height: 844 },
  { name: 'tablet-portrait', width: 800, height: 1280 },
  { name: 'tablet-landscape', width: 1024, height: 768 },
] as const;



async function waitForPrimeGold3d(page: Page) {
  await waitForMp3dReady(page, 'prime-gold');
  await page.waitForFunction(
    () =>
      typeof (
        window as unknown as {
          __mp3dPrimeGold?: { valueToClientPoint: unknown };
        }
      ).__mp3dPrimeGold?.valueToClientPoint === 'function'
  );
}

async function clickBoardValue(page: Page, value: number) {
  await waitForPrimeGold3d(page);
  const pt = await page.evaluate((v) => {
    const api = (
      window as unknown as {
        __mp3dPrimeGold: {
          valueToClientPoint: (
            value: number
          ) => { x: number; y: number } | null;
        };
      }
    ).__mp3dPrimeGold;
    return api.valueToClientPoint(v);
  }, value);
  expect(pt).toBeTruthy();
  await page.mouse.click(pt!.x, pt!.y);
  await page.waitForTimeout(120);
}

/** WebGL canvas.screenshot() can return a stale compositor frame; read pixels via toDataURL. */
async function saveCanvasPng(page: Page, outPath: string) {
  const dataUrl = await page.evaluate(() => {
    const c = document.querySelector(
      'canvas[data-mp3d="prime-gold"]'
    ) as HTMLCanvasElement | null;
    if (!c) throw new Error('prime-gold canvas missing');
    // Force a layout read so the latest WebGL frame is resolved.
    void c.getBoundingClientRect();
    return c.toDataURL('image/png');
  });
  const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
  fs.writeFileSync(outPath, Buffer.from(base64, 'base64'));
  expect(fs.statSync(outPath).size).toBeGreaterThan(1000);
}

async function rollAndPlaceFirst(page: Page) {
  const roll = page.locator('.pg-roll-btn');
  if (await roll.isVisible().catch(() => false)) {
    await roll.click();
    await page.waitForTimeout(150);
  }
  const expr = page.locator('.pg-expr-item').first();
  if (await expr.isVisible().catch(() => false)) {
    await expr.click();
    await page.waitForTimeout(150);
    return;
  }
  // Fallback: try a11y / canvas click on first focusable value
  const cell = page.locator('.pg-a11y-grid button[tabindex="0"]').first();
  if (await cell.count()) {
    const value = await cell.getAttribute('data-value');
    if (value) await clickBoardValue(page, Number(value));
  }
}

test.describe('mp3d Prime Gold 3D board', () => {
  test('flag off keeps classic 2D board and never requests vendor/three', async ({
    page,
  }) => {
    const threeRequests: string[] = [];
    page.on('request', (req) => {
      if (req.url().includes('vendor/three')) threeRequests.push(req.url());
    });

    await disableBoard3d(page);
    await page.goto('/#/game/prime-gold');
    await waitForGameReady(page);
    await dismissModeIfNeeded(page);
    await expect(page.locator('.pg-board .pg-cell').first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('canvas[data-mp3d="prime-gold"]')).toHaveCount(0);
    expect(threeRequests).toEqual([]);
  });

  test('flag on: start / mid / game-over screenshots at three viewports', async ({
    page,
  }) => {
    test.setTimeout(MP3D_HEAVY_TEST_TIMEOUT_MS);
    await enableBoard3dLowQuality(page);

    const outDir = path.resolve('docs/screenshots/mp3d');
    fs.mkdirSync(outDir, { recursive: true });

    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      // Hash-route goto to the same URL does not remount — bounce home first.
      await page.goto('/#/');
      await page.goto(`/?board3d=1&board3dLQ=1&shot=${vp.name}#/game/prime-gold`);
      await waitForGameReady(page);
      await dismissModeIfNeeded(page);
      await waitForPrimeGold3d(page);
      await expect(page.locator('.pg-board .pg-cell')).toHaveCount(0);
      await expect(page.locator('.pg-a11y-grid [role="gridcell"]')).toHaveCount(
        49
      );
      // Ensure layout + an on-demand paint after viewport settle.
      await page.evaluate(() => window.dispatchEvent(new Event('resize')));
      await page.waitForTimeout(200);

      const canvas = page.locator('canvas[data-mp3d="prime-gold"]');
      const startPath = path.join(
        outDir,
        `prime-gold-3d-start-${vp.name}.png`
      );
      await saveCanvasPng(page, startPath);

      // A couple of human turns via DOM expression list (dice stay as DOM).
      await rollAndPlaceFirst(page);
      await rollAndPlaceFirst(page);
      await page.evaluate(() => window.dispatchEvent(new Event('resize')));
      await page.waitForTimeout(300);

      const midPath = path.join(outDir, `prime-gold-3d-mid-${vp.name}.png`);
      await saveCanvasPng(page, midPath);

      // Force a game-over state with a visible prime vein (DEV hook; npm run dev).
      await page.evaluate(() => {
        const api = (
          window as unknown as {
            __mpPrimeGoldTest?: {
              getState: () => {
                cells: Map<
                  string,
                  {
                    row: number;
                    col: number;
                    value: number;
                    owner: string | null;
                    isPrime: boolean;
                    isGoldbachTarget: boolean;
                  }
                >;
                phase: string;
                winner: string | null;
                primeVeins: Record<string, number>;
                currentPlayer: string;
                diceRoll: null;
                moveHistory: unknown[];
                playerChips: Record<string, number>;
              };
              setState: (s: unknown) => void;
            };
          }
        ).__mpPrimeGoldTest;
        if (!api) throw new Error('__mpPrimeGoldTest missing');
        const state = api.getState();
        const cells = new Map(state.cells);
        // Own a diagonal of primes for player1 so vein lines render in 3D.
        for (const key of ['0,0', '1,1', '2,2', '3,3', '4,4', '5,5', '6,6']) {
          const cell = cells.get(key);
          if (cell?.isPrime) {
            cells.set(key, { ...cell, owner: 'player1' });
          }
        }
        api.setState({
          ...state,
          cells,
          phase: 'gameOver',
          winner: 'player1',
          primeVeins: { player1: 4, player2: 1 },
          diceRoll: null,
        });
      });
      await expect(page.locator('.pg-winner-banner')).toContainText('Wins');
      await page.evaluate(() => window.dispatchEvent(new Event('resize')));
      await page.waitForTimeout(300);

      const overPath = path.join(
        outDir,
        `prime-gold-3d-gameover-${vp.name}.png`
      );
      await saveCanvasPng(page, overPath);

      // Board must remain in the first viewport (not below the fold).
      const box = await canvas.boundingBox();
      expect(box).toBeTruthy();
      expect(box!.y).toBeLessThan(vp.height);
      expect(box!.y + Math.min(box!.height, 40)).toBeLessThan(vp.height);
    }
  });

  test('WebGL failure falls back to playable 2D board', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('mp-board3d', '1');
      const proto = HTMLCanvasElement.prototype;
      proto.getContext = () => null;
    });
    await page.goto(board3dUrl('#/game/prime-gold'));
    await waitForGameReady(page);
    await dismissModeIfNeeded(page);
    await expect(page.locator('.pg-board .pg-cell').first()).toBeVisible({
      timeout: 15000,
    });
    await expect(page.locator('canvas[data-mp3d="prime-gold"]')).toHaveCount(0);
    // Still playable — roll control present
    await expect(page.locator('.pg-roll-btn')).toBeVisible();
  });

  test('keyboard a11y grid activates placement with 3D on', async ({
    page,
  }) => {
    await enableBoard3dLowQuality(page);
    await page.goto(board3dUrl('#/game/prime-gold'));
    await waitForGameReady(page);
    await dismissModeIfNeeded(page);
    await waitForPrimeGold3d(page);
    await waitForHumanStatus(page, '.pg-status', /Roll/i);

    const roll = page.locator('.pg-roll-btn');
    await expect(roll).toBeVisible();
    await roll.click();
    // Placing phase — do not race fixed sleeps against a11y grid rebuild.
    await waitForHumanStatus(page, '.pg-status', /Select/i);

    // #region agent log
    const placeProbe = await page.evaluate(() => {
      const zeros = Array.from(
        document.querySelectorAll('.pg-a11y-grid button[tabindex="0"]')
      );
      const allBtns = Array.from(
        document.querySelectorAll('.pg-a11y-grid button')
      );
      // Heuristic: valid targets are the ones syncA11y wired before restoreGridFocus
      // may have collapsed tabindex — compare expr list values vs tabindex=0.
      const exprTexts = Array.from(
        document.querySelectorAll('.pg-expr-item')
      ).map((el) => el.textContent?.trim() ?? '');
      return {
        tabindex0Count: zeros.length,
        tabindex0: zeros.map((b) => ({
          value: b.getAttribute('data-value'),
          row: b.getAttribute('data-row'),
          col: b.getAttribute('data-col'),
          aria: b.getAttribute('aria-label'),
        })),
        firstCell: allBtns[0]
          ? {
              value: allBtns[0].getAttribute('data-value'),
              row: allBtns[0].getAttribute('data-row'),
              col: allBtns[0].getAttribute('data-col'),
              tabIndex: (allBtns[0] as HTMLButtonElement).tabIndex,
            }
          : null,
        exprItemCount: exprTexts.length,
        exprTextsSample: exprTexts.slice(0, 8),
        status:
          document.querySelector('.pg-status')?.textContent?.trim() ?? null,
      };
    });
    fs.appendFileSync(
      '/opt/cursor/logs/debug.log',
      JSON.stringify({
        location: 'mp3d-prime-gold-board3d.spec.ts:keyboard-a11y',
        message: 'post-Select pre-activate probe',
        data: placeProbe,
        timestamp: Date.now(),
        hypothesisId: 'A,B',
      }) + '\n'
    );
    // #endregion

    const focusable = page.locator('.pg-a11y-grid button[tabindex="0"]').first();
    await keyboardActivateA11yCell(page, focusable);

    // Successful place mounts move history; never union-query with .pg-status
    // (strict-mode flake once both exist).
    await expect(page.locator('.pg-move-history')).toBeVisible({
      timeout: 10_000,
    });
    await waitForHumanStatus(page, '.pg-status', /turn|Roll/i);
  });
});
