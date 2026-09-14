/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Frac Fact newGameVsHuman chrome.
 * Wave57 locked newGameVsAI; deepen human opponent leftover. Tests-only.
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
  document.getElementById('app')?.remove();
});

describe('Wave 58 frac controller — newGameVsHuman', () => {
  it('newGameVsHuman stays playing with human opponent chrome leftover', () => {
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const root = document.createElement('div');
    document.body.appendChild(root);
    initGame(root);
    newGameVsHuman('medium');
    expect(getCurrentState().phase).toBe('playing');
    expect(getCurrentState().difficulty).toBe('medium');
    expect(getCurrentState().currentProblem).not.toBeNull();
    // HvH clears AI chrome (does not stamp data-opponent="human")
    expect(app.getAttribute('data-opponent')).toBeNull();
    expect(app.classList.contains('game-vs-ai')).toBe(false);
    expect(root.querySelectorAll('.frac-choice-btn')).toHaveLength(4);
  });
});
