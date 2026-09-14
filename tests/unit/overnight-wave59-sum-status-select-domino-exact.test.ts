/**
 * Wave 59 Contig/SD residual — Sum select-domino status exact. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 59 sum — select status exact', () => {
  it('placing without selection shows Select a domino', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    ctrl.state = {
      ...ctrl.state,
      phase: 'placing',
      currentDice: [3, 4],
      selectedDomino: null,
      currentPlayer: 'player1',
    };
    ctrl.update();
    expect(root.querySelector('.sd-status')?.textContent).toMatch(
      /Blue - Select a domino to play/
    );
  });
});
