/**
 * Shared helpers for MP-3D Playwright specs.
 * Prefer ready-signal waits over fixed sleep; opt into board3dLQ for CI GL load.
 */
import { expect, type Locator, type Page } from '@playwright/test';

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
