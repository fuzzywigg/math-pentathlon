/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Frac Fact newGameVsAI leftover.
 * Wave55 overnight only covered newGameVsHuman(hard). Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  initGame,
  newGameVsAI,
  getCurrentState,
} from '../../src/games/frac-fact/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('frac-fact-styles')?.remove();
  document.getElementById('app')?.remove();
});

describe('Wave 57 frac controller — newGameVsAI', () => {
  it('newGameVsAI stays playing with AI opponent chrome leftover', () => {
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const root = document.createElement('div');
    document.body.appendChild(root);
    initGame(root);
    newGameVsAI('hard', 'easy');
    expect(getCurrentState().phase).toBe('playing');
    expect(getCurrentState().difficulty).toBe('hard');
    expect(getCurrentState().currentProblem).not.toBeNull();
    expect(app.getAttribute('data-opponent')).toBe('ai');
    expect(root.querySelectorAll('.frac-choice-btn')).toHaveLength(4);
  });
});
