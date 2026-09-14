/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Frac Fact newGameVsHuman hard leftover.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  initGame,
  newGameVsHuman,
  getCurrentState,
} from '../../src/games/frac-fact/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 55 frac controller — vs human hard', () => {
  it('newGameVsHuman(hard) persists difficulty leftover', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    initGame(root);
    newGameVsHuman('hard');
    expect(getCurrentState().difficulty).toBe('hard');
    expect(getCurrentState().phase).toBe('playing');
    expect(getCurrentState().currentProblem).not.toBeNull();
  });
});
