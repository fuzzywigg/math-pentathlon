// Pent'Em In Game Rules
// Placement validation, move execution, and win detection

import {
  PentEmInState,
  Player,
  PlacedPiece,
  BoardCell,
  MoveRecord,
  BOARD_SIZE,
  getOpponent,
  getPlayerPieces,
  getPentominoShape,
} from './types';
import { Cell, Rotation } from '../../core/polyomino/types';
import { rotateCells, flipCellsHorizontal as flipCells } from '../../core/polyomino/transform';

// =============================================================================
// Piece Transformation
// =============================================================================

/**
 * Get the cells occupied by a piece at a given position/rotation/flip
 */
export function getPieceCells(
  shapeId: string,
  position: Cell,
  rotation: Rotation,
  flipped: boolean
): Cell[] {
  const shape = getPentominoShape(shapeId);
  if (!shape) return [];

  // Start with base cells
  let cells = [...shape.cells];

  // Apply flip first (if applicable)
  if (flipped && shape.canFlip) {
    cells = flipCells(cells);
  }

  // Apply rotation
  if (shape.canRotate && rotation !== 0) {
    cells = rotateCells(cells, rotation);
  }

  // Translate to position
  return cells.map(cell => ({
    row: position.row + cell.row,
    col: position.col + cell.col,
  }));
}

// =============================================================================
// Placement Validation
// =============================================================================

/**
 * Check if cells are within board bounds
 */
function areCellsInBounds(cells: Cell[]): boolean {
  return cells.every(cell =>
    cell.row >= 0 &&
    cell.row < BOARD_SIZE &&
    cell.col >= 0 &&
    cell.col < BOARD_SIZE
  );
}

/**
 * Check if cells are all unoccupied
 */
function areCellsFree(state: PentEmInState, cells: Cell[]): boolean {
  return cells.every(cell => !state.board[cell.row][cell.col].occupied);
}

/**
 * Check if placement is valid
 */
export function canPlacePiece(
  state: PentEmInState,
  shapeId: string,
  position: Cell,
  rotation: Rotation,
  flipped: boolean
): boolean {
  // Get the cells this piece would occupy
  const cells = getPieceCells(shapeId, position, rotation, flipped);

  // Check bounds
  if (!areCellsInBounds(cells)) return false;

  // Check no overlap
  if (!areCellsFree(state, cells)) return false;

  return true;
}

/**
 * Get all valid placement positions for a piece
 */
export function getValidPlacements(
  state: PentEmInState,
  shapeId: string,
  rotation: Rotation,
  flipped: boolean
): Cell[] {
  const validPositions: Cell[] = [];

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const pos = { row, col };
      if (canPlacePiece(state, shapeId, pos, rotation, flipped)) {
        validPositions.push(pos);
      }
    }
  }

  return validPositions;
}

/**
 * Check if a player can place ANY of their remaining pieces
 */
export function canPlayerMove(state: PentEmInState, player: Player): boolean {
  const pieces = getPlayerPieces(state, player);
  const shape = getPentominoShape(pieces.available[0]);

  if (!shape) return pieces.available.length > 0;

  // Check each available piece
  for (const shapeId of pieces.available) {
    const pieceShape = getPentominoShape(shapeId);
    if (!pieceShape) continue;

    // Try all rotations
    const rotations: Rotation[] = pieceShape.canRotate ? [0, 90, 180, 270] : [0];
    const flips = pieceShape.canFlip ? [false, true] : [false];

    for (const rotation of rotations) {
      for (const flipped of flips) {
        const positions = getValidPlacements(state, shapeId, rotation, flipped);
        if (positions.length > 0) return true;
      }
    }
  }

  return false;
}

// =============================================================================
// Move Execution
// =============================================================================

/**
 * Place a piece on the board
 */
