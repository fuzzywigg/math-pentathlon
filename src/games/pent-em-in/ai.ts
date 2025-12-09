// Pent'Em In AI Module
// Strategic AI for pentomino placement/entrapment game
//
// EDUCATIONAL NOTES:
// Pent'Em In teaches spatial reasoning and strategic thinking.
// Key skills: Polyomino shapes, rotation/reflection, territory control.
//
// Strategy tips for learners:
// 1. There are 12 pentominoes (F, I, L, N, P, T, U, V, W, X, Y, Z)
// 2. Each pentomino has 5 squares - learn their shapes!
// 3. Control space - don't let opponent trap you in a corner
// 4. Think about which pieces fit in small spaces
// 5. Save flexible pieces (I, X) for tight spots
// 6. The 'I' piece (5 in a row) can block long paths

import {
  PentEmInState,
  Player,
  getPlayerPieces,
  getPentominoShape,
  BOARD_SIZE,
} from './types';
import {
  placePiece,
  getValidPlacements,
} from './rules';
import { Cell, Rotation } from '../../core/polyomino/types';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY_CONFIG = {
  easy: { randomness: 0.6, teachingMode: true },
  medium: { randomness: 0.2, teachingMode: false },
  hard: { randomness: 0.05, teachingMode: false },
};

// =============================================================================
// Move Evaluation
// =============================================================================

interface MoveOption {
  shapeId: string;
  position: Cell;
  rotation: Rotation;
  flipped: boolean;
  score: number;
  reasoning: string;
}

/**
 * Count empty cells in a region (simple flood fill from a cell)
 */
function countReachableEmpty(state: PentEmInState, start: Cell): number {
  const visited = new Set<string>();
  const queue: Cell[] = [start];
  let count = 0;

  while (queue.length > 0) {
    const cell = queue.shift()!;
    const key = `${cell.row},${cell.col}`;

    if (visited.has(key)) continue;
    if (cell.row < 0 || cell.row >= BOARD_SIZE || cell.col < 0 || cell.col >= BOARD_SIZE) continue;
    if (state.board[cell.row][cell.col].occupied) continue;

    visited.add(key);
    count++;

    // Check neighbors
    queue.push({ row: cell.row - 1, col: cell.col });
    queue.push({ row: cell.row + 1, col: cell.col });
    queue.push({ row: cell.row, col: cell.col - 1 });
    queue.push({ row: cell.row, col: cell.col + 1 });
  }

  return count;
}

/**
 * Evaluate a potential move
 */
function evaluateMove(
  state: PentEmInState,
  player: Player,
  shapeId: string,
  position: Cell,
  rotation: Rotation,
  flipped: boolean
): MoveOption {
  const reasons: string[] = [];
  let score = 0;

  // Factor 1: Central positions are often better for control
  const centerDist = Math.abs(position.row - 4.5) + Math.abs(position.col - 4.5);
  if (centerDist < 3) {
    score += 15 - centerDist * 3;
    reasons.push('Central control');
  }

  // Factor 2: Pieces that use corners and edges can be strategic
  if (position.row === 0 || position.row === BOARD_SIZE - 1 ||
      position.col === 0 || position.col === BOARD_SIZE - 1) {
    score += 5;
    reasons.push('Edge placement');
  }

  // Factor 3: Simulate the move and check remaining space
  const tempState = placePiece(state, shapeId, position, rotation, flipped);

  if (tempState.winner === player) {
    // This move wins!
    score += 10000;
    reasons.push('Winning move!');
  } else if (tempState.phase === 'gameOver' && tempState.winner !== player) {
    // This would lose - heavily penalize
    score -= 5000;
    reasons.push('Losing move');
  }

  // Factor 4: Space fragmentation - prefer moves that don't create tiny isolated regions
  // (Simple heuristic - check area near placement)
  const nearbyEmpty = countReachableEmpty(tempState, {
    row: Math.min(BOARD_SIZE - 1, position.row + 2),
    col: Math.min(BOARD_SIZE - 1, position.col + 2),
  });
  if (nearbyEmpty > 20) {
    score += 10;
    reasons.push('Preserves open space');
  }

  // Factor 5: Piece flexibility - save flexible pieces for later
  const piecePriority: Record<string, number> = {
    'X': -5,  // Very symmetric, save for tight spots
    'I': -3,  // Long, good for blocking
    'F': 3,   // Use asymmetric pieces early
    'L': 2,
    'N': 2,
    'P': 1,
    'Y': 2,
    'Z': 2,
  };
  if (piecePriority[shapeId]) {
    score += piecePriority[shapeId];
  }

  return {
    shapeId,
    position,
    rotation,
    flipped,
    score,
    reasoning: reasons.join('; ') || 'Standard placement',
  };
}

