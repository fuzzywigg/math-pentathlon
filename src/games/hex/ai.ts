// Hex AI - Strategic AI using shortest path heuristics
// Player 1 connects top-bottom, Player 2 connects left-right

import { HexGameState, HexPosition, Player, getOpponent } from './types';
import { getNeighbors, makeMove, getValidMoves } from './rules';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

// Configuration for different difficulties
const DIFFICULTY_CONFIG = {
  easy: { maxDepth: 1, randomness: 0.4 },
  medium: { maxDepth: 2, randomness: 0.15 },
  hard: { maxDepth: 3, randomness: 0.05 },
};

// Calculate shortest path distance from a player's starting edge to their goal edge
// Uses Dijkstra's algorithm with distance = 0 for own pieces, 1 for empty, Infinity for opponent
function shortestPathDistance(
  state: HexGameState,
  player: Player
): number {
  const { board, boardSize } = state;
  const INF = Infinity;

  // Distance grid
  const dist: number[][] = Array(boardSize)
    .fill(null)
    .map(() => Array(boardSize).fill(INF));

  // Priority queue (simple implementation)
  const pq: { pos: HexPosition; dist: number }[] = [];

  const addToPQ = (pos: HexPosition, d: number) => {
    pq.push({ pos, dist: d });
    pq.sort((a, b) => a.dist - b.dist);
  };

  // Initialize starting edge
  if (player === 'player1') {
    // Start from top row
    for (let col = 0; col < boardSize; col++) {
      const cell = board[0][col];
      const d = cell === player ? 0 : cell === null ? 1 : INF;
      if (d < INF) {
        dist[0][col] = d;
        addToPQ({ row: 0, col }, d);
      }
    }
  } else {
    // Start from left column
    for (let row = 0; row < boardSize; row++) {
      const cell = board[row][0];
      const d = cell === player ? 0 : cell === null ? 1 : INF;
      if (d < INF) {
        dist[row][0] = d;
        addToPQ({ row, col: 0 }, d);
      }
    }
  }

  // Dijkstra's algorithm
  while (pq.length > 0) {
    const { pos, dist: currentDist } = pq.shift()!;

    if (currentDist > dist[pos.row][pos.col]) continue;

    // Check if reached goal
    if (player === 'player1' && pos.row === boardSize - 1) {
      return currentDist;
    }
    if (player === 'player2' && pos.col === boardSize - 1) {
      return currentDist;
    }

    // Explore neighbors
    for (const neighbor of getNeighbors(pos, boardSize)) {
      const cell = board[neighbor.row][neighbor.col];
      const edgeCost = cell === player ? 0 : cell === null ? 1 : INF;

      if (edgeCost < INF) {
        const newDist = currentDist + edgeCost;
        if (newDist < dist[neighbor.row][neighbor.col]) {
          dist[neighbor.row][neighbor.col] = newDist;
          addToPQ(neighbor, newDist);
        }
      }
    }
  }

  return INF;
}

// Evaluate board position for the given player
function evaluatePosition(state: HexGameState, player: Player): number {
  const opponent = getOpponent(player);

  const playerDist = shortestPathDistance(state, player);
  const opponentDist = shortestPathDistance(state, opponent);

  // If player has connected, return high score
  if (playerDist === 0) return 10000;
  // If opponent has connected, return low score
  if (opponentDist === 0) return -10000;

  // If either path is blocked, extreme values
  if (playerDist === Infinity && opponentDist === Infinity) return 0;
  if (playerDist === Infinity) return -5000;
  if (opponentDist === Infinity) return 5000;

  // Score based on path difference - lower distance is better
  // Also factor in whose turn it is (having the move is worth ~0.5 cells)
  const pathDiff = opponentDist - playerDist;

  // Add some value for center control
  let centerBonus = 0;
  const center = Math.floor(state.boardSize / 2);
  for (let row = 0; row < state.boardSize; row++) {
    for (let col = 0; col < state.boardSize; col++) {
      if (state.board[row][col] === player) {
        const distFromCenter = Math.abs(row - center) + Math.abs(col - center);
        centerBonus += (state.boardSize - distFromCenter) * 0.1;
      } else if (state.board[row][col] === opponent) {
        const distFromCenter = Math.abs(row - center) + Math.abs(col - center);
        centerBonus -= (state.boardSize - distFromCenter) * 0.1;
      }
    }
  }

  return pathDiff * 100 + centerBonus;
}

// Minimax with alpha-beta pruning
function minimax(
  state: HexGameState,
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: boolean,
  aiPlayer: Player
): number {
  // Terminal conditions
  if (state.winner === aiPlayer) return 10000 + depth;
  if (state.winner === getOpponent(aiPlayer)) return -10000 - depth;
  if (depth === 0) return evaluatePosition(state, aiPlayer);

  const moves = getValidMoves(state);
  if (moves.length === 0) return evaluatePosition(state, aiPlayer);

  // Sort moves to improve pruning (prefer center moves)
  const center = Math.floor(state.boardSize / 2);
  moves.sort((a, b) => {
    const distA = Math.abs(a.row - center) + Math.abs(a.col - center);
    const distB = Math.abs(b.row - center) + Math.abs(b.col - center);
    return distA - distB;
  });

  // Limit number of moves to evaluate at each depth for performance
  const maxMoves = depth > 1 ? 15 : 25;
  const limitedMoves = moves.slice(0, maxMoves);

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    for (const move of limitedMoves) {
      const newState = makeMove(state, move);
      const evalScore = minimax(newState, depth - 1, alpha, beta, false, aiPlayer);
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of limitedMoves) {
      const newState = makeMove(state, move);
      const evalScore = minimax(newState, depth - 1, alpha, beta, true, aiPlayer);
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

// Get the best move for the AI
export function getBestMove(
  state: HexGameState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium'
): HexPosition | null {
  const config = DIFFICULTY_CONFIG[difficulty];
  const moves = getValidMoves(state);

  if (moves.length === 0) return null;

  // First move: play near center
  if (state.moveHistory.length < 2) {
    const center = Math.floor(state.boardSize / 2);
    const centerMoves = moves.filter(
      m => Math.abs(m.row - center) <= 1 && Math.abs(m.col - center) <= 1
    );
    if (centerMoves.length > 0) {
      return centerMoves[Math.floor(Math.random() * centerMoves.length)];
    }
  }

  // Evaluate all moves
  const scoredMoves = moves.map(move => {
    const newState = makeMove(state, move);

    // Check for immediate win
    if (newState.winner === aiPlayer) {
      return { move, score: Infinity };
    }

    // Check for blocking opponent's immediate win
    const opponentState = { ...state, currentPlayer: getOpponent(aiPlayer) };
    const opponentWithMove = makeMove(opponentState, move);
    if (opponentWithMove.winner === getOpponent(aiPlayer)) {
      return { move, score: 5000 }; // High priority to block
    }

    const score = minimax(
      newState,
      config.maxDepth,
      -Infinity,
      Infinity,
      false,
      aiPlayer
    );

    // Add randomness based on difficulty
    const randomFactor = (Math.random() - 0.5) * config.randomness * 200;

    return { move, score: score + randomFactor };
  });

  // Sort by score (highest first)
  scoredMoves.sort((a, b) => b.score - a.score);

  // Return the best move
  return scoredMoves[0].move;
}

// Get a random valid move (for very easy mode or fallback)
export function getRandomMove(state: HexGameState): HexPosition | null {
  const moves = getValidMoves(state);
  if (moves.length === 0) return null;
  return moves[Math.floor(Math.random() * moves.length)];
}
