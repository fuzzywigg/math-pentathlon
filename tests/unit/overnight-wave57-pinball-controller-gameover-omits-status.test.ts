/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Pinball gameOver omits status chrome.
 * Controllers skip .pinball-status when phase is gameOver. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame, getCurrentState } from '../../src/games/fraction-pinball/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 57 pinball controller — gameover omits status', () => {
  it('after max rounds, gameOver DOM has no .pinball-status leftover', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    initGame(root);
    const max = getCurrentState().maxRounds;
    for (let i = 0; i < max; i++) {
      const state = getCurrentState();
      if (state.phase === 'gameOver') break;
      const correct = state.currentChallenge?.correctAnswer;
      const btn = Array.from(
        root.querySelectorAll('.pinball-choice-btn')
      ).find((el) => el.textContent === correct) as HTMLButtonElement | undefined;
      btn?.click();
      (
        root.querySelector('.pinball-continue-btn') as HTMLButtonElement | null
      )?.click();
    }
    expect(getCurrentState().phase).toBe('gameOver');
    expect(root.querySelector('.pinball-game-over')).toBeTruthy();
    expect(root.querySelector('.pinball-status')).toBeNull();
  });
});
