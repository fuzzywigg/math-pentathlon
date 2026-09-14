/**
 * Wave 42 leftovers B — Kings medium AI returns legal complete moves.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { getAIMove } from '../../src/games/kings-quadraphages/ai';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import {
  getValidKingMoves,
  getValidQuadraphagePlacements,
  findKingPosition,
} from '../../src/games/kings-quadraphages/rules';

describe('Wave 42 kings — medium AI legality', () => {
  it('medium AI kingMove in valids; quad not on kings', () => {
    const state = createInitialGameState();
    const move = getAIMove(state, 'player1', 'medium');
    expect(move).not.toBeNull();
    const kingValids = getValidKingMoves(state, 'player1');
    expect(
      kingValids.some(
        (m) => m.row === move!.kingMove.row && m.col === move!.kingMove.col
      )
    ).toBe(true);

    // Simulate king move then check quad is among placements
    const board = state.board.map((row) => row.map((c) => (c ? { ...c } : null)));
    const from = findKingPosition(board, 'player1')!;
    board[move!.kingMove.row][move!.kingMove.col] = board[from.row][from.col];
    board[from.row][from.col] = null;
    const afterKing = { ...state, board };
    const places = getValidQuadraphagePlacements(afterKing);
    expect(
      places.some(
        (p) =>
          p.row === move!.quadraphagePlacement.row &&
          p.col === move!.quadraphagePlacement.col
      )
    ).toBe(true);
  });
});
