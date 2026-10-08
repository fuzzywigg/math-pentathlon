/**
 * Shared Kings Quadraphages board-state builders for unit tests.
 */
import {
  type Board,
  BOARD_SIZE,
  type Position,
  type RulesGameState,
} from '../../../src/games/kings-quadraphages/board';
import type { Piece } from '../../../src/games/kings-quadraphages/pieces';

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  );
}

export function placePiece(board: Board, pos: Position, piece: Piece): void {
  // ratchet: Board is always BOARD_SIZE × BOARD_SIZE dense.
  board[pos.row]![pos.col] = piece;
}

export function placeKing(
  board: Board,
  pos: Position,
  owner: 'player1' | 'player2'
): void {
  placePiece(board, pos, { type: 'king', owner });
}

export function placeQuadraphage(
  board: Board,
  pos: Position,
  owner: 'player1' | 'player2'
): void {
  placePiece(board, pos, { type: 'quadraphage', owner });
}

export function createCustomGameState(
  board: Board,
  player1Supply = 30,
  player2Supply = 30
): RulesGameState {
  return {
    board,
    player1Supply,
    player2Supply,
  };
}

/** Alias used by overnight kings AI suites. */
export const createRulesState = createCustomGameState;

/** Opening kings on the standard center files. */
export function openingBoard(): Board {
  const board = createEmptyBoard();
  placeKing(board, { row: 0, col: 4 }, 'player1');
  placeKing(board, { row: 8, col: 4 }, 'player2');
  return board;
}
