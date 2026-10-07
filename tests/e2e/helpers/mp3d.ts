/**
 * Shared helpers for MP-3D Playwright specs.
 * Prefer ready-signal waits over fixed sleep; opt into board3dLQ for CI GL load.
 */
import { expect, type Page } from '@playwright/test';

/** Heavy multi-viewport / play-through 3D specs. */
export const MP3D_HEAVY_TEST_TIMEOUT_MS = 120_000;

/** Canvas / scene mount under software WebGL. */
export const MP3D_READY_TIMEOUT_MS = 30_000;

export async function waitForGameReady(page: Page): Promise<void> {
  await expect(page.getByTestId('game-loading')).toBeHidden({
    timeout: 15_000,
  });
}

export async function dismissModeIfNeeded(page: Page): Promise<void> {
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

/** Enable 3D + test-only low-quality render before navigation. */
export async function enableBoard3dLowQuality(page: Page): Promise<void> {
  await page.addInitScript(() => {
    localStorage.setItem('mp-board3d', '1');
    localStorage.setItem('mp-board3d-lq', '1');
  });
}

export async function disableBoard3d(page: Page): Promise<void> {
  await page.addInitScript(() => {
    localStorage.removeItem('mp-board3d');
    localStorage.removeItem('mp-board3d-lq');
  });
}

/**
 * Wait until the named 3D canvas has completed at least one paint
 * (`data-mp3d-ready="1"` set by tablet-gl after render).
 */
export async function waitForMp3dReady(
  page: Page,
  gameId: string,
  timeoutMs: number = MP3D_READY_TIMEOUT_MS
): Promise<void> {
  const canvas = page.locator(
    `canvas[data-mp3d="${gameId}"][data-mp3d-ready="1"]`
  );
  await expect(canvas).toBeVisible({ timeout: timeoutMs });
}

/** board3d URL with LQ flag for e2e. */
export function board3dUrl(hashPath: string): string {
  const path = hashPath.startsWith('#') ? hashPath : `#${hashPath}`;
  return `/?board3d=1&board3dLQ=1${path}`;
}
