// Juggle AI Module
// Strategic AI for polyomino placement game
//
// EDUCATIONAL NOTES:
// Juggle teaches spatial reasoning, area calculation, and efficient packing.
// Key skills: Visualizing rotations/flips, planning ahead for odd spaces,
// understanding how different shapes fit together.
//
// Strategy tips for learners:
// 1. Bigger shapes (pentominoes) fill the board faster - but they're harder to place later
// 2. Leave room for smaller shapes to fill gaps
// 3. Avoid creating 1-cell or 2-cell holes that only small shapes can fill
// 4. Consider which shapes can fill corners and edges
// 5. Plan ahead - don't leave spaces that no shape can fill!

import {
  JuggleState,
  Player,
  ShapeCategory,
  getCategoryFromDie,
  getShapesForDie,
} from './types';
import { PolyominoShape, Rotation, Cell } from '../../core/polyomino/types';
import { Board, findValidPlacements, countEmptyCells } from '../../core/polyomino/placement';
import { getCellsAtPosition } from '../../core/polyomino/transform';
import {
  selectDie,
  selectShape,
  rotateShape,
  flipShape,
  placeShape,
} from './rules';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY_CONFIG = {
  easy: { randomness: 0.5, teachingMode: true, considerHoles: false },
  medium: { randomness: 0.15, teachingMode: false, considerHoles: true },
  hard: { randomness: 0.03, teachingMode: false, considerHoles: true },
};

// =============================================================================
// Board Analysis
// =============================================================================

/**
 * Check if a position would create isolated holes that are hard to fill
 */
function countHolesCreated(
  board: Board,
  shape: PolyominoShape,
  position: Cell,
  rotation: Rotation,
  flipped: boolean
): number {
  // Get cells that would be filled
  const filledCells = getCellsAtPosition(shape, position, rotation, flipped);
  const filledSet = new Set(filledCells.map(c => `${c.row},${c.col}`));

  // Create a copy of the board state
  const boardCopy: boolean[][] = [];
  for (let r = 0; r < board.rows; r++) {
    boardCopy[r] = [];
    for (let c = 0; c < board.cols; c++) {
      boardCopy[r][c] = board.cells[r][c] || filledSet.has(`${r},${c}`);
    }
  }

  // Count isolated empty cells (cells with no empty neighbors)
  let isolatedCount = 0;
  for (let r = 0; r < board.rows; r++) {
    for (let c = 0; c < board.cols; c++) {
      if (boardCopy[r][c]) continue; // Cell is filled

      // Count empty neighbors
      let emptyNeighbors = 0;
      const neighbors = [
        { row: r - 1, col: c },
        { row: r + 1, col: c },
        { row: r, col: c - 1 },
        { row: r, col: c + 1 },
      ];

      for (const n of neighbors) {
        if (n.row >= 0 && n.row < board.rows && n.col >= 0 && n.col < board.cols) {
          if (!boardCopy[n.row][n.col]) {
            emptyNeighbors++;
          }
        }
      }

      // Isolated cell (only 0 or 1 empty neighbor)
      if (emptyNeighbors <= 1) {
        isolatedCount++;
      }
    }
  }

  return isolatedCount;
}

/**
 * Evaluate position quality (corners, edges, center)
 */
function evaluatePositionQuality(
  board: Board,
  position: Cell,
  shape: PolyominoShape,
  rotation: Rotation,
  flipped: boolean
): number {
  const cells = getCellsAtPosition(shape, position, rotation, flipped);
  let score = 0;

  for (const cell of cells) {
    // Prefer positions that touch already filled cells (compact packing)
    const neighbors = [
      { row: cell.row - 1, col: cell.col },
      { row: cell.row + 1, col: cell.col },
      { row: cell.row, col: cell.col - 1 },
      { row: cell.row, col: cell.col + 1 },
    ];

    for (const n of neighbors) {
      if (n.row >= 0 && n.row < board.rows && n.col >= 0 && n.col < board.cols) {
        if (board.cells[n.row][n.col]) {
          score += 5; // Adjacent to filled cell
        }
      }
    }

    // Small bonus for filling corners (hardest to fill later)
    const isCorner =
      (cell.row === 0 || cell.row === board.rows - 1) &&
      (cell.col === 0 || cell.col === board.cols - 1);
    if (isCorner) {
      score += 10;
    }

    // Small bonus for filling edges
    const isEdge =
      cell.row === 0 || cell.row === board.rows - 1 ||
      cell.col === 0 || cell.col === board.cols - 1;
    if (isEdge && !isCorner) {
      score += 3;
    }
  }

  return score;
}

