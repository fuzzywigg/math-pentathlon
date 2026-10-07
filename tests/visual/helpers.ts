import { expect, type Page } from '@playwright/test';
import { GAMES } from '../../src/core/game-registry';

/** Fixed PRNG seed for deterministic board/dice layout across runs. */
export const VISUAL_SEED = 0x4d50_5652; // "MPVR"

/** Available games captured by the visual suite (2D boards). */
export const AVAILABLE_GAMES = GAMES.filter((g) => g.available);

/** Primary board / play surface that proves the game mounted in 2D. */
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

declare global {
  interface Window {
    __mpVisualReseed?: (seed?: number) => void;
  }
}

/**
 * Install deterministic Math.random, force 2D boards, and disable motion
 * before any app script runs.
 */
export async function installVisualDeterminism(page: Page): Promise<void> {
  await page.addInitScript((seed: number) => {
    // Mulberry32 — compact, deterministic PRNG. Exposed so tests can re-seed
    // immediately before New Game start (owl / idle code may burn entropy).
    const install = (nextSeed: number) => {
      let s = nextSeed >>> 0 || 1;
      Math.random = () => {
        s |= 0;
        s = (s + 0x6d2b79f5) | 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    };
    install(seed);
    (
      window as Window & { __mpVisualReseed?: (s?: number) => void }
    ).__mpVisualReseed = (s?: number) => install(s ?? seed);

    try {
      localStorage.removeItem('mp-board3d');
      // Disable owl so message picks cannot race board shuffles.
      localStorage.setItem(
        'math-pentathlon-progress',
        JSON.stringify({
          version: 1,
          profile: null,
          streak: {
            currentStreak: 0,
            bestStreak: 0,
            lastPlayDate: '',
            streakStartDate: '',
          },
          achievements: [],
          gameStats: {},
          owlState: {
            mood: 'happy',
            lastInteraction: 0,
            messagesSeen: [],
            tutorialsCompleted: [],
            totalMessagesShown: 0,
          },
          settings: {
            owlEnabled: false,
            soundEnabled: false,
            reducedMotion: true,
            owlFrequency: 'quiet',
          },
        })
      );
    } catch {
      // ignore quota / private-mode failures
    }

    const style = document.createElement('style');
    style.setAttribute('data-visual-regression', 'true');
    style.textContent = `
      *, *::before, *::after {
        animation: none !important;
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition: none !important;
        transition-duration: 0s !important;
        caret-color: transparent !important;
      }
      html { scroll-behavior: auto !important; }
      #ollie-owl { visibility: hidden !important; pointer-events: none !important; }
    `;
    const attach = () => {
      if (document.documentElement) {
        document.documentElement.setAttribute('data-reduced-motion', 'true');
        (document.head ?? document.documentElement).appendChild(style);
      }
    };
    if (document.documentElement) attach();
    else document.addEventListener('DOMContentLoaded', attach, { once: true });
  }, VISUAL_SEED);
}

/** Lazy game chunks show `data-testid="game-loading"` until the shell mounts. */
export async function waitForGameReady(page: Page): Promise<void> {
  await expect(page.getByTestId('game-loading')).toBeHidden({
    timeout: 15_000,
  });
  await expect(page.locator('#new-game-btn, h1').first()).toBeVisible({
    timeout: 15_000,
  });
}

/** Hide Ollie and wait for fonts before capturing. */
export async function stabilizeChrome(page: Page): Promise<void> {
  await page.evaluate(() => {
    const owl = document.getElementById('ollie-owl');
    if (owl) {
      (owl as HTMLElement).style.visibility = 'hidden';
      (owl as HTMLElement).style.pointerEvents = 'none';
    }
  });
  await page.evaluate(async () => {
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }
  });
}

/** Re-seed Math.random so the next createInitialState() is deterministic. */
export async function reseedVisualRng(page: Page): Promise<void> {
  await page.evaluate((seed) => {
    window.__mpVisualReseed?.(seed);
  }, VISUAL_SEED);
}

/**
 * Always open New Game → human-vs-human → reseed → Start so shuffled boards
 * (rods, dice, hands) do not depend on how many Math.random calls happened
 * during mount / owl / idle warm.
 */
export async function startHumanBoard(page: Page): Promise<void> {
  await waitForGameReady(page);
  await stabilizeChrome(page);

  const modal = page.locator('#new-game-modal');
  const alreadyOpen = await modal.isVisible().catch(() => false);
  if (!alreadyOpen) {
    await page.locator('#new-game-btn').click();
  }
  await expect(modal).toBeVisible({ timeout: 10_000 });

  const human = page.locator('.mode-option[data-mode="human-vs-human"]');
  if (await human.isVisible().catch(() => false)) {
    await human.click();
  }

  await reseedVisualRng(page);
  await page.locator('#start-game-btn').click();
  await expect(modal).toHaveClass(/hidden/);
  await stabilizeChrome(page);
}

export async function gotoLanding(page: Page): Promise<void> {
  await installVisualDeterminism(page);
  await page.goto('/?board3d=0#/');
  await expect(
    page.locator('.game-card, .division-section, h1').first()
  ).toBeVisible({
    timeout: 15_000,
  });
  await stabilizeChrome(page);
}

export async function gotoGameBoard(page: Page, gameId: string): Promise<void> {
  await installVisualDeterminism(page);
  await page.goto(`/?board3d=0#/game/${gameId}`);
  await startHumanBoard(page);
  const sel = MOUNT[gameId] ?? '#board, #game-container, main';
  await expect(page.locator(sel).first()).toBeVisible({ timeout: 15_000 });
  // Guard: 3D canvas must stay off for this suite.
  await expect(page.locator('canvas[data-mp3d]')).toHaveCount(0);
}
