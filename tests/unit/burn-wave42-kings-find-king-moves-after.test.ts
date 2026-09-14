/**
 * Wave 42 — Kings findKingPosition / getValidKingMoves opening + after move.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  findKingPosition,
  getValidKingMoves,
} from '../../src/games/kings-quadraphages/rules';
import {
  createInitialGameState,
  moveKing,
} from '../../src/games/kings-quadraphages/game-state';

describe('Wave 42 kings — findKing / valid moves after move', () => {
  it('opening kings at 0-based (0,4) and (8,4)', () => {
    const state = createInitialGameState();
    expect(findKingPosition(state.board, 'player1')).toEqual({
      row: 0,
      col: 4,
    });
    expect(findKingPosition(state.board, 'player2')).toEqual({
      row: 8,
      col: 4,
    });
  });

  it('player1 opening has 5 edge moves (not 8)', () => {
    const state = createInitialGameState();
    const moves = getValidKingMoves(state, 'player1');
    expect(moves).toHaveLength(5);
    expect(moves).toEqual(
      expect.arrayContaining([
        { row: 0, col: 3 },
        { row: 0, col: 5 },
        { row: 1, col: 3 },
        { row: 1, col: 4 },
        { row: 1, col: 5 },
      ])
    );
  });

  it('after moveKing to (2,5), findKing tracks and moves recount', () => {
    let state = createInitialGameState();
    state = moveKing(state, { row: 2, col: 5 });
    expect(findKingPosition(state.board, 'player1')).toEqual({
      row: 1,
      col: 4,
    });
    const moves = getValidKingMoves(state, 'player1');
    expect(moves.length).toBe(8);
    expect(moves.some((m) => m.row === 0 && m.col === 4)).toBe(true);
  });
});
