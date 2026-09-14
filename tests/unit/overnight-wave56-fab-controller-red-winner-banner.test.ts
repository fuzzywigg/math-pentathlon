/**
 * Wave 56 leftover after #255/#256 — Fab Red winner banner + status. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/fab-a-diffy/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 56 fab — controller red winner banner', () => {
  it('mounts Red Wins banner and status for player2', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const ctrl = newGameVsHuman(container);
    ctrl.state = { ...ctrl.state, winner: 'player2', phase: 'gameOver' };
    ctrl.update();
    expect(container.querySelector('.fab-winner-banner')?.textContent).toMatch(
      /Red Wins!/
    );
    expect(container.querySelector('.fab-status')?.textContent).toMatch(
      /Red wins!/
    );
  });
});
