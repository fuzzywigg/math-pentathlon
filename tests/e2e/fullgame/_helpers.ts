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
  const s = text.replace(/\s+/g, ' ').trim();
  // Avoid false positives like Star Track "Draw chains from the bucket".
  if (/\bdraw chains\b/i.test(s)) return false;
  return (
    /\bwins?\b|\bwin!|\btie\b|\bgame over\b|\bit'?s a draw\b|\bdraw!\b/i.test(
      s
    ) || /^draw\b/i.test(s)
  );
}

/** Status + history + material — ignores selection chrome / aria churn. */
export async function moveFingerprint(page: Page): Promise<string> {
  return page.evaluate(() => {
    // Ordered lookup (not querySelector(a,b)): shell `#status[role=status]` is
    // often empty while the game writes into `.ramrod-status` / `.qg-status` etc.
    const statusSels = [
      '.status-winner',
      '.status-turn',
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
    ];
    let status = '';
    for (const sel of statusSels) {
      const text = (document.querySelector(sel)?.textContent ?? '')
        .replace(/\s+/g, ' ')
        .trim();
      if (text) {
        status = text;
        break;
      }
    }
    const history = document.querySelectorAll(
      [
        '.move-history-entry',
        '.history-entry',
        '.kwa-history-move',
        '.sd-history-entry',
        '.pg-move-item',
        '.stars-move-item',
        '.fab-history-move',
        '.juggle-history-entry',
        '.contig-history-entry',
        '.ramrod-history-move',
        '.par55-history-move',
      ].join(', ')
    ).length;
    const scores = (
      document.querySelector(
        '.ramrod-scores, .par55-scores, .kwa-scores, .fab-scores, .stars-scores'
      )?.textContent ?? ''
    )
      .replace(/\s+/g, ' ')
      .trim();
    const material = document.querySelectorAll(
      [
        '.hex-cell-p1, .hex-cell-p2',
        '.cell-king',
        '.calla-pit',
        '.juggle-cell.occupied-player1, .juggle-cell.occupied-player2',
        '.kwa-chip, .kwa-selectable-chip',
        '.fiar-board-container [data-owner], .fiar-board-container circle[fill]',
        '.pent-cell-p1, .pent-cell-p2, .pent-board [data-owner]',
        '.qg-board-container svg g[aria-label*="Blue"], .qg-board-container svg g[aria-label*="Red"]',
        // Ramrod / Par-55: occupied slots (history only lists captures)
        '.ramrod-slot .ramrod-rod, .ramrod-slot [class*="rod"]',
        '.par55-base .par55-block, .par55-placed',
      ].join(', ')
    ).length;
    return `${status}|h=${history}|m=${material}|s=${scores}`;
  });
}

export async function boardFingerprint(page: Page): Promise<string> {
  return moveFingerprint(page);
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
  // Port from #507 suite: menu chrome must show brand after back navigation.
  await expect(page.locator('h1')).toContainText(/Math Pentathlon/i);
}
