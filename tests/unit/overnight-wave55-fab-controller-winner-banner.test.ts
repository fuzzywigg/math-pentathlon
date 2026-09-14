/**
 * Wave 55 leftover after #249/#250 — Fab controller winner banner. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/fab-a-diffy/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 55 fab — controller winner banner', () => {
  it('mounts .fab-winner-banner and wins status for player1', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const ctrl = newGameVsHuman(container);
    ctrl.state = { ...ctrl.state, winner: 'player1', phase: 'gameOver' };
    ctrl.update();
    expect(container.querySelector('.fab-winner-banner')?.textContent).toMatch(
      /Blue Wins!/
    );
    expect(container.querySelector('.fab-status')?.textContent).toMatch(/wins!/);
  });
});
