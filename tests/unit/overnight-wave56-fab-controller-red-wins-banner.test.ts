/**
 * Wave 56 leftover after #255/#256 — Fab Red Wins banner (wave55 covered Blue). Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/fab-a-diffy/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 56 fab — red winner banner', () => {
  it('player2 mounts Red Wins! banner and status', () => {
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
