/**
 * Shared setup for visual-regression e2e: deterministic Math.random,
 * reduced motion, owl off, fonts settled, CSS animations forced off.
 * Does not change production game rules or scoring.
 */
import { expect, type Page } from '@playwright/test';
import { browserInstallSeededRandom } from '../../helpers/rng';
import {
  dismissOwl,
  waitForGameReady as sharedWaitForGameReady,
} from './page';

/** Fixed seed for Mulberry32 — same algorithm as src/core/ai-worker/seeded-rng.ts */
export const VISUAL_RNG_SEED = 0xc0ffee;

const STORAGE_KEY = 'math-pentathlon-progress';

/** Stable localStorage payload: owl off, reduced motion on. */
export const VISUAL_PROGRESS = {
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

/**
 * Install before any navigation: seeded RNG + preference storage.
 * Re-runs on every document load so each game starts from the same seed.
 */
export async function installVisualStability(page: Page): Promise<void> {
  await page.addInitScript(browserInstallSeededRandom, VISUAL_RNG_SEED);
  await page.addInitScript(
    ({ storageKey, progress }) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(progress));
      } catch {
        // ignore quota / private mode
      }
    },
    {
      storageKey: STORAGE_KEY,
      progress: VISUAL_PROGRESS,
    }
  );

  await page.emulateMedia({ reducedMotion: 'reduce' });
}

/** Kill residual CSS motion that prefers-reduced-motion may not cover. */
export async function disableCssMotion(page: Page): Promise<void> {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
        caret-color: transparent !important;
        scroll-behavior: auto !important;
      }
    `,
  });
}

export async function waitForFonts(page: Page): Promise<void> {
  await page.evaluate(async () => {
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }
  });
}

/** Hide owl stack if it still mounts despite settings. */
export async function neutralizeOwl(page: Page): Promise<void> {
  await dismissOwl(page, {
    minimize: false,
    pointerEventsNone: true,
    hide: true,
  });
}

export async function waitForGameReady(page: Page): Promise<void> {
  await sharedWaitForGameReady(page);
}

/** Reach a settled human-vs-human opening position (modal closed). */
export async function openGameOpening(page: Page, gameId: string): Promise<void> {
  await page.goto(`/#/game/${gameId}`);
  await waitForGameReady(page);
  await disableCssMotion(page);
  await waitForFonts(page);

  const modal = page.locator('#new-game-modal');
  if (await modal.isVisible().catch(() => false)) {
    const human = page.locator('.mode-option[data-mode="human-vs-human"]');
    if (await human.isVisible().catch(() => false)) {
      await human.click();
    }
    await page.locator('#start-game-btn').click();
    await expect(modal).toHaveClass(/hidden/);
  }

  await neutralizeOwl(page);
  // One paint after modal close / owl hide.
  await page.waitForTimeout(100);
}

export async function openStartScreen(page: Page): Promise<void> {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Math Pentathlon');
  await expect(page.locator('.game-card').first()).toBeVisible();
  await disableCssMotion(page);
  await waitForFonts(page);
  await neutralizeOwl(page);
  await page.waitForTimeout(100);
}

/** Shared toHaveScreenshot options for cross-run stability. */
export const VISUAL_SHOT_OPTS = {
  animations: 'disabled' as const,
  caret: 'hide' as const,
  // Allow tiny antialias / font hinting drift across GPU/OS paint paths.
  maxDiffPixelRatio: 0.005,
};
