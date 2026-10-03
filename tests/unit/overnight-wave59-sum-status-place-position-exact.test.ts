/**
 * Wave 59 Contig/SD residual — Sum place-position status exact. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 59 sum — place position status', () => {
  it('placing with selection shows Click a valid position', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    const id = ctrl.state.hands.player1[0]!.id;
    ctrl.state = {
      ...ctrl.state,
      phase: 'placing',
      currentDice: [3, 4],
      selectedDomino: id,
      currentPlayer: 'player1',
    };
    ctrl.update();
    expect(root.querySelector('.sd-status')?.textContent).toMatch(
      /Blue - Click a valid position to place/
    );
  });
});
