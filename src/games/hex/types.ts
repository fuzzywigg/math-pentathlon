// Hex Game Types

export type Player = 'player1' | 'player2';

export type CellState = Player | null;

// Hex board is typically 11x11 for standard play
export const DEFAULT_BOARD_SIZE = 11;

// A cell position on the hex grid
export interface HexPosition {
  row: number;
  col: number;
}

// The hex board is stored as a 2D array
// Player 1 (Blue) connects top to bottom
// Player 2 (Red) connects left to right
export type HexBoard = CellState[][];

// Game state
export interface HexGameState {
  board: HexBoard;
  currentPlayer: Player;
  winner: Player | null;
  boardSize: number;
  moveHistory: HexMove[];
}

// A move in the game
export interface HexMove {
  player: Player;
  position: HexPosition;
  moveNumber: number;
}

// Create an empty board
export function createEmptyBoard(size: number = DEFAULT_BOARD_SIZE): HexBoard {
  return Array(size)
    .fill(null)
    .map(() => Array(size).fill(null));
}

// Create initial game state
export function createInitialState(boardSize: number = DEFAULT_BOARD_SIZE): HexGameState {
  return {
    board: createEmptyBoard(boardSize),
    currentPlayer: 'player1',
    winner: null,
    boardSize,
    moveHistory: [],
  };
}

// Get the opponent player
export function getOpponent(player: Player): Player {
  return player === 'player1' ? 'player2' : 'player1';
}
