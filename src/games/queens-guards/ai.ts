// Queens & Guards AI Module
// Strategic AI for hexagonal Agon-style game

import {
  QueensGuardsState,
  Player,
  BoardCoord,
  CONFIG,
  cellKey,
  parseKey,
  getAdjacent,
  getOpponent,
  cellsInRing,
} from './types';

import {
  getValidMoves,
  makeMove,
  checkWinner,
  hasValidMoves,
} from './rules';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY_CONFIG = {
  easy: { maxDepth: 2, randomness: 0.4 },
  medium: { maxDepth: 3, randomness: 0.15 },
  hard: { maxDepth: 4, randomness: 0.05 },
};

// =============================================================================
// Board Evaluation
// =============================================================================

/**
 * Evaluate board position for a player
 * Higher score = better for that player
 */
function evaluatePosition(state: QueensGuardsState, player: Player): number {
  const opponent = getOpponent(player);

  // Check for winner
  const winner = checkWinner(state);
  if (winner === player) return 10000;
  if (winner === opponent) return -10000;

  let score = 0;

  // Find queen and guard positions for both players
  const playerQueen = findQueen(state, player);
  const opponentQueen = findQueen(state, opponent);
  const playerGuards = findGuards(state, player);
  const opponentGuards = findGuards(state, opponent);

  // Queen position score - closer to center is better
  if (playerQueen) {
    score += (CONFIG.NUM_RINGS - playerQueen.ring) * 100;
    // Bonus if queen is in ring 1 (one step from winning)
    if (playerQueen.ring === 1) score += 200;
    // Even bigger bonus for center
    if (playerQueen.ring === 0) score += 500;
  }

  if (opponentQueen) {
    score -= (CONFIG.NUM_RINGS - opponentQueen.ring) * 100;
    if (opponentQueen.ring === 1) score -= 200;
    if (opponentQueen.ring === 0) score -= 500;
  }

  // Guard positioning - should support queen's advance
  for (const guard of playerGuards) {
    // Guards closer to center are better
    score += (CONFIG.NUM_RINGS - guard.ring) * 20;

    // Guards near queen are valuable
    if (playerQueen && isAdjacent(guard, playerQueen)) {
      score += 30;
    }

    // Count guards in ring 1 (needed for win condition)
    if (guard.ring === 1) score += 50;
  }

  for (const guard of opponentGuards) {
    score -= (CONFIG.NUM_RINGS - guard.ring) * 20;
    if (opponentQueen && isAdjacent(guard, opponentQueen)) {
      score -= 30;
    }
    if (guard.ring === 1) score -= 50;
  }

  // Evaluate capture threats
  score += evaluateCaptureThreats(state, player) * 40;
  score -= evaluateCaptureThreats(state, opponent) * 40;

  // Mobility - having more move options is good
  score += countMobility(state, player) * 3;
  score -= countMobility(state, opponent) * 3;

  // Check if we're close to completing win condition
  if (playerQueen && playerQueen.ring === 0) {
    // Queen in center - count guards in ring 1
    let friendlyGuardsInRing1 = 0;
    for (let pos = 0; pos < 6; pos++) {
      const cell = state.cells.get(cellKey(1, pos));
      if (cell?.piece?.player === player && cell.piece.type === 'guard') {
        friendlyGuardsInRing1++;
      }
    }
    score += friendlyGuardsInRing1 * 100; // Big bonus for each guard in position
  }

  return score;
}

/**
 * Find queen position for a player
 */
function findQueen(state: QueensGuardsState, player: Player): BoardCoord | null {
  for (const [key, cell] of state.cells) {
    if (cell.piece?.player === player && cell.piece.type === 'queen') {
      return parseKey(key);
    }
  }
  return null;
}

/**
 * Find all guard positions for a player
 */
function findGuards(state: QueensGuardsState, player: Player): BoardCoord[] {
  const guards: BoardCoord[] = [];
  for (const [key, cell] of state.cells) {
    if (cell.piece?.player === player && cell.piece.type === 'guard') {
      guards.push(parseKey(key));
    }
  }
  return guards;
}

/**
 * Check if two coordinates are adjacent
 */
function isAdjacent(a: BoardCoord, b: BoardCoord): boolean {
  const adjacent = getAdjacent(a);
  return adjacent.some(adj => adj.ring === b.ring && adj.position === b.position);
}

/**
 * Count capture threats for a player
 */
function evaluateCaptureThreats(state: QueensGuardsState, player: Player): number {
  let threats = 0;

  for (const [key, cell] of state.cells) {
    if (cell.piece?.player !== player) continue;

    const coord = parseKey(key);
    const moves = getValidMoves(state, coord);

    for (const move of moves) {
      // Check if this move would create a capture
      const simState = makeMove(state, coord, move);
      if (simState.capturedPieces.length > state.capturedPieces.length) {
        threats++;
        // Extra value for capturing queen
        const capturedQueens = simState.capturedPieces.filter(c => {
          const capturedCell = state.cells.get(cellKey(c.ring, c.position));
          return capturedCell?.piece?.type === 'queen';
        });
        if (capturedQueens.length > 0) {
          threats += 5; // Capturing queen is very valuable
        }
      }
    }
  }

  return threats;
}

/**
 * Count total mobility (number of valid moves)
 */