// =============================================================================
// Move Evaluation
// =============================================================================

interface DieOption {
  index: 0 | 1;
  value: number;
  category: ShapeCategory;
  size: number;
  score: number;
  reasoning: string;
}

interface ShapePlacement {
  shape: PolyominoShape;
  position: Cell;
  rotation: Rotation;
  flipped: boolean;
  score: number;
  reasoning: string;
}

/**
 * Evaluate which die to choose
 */
function evaluateDiceOptions(
  state: JuggleState,
  board: Board,
  difficulty: AIDifficulty
): DieOption[] {
  if (!state.currentDice) return [];

  const options: DieOption[] = [];
  const emptyCells = countEmptyCells(board);
  const config = DIFFICULTY_CONFIG[difficulty];

  for (let i = 0; i < 2; i++) {
    const value = state.currentDice[i as 0 | 1];
    const category = getCategoryFromDie(value);
    const shapes = getShapesForDie(value);

    // Get shape size
    const size = shapes[0]?.size || 1;

    let score = 0;
    const reasons: string[] = [];

    // Factor 1: Larger shapes fill board faster
    score += size * 20;
    if (size >= 4) {
      reasons.push('Larger shape fills board faster');
    }

    // Factor 2: But can we actually place any shapes from this category?
    let canPlace = false;
    for (const shape of shapes) {
      const rotations: Rotation[] = [0, 90, 180, 270];
      for (const rotation of rotations) {
        const positions = findValidPlacements(board, shape, rotation, false);
        if (positions.length > 0) {
          canPlace = true;
          break;
        }
        if (shape.canFlip) {
          const flippedPositions = findValidPlacements(board, shape, rotation, true);
          if (flippedPositions.length > 0) {
            canPlace = true;
            break;
          }
        }
      }
      if (canPlace) break;
    }

    if (!canPlace) {
      score -= 1000; // Can't place any shape from this category
      reasons.push('No valid placements available');
    }

    // Factor 3: Late game - prefer smaller shapes if board is nearly full
    if (emptyCells < 20 && size > emptyCells) {
      score -= 50;
      reasons.push('Shape might be too big for remaining space');
    }

    // Factor 4: Teaching mode bonus for variety
    if (config.teachingMode && Math.random() < 0.3) {
      score += Math.random() * 30; // Add some randomness for teaching
    }

    options.push({
      index: i as 0 | 1,
      value,
      category,
      size,
      score,
      reasoning: reasons.join('; ') || 'Standard choice',
    });
  }

  options.sort((a, b) => b.score - a.score);
  return options;
}

/**
 * Evaluate all possible shape placements
 */
