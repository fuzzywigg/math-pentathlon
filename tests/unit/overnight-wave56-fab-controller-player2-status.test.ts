/**
 * Wave 56 leftover after #255/#256 — Fab player2 status phase copy. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/fab-a-diffy/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 56 fab — controller player2 status', () => {
  it('paints Red seat class and first-bar prompt on player2 turn', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const ctrl = newGameVsHuman(container);
    ctrl.state = {
      ...ctrl.state,
      currentPlayer: 'player2',
      phase: 'selectingBar1',
    };
    ctrl.update();
    expect(container.querySelector('.fab-status.player2')?.textContent).toMatch(
      /Red's turn - Select first fraction bar/
    );
  });
});
