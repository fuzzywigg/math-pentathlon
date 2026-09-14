/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball gameOver hides status/main.
 * Drives public Continue path to settle. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  initGame,
  getCurrentState,
} from '../../src/games/fraction-pinball/game-controller';
import { MAX_ROUNDS } from '../../src/games/fraction-pinball/types';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 56 pinball controller — gameOver hides status', () => {
  it('after max rounds, game-over shows and status/main omitted leftover', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    initGame(root);

    // Safety cap: wrong answers drain balls and can end early
    for (let i = 0; i < MAX_ROUNDS * 2 && getCurrentState().phase !== 'gameOver'; i++) {
      const btn = root.querySelector(
        '.pinball-choice-btn'
      ) as HTMLButtonElement | null;
      if (!btn) break;
      btn.click();
      const cont = root.querySelector(
        '.pinball-continue-btn'
      ) as HTMLButtonElement | null;
      if (cont) cont.click();
    }

    expect(getCurrentState().phase).toBe('gameOver');
    expect(root.querySelector('.pinball-game-over')).toBeTruthy();
    expect(root.querySelector('.pinball-status')).toBeNull();
    expect(root.querySelector('.pinball-main')).toBeNull();
  });
});
