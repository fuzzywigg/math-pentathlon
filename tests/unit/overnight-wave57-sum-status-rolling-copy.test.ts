/**
 * Wave 57 leftover after #267 — Sum rolling status exact copy. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 57 sum — status rolling copy', () => {
  it('opening status is Blue turn - Roll the dice', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    newGameVsHuman(root);
    expect(root.querySelector('.sd-status.player1')?.textContent).toMatch(
      /Blue's turn - Roll the dice/
    );
  });
});
