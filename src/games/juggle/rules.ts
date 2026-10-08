// Juggle Game Rules
// Dice rolling, shape selection, and placement logic

import type { JuggleState, Player, JuggleMove } from './types';
import {
  CONFIG,
  getOpponent,
  rollDice,
  getCategoryFromDie,
  getShapesForDie,
} from './types';
import type {
  PolyominoShape,
  Rotation,
  Cell,
} from '../../core/polyomino/types';
import type { Board } from '../../core/polyomino/placement';
import {
  createBoard,
  validatePlacement,
  placePolyomino,
  isBoardFilled,
  canPlaceShape,
  countEmptyCells,
  findValidPlacements,
} from '../../core/polyomino/placement';
import { getCellsAtPosition } from '../../core/polyomino/transform';

// =============================================================================
// State Creation
// =============================================================================

/**
 * Create initial game state
 */
export function createInitialState(): JuggleState {
  return {
    boards: {
      player1: createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE),
      player2: createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE),
    },
    currentPlayer: 'player1',
    currentDice: null,
    selectedCategory: null,
    selectedDieValue: null,
    selectedShape: null,
    selectedRotation: 0,
    selectedFlipped: false,
    hoverPosition: null,
    winner: null,
    moveHistory: [],
    phase: 'rolling',
  };
}

// =============================================================================
// Dice Rolling
// =============================================================================

/**
 * Roll dice and transition to shape selection
 */
export function doRollDice(state: JuggleState): JuggleState {
  if (state.phase !== 'rolling') return state;

  const dice = rollDice();

  return {
    ...state,
    currentDice: dice,
    selectedCategory: null,
    selectedDieValue: null,
    selectedShape: null,
    phase: 'selectingShape',
  };
}

// =============================================================================
// Shape Selection
// =============================================================================

/**
 * Select which die to use (determines shape category)
 */
export function selectDie(state: JuggleState, dieIndex: 0 | 1): JuggleState {
  if (state.phase !== 'selectingShape' || !state.currentDice) return state;

  const dieValue = state.currentDice[dieIndex];
  const category = getCategoryFromDie(dieValue);
  const shapes = getShapesForDie(dieValue);

  // Auto-select first shape if only one option
  // ratchet: length === 1 guarantees shapes[0].
  const autoShape = shapes.length === 1 ? shapes[0]! : null;

  const next: JuggleState = {
    ...state,
    selectedCategory: category,
    selectedDieValue: dieValue,
    selectedShape: autoShape,
    selectedRotation: 0,
    selectedFlipped: false,
    phase: autoShape ? 'placing' : 'selectingShape',
  };
  return autoShape ? orientSelectedShapeToFit(next) : next;
}

/**
 * Select a specific shape
 */
export function selectShape(
  state: JuggleState,
  shape: PolyominoShape
): JuggleState {
  if (state.phase !== 'selectingShape' || !state.selectedCategory) return state;

  return orientSelectedShapeToFit({
    ...state,
    selectedShape: shape,
    selectedRotation: 0,
    selectedFlipped: false,
    phase: 'placing',
  });
}

/**
 * Prefer an orientation that actually fits (UI only — same legal placements).
 */
function orientSelectedShapeToFit(state: JuggleState): JuggleState {
  if (state.phase !== 'placing' || !state.selectedShape) return state;

  const board = state.boards[state.currentPlayer];
  const shape = state.selectedShape;
  const rotations: Rotation[] = shape.canRotate ? [0, 90, 180, 270] : [0];
  const flips = shape.canFlip ? [false, true] : [false];

  for (const flipped of flips) {
    for (const rotation of rotations) {
      if (findValidPlacements(board, shape, rotation, flipped).length > 0) {
        return {
          ...state,
          selectedRotation: rotation,
          selectedFlipped: flipped,
        };
      }
    }
  }
  return state;
}

/** True if the selected polyomino fits somewhere in any orientation. */
export function selectedShapeFitsAnywhere(state: JuggleState): boolean {
  if (!state.selectedShape) return false;
  return canPlaceShape(state.boards[state.currentPlayer], state.selectedShape);
}

/** Legal anchors for the currently selected rotation/flip. */
export function getCurrentOrientationPlacements(state: JuggleState): Cell[] {
  if (!state.selectedShape || state.phase !== 'placing') return [];
  return findValidPlacements(
    state.boards[state.currentPlayer],
    state.selectedShape,
    state.selectedRotation,
    state.selectedFlipped
  );
}

/**
 * Back out of placing so the kid can pick another die/shape.
 * Does not change boards, dice, or scores.
 */
