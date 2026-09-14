/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Pinball newGameVsHuman chrome.
 * Wave57 locked newGameVsAI easy; deepen human opponent leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  initGame,
  newGameVsHuman,
  getCurrentState,
} from '../../src/games/fraction-pinball/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fraction-pinball-styles')?.remove();
  document.getElementById('app')?.remove();
});

describe('Wave 58 pinball controller — newGameVsHuman', () => {
  it('newGameVsHuman stays answering with human opponent chrome leftover', () => {
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const root = document.createElement('div');
    document.body.appendChild(root);
    initGame(root);
    newGameVsHuman();
    expect(getCurrentState().phase).toBe('answering');
    expect(getCurrentState().currentChallenge).not.toBeNull();
    // HvH clears AI chrome (does not stamp data-opponent="human")
    expect(app.getAttribute('data-opponent')).toBeNull();
    expect(app.classList.contains('game-vs-ai')).toBe(false);
    expect(root.querySelectorAll('.pinball-choice-btn')).toHaveLength(4);
  });
});
