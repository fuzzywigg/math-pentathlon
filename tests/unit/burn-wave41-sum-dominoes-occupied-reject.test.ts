/**
 * Wave 41 — Sum Dominoes occupied-cell placement rejects. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  isValidPlacement,
  canPlayDomino,
} from '../../src/games/sum-dominoes/rules';
import {
  CONFIG,
  type Domino,
  type PlacedDomino,
  type SumDominoesState,
} from '../../src/games/sum-dominoes/types';

function makeDomino(id: string, face1: number, face2: number): Domino {
  return { id, face1, face2, owner: 'player1', orientation: 'horizontal' };
}

function placeOnBoard(
  board: (PlacedDomino | null)[][],
  domino: Domino,
  row: number,
  col: number,
  orientation: 'horizontal' | 'vertical'
): void {
  const placed: PlacedDomino = {
    domino: { ...domino, orientation },
    position: { row, col },
    orientation,
  };
  board[row][col] = placed;
  if (orientation === 'horizontal') board[row][col + 1] = placed;
  else board[row + 1][col] = placed;
}

describe('Wave 41 sum-dominoes — occupied rejects', () => {
  it('isValidPlacement false on center seed cells', () => {
    const state = createInitialState();
    const d = makeDomino('clash', 0, 0);
    expect(
      isValidPlacement(
        state,
        d,
        { row: CONFIG.CENTER_ROW, col: CONFIG.CENTER_COL },
        'horizontal',
        6
      )
    ).toBe(false);
    expect(
      isValidPlacement(
        state,
        d,
        { row: CONFIG.CENTER_ROW, col: CONFIG.CENTER_COL },
        'vertical',
        6
      )
    ).toBe(false);
  });

  it('rejects when second cell of horizontal is occupied', () => {
    const state = createInitialState();
    const board = state.board.map((row) => [...row]);
    // Place a blocker to the left of center so col+1 hits center
    placeOnBoard(
      board,
      makeDomino('block', 1, 1),
      CONFIG.CENTER_ROW,
      CONFIG.CENTER_COL - 2,
      'horizontal'
    );
    const forged: SumDominoesState = { ...state, board };
    const d = makeDomino('try', 3, 3);
    expect(
      isValidPlacement(
        forged,
        d,
        { row: CONFIG.CENTER_ROW, col: CONFIG.CENTER_COL - 1 },
        'horizontal',
        9
      )
    ).toBe(false);
  });

  it('canPlayDomino false when hand faces cannot adjoin any empty cell', () => {
    const state = createInitialState();
    const impossible = makeDomino('imp', 0, 0);
    // Target sum that cannot match against center sixes with 0+6
    expect(canPlayDomino(state, impossible, 1)).toBe(false);
  });
});
