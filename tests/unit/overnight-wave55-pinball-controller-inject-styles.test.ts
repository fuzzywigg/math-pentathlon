/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Pinball initGame injects stylesheet leftover.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame } from '../../src/games/fraction-pinball/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 55 pinball controller — inject styles', () => {
  it('initGame mounts #fraction-pinball-styles leftover', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    initGame(root);
    expect(document.getElementById('fraction-pinball-styles')).toBeTruthy();
    expect(root.querySelector('.pinball-game-container')).toBeTruthy();
    expect(root.querySelector('.pinball-challenge')).toBeTruthy();
    expect(root.querySelector('.pinball-board')).toBeTruthy();
  });
});
