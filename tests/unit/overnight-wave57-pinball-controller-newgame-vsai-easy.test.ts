/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Pinball newGameVsAI easy leftover.
 * Wave55 hard + wave56 vs-human; easy path unasserted overnight. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  initGame,
  newGameVsAI,
  getCurrentState,
} from '../../src/games/fraction-pinball/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fraction-pinball-styles')?.remove();
  document.getElementById('app')?.remove();
});

describe('Wave 57 pinball controller — newGameVsAI easy', () => {
  it('newGameVsAI(easy) stays answering with AI chrome leftover', () => {
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const root = document.createElement('div');
    document.body.appendChild(root);
    initGame(root);
    newGameVsAI('easy');
    expect(getCurrentState().phase).toBe('answering');
    expect(getCurrentState().currentChallenge).not.toBeNull();
    expect(app.getAttribute('data-opponent')).toBe('ai');
    expect(root.querySelectorAll('.pinball-choice-btn')).toHaveLength(4);
  });
});
