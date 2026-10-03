/**
 * Wave 59 Contig/SD residual — Sum valid cell click places via controller. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/sum-dominoes/game-controller';
import { CONFIG, getDiceSum } from '../../src/games/sum-dominoes/types';
import { getValidPlacements } from '../../src/games/sum-dominoes/rules';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 59 sum — valid cell place', () => {
  it('selected + valid click removes domino from hand', () => {
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
    const dice: [number, number] = [3, 4];
    const state = {
      ...ctrl.state,
      board,
      hands: { player1: [playable], player2: [] },
      currentDice: dice,
      phase: 'placing' as const,
      selectedDomino: playable.id,
    };
    const placements = getValidPlacements(state, playable, getDiceSum(dice));
    expect(placements.length).toBeGreaterThan(0);
    ctrl.state = state;
    ctrl.update();
    const cell = root.querySelector('.sd-cell-valid') as HTMLElement;
    expect(cell).toBeTruthy();
    cell.click();
    expect(ctrl.state.hands.player1.length).toBe(0);
    expect(ctrl.state.winner).toBe('player1');
    expect(ctrl.state.phase).toBe('gameOver');
  });
});
