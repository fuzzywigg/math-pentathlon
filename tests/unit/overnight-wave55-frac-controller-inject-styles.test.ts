/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Frac Fact initGame injects stylesheet.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame } from '../../src/games/frac-fact/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 55 frac controller — inject styles', () => {
  it('initGame mounts #frac-fact-styles once', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    initGame(root);
    expect(document.getElementById('frac-fact-styles')).toBeTruthy();
    expect(root.querySelector('.frac-game-container')).toBeTruthy();
    expect(root.querySelector('.frac-problem')).toBeTruthy();
  });
});