function evaluatePlacements(
  state: JuggleState,
  board: Board,
  difficulty: AIDifficulty
): ShapePlacement[] {
  if (!state.currentDice || !state.selectedCategory) return [];

  const placements: ShapePlacement[] = [];
  const config = DIFFICULTY_CONFIG[difficulty];

  // Get shapes for the selected category
  const dieValue = state.currentDice.find(d => getCategoryFromDie(d) === state.selectedCategory);
  if (!dieValue) return [];

  const shapes = getShapesForDie(dieValue);
  const rotations: Rotation[] = [0, 90, 180, 270];

  for (const shape of shapes) {
    for (const rotation of rotations) {
      if (rotation !== 0 && !shape.canRotate) continue;

      for (const flipped of [false, true]) {
        if (flipped && !shape.canFlip) continue;

        const positions = findValidPlacements(board, shape, rotation, flipped);

        for (const position of positions) {
          let score = 100; // Base score
          const reasons: string[] = [];

          // Factor 1: Position quality
          const positionScore = evaluatePositionQuality(board, position, shape, rotation, flipped);
          score += positionScore;
          if (positionScore > 20) {
            reasons.push('Good position near existing pieces');
          }

          // Factor 2: Avoid creating isolated holes (hard difficulty)
          if (config.considerHoles) {
            const holes = countHolesCreated(board, shape, position, rotation, flipped);
            score -= holes * 15;
            if (holes > 2) {
              reasons.push('Creates isolated holes');
            }
          }

          // Factor 3: Corners are valuable
          const cells = getCellsAtPosition(shape, position, rotation, flipped);
          const touchesCorner = cells.some(c =>
            (c.row === 0 || c.row === board.rows - 1) &&
            (c.col === 0 || c.col === board.cols - 1)
          );
          if (touchesCorner) {
            score += 15;
            reasons.push('Fills a corner');
          }

          placements.push({
            shape,
            position,
            rotation,
            flipped,
            score,
            reasoning: reasons.join('; ') || 'Valid placement',
          });
        }
      }
    }
  }

  placements.sort((a, b) => b.score - a.score);
  return placements;
}

// =============================================================================
// Teaching Mode
// =============================================================================

/**
 * In easy mode, make intentionally suboptimal moves
 */
function getTeachingDieChoice(options: DieOption[]): DieOption | null {
  if (options.length === 0) return null;

  // 40% chance to pick the smaller die (less optimal)
  if (Math.random() < 0.4 && options.length > 1) {
    // Pick the smaller option (usually second best)
    const smaller = options.find(o => o.score < options[0].score);
    if (smaller) return smaller;
  }

  return options[0];
}

function getTeachingPlacement(placements: ShapePlacement[]): ShapePlacement | null {
  if (placements.length === 0) return null;

  // 40% chance to pick a suboptimal placement
  if (Math.random() < 0.4 && placements.length > 1) {
    const suboptimal = placements.slice(1, Math.min(5, placements.length));
    if (suboptimal.length > 0) {
      return suboptimal[Math.floor(Math.random() * suboptimal.length)];
    }
  }

  return placements[0];
}

// =============================================================================
// Public API
// =============================================================================

export interface AIDieChoice {
  index: 0 | 1;
  hint?: string;
}

export interface AIShapeChoice {
  shape: PolyominoShape;
  hint?: string;
}

export interface AIPlacementChoice {
  position: Cell;
  rotation: Rotation;
  flipped: boolean;
  hint?: string;
}

/**
 * Get AI's die selection
 */
export function getAIDieChoice(
  state: JuggleState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium'
): AIDieChoice | null {
  if (state.phase !== 'selectingShape' || !state.currentDice) return null;
  if (state.currentPlayer !== aiPlayer) return null;
  if (state.selectedCategory) return null; // Already selected die

  const board = state.boards[aiPlayer];
  const config = DIFFICULTY_CONFIG[difficulty];
  const options = evaluateDiceOptions(state, board, difficulty);

  if (options.length === 0) return null;

  // Teaching mode
  if (config.teachingMode) {
    const choice = getTeachingDieChoice(options);
    if (choice) {
      return { index: choice.index };
    }
  }

  // Add randomness
  if (Math.random() < config.randomness && options.length > 1) {
    const chosen = options[Math.floor(Math.random() * options.length)];
    return { index: chosen.index };
  }

  return { index: options[0].index };
}

/**
 * Get AI's shape selection
 */
export function getAIShapeChoice(
  state: JuggleState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium'
): AIShapeChoice | null {
  if (state.phase !== 'selectingShape' || !state.selectedCategory) return null;
  if (state.currentPlayer !== aiPlayer) return null;

  const board = state.boards[aiPlayer];
  const placements = evaluatePlacements(state, board, difficulty);

  if (placements.length === 0) return null;

  // Return the shape from the best placement
  return { shape: placements[0].shape };
}

