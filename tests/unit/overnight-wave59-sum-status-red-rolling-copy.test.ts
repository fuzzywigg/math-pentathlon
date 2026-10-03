/**
 * Wave 59 Contig/SD residual — Sum Red rolling status copy. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 59 sum — Red rolling status', () => {
  it('shows Red turn roll instruction', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    ctrl.state = {
      ...ctrl.state,
      currentPlayer: 'player2',
      phase: 'rolling',
    };
    ctrl.update();
    expect(root.querySelector('.sd-status')?.textContent).toMatch(
      /Red's turn - Roll the dice/
    );
  });
});
