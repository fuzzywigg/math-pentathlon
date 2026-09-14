/**
 * Wave 57 leftover after #257 — Fab status seat class for player2. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/fab-a-diffy/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 57 fab — status player2 class', () => {
  it('currentPlayer player2 mounts .fab-status.player2', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const ctrl = newGameVsHuman(container);
    expect(container.querySelector('.fab-status.player1')).toBeTruthy();

    ctrl.state = { ...ctrl.state, currentPlayer: 'player2' };
    ctrl.update();
    expect(container.querySelector('.fab-status.player2')).toBeTruthy();
    expect(container.querySelector('.fab-status.player1')).toBeNull();
  });
});
