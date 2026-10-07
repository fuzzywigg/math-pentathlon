/**
 * Shared helpers for MP-3D Playwright specs.
 * Prefer ready-signal waits over fixed sleep; opt into board3dLQ for CI GL load.
 */
import { expect, type Locator, type Page } from '@playwright/test';
import * as fs from 'node:fs';

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
 * Visually-hidden a11y grids use clip/1px sizing — `toBeVisible` is flaky.
 * Wait for attach, focus, then Enter (button activates via click handler).
 */
export async function keyboardActivateA11yCell(
  page: Page,
  cell: Locator
): Promise<void> {
  await expect(cell).toBeAttached({ timeout: 10_000 });
  // #region agent log
  const preFocus = await cell.evaluate((el) => ({
    tag: el.tagName,
    value: el.getAttribute('data-value'),
    row: el.getAttribute('data-row'),
    col: el.getAttribute('data-col'),
    tabIndex: (el as HTMLElement).tabIndex,
    aria: el.getAttribute('aria-label'),
    inDoc: document.contains(el),
  }));
  fs.appendFileSync(
    '/opt/cursor/logs/debug.log',
    JSON.stringify({
      location: 'mp3d.ts:keyboardActivateA11yCell',
      message: 'pre-focus cell snapshot',
      data: preFocus,
      timestamp: Date.now(),
      hypothesisId: 'A',
    }) + '\n'
  );
  // #endregion
  await cell.focus();
  await expect(cell).toBeFocused({ timeout: 5_000 });
  // #region agent log
  const preEnter = await page.evaluate(() => {
    const active = document.activeElement as HTMLElement | null;
    const zeros = Array.from(
      document.querySelectorAll('.pg-a11y-grid button[tabindex="0"]')
    ).map((b) => ({
      value: b.getAttribute('data-value'),
      row: b.getAttribute('data-row'),
      col: b.getAttribute('data-col'),
    }));
    const api = (
      window as unknown as {
        __mpPrimeGoldTest?: {
          getState: () => {
            phase: string;
            diceRoll: number[] | null;
            moveHistory: unknown[];
          };
        };
      }
    ).__mpPrimeGoldTest;
    const state = api?.getState();
    const exprItems = Array.from(
      document.querySelectorAll('.pg-expr-item')
    ).map((el) => el.textContent?.trim() ?? '');
    const validValues = Array.from(
      document.querySelectorAll('.pg-expr-item strong')
    ).map((el) => el.textContent?.trim() ?? '');
    const activeValue = active?.getAttribute?.('data-value');
    return {
      activeTag: active?.tagName,
      activeValue,
      activeRow: active?.getAttribute?.('data-row'),
      activeCol: active?.getAttribute?.('data-col'),
      activeTabIndex: active?.tabIndex,
      focusedIsValidPlacement: !!activeValue && validValues.includes(activeValue),
      validValuesSample: validValues.slice(0, 12),
      tabindex0Count: zeros.length,
      tabindex0Cells: zeros.slice(0, 8),
      phase: state?.phase ?? null,
      dice: state?.diceRoll ?? null,
      moveHistoryLen: state?.moveHistory?.length ?? null,
      exprItemCount: exprItems.length,
      exprItemsSample: exprItems.slice(0, 6),
      statusText:
        document.querySelector('.pg-status')?.textContent?.trim() ?? null,
    };
  });
  fs.appendFileSync(
    '/opt/cursor/logs/debug.log',
    JSON.stringify({
      location: 'mp3d.ts:keyboardActivateA11yCell',
      message: 'pre-Enter grid/state snapshot',
      data: preEnter,
      timestamp: Date.now(),
      hypothesisId: 'A,B,C',
    }) + '\n'
  );
  // #endregion
  await page.keyboard.press('Enter');
  // #region agent log
  const postEnter = await page.evaluate(() => {
    const api = (
      window as unknown as {
        __mpPrimeGoldTest?: {
          getState: () => {
            phase: string;
            moveHistory: unknown[];
            currentPlayer: string;
          };
        };
      }
    ).__mpPrimeGoldTest;
    const state = api?.getState();
    return {
      phase: state?.phase ?? null,
      moveHistoryLen: state?.moveHistory?.length ?? null,
      currentPlayer: state?.currentPlayer ?? null,
      statusText:
        document.querySelector('.pg-status')?.textContent?.trim() ?? null,
      hasMoveHistory: !!document.querySelector('.pg-move-history'),
      activeValue: document.activeElement?.getAttribute?.('data-value'),
      stillInDoc: document.contains(document.activeElement),
    };
  });
  fs.appendFileSync(
    '/opt/cursor/logs/debug.log',
    JSON.stringify({
      location: 'mp3d.ts:keyboardActivateA11yCell',
      message: 'post-Enter state snapshot',
      data: postEnter,
      timestamp: Date.now(),
      hypothesisId: 'A,D,E',
    }) + '\n'
  );
  // #endregion
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
