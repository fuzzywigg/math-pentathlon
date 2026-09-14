/**
 * Wave 56 leftover after #256 — Stars win status with points. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/stars-bars/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('stars-styles')?.remove();
});

describe('Wave 56 stars — win points', () => {
  it('Blue wins with N points + Blue Wins! banner', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const ctrl = newGameVsHuman(el);
    ctrl.state = {
      ...ctrl.state,
      phase: 'gameOver',
      winner: 'player1',
      playerScores: { player1: 30, player2: 12 },
    };
    ctrl.update();
    expect(el.querySelector('.stars-status')?.textContent).toMatch(
      /Blue wins with 30 points!/
    );
    expect(el.querySelector('.stars-winner-banner')?.textContent).toBe('Blue Wins!');
  });
});
