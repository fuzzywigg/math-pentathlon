/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact gameOver hides status.
 * Drives public Continue path to settle. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  initGame,
  getCurrentState,
} from '../../src/games/frac-fact/game-controller';
import { DEFAULT_MAX_PROBLEMS } from '../../src/games/frac-fact/types';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 56 frac controller — gameOver hides status', () => {
  it('after max problems, banner shows and status is omitted leftover', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    initGame(root);

    for (let i = 0; i < DEFAULT_MAX_PROBLEMS; i++) {
      const btn = root.querySelector('.frac-choice-btn') as HTMLButtonElement;
      expect(btn).toBeTruthy();
      btn.click();
      const cont = root.querySelector(
        '.frac-continue-btn'
      ) as HTMLButtonElement;
      expect(cont).toBeTruthy();
      cont.click();
    }

    expect(getCurrentState().phase).toBe('gameOver');
    expect(root.querySelector('.frac-game-over')).toBeTruthy();
    expect(root.querySelector('.frac-winner-banner')).toBeTruthy();
    expect(root.querySelector('.frac-status')).toBeNull();
  });
});
