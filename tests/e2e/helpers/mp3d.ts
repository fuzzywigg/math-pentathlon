/**
 * Shared helpers for MP-3D Playwright specs.
 * Prefer ready-signal waits over fixed sleep; opt into board3dLQ for CI GL load.
 */
import { expect, type Locator, type Page } from '@playwright/test';
import { waitForGameReady as sharedWaitForGameReady } from './page';

/** Heavy multi-viewport / play-through 3D specs. */
export const MP3D_HEAVY_TEST_TIMEOUT_MS = 120_000;

/**
 * Canvas / scene mount under software WebGL (SwiftShader / ANGLE).
 * CI VMs need more headroom than local GPU; 30s was the historical flake budget.
 */
declare const process: { env: Record<string, string | undefined> };
export const MP3D_READY_TIMEOUT_MS = process.env.CI ? 60_000 : 45_000;

/** Result of waiting for a 3D canvas — or asserting the classic 2D fallback. */
export type Mp3dReadyMode = 'ready' | 'fallback';

/**
 * Classic 2D play surfaces used when WebGL never mounts (Firefox CI, forced
 * getContext null). Specs assert these instead of skipping.
 */
const MP3D_2D_SURFACE: Record<string, string> = {
  'prime-gold': '.pg-board .pg-cell',
  'queens-guards': '.qg-board-container svg',
  'hex-a-gone': '.hex-a-gone-board',
  'pent-em-in': '.pent-board',
  'star-track': '.star-track-board',
  'kwatro-sinko': '.kwa-board',
  fiar: '.fiar-board-container svg, .fiar-board-container [data-node-id]',
  'kings-quadraphages': '#board .board .cell, .cell-king',
};

/** Loading-only ready (mp3d specs do not require #new-game-btn chrome). */
export async function waitForGameReady(page: Page): Promise<void> {
  await sharedWaitForGameReady(page, { requireChrome: false });
}

export async function dismissModeIfNeeded(page: Page): Promise<void> {
  const modal = page.locator('#new-game-modal');
  if (!(await modal.isVisible().catch(() => false))) return;

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
  // Overlay must be gone before board/keyboard interaction (focus + AI-turn races).
  await expect(modal).toBeHidden({ timeout: 10_000 });
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

/** Probe whether this browser can create a WebGL context (harness-only). */
async function probeWebGlAvailable(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl') ||
        canvas.getContext('webgl2');
      return gl != null;
    } catch {
      return false;
    }
  });
}

function browserNameOf(page: Page): string {
  return page.context().browser()?.browserType().name() ?? 'unknown';
}

/**
 * Assert the controller kept a playable classic 2D board (no mp3d canvas).
 * Used when WebGL is unavailable on CI (notably Firefox) instead of skipping.
 */
export async function assertMp3d2dFallback(
  page: Page,
  gameId: string
): Promise<void> {
  const surface = MP3D_2D_SURFACE[gameId];
  expect(
    surface,
    `unknown mp3d gameId for 2D fallback assert: ${gameId}`
  ).toBeTruthy();
  await expect(page.locator(surface!).first()).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.locator(`canvas[data-mp3d="${gameId}"]`)).toHaveCount(0);
}

/**
 * Wait until the named 3D canvas has completed at least one paint
 * (`data-mp3d-ready="1"` set by tablet-gl after a successful render).
 *
 * Software-GL aware:
 * - Longer default timeout under `CI`
 * - Fail fast when the controller sets `data-mp3d-fallback` (WebGL never mounted)
 * - When WebGL is unavailable (Firefox CI), **assert** the 2D fallback and
 *   return `'fallback'` so callers can exit without skipping the test
 * - Wait on the ready attribute (not only visibility) so a painted but
 *   zero-opacity frame still counts once the attribute is present
 */
