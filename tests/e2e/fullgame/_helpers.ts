/**
 * Shared helpers for burn-1007 HvH full-game e2e suite.
 * Reuses e2e stability seed (0xc0ffee); UI-only clicks/keyboard.
 */
import { expect, type Page } from '@playwright/test';
import { E2E_RNG_SEED } from '../helpers/stability';

export { E2E_RNG_SEED };

const PROGRESS_KEY = 'math-pentathlon-progress';

/** Quiet owl + reduced motion so overlays never steal clicks. */
const QUIET_PROGRESS = {
  version: 1,
  profile: null,
  streak: {
    currentStreak: 0,
    bestStreak: 0,
    lastPlayDate: '',
    streakStartDate: '',
  },
  achievements: [] as unknown[],
  gameStats: {} as Record<string, unknown>,
  owlState: {
    mood: 'happy',
    lastInteraction: 0,
    messagesSeen: [] as string[],
    tutorialsCompleted: [] as string[],
    totalMessagesShown: 0,
  },
  settings: {
    owlEnabled: false,
    soundEnabled: false,
    reducedMotion: true,
    owlFrequency: 'quiet' as const,
  },
};

export type ConsoleTrap = {
  errors: string[];
  dispose: () => void;
};

export function attachConsoleTrap(page: Page): ConsoleTrap {
  const errors: string[] = [];
  const onPageError = (e: Error) => errors.push(`pageerror: ${e.message}`);
  const onConsole = (msg: { type: () => string; text: () => string }) => {
    if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
  };
  page.on('pageerror', onPageError);
  page.on('console', onConsole);
  return {
    errors,
    dispose: () => {
      page.off('pageerror', onPageError);
      page.off('console', onConsole);
    },
  };
}

export async function installFullgamePrefs(page: Page): Promise<void> {
  await page.addInitScript(
    ({ storageKey, progress }) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(progress));
      } catch {
        // ignore
      }
    },
    { storageKey: PROGRESS_KEY, progress: QUIET_PROGRESS }
  );
}

export async function dismissOwl(page: Page): Promise<void> {
  await page.evaluate(() => {
    const el = document.getElementById('ollie-owl');
    if (el) {
      (el as HTMLElement).style.pointerEvents = 'none';
      (el as HTMLElement).style.visibility = 'hidden';
    }
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

/** Open New Game → human-vs-human → Start (reseeds via stability fixture). */
export async function startHumanVsHuman(page: Page): Promise<void> {
  await waitForGameReady(page);
  await dismissOwl(page);

  const modal = page.locator('#new-game-modal');
  const open = await modal.isVisible().catch(() => false);
  if (!open) {
    await page.locator('#new-game-btn').click();
  }
  await expect(modal).toBeVisible({ timeout: 10_000 });

  const human = page.locator('.mode-option[data-mode="human-vs-human"]');
  if (await human.isVisible().catch(() => false)) {
    await human.click();
  }
  await page.locator('#start-game-btn').click();
  await expect(modal).toHaveClass(/hidden/);
  await dismissOwl(page);
}

export async function gotoGameHvH(page: Page, gameId: string): Promise<void> {
  await installFullgamePrefs(page);
  await page.goto(`/?board3d=0#/game/${gameId}`);
  await startHumanVsHuman(page);
}

export async function readStatusText(page: Page): Promise<string> {
  return page.evaluate(() => {
    const sels = [
      '.status-turn',
      '.status-winner',
      '.qg-status',
      '.fiar-status',
      '.ramrod-status',
      '.par55-status',
      '.kwa-status',
      '.juggle-status',
      '.contig-status',
      '.stars-status',
      '.fab-status',
      '.pg-status',
      '.pent-status',
      '.sd-status',
      '.remainder-status',
      '.frac-status',
      '.pinball-status',
      '.hex-status',
      '.calla-status',
      '.hex-a-gone-status',
      '.star-track-status',
      '[role="status"]',
      '#status',
    ];
    for (const sel of sels) {
      const text = (document.querySelector(sel)?.textContent ?? '')
        .replace(/\s+/g, ' ')
        .trim();
      if (text) return text;
    }
    return '';
  });
}

export function isGameOverText(text: string): boolean {
  return /wins?|win!|tie|draw|game over/i.test(text);
}

export async function boardFingerprint(page: Page): Promise<string> {
  return page.evaluate(() => {
    const root =
      document.querySelector('#board, #game-container, main') ??
      document.body;
    const status = (
      document.querySelector(
        '.status-turn, .status-winner, [role="status"]'
      )?.textContent ?? ''
    )
      .replace(/\s+/g, ' ')
      .trim();
    const history = document.querySelectorAll(
      '.move-history-entry, .history-entry, .kwa-history li, .sd-history-entry, .pg-move-item, .stars-move-item, .fab-history-move, .juggle-history-entry, .contig-history-entry, .ramrod-history-entry, .par55-history-move'
    ).length;
    return `${status}|h=${history}|len=${root.innerHTML.length}`;
  });
}

export async function clickDom(
  page: Page,
  selector: string,
  index = 0
): Promise<boolean> {
  return page.evaluate(
    ({ sel, idx }) => {
      const els = [...document.querySelectorAll(sel)];
      const el = els[idx];
      if (!el) return false;
      el.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );
      return true;
    },
    { sel: selector, idx: index }
  );
}

export async function playAgainHvH(page: Page): Promise<void> {
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

export async function backToMenu(page: Page): Promise<void> {
  await dismissOwl(page);
  await page.locator('#back-btn').click();
  await expect(page.locator('.game-card').first()).toBeVisible({
    timeout: 15_000,
  });
}
