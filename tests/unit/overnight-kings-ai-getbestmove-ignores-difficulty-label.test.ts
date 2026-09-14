/**
 * Overnight HEAVY after #210 — getBestMove ignores difficulty label (always hard search).
 * #210 only called getBestMove with default; alias contract still thin.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getBestMove } from '../../src/games/kings-quadraphages/ai';
import {
  Board,
  BOARD_SIZE,
  RulesGameState,
  Position,
} from '../../src/games/kings-quadraphages/board';
import { Piece } from '../../src/games/kings-quadraphages/pieces';

function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  );
}

function placePiece(board: Board, pos: Position, piece: Piece): void {
  board[pos.row][pos.col] = piece;
}

function createRulesState(board: Board): RulesGameState {
  return { board, player1Supply: 30, player2Supply: 30 };
}

function winTrapBoard(): Board {
  const board = createEmptyBoard();
  placePiece(board, { row: 4, col: 4 }, { type: 'king', owner: 'player1' });
  placePiece(board, { row: 0, col: 0 }, { type: 'king', owner: 'player2' });
  placePiece(
    board,
    { row: 0, col: 1 },
    { type: 'quadraphage', owner: 'player1' }
  );
  placePiece(
    board,
    { row: 1, col: 0 },
    { type: 'quadraphage', owner: 'player1' }
  );
  return board;
}

describe('Overnight kings — getBestMove ignores difficulty label', () => {
  it('getBestMove with easy/medium labels still traps on winTrapBoard', () => {
    const state = createRulesState(winTrapBoard());
    for (const d of ['easy', 'medium'] as const) {
      const move = getBestMove(state, 'player1', d);
      expect(move).not.toBeNull();
      expect(move!.quadraphagePlacement).toEqual({ row: 1, col: 1 });
    }
  });
});