function countMobility(state: QueensGuardsState, player: Player): number {
  let mobility = 0;

  for (const [key, cell] of state.cells) {
    if (cell.piece?.player === player) {
      const coord = parseKey(key);
      mobility += getValidMoves(state, coord).length;
    }
  }

  return mobility;
}

// =============================================================================
// Minimax with Alpha-Beta Pruning
// =============================================================================

function minimax(
  state: QueensGuardsState,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  aiPlayer: Player
): number {
  // Terminal conditions
  if (depth === 0 || state.winner !== null) {
    return evaluatePosition(state, aiPlayer);
  }

  // Check if current player has moves
  if (!hasValidMoves(state)) {
    return evaluatePosition(state, aiPlayer);
  }

  const allMoves = getAllMoves(state);

  if (allMoves.length === 0) {
    return evaluatePosition(state, aiPlayer);
  }

  // Order moves for better pruning (captures and queen moves first)
  const orderedMoves = orderMoves(state, allMoves);

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of orderedMoves) {
      const newState = makeMove(state, move.from, move.to);
      const evalScore = minimax(newState, depth - 1, alpha, beta, false, aiPlayer);
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of orderedMoves) {
      const newState = makeMove(state, move.from, move.to);
      const evalScore = minimax(newState, depth - 1, alpha, beta, true, aiPlayer);
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

/**
 * Get all possible moves for current player
 */
function getAllMoves(state: QueensGuardsState): { from: BoardCoord; to: BoardCoord }[] {
  const moves: { from: BoardCoord; to: BoardCoord }[] = [];

  for (const [key, cell] of state.cells) {
    if (cell.piece?.player !== state.currentPlayer) continue;

    const from = parseKey(key);
    const validMoves = getValidMoves(state, from);

    for (const to of validMoves) {
      moves.push({ from, to });
    }
  }

  return moves;
}

/**
 * Order moves for better alpha-beta pruning
 * Priority: captures, queen moves toward center, guard moves toward center
 */
function orderMoves(
  state: QueensGuardsState,
  moves: { from: BoardCoord; to: BoardCoord }[]
): { from: BoardCoord; to: BoardCoord }[] {
  return moves.sort((a, b) => {
    const cellA = state.cells.get(cellKey(a.from.ring, a.from.position));
    const cellB = state.cells.get(cellKey(b.from.ring, b.from.position));

    // Captures first
    const stateA = makeMove(state, a.from, a.to);
    const stateB = makeMove(state, b.from, b.to);
    const captureA = stateA.capturedPieces.length > state.capturedPieces.length ? 1 : 0;
    const captureB = stateB.capturedPieces.length > state.capturedPieces.length ? 1 : 0;
    if (captureA !== captureB) return captureB - captureA;

    // Queen moves first
    const queenA = cellA?.piece?.type === 'queen' ? 1 : 0;
    const queenB = cellB?.piece?.type === 'queen' ? 1 : 0;
    if (queenA !== queenB) return queenB - queenA;

    // Moves toward center first
    const inwardA = a.to.ring < a.from.ring ? 1 : 0;
    const inwardB = b.to.ring < b.from.ring ? 1 : 0;
    return inwardB - inwardA;
  });
}

// =============================================================================
// Public API
// =============================================================================

export interface AIMove {
  from: BoardCoord;
  to: BoardCoord;
}

/**
 * Get the AI's next move
 */
export function getAIMove(
  state: QueensGuardsState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium'
): AIMove | null {
  if (state.winner !== null) return null;
  if (state.currentPlayer !== aiPlayer) return null;

  // Handle captured pieces first (must restore to outer ring)
  if (state.capturedPieces.length > 0) {
    return getRestoreMove(state);
  }

  const config = DIFFICULTY_CONFIG[difficulty];
  const allMoves = getAllMoves(state);

  if (allMoves.length === 0) return null;

  // Evaluate each move with minimax
  const scoredMoves: { move: AIMove; score: number }[] = [];

  for (const move of allMoves) {
    const newState = makeMove(state, move.from, move.to);
    const score = minimax(
      newState,
      config.maxDepth,
      -Infinity,
      Infinity,
      false,
      aiPlayer
    );
    scoredMoves.push({ move, score });
  }

  // Sort by score
  scoredMoves.sort((a, b) => b.score - a.score);

  // Add randomness based on difficulty
  if (Math.random() < config.randomness && scoredMoves.length > 1) {
    const randomIndex = Math.floor(Math.random() * Math.min(3, scoredMoves.length));
    return scoredMoves[randomIndex].move;
  }

  return scoredMoves[0].move;
}

/**
 * Get a move to restore a captured piece to the outer ring
 */
function getRestoreMove(state: QueensGuardsState): AIMove | null {
  if (state.capturedPieces.length === 0) return null;

  const capturedCoord = state.capturedPieces[0];
  const outerRing = CONFIG.NUM_RINGS - 1;
  const outerCount = cellsInRing(outerRing);

  // Find an empty cell on the outer ring
  for (let pos = 0; pos < outerCount; pos++) {
    const cell = state.cells.get(cellKey(outerRing, pos));
    if (!cell?.piece) {
      return {
        from: capturedCoord,
        to: { ring: outerRing, position: pos },
      };
    }
  }

  return null;
}

/**
 * Apply an AI move to the game state
 */
export function applyAIMove(state: QueensGuardsState, move: AIMove): QueensGuardsState {
  return makeMove(state, move.from, move.to);
}
