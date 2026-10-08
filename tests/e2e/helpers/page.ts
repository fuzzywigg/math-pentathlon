/**
 * Shared Playwright page helpers: waits, navigation, owl dismiss, mode start.
 * Prefer these over per-spec copies. Fullgame `_shared.ts` may adopt later
 * (leave that suite alone while PR #505 is open).
 */
import { expect, type Locator, type Page } from '@playwright/test';
import { DEFAULT_MOUNT, GAME_MOUNT } from './game-mounts';

export { DEFAULT_MOUNT, GAME_MOUNT };

export type Difficulty = 'easy' | 'medium' | 'hard';

export type WaitForGameReadyOptions = {
  /** Default 15_000. Fullgame historically uses 20_000. */
  timeoutMs?: number;
  /** When false, only wait for `game-loading` to hide (mp3d style). */
  requireChrome?: boolean;
};

/** Lazy game chunks show `data-testid="game-loading"` until the shell mounts. */
export async function waitForGameReady(
  page: Page,
  options: WaitForGameReadyOptions = {}
): Promise<void> {
  const timeoutMs = options.timeoutMs ?? 15_000;
  const requireChrome = options.requireChrome !== false;
  await expect(page.getByTestId('game-loading')).toBeHidden({
    timeout: timeoutMs,
  });
  if (requireChrome) {
    await expect(page.locator('#new-game-btn, h1').first()).toBeVisible({
      timeout: timeoutMs,
    });
  }
}

export type DismissOwlOptions = {
  /** Click minimize after dismiss (default true). */
  minimize?: boolean;
  /** Set pointer-events:none on #ollie-owl (default true). */
  pointerEventsNone?: boolean;
  /** Also hide via visibility:hidden (visual suites). */
  hide?: boolean;
};

export async function dismissOwl(
  page: Page,
  options: DismissOwlOptions = {}
): Promise<void> {
  const minimize = options.minimize !== false;
  const pointerEventsNone = options.pointerEventsNone !== false;
  const hide = options.hide === true;

  const dismiss = page.locator(
    '#ollie-owl button[aria-label="Dismiss message"], #ollie-owl .owl-bubble-dismiss'
  );
  if (await dismiss.first().isVisible().catch(() => false)) {
    await dismiss.first().click({ force: true }).catch(() => undefined);
  }
  if (minimize) {
    const minBtn = page.locator('#ollie-owl .owl-minimize-btn');
    if (await minBtn.isVisible().catch(() => false)) {
      await minBtn.click({ force: true }).catch(() => undefined);
    }
  }
  if (pointerEventsNone || hide) {
    await page.evaluate(
      ({ pe, hideOwl }) => {
        const el = document.getElementById('ollie-owl');
        if (!el) return;
        if (pe) (el as HTMLElement).style.pointerEvents = 'none';
        if (hideOwl) (el as HTMLElement).style.visibility = 'hidden';
      },
      { pe: pointerEventsNone, hideOwl: hide }
    );
  }
}

/** Historical alias used across smoke / a11y / keyboard specs. */
export const dismissOwlIfNeeded = dismissOwl;

export async function gotoGame(page: Page, gameId: string): Promise<void> {
  await page.goto(`/#/game/${gameId}`);
  await waitForGameReady(page);
}

export function mountLocator(page: Page, gameId: string): Locator {
  return page.locator(GAME_MOUNT[gameId] ?? DEFAULT_MOUNT).first();
}

/** Start vs-AI (opens New Game modal). Optional difficulty click. */
export async function startVsAi(
  page: Page,
  difficulty?: Difficulty
): Promise<void> {
  await waitForGameReady(page);
  await dismissOwl(page);
  await page.locator('#new-game-btn').click();
  const modal = page.locator('#new-game-modal');
  await expect(modal).toBeVisible({ timeout: 10_000 });
  await page.locator('.mode-option[data-mode="human-vs-ai"]').click();
  if (difficulty) {
    const btn = page.locator(`.difficulty-btn.${difficulty}`);
    if (await btn.isVisible().catch(() => false)) {
      await btn.click();
    }
  } else {
    const easy = page.locator('.difficulty-btn.easy');
    if (await easy.isVisible().catch(() => false)) {
      await easy.click();
    }
  }
  await page.locator('#start-game-btn').click();
  await expect(modal).toHaveClass(/hidden/);
  await dismissOwl(page);
}

/** Navigate to a game route, then start vs-AI at the given difficulty. */
export async function startVsAiAt(
  page: Page,
  gameId: string,
  difficulty?: Difficulty
): Promise<void> {
  await gotoGame(page, gameId);
  await startVsAi(page, difficulty);
}

/**
 * Ensure human-vs-human play. If the new-game modal is already open, choose
 * human and start; otherwise leave the current human session alone.
 */
export async function startHuman(page: Page): Promise<void> {
  await waitForGameReady(page);
  const modal = page.locator('#new-game-modal');
  if (await modal.isVisible().catch(() => false)) {
    const human = page.locator('.mode-option[data-mode="human-vs-human"]');
    if (await human.isVisible().catch(() => false)) {
      await human.click();
    }
    await page.locator('#start-game-btn').click();
    await expect(modal).toHaveClass(/hidden/);
  }
  await dismissOwl(page);
}

/** Always open New Game → HvH → Start for a fresh seeded deal. */
export async function startHumanFresh(page: Page): Promise<void> {
  await waitForGameReady(page);
  await dismissOwl(page);
  await page.locator('#new-game-btn').click();
  const modal = page.locator('#new-game-modal');
  await expect(modal).toBeVisible({ timeout: 10_000 });
  const human = page.locator('.mode-option[data-mode="human-vs-human"]');
  if (await human.isVisible().catch(() => false)) {
    await human.click();
  }
  await page.locator('#start-game-btn').click();
  await expect(modal).toHaveClass(/hidden/);
  await dismissOwl(page);
}

/** Attach console / pageerror capture; returns filtered error getter. */
export function installConsoleGuard(page: Page): () => string[] {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  return () =>
    errors.filter(
      (e) =>
        !/favicon/i.test(e) &&
        !/Download the React DevTools/i.test(e) &&
        !/\[vite\]/i.test(e)
    );
}
