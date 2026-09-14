/**
 * Overnight HEAVY after #210 — evaluatePosition non-terminal mobility heuristic.
 * #210 only asserted ±10000 terminals.
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
  return { board, player1Supply: 25, player2Supply: 25 };
}

describe('Overnight kings — evaluate heuristic mobility', () => {
  it('opening-like midboard yields finite non-terminal score', () => {
    const board = createEmptyBoard();
    placePiece(board, { row: 0, col: 4 }, { type: 'king', owner: 'player1' });
    placePiece(board, { row: 8, col: 4 }, { type: 'king', owner: 'player2' });
    const score = evaluatePosition(createRulesState(board), 'player1');
    expect(Number.isFinite(score)).toBe(true);
    expect(Math.abs(score)).toBeLessThan(10000);
  });

  it('asymmetric mobility tilts score toward freer king', () => {
    const board = createEmptyBoard();
    // P1 near center (more mobility); P2 near corner with partial blockade
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
    const score = evaluatePosition(createRulesState(board), 'player1');
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(10000);
  });
});
