/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact initGame default medium.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  initGame,
  getCurrentState,
} from '../../src/games/frac-fact/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 56 frac controller — init default medium', () => {
  it('bare initGame uses medium difficulty leftover', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    initGame(root);
    expect(getCurrentState().difficulty).toBe('medium');
    expect(getCurrentState().phase).toBe('playing');
  });
});
