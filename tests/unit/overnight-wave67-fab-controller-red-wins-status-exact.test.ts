/**
 * Wave 67 leftover after tip/#316 — Fab Red wins status exact.
 * Wave56 Red banner soft; lock status Red wins! leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/fab-a-diffy/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 67 fab — controller red wins status exact', () => {
  it('player2 winner status is exact with seat icon', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const ctrl = newGameVsHuman(container);
    ctrl.state = { ...ctrl.state, winner: 'player2' };
    ctrl.update();
    expect(container.querySelector('.fab-status')?.textContent).toBe(
      '🔴 Red wins!'
    );
  });
});
