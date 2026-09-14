/**
 * Wave 48 — Juggle checkWinner when only p2 board is filled. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { checkWinner, createInitialState } from '../../src/games/juggle/rules';
import { SHAPE_POOLS } from '../../src/games/juggle/types';
import { placePolyomino } from '../../src/core/polyomino/placement';

describe('Wave 48 juggle — checkWinner p2', () => {
  it('returns player2 when only p2 board is filled', () => {
    const mono = SHAPE_POOLS.monomino[0];
    let board = createInitialState().boards.player2;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        board = placePolyomino(board, mono, { row, col }, 0, false, 2);
      }
    }
    expect(
      checkWinner({
        player1: createInitialState().boards.player1,
        player2: board,
      })
    ).toBe('player2');
  });
});
