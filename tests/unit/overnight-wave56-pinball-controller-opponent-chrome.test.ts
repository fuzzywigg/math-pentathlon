/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball opponent chrome stamp.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  initGame,
  newGameVsAI,
  newGameVsHuman,
} from '../../src/games/fraction-pinball/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 56 pinball controller — opponent chrome', () => {
  it('vs-AI stamps data-opponent ai; vs-human clears leftover', () => {
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const root = document.createElement('div');
    app.appendChild(root);
    initGame(root);
    newGameVsAI('hard');
    expect(app.getAttribute('data-opponent')).toBe('ai');
    expect(app.classList.contains('game-vs-ai')).toBe(true);
    newGameVsHuman();
    expect(app.getAttribute('data-opponent')).toBeNull();
    expect(app.classList.contains('game-vs-ai')).toBe(false);
  });
});
