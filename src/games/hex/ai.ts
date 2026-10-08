// Hex AI - Strategic AI using shortest path heuristics
// Player 1 connects top-bottom, Player 2 connects left-right

import type { HexGameState, HexPosition, Player } from './types';
import { getOpponent } from './types';
import { getNeighbors, makeMove, getValidMoves } from './rules';
import { createSeededRng } from '../../core/ai-worker/seeded-rng';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

/**
 * Play-facing wall-time budgets (ms). Hard still uses maxDepth when time
 * remains; iterative deepening keeps a sensible move if the budget expires.
 * Hard targets ≤500ms wall think-time (deadline 450ms leaves abort slack;
 * mid-game Hard benches stay move-identical to unlimited search on the
 * hand-built mid states — see docs/ai-move-time-2026-10-07.md).
 */
export const AI_PLAY_DEADLINE_MS: Record<AIDifficulty, number> = {
  easy: 600,
  medium: 1200,
  hard: 450,
};

/** Optional search controls — defaults preserve historical Math.random behavior. */
export interface AISearchOptions {
  seed?: number | undefined;
  /**
   * Soft wall-time budget (ms). When finite, iterative deepening + mid-tree
   * abort return a move within the budget. Omit for historical single-depth search.
   */
  deadlineMs?: number | undefined;
  now?: (() => number) | undefined;
}

interface SearchClock {
  now: () => number;
  deadline: number;
  aborted: boolean;
  nodes: number;
}

function clockTimedOut(clock: SearchClock | null): boolean {
  if (!clock) return false;
  clock.nodes += 1;
  if (clock.now() >= clock.deadline) {
    clock.aborted = true;
  }
  return clock.aborted;
}

export interface AISearchResult {
  move: HexPosition | null;
  truncated: boolean;
}

// Configuration for different difficulties
const DIFFICULTY_CONFIG = {
  easy: { maxDepth: 1, randomness: 0.4 },
  medium: { maxDepth: 2, randomness: 0.15 },
  hard: { maxDepth: 3, randomness: 0.05 },
};

// Calculate shortest path distance from a player's starting edge to their goal edge.
// Edge costs are 0 (own stone) or 1 (empty) — 0-1 BFS, same metric as Dijkstra.
function shortestPathDistance(state: HexGameState, player: Player): number {
  const { board, boardSize } = state;
  const INF = 1e9;

  const dist: number[][] = Array.from({ length: boardSize }, () =>
    Array(boardSize).fill(INF)
  );

  // Deque for 0-1 BFS (front = cost 0, back = cost 1)
  const deque: { row: number; col: number; d: number }[] = [];

  const cellStep = (row: number, col: number): number => {
    const cell = board[row]![col]; // ratchet: in-bounds board cell
    if (cell === player) return 0;
    if (cell === null) return 1;
    return INF;
  };

  if (player === 'player1') {
    for (let col = 0; col < boardSize; col++) {
      const step = cellStep(0, col);
      if (step < INF) {
        dist[0]![col] = step; // ratchet: row 0 in-bounds
        if (step === 0) deque.unshift({ row: 0, col, d: step });
        else deque.push({ row: 0, col, d: step });
      }
    }
  } else {
    for (let row = 0; row < boardSize; row++) {
      const step = cellStep(row, 0);
      if (step < INF) {
        dist[row]![0] = step; // ratchet: col 0 in-bounds
        if (step === 0) deque.unshift({ row, col: 0, d: step });
        else deque.push({ row, col: 0, d: step });
      }
    }
  }

  while (deque.length > 0) {
    const { row, col, d: currentDist } = deque.shift()!;
    if (currentDist > dist[row]![col]!) continue; // ratchet: in-bounds dist

    if (player === 'player1' && row === boardSize - 1) {
      return currentDist;
    }
    if (player === 'player2' && col === boardSize - 1) {
      return currentDist;
    }

    for (const neighbor of getNeighbors({ row, col }, boardSize)) {
      const edgeCost = cellStep(neighbor.row, neighbor.col);
      if (edgeCost >= INF) continue;
      const newDist = currentDist + edgeCost;
      if (newDist < dist[neighbor.row]![neighbor.col]!) {
        dist[neighbor.row]![neighbor.col] = newDist;
        if (edgeCost === 0) {
          deque.unshift({ row: neighbor.row, col: neighbor.col, d: newDist });
        } else {
          deque.push({ row: neighbor.row, col: neighbor.col, d: newDist });
        }
      }
    }
  }

  return Infinity;
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
      if (state.board[row]![col] === player) {
        const distFromCenter = Math.abs(row - center) + Math.abs(col - center);
        centerBonus += (state.boardSize - distFromCenter) * 0.1;
      } else if (state.board[row]![col] === opponent) {
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
  aiPlayer: Player,
  clock: SearchClock | null
): number {
  if (clockTimedOut(clock)) {
    return evaluatePosition(state, aiPlayer);
  }

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
      if (clockTimedOut(clock)) break;
      const newState = makeMove(state, move);
      const evalScore = minimax(
        newState,
        depth - 1,
        alpha,
        beta,
        false,
        aiPlayer,
        clock
      );
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  }

  let minEval = Infinity;
  for (const move of limitedMoves) {
    if (clockTimedOut(clock)) break;
    const newState = makeMove(state, move);
    const evalScore = minimax(
      newState,
      depth - 1,
      alpha,
      beta,
      true,
      aiPlayer,
      clock
    );
    minEval = Math.min(minEval, evalScore);
    beta = Math.min(beta, evalScore);
    if (beta <= alpha) break;
  }
  return minEval;
}

