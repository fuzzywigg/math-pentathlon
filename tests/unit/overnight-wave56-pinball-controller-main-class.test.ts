/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball .pinball-main layout.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame } from '../../src/games/fraction-pinball/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 56 pinball controller — main class', () => {
  it('active play mounts .pinball-main leftover', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    initGame(root);
    const main = root.querySelector('.pinball-main');
    expect(main).toBeTruthy();
    expect(main?.querySelector('.pinball-board')).toBeTruthy();
    expect(main?.querySelector('.pinball-challenge')).toBeTruthy();
  });
});
