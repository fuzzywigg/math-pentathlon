/**
 * Wave 43 — Juggle getBoardFillPercentage ladder. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState, getBoardFillPercentage } from '../../src/games/juggle/rules';
import { SHAPE_POOLS } from '../../src/games/juggle/types';
import { placePolyomino } from '../../src/core/polyomino/placement';

describe('Wave 43 juggle — fill percentage ladder', () => {
  it('1 cell ≈ 1%; 81 cells = 100%', () => {
    const mono = SHAPE_POOLS.monomino[0];
    let board = createInitialState().boards.player1;
    board = placePolyomino(board, mono, { row: 0, col: 0 }, 0, false, 1);
    expect(getBoardFillPercentage(board)).toBe(1);
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (row === 0 && col === 0) continue;
        board = placePolyomino(board, mono, { row, col }, 0, false, 1);
      }
    }
    expect(getBoardFillPercentage(board)).toBe(100);
  });
});
