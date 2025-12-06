// FIAR (Four In A Row) AI Module
// Strategic AI for placement and movement phases

import {
  FiarGameState,
  Player,
  CONFIG,
  getOpponent,
  getNodesInDirection,
  getDirections,
} from './types';

import {
  canPlaceChip,
  placeChip,
  getValidMoves,
  moveChip,
  findPaths,
  checkWinner,
} from './rules';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY_CONFIG = {
  easy: { maxDepth: 1, randomness: 0.4 },
  medium: { maxDepth: 2, randomness: 0.15 },
  hard: { maxDepth: 3, randomness: 0.05 },
};

// =============================================================================
// Board Evaluation
// =============================================================================

/**
 * Evaluate board position for a player
 * Higher score = better for that player
 */
function evaluatePosition(state: FiarGameState, player: Player): number {
  const opponent = getOpponent(player);

  // Check for winner
  const winner = checkWinner(state);
  if (winner === player) return 10000;
  if (winner === opponent) return -10000;

  let score = 0;

  // Evaluate paths for both players
  const playerPaths = findPaths(state, player);
  const opponentPaths = findPaths(state, opponent);

  // Winning paths (unblocked 4-in-a-row)
  for (const path of playerPaths) {
    if (!path.isBlocked) {
      score += path.nodes.length * 100;
    } else {
      score += path.nodes.length * 20; // Blocked paths still have value
    }
  }

  for (const path of opponentPaths) {
    if (!path.isBlocked) {
      score -= path.nodes.length * 100;
    } else {
      score -= path.nodes.length * 20;
    }
  }

  // Evaluate potential paths (partial alignments)
  score += evaluatePotentialPaths(state, player);
  score -= evaluatePotentialPaths(state, opponent);

  // Center control bonus during placement
  if (state.phase === 'placement') {
    score += evaluateCenterControl(state, player) * 15;
    score -= evaluateCenterControl(state, opponent) * 15;
  }

  return score;
}

/**
 * Evaluate potential winning paths (2-3 in a row)
 */
function evaluatePotentialPaths(state: FiarGameState, player: Player): number {
  let score = 0;

  for (const [nodeId, node] of state.board.nodes) {
    if (node.chip !== player) continue;

    const directions = getDirections().slice(0, 4); // Only check 4 directions (others are reverse)

    for (const dir of directions) {
      let lineLength = 1;
      let emptySpaces = 0;
      let blocked = false;

      // Check forward direction
      const forward = getNodesInDirection(state.board, nodeId, dir.dx, dir.dy);
      for (const id of forward) {
        const n = state.board.nodes.get(id);
        if (!n) break;
        if (n.chip === player) lineLength++;
        else if (n.chip === null) emptySpaces++;
        else {
          blocked = true;
          break;
        }
        if (lineLength + emptySpaces >= CONFIG.WIN_LENGTH) break;
      }

      // Check backward direction
      const backward = getNodesInDirection(state.board, nodeId, -dir.dx, -dir.dy);
      for (const id of backward) {
        const n = state.board.nodes.get(id);
        if (!n) break;
        if (n.chip === player) lineLength++;
        else if (n.chip === null) emptySpaces++;
        else {
          blocked = true;
          break;
        }
        if (lineLength + emptySpaces >= CONFIG.WIN_LENGTH) break;
      }

      // Score based on potential
      if (lineLength + emptySpaces >= CONFIG.WIN_LENGTH && !blocked) {
        score += lineLength * lineLength * 5; // Quadratic scoring for longer lines
      }
    }
  }

  return score;
}

/**
 * Evaluate center control
 */
function evaluateCenterControl(state: FiarGameState, player: Player): number {
  let score = 0;

  for (const [nodeId, node] of state.board.nodes) {
    if (node.chip !== player) continue;

    // Parse coordinates
    const [row, col] = nodeId.split('-').map(Number);

    // Center of 5x5 is (2, 2)
    const distFromCenter = Math.abs(row - 2) + Math.abs(col - 2);
    score += (4 - distFromCenter); // Max 4 for center, less for edges
  }

  return score;
}

// =============================================================================
// AI Move Selection - Placement Phase
// =============================================================================

/**
 * Get best placement during placement phase
 */
function getBestPlacement(
  state: FiarGameState,
  aiPlayer: Player,
  difficulty: AIDifficulty
): string | null {
  const config = DIFFICULTY_CONFIG[difficulty];
  const placements: { nodeId: string; score: number }[] = [];

  for (const [nodeId] of state.board.nodes) {
    if (!canPlaceChip(state, nodeId)) continue;

    // Simulate placement
    const newState = placeChip(state, nodeId);

    // Evaluate with minimax
    const score = minimax(
      newState,
      config.maxDepth,
      -Infinity,
      Infinity,
      false,
      aiPlayer
    );

    placements.push({ nodeId, score });
  }

  if (placements.length === 0) return null;

  // Sort by score
  placements.sort((a, b) => b.score - a.score);

  // Add randomness based on difficulty
  if (Math.random() < config.randomness && placements.length > 1) {
    const randomIndex = Math.floor(Math.random() * Math.min(3, placements.length));
    return placements[randomIndex].nodeId;
  }

  return placements[0].nodeId;
}

