import { Piece, PieceType, PlayerOwner, INITIAL_QUADRAPHAGE_COUNT } from './pieces';

// Re-export piece types for convenience
export type { Piece, PieceType, PlayerOwner };

// Board dimensions
export const BOARD_SIZE = 9;

// A cell can be empty or contain a piece
export type Cell = Piece | null;

// The board is a 9x9 grid of cells
// Indexed as board[row][col] where row 0 is top, col 0 is left
// For 1-based indexing: row 1 = index 0, column 5 = index 4
export type Board = Cell[][];

// Position on the board (0-based internally)
export interface Position {
  row: number; // 0-8, where 0 is top (row 1), 8 is bottom (row 9)
  col: number; // 0-8, where 0 is left (col 1), 4 is center (col 5)
}

// Starting positions for kings (1-based: col 5, rows 1 and 9)
// Stored as 0-based: col 4, rows 0 and 8
export const PLAYER1_KING_START: Position = { row: 0, col: 4 }; // Row 1, Col 5 (top center)
export const PLAYER2_KING_START: Position = { row: 8, col: 4 }; // Row 9, Col 5 (bottom center)

// Complete game state
export interface GameState {
  board: Board;
  player1Supply: number;
  player2Supply: number;
}

/** @alias GameState — compatibility alias used by tests and rules module */
export type RulesGameState = GameState;

// Convert 1-based position to 0-based Position
export function fromOneBasedPosition(row: number, col: number): Position {
  return { row: row - 1, col: col - 1 };
}

// Convert 0-based Position to 1-based values
export function toOneBasedPosition(pos: Position): { row: number; col: number } {
  return { row: pos.row + 1, col: pos.col + 1 };
}

// Create a new game state with kings in starting positions
export function createInitialGameState(): GameState {
  // Create empty 9x9 grid
  const board: Board = Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  );

  // Place Player 1's King at top center (row 1, col 5 = index [0][4])
  board[PLAYER1_KING_START.row][PLAYER1_KING_START.col] = {
    type: 'king',
    owner: 'player1',
  };

  // Place Player 2's King at bottom center (row 9, col 5 = index [8][4])
  board[PLAYER2_KING_START.row][PLAYER2_KING_START.col] = {
    type: 'king',
    owner: 'player2',
  };

  return {
    board,
    player1Supply: INITIAL_QUADRAPHAGE_COUNT,
    player2Supply: INITIAL_QUADRAPHAGE_COUNT,
  };
}

// Legacy function for backward compatibility
export function createInitialBoard(): Board {
  return createInitialGameState().board;
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

// Get the remaining supply for a player
export function getSupply(state: GameState, player: PlayerOwner): number {
  return player === 'player1' ? state.player1Supply : state.player2Supply;
}

// Check if a player has Quadraphages remaining
export function hasSupply(state: GameState, player: PlayerOwner): boolean {
  return getSupply(state, player) > 0;
}
