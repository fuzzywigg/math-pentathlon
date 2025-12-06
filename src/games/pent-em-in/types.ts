// Pent'Em In Game Types
// Pentomino entrapment strategy game - trap your opponent so they can't place pieces

import { PolyominoShape, Cell, Rotation, PENTOMINOES } from '../../core/polyomino/types';

export type Player = 'player1' | 'player2';

// Board dimensions - 10x10 grid is common for pentomino games
export const BOARD_SIZE = 10;

// Each player gets a full set of 12 pentominoes
export const PIECES_PER_PLAYER = 12;

// A cell on the board
export interface BoardCell {
  row: number;
  col: number;
  occupied: boolean;
  owner: Player | null;
  pieceId: string | null;
}

// A placed pentomino on the board
export interface PlacedPiece {
  id: string;
  shapeId: string;
  player: Player;
  position: Cell;  // anchor cell
  rotation: Rotation;
  flipped: boolean;
  cells: Cell[];  // actual cells occupied
}

// Player's remaining pieces
export interface PlayerPieces {
  available: string[];  // shape IDs that haven't been placed
  placed: string[];     // shape IDs that have been placed
}

// Game phases
export type GamePhase = 'selectPiece' | 'placePiece' | 'gameOver';

// Game state
export interface PentEmInState {
  board: BoardCell[][];
  placedPieces: PlacedPiece[];
  currentPlayer: Player;
  phase: GamePhase;

  // Each player's pieces
  player1Pieces: PlayerPieces;
  player2Pieces: PlayerPieces;

  // Currently selected piece for placement
  selectedPiece: string | null;
  selectedRotation: Rotation;
  selectedFlipped: boolean;

  // Preview position
  previewPosition: Cell | null;

  // Move history
  moveHistory: MoveRecord[];

  // Winner
  winner: Player | null;
}

// Move record
export interface MoveRecord {
  player: Player;
  shapeId: string;
  position: Cell;
  rotation: Rotation;
  flipped: boolean;
  moveNumber: number;
}

// Create empty board
function createBoard(): BoardCell[][] {
  const board: BoardCell[][] = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    board[row] = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      board[row][col] = {
        row,
        col,
        occupied: false,
        owner: null,
        pieceId: null,
      };
    }
  }
  return board;
}

// Get all pentomino IDs
function getAllPentominoIds(): string[] {
  return PENTOMINOES.map(p => p.id);
}

// Create initial game state
export function createInitialState(): PentEmInState {
  const pentominoIds = getAllPentominoIds();

  return {
    board: createBoard(),
    placedPieces: [],
    currentPlayer: 'player1',
    phase: 'selectPiece',
    player1Pieces: {
      available: [...pentominoIds],
      placed: [],
    },
    player2Pieces: {
      available: [...pentominoIds],
      placed: [],
    },
    selectedPiece: null,
    selectedRotation: 0,
    selectedFlipped: false,
    previewPosition: null,
    moveHistory: [],
    winner: null,
  };
}

// Get opponent
export function getOpponent(player: Player): Player {
  return player === 'player1' ? 'player2' : 'player1';
}

// Get player's pieces
export function getPlayerPieces(state: PentEmInState, player: Player): PlayerPieces {
  return player === 'player1' ? state.player1Pieces : state.player2Pieces;
}

// Get pentomino shape by ID
export function getPentominoShape(shapeId: string): PolyominoShape | undefined {
  return PENTOMINOES.find(p => p.id === shapeId);
}
