/**
 * Overnight HEAVY after #210 — evaluatePosition missing-king ±10000 branches.
 * #210 terminals were mobility traps, not missing-piece paths.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { evaluatePosition } from '../../src/games/kings-quadraphages/ai';
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
  return { board, player1Supply: 20, player2Supply: 20 };
}

describe('Overnight kings — evaluate missing king', () => {
  it('only player1 king → +10000 (opponent king missing)', () => {
    const board = createEmptyBoard();
    placePiece(board, { row: 4, col: 4 }, { type: 'king', owner: 'player1' });
    expect(evaluatePosition(createRulesState(board), 'player1')).toBe(10000);
  });

  it('only player2 king → -10000 for player1 (own king missing)', () => {
    const board = createEmptyBoard();
    placePiece(board, { row: 4, col: 4 }, { type: 'king', owner: 'player2' });
    expect(evaluatePosition(createRulesState(board), 'player1')).toBe(-10000);
  });
});
