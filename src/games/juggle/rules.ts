// Juggle Game Rules
// Dice rolling, shape selection, and placement logic

import {
  JuggleState,
  Player,
  JuggleMove,
  CONFIG,
  getOpponent,
  rollDice,
  getCategoryFromDie,
  getShapesForDie,
} from './types';
import { PolyominoShape, Rotation, Cell } from '../../core/polyomino/types';
import {
  Board,
  createBoard,
  validatePlacement,
  placePolyomino,
  isBoardFilled,
  canPlaceShape,
  countEmptyCells,
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
  const board = state.boards[state.currentPlayer];

  // Auto-select only when the single option actually fits (avoids place soft-lock).
  const autoShape =
    shapes.length === 1 && canPlaceShape(board, shapes[0]) ? shapes[0] : null;

  return {
    ...state,
    selectedCategory: category,
    selectedShape: autoShape,
    selectedRotation: 0,
    selectedFlipped: false,
    phase: autoShape ? 'placing' : 'selectingShape',
  };
}

/**
 * Select a specific shape
 */
export function selectShape(
  state: JuggleState,
  shape: PolyominoShape
): JuggleState {
  if (state.phase !== 'selectingShape' || !state.selectedCategory) return state;

  // Refuse shapes that cannot fit in any orientation (soft-lock guard).
  if (!canPlaceShape(state.boards[state.currentPlayer], shape)) {
    return state;
  }

  return {
    ...state,
    selectedShape: shape,
    selectedRotation: 0,
    selectedFlipped: false,
    phase: 'placing',
  };
}

/**
 * Rotate selected shape
 */
export function rotateShape(state: JuggleState): JuggleState {
  if (!state.selectedShape || state.phase !== 'placing') return state;

  const rotations: Rotation[] = [0, 90, 180, 270];
  const currentIndex = rotations.indexOf(state.selectedRotation);
  const nextRotation = rotations[(currentIndex + 1) % 4];

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

  // Record the die that matches the selected category (prefer first match).
  const chosenDie =
    state.currentDice.find(
      (d) => getCategoryFromDie(d) === state.selectedCategory
    ) ?? state.currentDice[0];

  // Record the move
  const move: JuggleMove = {
    player: state.currentPlayer,
    dice: state.currentDice,
    chosenDie,
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
 * True when any orientation of the currently selected shape fits the board.
 */
export function canPlaceSelectedShape(state: JuggleState): boolean {
  if (!state.selectedShape || state.phase !== 'placing') return false;
  return canPlaceShape(state.boards[state.currentPlayer], state.selectedShape);
}

/**
 * True when at least one shape for this die value fits the current player's board.
 */
export function canPlaceAnyShapeForDie(
  state: JuggleState,
  dieValue: number
): boolean {
  const board = state.boards[state.currentPlayer];
  for (const shape of getShapesForDie(dieValue)) {
    if (canPlaceShape(board, shape)) return true;
  }
  return false;
}

/**
 * True when the human/AI seat should be offered Pass (or auto-pass).
 * Does not invent a new win condition — only detects an unplaceable roll.
 */
export function shouldOfferPass(state: JuggleState): boolean {
  if (state.phase === 'gameOver' || state.winner) return false;
  if (state.phase === 'rolling' || !state.currentDice) return false;
  return !canMakeAnyMove(state);
}

/**
 * Pass the turn when the current dice cannot be placed on this seat's board.
 * Does not change win/scoring rules — only recovers from a jammed seat.
 */
export function passTurn(state: JuggleState): JuggleState {
  if (!shouldOfferPass(state)) return state;

  return {
    ...state,
    currentPlayer: getOpponent(state.currentPlayer),
    currentDice: null,
    selectedCategory: null,
    selectedShape: null,
    selectedRotation: 0,
    selectedFlipped: false,
    hoverPosition: null,
    phase: 'rolling',
  };
}

/**
 * Return from placing to shape select when the selected piece will not fit
 * but another shape in the same category might (escape without forfeiting).
 */
export function clearSelectedShape(state: JuggleState): JuggleState {
  if (state.phase !== 'placing' || !state.selectedCategory) return state;
  if (!state.selectedShape) return state;
  if (canPlaceSelectedShape(state)) return state;

  return {
    ...state,
    selectedShape: null,
    selectedRotation: 0,
    selectedFlipped: false,
    hoverPosition: null,
    phase: 'selectingShape',
  };
}

/**
 * Get board fill percentage
 */
export function getBoardFillPercentage(board: Board): number {
  const empty = countEmptyCells(board);
  const total = CONFIG.GRID_SIZE * CONFIG.GRID_SIZE;
  return Math.round(((total - empty) / total) * 100);
}
