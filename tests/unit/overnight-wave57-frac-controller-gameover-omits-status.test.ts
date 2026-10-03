/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Frac Fact gameOver omits status chrome.
 * Controllers skip .frac-status when phase is gameOver. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame, getCurrentState } from '../../src/games/frac-fact/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 57 frac controller — gameover omits status', () => {
  it('after max problems, gameOver DOM has no .frac-status leftover', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    initGame(root);
    const max = getCurrentState().maxProblems;
    for (let i = 0; i < max; i++) {
      const choice = root.querySelector(
        '.frac-choice-btn'
      ) as HTMLButtonElement | null;
      if (!choice) break;
      choice.click();
      const cont = root.querySelector(
        '.frac-continue-btn'
      ) as HTMLButtonElement | null;
      cont?.click();
    }
    expect(getCurrentState().phase).toBe('gameOver');
    expect(root.querySelector('.frac-game-over')).toBeTruthy();
    expect(root.querySelector('.frac-status')).toBeNull();
  });
});