/**
 * Evaluate all possible moves for a player
 */
function evaluateMoves(
  state: PentEmInState,
  player: Player,
  _difficulty: AIDifficulty
): MoveOption[] {
  const pieces = getPlayerPieces(state, player);
  const moves: MoveOption[] = [];

  for (const shapeId of pieces.available) {
    const shape = getPentominoShape(shapeId);
    if (!shape) continue;

    const rotations: Rotation[] = shape.canRotate ? [0, 90, 180, 270] : [0];
    const flips = shape.canFlip ? [false, true] : [false];

    for (const rotation of rotations) {
      for (const flipped of flips) {
        const positions = getValidPlacements(state, shapeId, rotation, flipped);

        for (const position of positions) {
          const move = evaluateMove(state, player, shapeId, position, rotation, flipped);
          moves.push(move);
        }
      }
    }
  }

  moves.sort((a, b) => b.score - a.score);
  return moves;
}

// =============================================================================
// Teaching Mode
// =============================================================================

/**
 * In easy mode, pick suboptimal moves sometimes
 */
function getTeachingMove(
  state: PentEmInState,
  player: Player
): MoveOption | null {
  const moves = evaluateMoves(state, player, 'easy');

  if (moves.length === 0) return null;

  // 40% chance to pick a lower-scoring move
  if (Math.random() < 0.4 && moves.length > 3) {
    const midMoves = moves.slice(2, Math.min(8, moves.length));
    if (midMoves.length > 0) {
      return midMoves[Math.floor(Math.random() * midMoves.length)];
    }
  }

  return moves[0];
}

// =============================================================================
// Public API
// =============================================================================

export interface AIMove {
  shapeId: string;
  position: Cell;
  rotation: Rotation;
  flipped: boolean;
  hint?: string;
}

/**
 * Get AI's move decision
 */
export function getAIMove(
  state: PentEmInState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium'
): AIMove | null {
  if (state.phase === 'gameOver') return null;
  if (state.currentPlayer !== aiPlayer) return null;

  const config = DIFFICULTY_CONFIG[difficulty];

  // Teaching mode
  if (config.teachingMode) {
    const result = getTeachingMove(state, aiPlayer);
    if (result) {
      return {
        shapeId: result.shapeId,
        position: result.position,
        rotation: result.rotation,
        flipped: result.flipped,
      };
    }
  }

  const moves = evaluateMoves(state, aiPlayer, difficulty);

  if (moves.length === 0) return null;

  // Add randomness based on difficulty
  if (Math.random() < config.randomness && moves.length > 1) {
    const topMoves = moves.slice(0, Math.min(5, moves.length));
    const chosen = topMoves[Math.floor(Math.random() * topMoves.length)];
    return {
      shapeId: chosen.shapeId,
      position: chosen.position,
      rotation: chosen.rotation,
      flipped: chosen.flipped,
    };
  }

  return {
    shapeId: moves[0].shapeId,
    position: moves[0].position,
    rotation: moves[0].rotation,
    flipped: moves[0].flipped,
  };
}

/**
 * Check if it's the AI's turn
 */
export function isAITurn(
  state: PentEmInState,
  aiPlayer: Player | null
): boolean {
  if (!aiPlayer) return false;
  if (state.phase === 'gameOver') return false;
  return state.currentPlayer === aiPlayer;
}
