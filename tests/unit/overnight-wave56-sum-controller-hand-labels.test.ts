/**
 * Wave 56 leftover after #243 — Sum Dominoes hand label residual.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame } from '../../src/games/sum-dominoes/game-controller';
import { CONFIG } from '../../src/games/sum-dominoes/types';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 56 sum — controller hand labels', () => {
  it('labels Blue/Red with starting hand counts', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    initGame(root, false);
    expect(root.querySelector('.sd-hand-label.player1')?.textContent).toMatch(
      new RegExp(`Blue \\(${CONFIG.STARTING_HAND_SIZE} left\\)`)
    );
    expect(root.querySelector('.sd-hand-label.player2')?.textContent).toMatch(
      new RegExp(`Red \\(${CONFIG.STARTING_HAND_SIZE} left\\)`)
    );
  });
});