// =============================================================================
// AI Move Selection - Movement Phase
// =============================================================================

/**
 * Get best movement during movement phase
 */
function getBestMove(
  state: FiarGameState,
  aiPlayer: Player,
  difficulty: AIDifficulty
): { from: string; to: string } | null {
  const config = DIFFICULTY_CONFIG[difficulty];
  const moves: { from: string; to: string; score: number }[] = [];

  for (const [nodeId, node] of state.board.nodes) {
    if (node.chip !== aiPlayer) continue;

    const validMoves = getValidMoves(state, nodeId);

    for (const targetId of validMoves) {
      // Simulate move
      const newState = moveChip(state, nodeId, targetId);

      // Evaluate with minimax
      const score = minimax(
        newState,
        config.maxDepth,
        -Infinity,
        Infinity,
        false,
        aiPlayer
      );

      moves.push({ from: nodeId, to: targetId, score });
    }
  }

  if (moves.length === 0) return null;

  // Sort by score
  moves.sort((a, b) => b.score - a.score);

  // Add randomness based on difficulty
  if (Math.random() < config.randomness && moves.length > 1) {
    const randomIndex = Math.floor(Math.random() * Math.min(3, moves.length));
    return { from: moves[randomIndex].from, to: moves[randomIndex].to };
  }

  return { from: moves[0].from, to: moves[0].to };
}

// =============================================================================
// Minimax with Alpha-Beta Pruning
// =============================================================================

function minimax(
  state: FiarGameState,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  aiPlayer: Player
): number {
  // Terminal conditions
  if (depth === 0 || state.phase === 'gameOver') {
    return evaluatePosition(state, aiPlayer);
  }

  const currentPlayer = state.currentPlayer;

  if (state.phase === 'placement') {
    // Placement phase moves
    const availableNodes: string[] = [];
    for (const [nodeId] of state.board.nodes) {
      if (canPlaceChip(state, nodeId)) {
        availableNodes.push(nodeId);
      }
    }

    if (availableNodes.length === 0) {
      return evaluatePosition(state, aiPlayer);
    }

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const nodeId of availableNodes) {
        const newState = placeChip(state, nodeId);
        const evalScore = minimax(newState, depth - 1, alpha, beta, false, aiPlayer);
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const nodeId of availableNodes) {
        const newState = placeChip(state, nodeId);
        const evalScore = minimax(newState, depth - 1, alpha, beta, true, aiPlayer);
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  } else {
    // Movement phase moves
    const allMoves: { from: string; to: string }[] = [];

    for (const [nodeId, node] of state.board.nodes) {
      if (node.chip !== currentPlayer) continue;

      const validMoves = getValidMoves(state, nodeId);
      for (const targetId of validMoves) {
        allMoves.push({ from: nodeId, to: targetId });
      }
    }

    if (allMoves.length === 0) {
      return evaluatePosition(state, aiPlayer);
    }

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of allMoves) {
        const newState = moveChip(state, move.from, move.to);
        const evalScore = minimax(newState, depth - 1, alpha, beta, false, aiPlayer);
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of allMoves) {
        const newState = moveChip(state, move.from, move.to);
        const evalScore = minimax(newState, depth - 1, alpha, beta, true, aiPlayer);
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }
}

// =============================================================================
// Public API
// =============================================================================

export interface AIMove {
  type: 'place' | 'move';
  nodeId?: string;  // For placement
  from?: string;    // For movement
  to?: string;      // For movement
}

/**
 * Get the AI's next move
 */
export function getAIMove(
  state: FiarGameState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium'
): AIMove | null {
  if (state.phase === 'placement') {
    const nodeId = getBestPlacement(state, aiPlayer, difficulty);
    if (nodeId) {
      return { type: 'place', nodeId };
    }
  } else if (state.phase === 'movement') {
    const move = getBestMove(state, aiPlayer, difficulty);
    if (move) {
      return { type: 'move', from: move.from, to: move.to };
    }
  }

  return null;
}

/**
 * Apply an AI move to the game state
 */
export function applyAIMove(state: FiarGameState, move: AIMove): FiarGameState {
  if (move.type === 'place' && move.nodeId) {
    return placeChip(state, move.nodeId);
  } else if (move.type === 'move' && move.from && move.to) {
    return moveChip(state, move.from, move.to);
  }
  return state;
}
