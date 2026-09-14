/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Sum controller hand labels. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 56 sum — controller hand labels', () => {
  it('opening hand labels Blue/Red 7 left leftover', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    initGame(root);
    expect(root.querySelector('.sd-hand-label.player1')?.textContent).toMatch(
      /Blue \(7 left\)/
    );
    expect(root.querySelector('.sd-hand-label.player2')?.textContent).toMatch(
      /Red \(7 left\)/
    );
  });
});
