/**
 * Wave 56 leftover after #243 — Sum Dominoes layout mount residual.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 56 sum — controller layout mount', () => {
  it('mounts game-area, main-layout, and #sd-styles', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    initGame(root, false);
    expect(root.querySelector('.sd-game-area')).toBeTruthy();
    expect(root.querySelector('.sd-main-layout')).toBeTruthy();
    expect(root.querySelector('.sd-board')).toBeTruthy();
    expect(document.getElementById('sd-styles')).toBeTruthy();
  });
});
