/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact setDifficulty gate leftover.
 * Distinct overnight slice assertion after #254 controller harden. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  initGame,
  setDifficulty,
  getCurrentState,
} from '../../src/games/frac-fact/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 56 frac controller — setDifficulty', () => {
  it('switches to easy at problemsCompleted 0 leftover', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    initGame(root);
    expect(getCurrentState().difficulty).toBe('medium');
    setDifficulty('easy');
    expect(getCurrentState().difficulty).toBe('easy');
    expect(getCurrentState().currentProblem).not.toBeNull();
    expect(getCurrentState().phase).toBe('playing');
  });

  it('no-ops after a completed problem leftover', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    initGame(root);
    setDifficulty('hard');
    expect(getCurrentState().difficulty).toBe('hard');
    (root.querySelector('.frac-choice-btn') as HTMLButtonElement).click();
    (root.querySelector('.frac-continue-btn') as HTMLButtonElement).click();
    expect(getCurrentState().problemsCompleted).toBeGreaterThan(0);
    const before = getCurrentState().difficulty;
    setDifficulty('easy');
    expect(getCurrentState().difficulty).toBe(before);
  });
});