/**
 * Full Hex AI search with optional seed / safety deadline metadata.
 */
export function searchBestMove(
  state: HexGameState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium',
  options: AISearchOptions = {}
): AISearchResult {
  const config = DIFFICULTY_CONFIG[difficulty];
  const moves = getValidMoves(state);

  if (moves.length === 0) return { move: null, truncated: false };

  const rng =
    options.seed === undefined ? Math.random : createSeededRng(options.seed);
  const now = options.now ?? (() => performance.now());
  const started = now();
  const deadline =
    options.deadlineMs === undefined
      ? Number.POSITIVE_INFINITY
      : started + options.deadlineMs;
  const timed = Number.isFinite(deadline);
  const maxDepth = config.maxDepth;

  // First move: play near center
  if (state.moveHistory.length < 2) {
    const center = Math.floor(state.boardSize / 2);
    const centerMoves = moves.filter(
      (m) => Math.abs(m.row - center) <= 1 && Math.abs(m.col - center) <= 1
    );
    if (centerMoves.length > 0) {
      return {
        move: centerMoves[Math.floor(rng() * centerMoves.length)]!,
        truncated: false,
      };
    }
  }

  let rootMoves = moves;
  let bestScored: { move: HexPosition; score: number }[] | null = null;
  let truncated = false;

  // Timed: depth-1 standing move, then jump to maxDepth so the budget is
  // not spent on intermediate ID layers. Unlimited: historical single pass.
  const depths =
    timed && maxDepth > 1 ? ([1, maxDepth] as const) : ([maxDepth] as const);

  for (const depth of depths) {
    if (timed && bestScored && now() >= deadline) {
      truncated = true;
      break;
    }

    const clock: SearchClock | null = timed
      ? { now, deadline, aborted: false, nodes: 0 }
      : null;
    const scoredMoves: { move: HexPosition; score: number }[] = [];
    let incomplete = false;

    for (const move of rootMoves) {
      if (
        timed &&
        now() >= deadline &&
        (scoredMoves.length > 0 || bestScored)
      ) {
        incomplete = true;
        break;
      }

      const newState = makeMove(state, move);

      // Check for immediate win
      if (newState.winner === aiPlayer) {
        scoredMoves.push({ move, score: Infinity });
        continue;
      }

      // Check for blocking opponent's immediate win
      const opponentState = { ...state, currentPlayer: getOpponent(aiPlayer) };
      const opponentWithMove = makeMove(opponentState, move);
      if (opponentWithMove.winner === getOpponent(aiPlayer)) {
        scoredMoves.push({ move, score: 5000 });
        continue;
      }

      const score = minimax(
        newState,
        depth,
        -Infinity,
        Infinity,
        false,
        aiPlayer,
        clock
      );
      if (clock?.aborted) {
        incomplete = true;
        break;
      }

      // Add randomness based on difficulty (once per completed root, historical)
      const randomFactor = (rng() - 0.5) * config.randomness * 200;
      scoredMoves.push({ move, score: score + randomFactor });
    }

    if (!incomplete && scoredMoves.length === rootMoves.length) {
      scoredMoves.sort((a, b) => b.score - a.score);
      bestScored = scoredMoves;
      rootMoves = scoredMoves.map((s) => s.move);
    } else {
      truncated = true;
      if (!bestScored && scoredMoves.length > 0) {
        scoredMoves.sort((a, b) => b.score - a.score);
        bestScored = scoredMoves;
      }
      break;
    }
  }

  const scoredMoves = bestScored;
  if (!scoredMoves || scoredMoves.length === 0) {
    return { move: moves[0] ?? null, truncated };
  }

  return { move: scoredMoves[0]!.move, truncated }; // ratchet: length-gated
}

// Get the best move for the AI
export function getBestMove(
  state: HexGameState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium',
  options: AISearchOptions = {}
): HexPosition | null {
  return searchBestMove(state, aiPlayer, difficulty, options).move;
}

// Get a random valid move (for very easy mode or fallback)
export function getRandomMove(state: HexGameState): HexPosition | null {
  const moves = getValidMoves(state);
  if (moves.length === 0) return null;
  return moves[Math.floor(Math.random() * moves.length)]!; // ratchet: length-gated
}
