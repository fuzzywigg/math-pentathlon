// Board dimensions
export const BOARD_SIZE = 9;

// Player identifiers
export type Player = 'blue' | 'red';

// Piece types
export type PieceType = 'king' | 'quadraphage';

// A piece on the board
export interface Piece {
  type: PieceType;
  owner: Player;
}

// A cell can be empty or contain a piece
export type Cell = Piece | null;

// The board is a 9x9 grid of cells
// Indexed as board[row][col] where row 0 is top, col 0 is left
export type Board = Cell[][];

// Position on the board
export interface Position {
  row: number; // 0-8, where 0 is top
  col: number; // 0-8, where 0 is left
}

// Starting positions for kings
export const BLUE_KING_START: Position = { row: 0, col: 4 }; // Center of top edge
export const RED_KING_START: Position = { row: 8, col: 4 }; // Center of bottom edge

// Create a new board with kings in starting positions
export function createInitialBoard(): Board {
  // Create empty 9x9 grid
  const board: Board = Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  );

  // Place blue king at top center
  board[BLUE_KING_START.row][BLUE_KING_START.col] = {
    type: 'king',
    owner: 'blue',
  };

  // Place red king at bottom center
  board[RED_KING_START.row][RED_KING_START.col] = {
    type: 'king',
    owner: 'red',
  };

  return board;
}

// Helper to check if a position is within the board
export function isValidPosition(pos: Position): boolean {
  return pos.row >= 0 && pos.row < BOARD_SIZE && pos.col >= 0 && pos.col < BOARD_SIZE;
}

// Get the piece at a position (returns null if empty or invalid)
export function getPiece(board: Board, pos: Position): Cell {
  if (!isValidPosition(pos)) {
    return null;
  }
  return board[pos.row][pos.col];
}

// Check if a cell is empty
export function isEmpty(board: Board, pos: Position): boolean {
  return isValidPosition(pos) && board[pos.row][pos.col] === null;
}
