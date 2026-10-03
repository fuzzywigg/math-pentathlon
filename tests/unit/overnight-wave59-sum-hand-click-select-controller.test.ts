/**
 * Wave 59 Contig/SD residual — Sum hand click selects via controller. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/sum-dominoes/game-controller';
import { CONFIG } from '../../src/games/sum-dominoes/types';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 59 sum — hand click select', () => {
  it('clicking playable hand tile selects and updates status', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    const playable = {
      id: 'p-61',
      face1: 6,
      face2: 1,
      owner: 'player1' as const,
      orientation: 'horizontal' as const,
    };
    const board = ctrl.state.board.map((row) => row.map(() => null));
    board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL] = {
      domino: {
        id: 'seed',
        face1: 6,
        face2: 6,
        owner: null,
        orientation: 'horizontal',
      },
      position: { row: CONFIG.CENTER_ROW, col: CONFIG.CENTER_COL },
      orientation: 'horizontal',
    };
    ctrl.state = {
      ...ctrl.state,
      board,
      hands: { player1: [playable], player2: [] },
      currentDice: [3, 4],
      phase: 'placing',
      selectedDomino: null,
    };
    ctrl.update();
    const tile = root.querySelector('.sd-hand-domino-playable') as HTMLElement;
    expect(tile).toBeTruthy();
    tile.click();
    expect(ctrl.state.selectedDomino).toBe(playable.id);
    expect(root.querySelector('.sd-status')?.textContent).toMatch(
      /Click a valid position/
    );
  });
});
