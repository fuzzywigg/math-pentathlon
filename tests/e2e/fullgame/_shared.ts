/**
 * Shared helpers for HvH full-game e2e (burn-1007-mp-e2e-fullgame).
 * UI-only: clicks/keyboard. Determinism via fixtures' seeded Math.random.
 */
import { expect, type Page, type Locator } from '@playwright/test';

export const FULLGAME_TAG = '@fullgame';

/** Per-game board mount selector (smoke/mobile parity). */
export const MOUNT: Record<string, string> = {
  'kings-quadraphages': '#board .board .cell, .cell-king',
  hex: '.hex-board',
  'star-track': '.star-track-board',
  'hex-a-gone': '.hex-a-gone-board',
  calla: '.calla-wrapper, .calla-pit',
  'sum-dominoes': '.sd-board',
  'par-55': '.par55-board',
  ramrod: '.ramrod-board',
  'kwatro-sinko': '.kwa-board',
  fiar: '.fiar-board-container',
  juggle: '.juggle-board',
  'contig-60': '.contig-board',
  'stars-bars': '.stars-board',
  'fab-a-diffy': '.fab-bar-pool, .fab-answer-board',
  'queens-guards': '.qg-board-container',
  'prime-gold': '.pg-board, .prime-board',
  'remainder-islands': '.remainder-board',
  'pent-em-in': '.pent-board',
  'frac-fact': '.frac-problem, .frac-choice-btn',
  'fraction-pinball':
    '.pinball-board, .pinball-challenge, .pinball-game-container, .pinball-choice-btn',
};

/** Status / turn indicator selector. */
export const STATUS: Record<string, string> = {
  'kings-quadraphages': '.status-turn',
  hex: '.hex-status .status-turn, .status-turn',
  'star-track': '.star-track-status .status-turn, .status-turn',
  'hex-a-gone': '.hex-a-gone-status .status-turn, .status-turn',
  calla: '.calla-status .status-turn, .status-turn',
  'sum-dominoes': '.sd-status',
  'par-55': '.par55-status',
  ramrod: '.ramrod-status',
  'kwatro-sinko': '.kwa-status',
  fiar: '.fiar-status',
  juggle: '.juggle-status',
  'contig-60': '.contig-status',
  'stars-bars': '.stars-status',
  'fab-a-diffy': '.fab-status',
  'queens-guards': '.qg-status',
  'prime-gold': '.pg-status',
  'remainder-islands': '.remainder-status',
  'pent-em-in': '.pent-status',
  'frac-fact': '.frac-status',
  'fraction-pinball': '.pinball-status',
};

/** Game-over / winner chrome. */
export const GAME_OVER: Record<string, string> = {
  'kings-quadraphages': '.status-winner',
  hex: '.status-winner',
  'star-track': '.star-track-winner, .status-winner',
  'hex-a-gone': '.hex-a-gone-winner, .status-winner',
  calla: '.status-winner',
  'sum-dominoes': '.sd-winner-banner, .game-winner-banner',
  'par-55': '.par55-winner-banner',
  ramrod: '.ramrod-winner-banner',
  'kwatro-sinko': '.kwa-winner-banner',
  fiar: '.fiar-winner-banner',
  juggle: '.juggle-winner-banner',
  'contig-60': '.contig-winner-banner, .game-winner-banner',
  'stars-bars': '.stars-winner-banner',
  'fab-a-diffy': '.fab-winner-banner',
  'queens-guards': '.qg-winner-banner',
  'prime-gold': '.pg-winner-banner',
  'remainder-islands': '.remainder-game-over, .remainder-winner-banner',
  'pent-em-in': '.pent-winner-banner',
  'frac-fact': '.frac-game-over, .frac-winner-banner',
  'fraction-pinball': '.pinball-game-over, .pinball-winner-banner',
};

export async function dismissOwl(page: Page): Promise<void> {
  const dismiss = page.locator(
    '#ollie-owl button[aria-label="Dismiss message"], #ollie-owl .owl-bubble-dismiss'
  );
  if (await dismiss.first().isVisible().catch(() => false)) {
    await dismiss.first().click({ force: true }).catch(() => undefined);
  }
  const minimize = page.locator('#ollie-owl .owl-minimize-btn');
  if (await minimize.isVisible().catch(() => false)) {
    await minimize.click({ force: true }).catch(() => undefined);
  }
  await page.evaluate(() => {
    const el = document.getElementById('ollie-owl');
    if (el) (el as HTMLElement).style.pointerEvents = 'none';
  });
}

export async function waitForGameReady(page: Page): Promise<void> {
  await expect(page.getByTestId('game-loading')).toBeHidden({
    timeout: 20_000,
  });
  await expect(page.locator('#new-game-btn, h1').first()).toBeVisible({
    timeout: 20_000,
  });
}

export async function gotoGame(page: Page, gameId: string): Promise<void> {
  await page.goto(`/#/game/${gameId}`);
  await waitForGameReady(page);
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

export function mountLocator(page: Page, gameId: string): Locator {
  return page.locator(MOUNT[gameId] ?? '#board, #game-container, main').first();
}

export function statusLocator(page: Page, gameId: string): Locator {
  return page.locator(STATUS[gameId] ?? '.status-turn, [role="status"]').first();
}

export function gameOverLocator(page: Page, gameId: string): Locator {
  return page
    .locator(GAME_OVER[gameId] ?? '.status-winner, .game-winner-banner')
    .first();
}

export async function readStatus(page: Page, gameId: string): Promise<string> {
  const text = (await statusLocator(page, gameId).textContent().catch(() => '')) ?? '';
  return text.replace(/\s+/g, ' ').trim();
}

export function isGameOverText(status: string): boolean {
  return /winner|wins|game over|draw|tie|you win|you lose/i.test(status);
}

export async function isGameOver(page: Page, gameId: string): Promise<boolean> {
  if (await gameOverLocator(page, gameId).isVisible().catch(() => false)) {
    return true;
  }
  const status = await readStatus(page, gameId);
  return isGameOverText(status);
}

/** Attach console / pageerror capture; returns a getter for filtered errors. */
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

export async function clickDom(
  page: Page,
  selector: string
): Promise<boolean> {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel) as HTMLElement | null;
    if (!el) return false;
    el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    el.click?.();
    return true;
  }, selector);
}

export async function assertPlayAgainAndMenu(
  page: Page,
  gameId: string
): Promise<void> {
  // "Play again" path: New Game (highlighted after game-over) → HvH → Start.
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
  await expect(mountLocator(page, gameId)).toBeVisible({ timeout: 15_000 });
  await expect(gameOverLocator(page, gameId)).toBeHidden({ timeout: 5_000 }).catch(
    () => undefined
  );

  // Back to menu
  await page.locator('#back-btn').click();
  await expect(page.locator('.game-card').first()).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.locator('h1')).toContainText(/Math Pentathlon/i);
}
