/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Sum controller winner banner. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 56 sum — controller winner banner', () => {
  it('forged Blue winner banner leftover', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctl = initGame(root);
    ctl.state = { ...ctl.state, winner: 'player1', phase: 'gameOver' };
    ctl.update();
    expect(root.querySelector('.sd-winner-banner')?.textContent).toMatch(
      /Blue Wins! 🎉/
    );
  });
});