export function abandonPlacement(state: JuggleState): JuggleState {
  if (state.phase !== 'placing') return state;
  return {
    ...state,
    selectedShape: null,
    selectedRotation: 0,
    selectedFlipped: false,
    hoverPosition: null,
    selectedCategory: null,
    phase: 'selectingShape',
  };
}

/**
 * Rotate selected shape
 */
export function rotateShape(state: JuggleState): JuggleState {
  if (!state.selectedShape || state.phase !== 'placing') return state;

  const rotations: Rotation[] = [0, 90, 180, 270];
  const currentIndex = rotations.indexOf(state.selectedRotation);
  // ratchet: rotations is length-4; (currentIndex+1)%4 is always 0..3.
  const nextRotation = rotations[(currentIndex + 1) % 4]!;

  return {
    ...state,
    selectedRotation: nextRotation,
  };
}

/**
 * Flip selected shape
 */
export function flipShape(state: JuggleState): JuggleState {
  if (!state.selectedShape || state.phase !== 'placing') return state;
  if (!state.selectedShape.canFlip) return state;

  return {
    ...state,
    selectedFlipped: !state.selectedFlipped,
  };
}

// =============================================================================
// Placement
// =============================================================================

/**
 * Get cells that would be occupied by current shape at position
 */
export function getPreviewCells(state: JuggleState, position: Cell): Cell[] {
  if (!state.selectedShape) return [];

  return getCellsAtPosition(
    state.selectedShape,
    position,
    state.selectedRotation,
    state.selectedFlipped
  );
}

/**
 * Check if placement is valid
 */
export function isPlacementValid(state: JuggleState, position: Cell): boolean {
  if (!state.selectedShape || state.phase !== 'placing') return false;

  const board = state.boards[state.currentPlayer];
  const result = validatePlacement(
    board,
    state.selectedShape,
    position,
    state.selectedRotation,
    state.selectedFlipped
  );

  return result.valid;
}

/**
 * Place the selected shape on the board
 */
export function placeShape(state: JuggleState, position: Cell): JuggleState {
  if (!state.selectedShape || !state.currentDice || state.phase !== 'placing') {
    return state;
  }

  const board = state.boards[state.currentPlayer];
  const result = validatePlacement(
    board,
    state.selectedShape,
    position,
    state.selectedRotation,
    state.selectedFlipped
  );

  if (!result.valid) return state;

  // Place the shape
  const newBoard = placePolyomino(
    board,
    state.selectedShape,
    position,
    state.selectedRotation,
    state.selectedFlipped,
    state.currentPlayer === 'player1' ? 1 : 2
  );

  // Record the move — chosenDie must be the die face actually selected
  const move: JuggleMove = {
    player: state.currentPlayer,
    dice: state.currentDice,
    chosenDie: state.selectedDieValue ?? state.currentDice[0],
    shapeId: state.selectedShape.id,
    position,
    rotation: state.selectedRotation,
    flipped: state.selectedFlipped,
    moveNumber: state.moveHistory.length + 1,
  };

  const newBoards = {
    ...state.boards,
    [state.currentPlayer]: newBoard,
  };

  // Check for winner
  const winner = checkWinner(newBoards);

  return {
    ...state,
    boards: newBoards,
    currentPlayer: winner
      ? state.currentPlayer
      : getOpponent(state.currentPlayer),
    currentDice: null,
    selectedCategory: null,
    selectedDieValue: null,
    selectedShape: null,
    selectedRotation: 0,
    selectedFlipped: false,
    hoverPosition: null,
    winner,
    moveHistory: [...state.moveHistory, move],
    phase: winner ? 'gameOver' : 'rolling',
  };
}

// =============================================================================
// Win Detection
// =============================================================================

/**
 * Check for winner
 */
export function checkWinner(boards: {
  player1: Board;
  player2: Board;
}): Player | null {
  // Player wins by filling their board first
  if (isBoardFilled(boards.player1)) return 'player1';
  if (isBoardFilled(boards.player2)) return 'player2';
  return null;
}

/**
 * Check if current player can make any move with given dice
 */
export function canMakeAnyMove(state: JuggleState): boolean {
  if (!state.currentDice) return false;

  const board = state.boards[state.currentPlayer];

  // Check both dice options
  for (const dieValue of state.currentDice) {
    const shapes = getShapesForDie(dieValue);
    for (const shape of shapes) {
      if (canPlaceShape(board, shape)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Get board fill percentage
 */
export function getBoardFillPercentage(board: Board): number {
  const empty = countEmptyCells(board);
  const total = CONFIG.GRID_SIZE * CONFIG.GRID_SIZE;
  return Math.round(((total - empty) / total) * 100);
}