export async function waitForMp3dReady(
  page: Page,
  gameId: string,
  timeoutMs: number = MP3D_READY_TIMEOUT_MS
): Promise<Mp3dReadyMode> {
  const readySelector = `canvas[data-mp3d="${gameId}"][data-mp3d-ready="1"]`;
  const browserName = browserNameOf(page);

  // Firefox CI often has no usable WebGL — assert 2D fallback, don't skip.
  if (!(await probeWebGlAvailable(page))) {
    await assertMp3d2dFallback(page, gameId);
    return 'fallback';
  }

  // Firefox may return a non-null context that never paints and never sets
  // data-mp3d-fallback — use a short budget then assert 2D instead of 60s×retries.
  const waitBudgetMs =
    browserName === 'firefox' ? Math.min(timeoutMs, 15_000) : timeoutMs;

  let status;
  try {
    status = await page.waitForFunction(
      (id: string) => {
        const fallback = document.querySelector('[data-mp3d-fallback]');
        if (fallback) {
          return {
            state: 'fallback' as const,
            reason: fallback.getAttribute('data-mp3d-fallback') ?? 'webgl',
          };
        }
        const ready = document.querySelector(
          `canvas[data-mp3d="${id}"][data-mp3d-ready="1"]`
        );
        if (ready) return { state: 'ready' as const, reason: null };
        return false;
      },
      gameId,
      { timeout: waitBudgetMs }
    );
  } catch (err) {
    // Context never painted — if GL is gone or Firefox, assert playable 2D.
    if (browserName === 'firefox' || !(await probeWebGlAvailable(page))) {
      await assertMp3d2dFallback(page, gameId);
      return 'fallback';
    }
    throw err;
  }

  const result = (await status.jsonValue()) as
    | false
    | { state: 'fallback'; reason: string }
    | { state: 'ready'; reason: null };
  if (result && result.state === 'fallback') {
    await assertMp3d2dFallback(page, gameId);
    return 'fallback';
  }

  const canvas = page.locator(readySelector);
  await expect(canvas).toBeAttached({ timeout: 5_000 });
  // Interaction / screenshots need a laid-out canvas, not just the attribute.
  await expect(canvas).toBeVisible({ timeout: 10_000 });
  return 'ready';
}

/**
 * Prime Gold 3D a11y cell that can actually place.
 *
 * After chrome rebuild, `restoreGridFocus` / `applyRovingTabindex` collapses
 * `tabindex` to a single gridcell (often [0,0]) that is frequently *not* a
 * valid placement — so `button[tabindex="0"]` is the wrong activation target.
 * Valid cells retain their click handlers; match them via the Valid Moves list.
 */
export async function primeGoldValidA11yCell(page: Page): Promise<Locator> {
  const exprValue = page.locator('.pg-expr-item strong').first();
  await expect(exprValue).toBeAttached({ timeout: 10_000 });
  const value = (await exprValue.textContent())?.trim();
  expect(value, 'expected at least one valid Prime Gold expression').toBeTruthy();
  const cell = page.locator(`.pg-a11y-grid button[data-value="${value}"]`);
  await expect(cell).toBeAttached({ timeout: 10_000 });
  return cell;
}

/**
 * Visually-hidden a11y grids use clip/1px sizing — `toBeVisible` is flaky.
 * Wait for attach, focus, then Enter (button activates via click handler).
 */
export async function keyboardActivateA11yCell(
  page: Page,
  cell: Locator
): Promise<void> {
  await expect(cell).toBeAttached({ timeout: 10_000 });
  await cell.focus();
  await expect(cell).toBeFocused({ timeout: 5_000 });
  await page.keyboard.press('Enter');
}

/**
 * Wait until status shows a human-actionable prompt (not AI thinking).
 * Use a single status selector — union locators flake under strict mode once
 * sibling panels (e.g. move history) mount after a successful move.
 */
export async function waitForHumanStatus(
  page: Page,
  statusSelector: string,
  pattern: RegExp,
  timeoutMs: number = 15_000
): Promise<void> {
  const status = page.locator(statusSelector);
  await expect(status).toBeVisible({ timeout: timeoutMs });
  await expect(status).not.toContainText(/Computer is thinking/i, {
    timeout: timeoutMs,
  });
  await expect(status).toContainText(pattern, { timeout: timeoutMs });
}

/** board3d URL with LQ flag for e2e. */
export function board3dUrl(hashPath: string): string {
  const path = hashPath.startsWith('#') ? hashPath : `#${hashPath}`;
  return `/?board3d=1&board3dLQ=1${path}`;
}
