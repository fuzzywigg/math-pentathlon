/**
 * Overnight HEAVY after #210 — Kings late-game close-in (totalQuads >= 20).
 * #210 boards used supply 20–30 → early-game stay-away factor only.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getAIMove } from '../../src/games/kings-quadraphages/ai';
import {
  Board,
  BOARD_SIZE,
  RulesGameState,
  Position,
} from '../../src/games/kings-quadraphages/board';
import { Piece } from '../../src/games/kings-quadraphages/pieces';
import { getValidKingMoves } from '../../src/games/kings-quadraphages/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  );
}

function placePiece(board: Board, pos: Position, piece: Piece): void {
  board[pos.row][pos.col] = piece;
}

describe('Overnight kings — late-game close-in', () => {
  it('hard with depleted supplies still returns a legal king+placement', () => {
    const board = createEmptyBoard();
    placePiece(board, { row: 2, col: 2 }, { type: 'king', owner: 'player1' });
    placePiece(board, { row: 6, col: 6 }, { type: 'king', owner: 'player2' });
    // totalQuads = 60 - 10 - 10 = 40 >= 20 → close-in branch
    const state: RulesGameState = {
      board,
      player1Supply: 10,
      player2Supply: 10,
    };
    expect(getValidKingMoves(state, 'player1').length).toBeGreaterThan(0);

    const move = getAIMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(move!.kingMove.row).toBeGreaterThanOrEqual(0);
    expect(move!.kingMove.col).toBeGreaterThanOrEqual(0);
    expect(move!.quadraphagePlacement.row).toBeGreaterThanOrEqual(0);
  });

  it('medium late-game still yields legal move under seeded random', () => {
    const board = createEmptyBoard();
    placePiece(board, { row: 3, col: 3 }, { type: 'king', owner: 'player1' });
    placePiece(board, { row: 5, col: 5 }, { type: 'king', owner: 'player2' });
    const state: RulesGameState = {
      board,
      player1Supply: 5,
      player2Supply: 5,
    };
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const move = getAIMove(state, 'player1', 'medium');
    expect(move).not.toBeNull();
    const kingValids = getValidKingMoves(state, 'player1');
    expect(
      kingValids.some(
        (m) => m.row === move!.kingMove.row && m.col === move!.kingMove.col
      )
    ).toBe(true);
  });
});