/**
 * Get AI's placement decision
 */
export function getAIPlacement(
  state: JuggleState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium'
): AIPlacementChoice | null {
  if (state.phase !== 'placing' || !state.selectedShape) return null;
  if (state.currentPlayer !== aiPlayer) return null;

  const board = state.boards[aiPlayer];
  const config = DIFFICULTY_CONFIG[difficulty];

  // Find all valid placements for the selected shape
  const placements: ShapePlacement[] = [];
  const rotations: Rotation[] = [0, 90, 180, 270];

  for (const rotation of rotations) {
    if (rotation !== 0 && !state.selectedShape.canRotate) continue;

    for (const flipped of [false, true]) {
      if (flipped && !state.selectedShape.canFlip) continue;

      const positions = findValidPlacements(board, state.selectedShape, rotation, flipped);

      for (const position of positions) {
        let score = 100;
        const positionScore = evaluatePositionQuality(board, position, state.selectedShape, rotation, flipped);
        score += positionScore;

        if (config.considerHoles) {
          const holes = countHolesCreated(board, state.selectedShape, position, rotation, flipped);
          score -= holes * 15;
        }

        placements.push({
          shape: state.selectedShape,
          position,
          rotation,
          flipped,
          score,
          reasoning: '',
        });
      }
    }
  }

  placements.sort((a, b) => b.score - a.score);

  if (placements.length === 0) return null;

  // Teaching mode
  if (config.teachingMode) {
    const choice = getTeachingPlacement(placements);
    if (choice) {
      return {
        position: choice.position,
        rotation: choice.rotation,
        flipped: choice.flipped,
      };
    }
  }

  // Add randomness
  if (Math.random() < config.randomness && placements.length > 1) {
    const topPlacements = placements.slice(0, 3);
    const chosen = topPlacements[Math.floor(Math.random() * topPlacements.length)];
    return {
      position: chosen.position,
      rotation: chosen.rotation,
      flipped: chosen.flipped,
    };
  }

  return {
    position: placements[0].position,
    rotation: placements[0].rotation,
    flipped: placements[0].flipped,
  };
}

/**
 * Check if it's the AI's turn
 */
export function isAITurn(
  state: JuggleState,
  aiPlayer: Player | null,
  gameMode: 'human-vs-human' | 'human-vs-ai'
): boolean {
  if (gameMode !== 'human-vs-ai') return false;
  if (!aiPlayer) return false;
  if (state.phase === 'gameOver') return false;

  return state.currentPlayer === aiPlayer;
}

/**
 * Execute complete AI turn (die selection + shape selection + placement)
 */
export function executeAITurn(
  state: JuggleState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium'
): JuggleState {
  let currentState = state;

  // Phase 1: Select die (if needed)
  if (currentState.phase === 'selectingShape' && !currentState.selectedCategory) {
    const dieChoice = getAIDieChoice(currentState, aiPlayer, difficulty);
    if (dieChoice) {
      currentState = selectDie(currentState, dieChoice.index);
    } else {
      return currentState; // Can't proceed
    }
  }

  // Phase 2: Select shape (if needed)
  if (currentState.phase === 'selectingShape' && currentState.selectedCategory) {
    const shapeChoice = getAIShapeChoice(currentState, aiPlayer, difficulty);
    if (shapeChoice) {
      currentState = selectShape(currentState, shapeChoice.shape);
    } else {
      return currentState; // Can't proceed
    }
  }

  // Phase 3: Place shape
  if (currentState.phase === 'placing') {
    const placement = getAIPlacement(currentState, aiPlayer, difficulty);
    if (placement) {
      // Apply rotation and flip
      while (currentState.selectedRotation !== placement.rotation) {
        currentState = rotateShape(currentState);
      }
      if (placement.flipped !== currentState.selectedFlipped) {
        currentState = flipShape(currentState);
      }

      currentState = placeShape(currentState, placement.position);
    }
  }

  return currentState;
}
