/**
 * Wave 67 leftover after tip/#316 — Fab wins status exact seat.
 * Wave55/57 banner soft; lock status wins! with seat icon leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/fab-a-diffy/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 67 fab — controller wins status exact', () => {
  it('winner status is exact with seat icon', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const ctrl = newGameVsHuman(container);
    ctrl.state = { ...ctrl.state, winner: 'player1' };
    ctrl.update();
    expect(container.querySelector('.fab-status')?.textContent).toBe(
      '🔵 Blue wins!'
    );
  });
});
