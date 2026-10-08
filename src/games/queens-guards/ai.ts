// Queens & Guards AI Module
// Strategic AI for hexagonal Agon-style game

import type { QueensGuardsState, Player, BoardCoord } from './types';
import {
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
  restoreCapturedPiece,
  checkWinner,
  hasValidMoves,
} from './rules';
import { createSeededRng } from '../../core/ai-worker/seeded-rng';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

/**
 * Play-facing wall-time budgets (ms). Hard still searches up to maxDepth when
 * the machine is fast enough; iterative deepening returns the last finished
 * depth if the budget runs out. The worker safety cap (180s) is a separate
 * stall guard, not a play target. Hard is time-boxed to 500ms; hand-built
 * mid-game Hard benches keep the same chosen move as unlimited search.
 * Hard deadline is 450ms so observed wall p95 stays ≤500ms after abort slack.
 */
export const AI_PLAY_DEADLINE_MS: Record<AIDifficulty, number> = {
  easy: 800,
  medium: 1500,
  hard: 450,
};

/** Optional search controls — defaults preserve historical Math.random behavior. */
export interface AISearchOptions {
  /** Deterministic PRNG seed (worker/direct parity tests). */
  seed?: number | undefined;
  /**
   * Soft wall-time budget (ms). When finite, search uses iterative deepening
   * up to the difficulty maxDepth and aborts mid-tree so a move returns on time.
   * Omit to keep the historical single-depth search (tests / unlimited).
   */
  deadlineMs?: number | undefined;
  /** Clock override for tests. */
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
  move: AIMove | null;
  truncated: boolean;
}

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
function findQueen(
  state: QueensGuardsState,
  player: Player
): BoardCoord | null {
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
  return adjacent.some(
    (adj) => adj.ring === b.ring && adj.position === b.position
  );
}

/**
 * Count capture threats for a player
 */
function evaluateCaptureThreats(
  state: QueensGuardsState,
  player: Player
): number {
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
        const capturedQueens = simState.capturedPieces.filter((c) => {
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
  aiPlayer: Player,
  clock: SearchClock | null
): number {
  if (clockTimedOut(clock)) {
    return evaluatePosition(state, aiPlayer);
  }

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
      if (clockTimedOut(clock)) break;
      const newState = makeMove(state, move.from, move.to);
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
  for (const move of orderedMoves) {
    if (clockTimedOut(clock)) break;
    const newState = makeMove(state, move.from, move.to);
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
 * Get all possible moves for current player
 */
function getAllMoves(
  state: QueensGuardsState
): { from: BoardCoord; to: BoardCoord }[] {
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
  const keys = new Map<{ from: BoardCoord; to: BoardCoord }, number>();
  for (const move of moves) {
    keys.set(move, moveOrderKey(state, move));
  }
  return moves.sort((a, b) => (keys.get(b) ?? 0) - (keys.get(a) ?? 0));
}

/** Lexicographic: capture, then queen, then inward — one makeMove per candidate. */
function moveOrderKey(
  state: QueensGuardsState,
  move: { from: BoardCoord; to: BoardCoord }
): number {
  const next = makeMove(state, move.from, move.to);
  const capture =
    next.capturedPieces.length > state.capturedPieces.length ? 1 : 0;
  const cell = state.cells.get(cellKey(move.from.ring, move.from.position));
  const queen = cell?.piece?.type === 'queen' ? 1 : 0;
  const inward = move.to.ring < move.from.ring ? 1 : 0;
  return capture * 4 + queen * 2 + inward;
}

// =============================================================================
// Public API
// =============================================================================

export interface AIMove {
  from: BoardCoord;
  to: BoardCoord;
}

/**
 * Full AI search with optional seed / safety deadline metadata.
 * Controllers normally use {@link getAIMove}; workers use this for truncation flags.
 */
export function searchAIMove(
  state: QueensGuardsState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium',
  options: AISearchOptions = {}
): AISearchResult {
  if (state.winner !== null) return { move: null, truncated: false };
  if (state.currentPlayer !== aiPlayer) return { move: null, truncated: false };

  // Handle captured pieces first (must restore to outer ring)
  if (state.capturedPieces.length > 0) {
    return { move: getRestoreMove(state), truncated: false };
  }

  const config = DIFFICULTY_CONFIG[difficulty];
  const allMoves = getAllMoves(state);

  if (allMoves.length === 0) return { move: null, truncated: false };

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

  let rootMoves = allMoves;
  let bestScored: { move: AIMove; score: number }[] | null = null;
  let truncated = false;

  // Unlimited search: one pass at maxDepth (historical). Timed: ID 1..maxDepth.
  for (let depth = timed ? 1 : maxDepth; depth <= maxDepth; depth++) {
    if (timed && bestScored && now() >= deadline) {
      truncated = true;
      break;
    }

    const clock: SearchClock | null = timed
      ? { now, deadline, aborted: false, nodes: 0 }
      : null;
    const scoredMoves: { move: AIMove; score: number }[] = [];
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
      const newState = makeMove(state, move.from, move.to);
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
      scoredMoves.push({ move, score });
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
    return { move: allMoves[0] ?? null, truncated };
  }

  // Add randomness based on difficulty
  if (rng() < config.randomness && scoredMoves.length > 1) {
    const randomIndex = Math.floor(rng() * Math.min(3, scoredMoves.length));
    // ratchet: randomIndex < min(3, length) after length > 1 gate.
    return { move: scoredMoves[randomIndex]!.move, truncated };
  }

  // ratchet: scoredMoves length checked non-empty above.
  return { move: scoredMoves[0]!.move, truncated };
}

/**
 * Get the AI's next move
 */
export function getAIMove(
  state: QueensGuardsState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium',
  options: AISearchOptions = {}
): AIMove | null {
  return searchAIMove(state, aiPlayer, difficulty, options).move;
}

/**
 * Get a move to restore a captured piece to the outer ring
 */
function getRestoreMove(state: QueensGuardsState): AIMove | null {
  if (state.capturedPieces.length === 0) return null;

  // ratchet: capturedPieces.length === 0 returned above.
  const capturedCoord = state.capturedPieces[0]!;
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
 * Apply an AI move to the game state.
 * Restore uses the official outer-ring relocation path, not makeMove
 * (normal movement cannot go outward).
 */
export function applyAIMove(
  state: QueensGuardsState,
  move: AIMove
): QueensGuardsState {
  if (state.capturedPieces.length > 0) {
    return restoreCapturedPiece(state, move.from, move.to);
  }
  return makeMove(state, move.from, move.to);
}
