/**
 * MP-3D — Prime Gold Three.js board behind board3d flag.
 * Captures start / mid-game / game-over screenshots at phone + tablet sizes.
 */
import { test } from './fixtures';
import { expect, Page } from '@playwright/test';
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


async function waitForGameReady(page: Page) {
  await expect(page.getByTestId('game-loading')).toBeHidden({
    timeout: 15_000,
  });
}

async function waitForPrimeGold3d(page: Page) {
  await expect(page.locator('canvas[data-mp3d="prime-gold"]')).toBeVisible({
    timeout: 15000,
  });
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

    await page.addInitScript(() => {
      localStorage.removeItem('mp-board3d');
    });
    await page.goto('/#/game/prime-gold');
    await waitForGameReady(page);
    await dismissModeIfNeeded(page);
    await expect(page.locator('.pg-board .pg-cell').first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('canvas[data-mp3d="prime-gold"]')).toHaveCount(0);
    await page.waitForTimeout(400);
    expect(threeRequests).toEqual([]);
  });

  test('flag on: start / mid / game-over screenshots at three viewports', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem('mp-board3d', '1');
    });

    const outDir = path.resolve('docs/screenshots/mp3d');
    fs.mkdirSync(outDir, { recursive: true });

    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      // Hash-route goto to the same URL does not remount — bounce home first.
      await page.goto('/#/');
      await page.goto(`/?board3d=1&shot=${vp.name}#/game/prime-gold`);
      await waitForGameReady(page);
      await dismissModeIfNeeded(page);
      await waitForPrimeGold3d(page);
      await expect(page.locator('.pg-board .pg-cell')).toHaveCount(0);
      await expect(page.locator('.pg-a11y-grid [role="gridcell"]')).toHaveCount(
        49
      );
      await page.waitForTimeout(350);
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
    await page.goto('/?board3d=1#/game/prime-gold');
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
    await page.addInitScript(() => {
      localStorage.setItem('mp-board3d', '1');
    });
    await page.goto('/?board3d=1#/game/prime-gold');
    await waitForGameReady(page);
    await dismissModeIfNeeded(page);
    await waitForPrimeGold3d(page);

    await page.locator('.pg-roll-btn').click();
    await page.waitForTimeout(200);

    const focusable = page.locator('.pg-a11y-grid button[tabindex="0"]').first();
    await expect(focusable).toBeVisible({ timeout: 5000 });
    await focusable.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(250);

    await expect(page.locator('.pg-move-history, .pg-status')).toBeVisible();
    // After a successful place, phase returns to rolling for the other player
    await expect(page.locator('.pg-status')).toContainText(/turn|Roll|Select/i);
  });
});