export function placePiece(
  state: PentEmInState,
  shapeId: string,
  position: Cell,
  rotation: Rotation,
  flipped: boolean
): PentEmInState {
  if (!canPlacePiece(state, shapeId, position, rotation, flipped)) {
    return state;
  }

  const cells = getPieceCells(shapeId, position, rotation, flipped);
  const pieceId = `${state.currentPlayer}-${shapeId}-${state.placedPieces.length}`;

  // Create placed piece
  const placedPiece: PlacedPiece = {
    id: pieceId,
    shapeId,
    player: state.currentPlayer,
    position,
    rotation,
    flipped,
    cells,
  };

  // Update board
  const newBoard: BoardCell[][] = state.board.map(row =>
    row.map(cell => ({ ...cell }))
  );

  for (const cell of cells) {
    newBoard[cell.row][cell.col] = {
      ...newBoard[cell.row][cell.col],
      occupied: true,
      owner: state.currentPlayer,
      pieceId,
    };
  }

  // Update player pieces
  const currentPieces = getPlayerPieces(state, state.currentPlayer);
  const newAvailable = currentPieces.available.filter(id => id !== shapeId);
  const newPlaced = [...currentPieces.placed, shapeId];

  const newPlayer1Pieces = state.currentPlayer === 'player1'
    ? { available: newAvailable, placed: newPlaced }
    : state.player1Pieces;
  const newPlayer2Pieces = state.currentPlayer === 'player2'
    ? { available: newAvailable, placed: newPlaced }
    : state.player2Pieces;

  // Record move
  const move: MoveRecord = {
    player: state.currentPlayer,
    shapeId,
    position,
    rotation,
    flipped,
    moveNumber: state.moveHistory.length + 1,
  };

  // Check if next player can move
  const nextPlayer = getOpponent(state.currentPlayer);
  const tempState: PentEmInState = {
    ...state,
    board: newBoard,
    placedPieces: [...state.placedPieces, placedPiece],
    player1Pieces: newPlayer1Pieces,
    player2Pieces: newPlayer2Pieces,
    currentPlayer: nextPlayer,
  };

  const nextCanMove = canPlayerMove(tempState, nextPlayer);

  // If next player can't move, check if current player can continue
  let winner: Player | null = null;
  let phase: 'selectPiece' | 'placePiece' | 'gameOver' = 'selectPiece';

  if (!nextCanMove) {
    // Next player is trapped - current player wins!
    winner = state.currentPlayer;
    phase = 'gameOver';
  }

  return {
    ...state,
    board: newBoard,
    placedPieces: [...state.placedPieces, placedPiece],
    player1Pieces: newPlayer1Pieces,
    player2Pieces: newPlayer2Pieces,
    currentPlayer: winner ? state.currentPlayer : nextPlayer,
    phase,
    selectedPiece: null,
    selectedRotation: 0,
    selectedFlipped: false,
    previewPosition: null,
    moveHistory: [...state.moveHistory, move],
    winner,
  };
}

// =============================================================================
// Piece Selection
// =============================================================================

/**
 * Select a piece for placement
 */
export function selectPiece(state: PentEmInState, shapeId: string): PentEmInState {
  const pieces = getPlayerPieces(state, state.currentPlayer);

  if (!pieces.available.includes(shapeId)) {
    return state;
  }

  return {
    ...state,
    selectedPiece: shapeId,
    selectedRotation: 0,
    selectedFlipped: false,
    phase: 'placePiece',
  };
}

/**
 * Rotate selected piece
 */
export function rotateSelectedPiece(state: PentEmInState): PentEmInState {
  if (!state.selectedPiece) return state;

  const shape = getPentominoShape(state.selectedPiece);
  if (!shape?.canRotate) return state;

  const rotations: Rotation[] = [0, 90, 180, 270];
  const currentIndex = rotations.indexOf(state.selectedRotation);
  const nextIndex = (currentIndex + 1) % 4;

  return {
    ...state,
    selectedRotation: rotations[nextIndex],
  };
}

/**
 * Flip selected piece
 */
export function flipSelectedPiece(state: PentEmInState): PentEmInState {
  if (!state.selectedPiece) return state;

  const shape = getPentominoShape(state.selectedPiece);
  if (!shape?.canFlip) return state;

  return {
    ...state,
    selectedFlipped: !state.selectedFlipped,
  };
}

/**
 * Cancel piece selection
 */
export function cancelSelection(state: PentEmInState): PentEmInState {
  return {
    ...state,
    selectedPiece: null,
    selectedRotation: 0,
    selectedFlipped: false,
    previewPosition: null,
    phase: 'selectPiece',
  };
}

/**
 * Update preview position
 */
export function setPreviewPosition(state: PentEmInState, position: Cell | null): PentEmInState {
  return {
    ...state,
    previewPosition: position,
  };
}
