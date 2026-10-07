/**
 * MP-3D — Star Track Three.js board behind board3d flag.
 * Captures start / mid-game / game-over screenshots at three viewports.
 */
import { test } from './fixtures';
import { expect, Page } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  MP3D_HEAVY_TEST_TIMEOUT_MS,
  board3dUrl,
  disableBoard3d,
  dismissModeIfNeeded,
  enableBoard3dLowQuality,
  waitForGameReady,
  waitForMp3dReady,
} from './helpers/mp3d';
import { softWaitVisible } from './helpers/stability';

const VIEWPORTS = [
  { name: 'phone', width: 390, height: 844 },
  { name: 'tablet-portrait', width: 800, height: 1280 },
  { name: 'tablet-landscape', width: 1024, height: 768 },
] as const;

async function dismissOwlIfNeeded(page: Page) {
  const dismiss = page.locator(
    'button:has-text("Dismiss"), button[aria-label="Dismiss message"], .owl-dismiss, #owl-dismiss'
  );
  if (
    await dismiss
      .first()
      .isVisible()
      .catch(() => false)
  ) {
    await dismiss
      .first()
      .click()
      .catch(() => undefined);
  }
  const minimize = page.locator(
    'button:has-text("Minimize"), button[aria-label="Minimize Ollie"]'
  );
  if (
    await minimize
      .first()
      .isVisible()
      .catch(() => false)
  ) {
    await minimize
      .first()
      .click()
      .catch(() => undefined);
  }
}

async function assertChainAboveFold(page: Page, viewportHeight: number) {
  await dismissOwlIfNeeded(page);
  const chain = page.locator('.star-track-chain-area');
  await expect(chain).toBeVisible();
  const box = await chain.boundingBox();
  expect(box).toBeTruthy();
  expect(box!.y + box!.height).toBeLessThanOrEqual(viewportHeight + 1);
}

async function playHumanTurns(page: Page, turns: number) {
  for (let i = 0; i < turns; i++) {
    if (
      await page
        .locator('.star-track-winner, .status-winner')
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      return;
    }
    const draw = page.locator('.star-track-draw-btn');
    if (await draw.isVisible().catch(() => false)) {
      await draw.click();
      // Draw → choose-chain; tolerate slow DOM refresh under software GL.
      await softWaitVisible(page, '.star-track-chain-btn', 8_000);
    }
    const chain = page.locator('.star-track-chain-btn').first();
    if (await chain.isVisible().catch(() => false)) {
      await chain.click();
      // Next draw OR game-over — do not hard-require draw if someone just won.
      await softWaitVisible(
        page,
        '.star-track-draw-btn, .star-track-winner, .status-winner',
        8_000
      );
    }
  }
}

test.describe('mp3d Star Track 3D board', () => {
  test('flag off keeps classic 2D SVG and never requests vendor/three', async ({
    page,
  }) => {
    const threeRequests: string[] = [];
    page.on('request', (req) => {
      if (req.url().includes('vendor/three')) threeRequests.push(req.url());
    });

    await disableBoard3d(page);
    await page.goto('/#/game/star-track');
    await waitForGameReady(page);
    await dismissModeIfNeeded(page);
    await expect(page.locator('.star-track-board').first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('canvas[data-mp3d="star-track"]')).toHaveCount(0);
    await expect(page.locator('.star-track-draw-btn')).toBeVisible();
    expect(threeRequests).toEqual([]);
  });

  test('flag on: start / mid / game-over screenshots at three sizes', async ({
    page,
  }) => {
    test.setTimeout(MP3D_HEAVY_TEST_TIMEOUT_MS);
    await enableBoard3dLowQuality(page);

    const outDir = path.resolve('docs/screenshots/mp3d');
    fs.mkdirSync(outDir, { recursive: true });

    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(board3dUrl('#/game/star-track'));
      await waitForGameReady(page);
      await dismissModeIfNeeded(page);
      await waitForMp3dReady(page, 'star-track');
      await expect(page.locator('.star-track-board')).toHaveCount(0);
      await expect(page.locator('.star-track-chain-area')).toBeVisible();
      await expect(page.locator('.star-track-a11y-track')).toHaveCount(1);
      await dismissOwlIfNeeded(page);

      await assertChainAboveFold(page, vp.height);
      const startPath = path.join(outDir, `star-track-3d-start-${vp.name}.png`);
      await page.screenshot({ path: startPath, fullPage: true });
      expect(fs.statSync(startPath).size).toBeGreaterThan(1000);

      // Mid-game: a few human-vs-human turns (P1 then P2)
      await playHumanTurns(page, 4);
      await assertChainAboveFold(page, vp.height);
      const midPath = path.join(outDir, `star-track-3d-mid-${vp.name}.png`);
      await page.screenshot({ path: midPath, fullPage: true });
      expect(fs.statSync(midPath).size).toBeGreaterThan(1000);

      // Drive to game over (enough turns for TRACK_LENGTH=12)
      for (let i = 0; i < 30; i++) {
        if (
          await page
            .locator('.star-track-winner')
            .isVisible()
            .catch(() => false)
        ) {
          break;
        }
        await playHumanTurns(page, 1);
      }
      await expect(
        page.locator('.star-track-winner, .status-winner').first()
      ).toBeVisible({
        timeout: 15000,
      });
      await assertChainAboveFold(page, vp.height);
      const endPath = path.join(
        outDir,
        `star-track-3d-gameover-${vp.name}.png`
      );
      await page.screenshot({ path: endPath, fullPage: true });
      expect(fs.statSync(endPath).size).toBeGreaterThan(1000);
    }
  });

  test('WebGL failure falls back to 2D board', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('mp-board3d', '1');
      localStorage.setItem('mp-board3d-lq', '1');
      const proto = HTMLCanvasElement.prototype;
      proto.getContext = function () {
        return null;
      } as typeof proto.getContext;
    });
    await page.goto(board3dUrl('#/game/star-track'));
    await waitForGameReady(page);
    await dismissModeIfNeeded(page);
    await expect(page.locator('.star-track-board').first()).toBeVisible({
      timeout: 15000,
    });
    await expect(page.locator('canvas[data-mp3d="star-track"]')).toHaveCount(0);
    await expect(page.locator('.star-track-draw-btn')).toBeVisible();
  });

  test('keyboard play works with 3D on (draw + choose chain)', async ({
    page,
  }) => {
    await enableBoard3dLowQuality(page);
    await page.goto(board3dUrl('#/game/star-track'));
    await waitForGameReady(page);
    await dismissModeIfNeeded(page);
    await waitForMp3dReady(page, 'star-track');

    const draw = page.locator('.star-track-draw-btn');
    await draw.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.star-track-chain-btn').first()).toBeVisible({
      timeout: 5000,
    });

    const chain = page.locator('.star-track-chain-btn').first();
    await chain.focus();
    await page.keyboard.press('Enter');

    // After a move: draw for the other seat, or (rare) immediate game-over.
    await expect(
      page
        .locator('.star-track-draw-btn, .star-track-winner, .status-winner')
        .first()
    ).toBeVisible({
      timeout: 8_000,
    });
  });
});
