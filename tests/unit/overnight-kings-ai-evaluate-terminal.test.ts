/**
 * Overnight HEAVY — Kings evaluatePosition terminal ±10000.
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

function surround(
  board: Board,
  king: Position,
  owner: 'player1' | 'player2'
): void {
  for (const d of [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ] as const) {
    const r = king.row + d[0];
    const c = king.col + d[1];
    if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
      placePiece(board, { row: r, col: c }, { type: 'quadraphage', owner });
    }
  }
}

describe('Overnight kings — evaluatePosition terminals', () => {
  it('opponent trapped → +10000 for player1', () => {
    const board = createEmptyBoard();
    placePiece(board, { row: 4, col: 4 }, { type: 'king', owner: 'player1' });
    placePiece(board, { row: 0, col: 0 }, { type: 'king', owner: 'player2' });
    surround(board, { row: 0, col: 0 }, 'player1');
    expect(evaluatePosition(createRulesState(board), 'player1')).toBe(10000);
  });

  it('own king trapped → -10000 for player1', () => {
    const board = createEmptyBoard();
    placePiece(board, { row: 4, col: 4 }, { type: 'king', owner: 'player1' });
    placePiece(board, { row: 8, col: 8 }, { type: 'king', owner: 'player2' });
    surround(board, { row: 4, col: 4 }, 'player2');
    expect(evaluatePosition(createRulesState(board), 'player1')).toBe(-10000);
  });
});
