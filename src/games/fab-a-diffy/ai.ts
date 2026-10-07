// Fab-a-Diffy AI Module
// Strategic AI for fraction combination game
//
// EDUCATIONAL NOTES:
// Fab-a-Diffy teaches fraction operations and equivalent fractions.
// Key skills: Adding/subtracting fractions, multiplying/dividing fractions,
// recognizing equivalent fractions, mental math with fractions.
//
// Strategy tips for learners:
// 1. Look for fractions with the same denominator - they're easier to add/subtract
// 2. Multiplying fractions is easy: just multiply tops and bottoms
// 3. Dividing is like multiplying by the flipped fraction (reciprocal)
// 4. Some answers can be made multiple ways - find the one using bars you want to use
// 5. Check if your answer simplifies to match a target (2/4 = 1/2)

import { FabADiffyState, Player, FractionBar } from './types';

import { FractionOperation } from '../../core/fractions/types';
import { areEquivalent } from '../../core/fractions/arithmetic';
import { createSeededRng } from '../../core/ai-worker/seeded-rng';

import {
  selectBar1,
  selectBar2,
  selectOperation,
  executeMove,
  passTurn,
  getPossibleResults,
  calculateResult,
} from './rules';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

/**
 * Play-facing wall-time budgets (ms). Hard still enumerates the full move
 * list when the machine is fast enough; a soft deadline returns the best
 * scored move found so far (evaluation scoring unchanged).
 */
export const AI_PLAY_DEADLINE_MS: Record<AIDifficulty, number> = {
  easy: 800,
  medium: 1500,
  hard: 2500,
};

/** Optional search controls — defaults preserve historical Math.random behavior. */
export interface AISearchOptions {
  /** Deterministic PRNG seed (worker/direct parity tests). */
  seed?: number;
  /**
   * Soft wall-time budget (ms). When finite, enumeration aborts between
   * candidates and returns the best move scored so far. Omit for historical
   * full enumeration (tests / unlimited).
   */
  deadlineMs?: number;
  /** Clock override for tests. */
  now?: () => number;
}

export interface AISearchResult {
  move: AIMove | null;
  truncated: boolean;
}

interface SearchClock {
  now: () => number;
  deadline: number;
  aborted: boolean;
}

const DIFFICULTY_CONFIG = {
  easy: { randomness: 0.5, teachingMode: true },
  medium: { randomness: 0.15, teachingMode: false },
  hard: { randomness: 0.03, teachingMode: false },
};

// =============================================================================
// Move Analysis
// =============================================================================

interface ValidMove {
  bar1Id: string;
  bar2Id: string;
  operation: FractionOperation;
  answerId: string;
  score: number;
  reasoning: string;
}

/**
 * Find valid moves for the current player.
 * Uses ordered bar pairs so subtract/divide match executeMove(bar1 op bar2).
 * Optional clock aborts between candidates without changing score formulas.
 */
function findAllValidMoves(
  state: FabADiffyState,
  clock: SearchClock | null = null
): { moves: ValidMove[]; truncated: boolean } {
  const moves: ValidMove[] = [];
  let truncated = false;

  const availableBars = Array.from(state.fractionBars.values()).filter(
    (b) => !b.used
  );
  const unclaimedAnswers = Array.from(state.answerBars.values()).filter(
    (a) => !a.claimedBy
  );

  if (availableBars.length < 2) return { moves, truncated };

  const operations: FractionOperation[] = [
    'add',
    'subtract',
    'multiply',
    'divide',
  ];

  const orderedPairs: Array<[FractionBar, FractionBar]> = [];
  for (let i = 0; i < availableBars.length; i++) {
    for (let j = 0; j < availableBars.length; j++) {
      if (i === j) continue;
      orderedPairs.push([availableBars[i], availableBars[j]]);
    }
  }

  outer: for (const [bar1, bar2] of orderedPairs) {
    for (const operation of operations) {
      // Skip duplicate commutative ops (add/multiply) for reverse order
      if (
        (operation === 'add' || operation === 'multiply') &&
        bar1.id > bar2.id
      ) {
        continue;
      }

      if (clock && clock.now() >= clock.deadline && moves.length > 0) {
        clock.aborted = true;
        truncated = true;
        break outer;
      }

      const result = calculateResult(bar1.fraction, bar2.fraction, operation);
      if (!result || result.numerator < 0) continue;

      const matchingAnswers = unclaimedAnswers.filter((a) =>
        areEquivalent(a.fraction, result)
      );

      for (const answer of matchingAnswers) {
        if (clock && clock.now() >= clock.deadline && moves.length > 0) {
          clock.aborted = true;
          truncated = true;
          break outer;
        }

        let score = 10;
        const reasons: string[] = [];

        if (bar1.fraction.denominator === bar2.fraction.denominator) {
          score += 5;
          reasons.push('Same denominator makes calculation easier');
        }

        if (operation === 'add' || operation === 'subtract') {
          score += 3;
        } else if (operation === 'multiply') {
          score += 2;
        }

        let alternateWays = 0;
        for (let k = 0; k < availableBars.length; k++) {
          for (let l = k + 1; l < availableBars.length; l++) {
            const a = availableBars[k];
            const b = availableBars[l];
            if (
              (a.id === bar1.id && b.id === bar2.id) ||
              (a.id === bar2.id && b.id === bar1.id)
            ) {
              continue;
            }
            const otherResults = getPossibleResults(a, b);
            if (
              otherResults.some((r) => areEquivalent(r.result, answer.fraction))
            ) {
              alternateWays++;
            }
          }
        }

        if (alternateWays === 0) {
          score += 20;
          reasons.push('Only way to make this answer - grab it!');
        } else if (alternateWays <= 2) {
          score += 10;
          reasons.push('Few ways to make this answer');
        }

        if (answer.fraction.denominator <= 4) {
          score += 5;
          reasons.push('Simple fraction target');
        }

        moves.push({
          bar1Id: bar1.id,
          bar2Id: bar2.id,
          operation,
          answerId: answer.id,
          score,
          reasoning: reasons.join('; ') || 'Valid combination',
        });
      }
    }
  }

  moves.sort((a, b) => b.score - a.score);

  return { moves, truncated };
}

// =============================================================================
// Teaching Mode
// =============================================================================

/**
 * In easy mode, occasionally make suboptimal moves
 */
function getTeachingMove(
  state: FabADiffyState,
  rng: () => number,
  clock: SearchClock | null
): { move: ValidMove | null; truncated: boolean } {
  const { moves, truncated } = findAllValidMoves(state, clock);

  if (moves.length === 0) return { move: null, truncated };

  // 40% chance to pick a lower-scoring move
  if (rng() < 0.4 && moves.length > 1) {
    const suboptimal = moves.slice(1);
    if (suboptimal.length > 0) {
      return {
        move: suboptimal[Math.floor(rng() * suboptimal.length)],
        truncated,
      };
    }
  }

  return { move: moves[0], truncated };
}

// =============================================================================
// Public API
// =============================================================================

export interface AIMove {
  bar1Id: string;
  bar2Id: string;
  operation: FractionOperation;
  answerId: string;
  hint?: string;
}

/**
 * Full Fab AI search with optional seed / play-budget deadline.
 */
export function searchAIMove(
  state: FabADiffyState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium',
  options: AISearchOptions = {}
): AISearchResult {
  if (state.phase === 'gameOver') return { move: null, truncated: false };
  if (state.currentPlayer !== aiPlayer) return { move: null, truncated: false };

  const config = DIFFICULTY_CONFIG[difficulty];
  const rng =
    options.seed === undefined ? Math.random : createSeededRng(options.seed);
  const now = options.now ?? (() => performance.now());
  const started = now();
  const deadline =
    options.deadlineMs === undefined
      ? Number.POSITIVE_INFINITY
      : started + options.deadlineMs;
  const clock: SearchClock | null = Number.isFinite(deadline)
    ? { now, deadline, aborted: false }
    : null;

  // Teaching mode for easy difficulty
  if (config.teachingMode) {
    const result = getTeachingMove(state, rng, clock);
    if (result.move) {
      return {
        move: {
          bar1Id: result.move.bar1Id,
          bar2Id: result.move.bar2Id,
          operation: result.move.operation,
          answerId: result.move.answerId,
        },
        truncated: result.truncated,
      };
    }
  }

  const { moves, truncated } = findAllValidMoves(state, clock);

  if (moves.length === 0) return { move: null, truncated };

  // Add randomness based on difficulty
  if (rng() < config.randomness && moves.length > 1) {
    const topMoves = moves.slice(0, 3);
    const chosen = topMoves[Math.floor(rng() * topMoves.length)];
    return {
      move: {
        bar1Id: chosen.bar1Id,
        bar2Id: chosen.bar2Id,
        operation: chosen.operation,
        answerId: chosen.answerId,
      },
      truncated,
    };
  }

  return {
    move: {
      bar1Id: moves[0].bar1Id,
      bar2Id: moves[0].bar2Id,
      operation: moves[0].operation,
      answerId: moves[0].answerId,
    },
    truncated,
  };
}

/**
 * Get AI's move decision
 */
export function getAIMove(
  state: FabADiffyState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium',
  options: AISearchOptions = {}
): AIMove | null {
  return searchAIMove(state, aiPlayer, difficulty, options).move;
}

/**
 * Check if it's the AI's turn
 */
export function isAITurn(
  state: FabADiffyState,
  aiPlayer: Player | null,
  gameMode: 'human-vs-human' | 'human-vs-ai'
): boolean {
  if (gameMode !== 'human-vs-ai') return false;
  if (!aiPlayer) return false;
  if (state.phase === 'gameOver') return false;

  return state.currentPlayer === aiPlayer;
}

/**
 * Apply a concrete AI move with per-step phase validation (#12).
 * Any failed step falls back to passTurn — never silently stalls.
 */
export function applyAIMoveSteps(
  state: FabADiffyState,
  move: AIMove
): FabADiffyState {
  let currentState = selectBar1(state, move.bar1Id);
  if (currentState.phase !== 'selectingBar2') {
    console.error('AI: selectBar1 failed', { move, phase: currentState.phase });
    return passTurn(state);
  }

  currentState = selectBar2(currentState, move.bar2Id);
  if (currentState.phase !== 'selectingOperation') {
    console.error('AI: selectBar2 failed', { move, phase: currentState.phase });
    return passTurn(state);
  }

  currentState = selectOperation(currentState, move.operation);
  if (currentState.phase !== 'confirmingMove') {
    console.error('AI: selectOperation failed', {
      move,
      phase: currentState.phase,
    });
    return passTurn(state);
  }

  currentState = executeMove(currentState, move.answerId);
  if (currentState.phase === 'confirmingMove') {
    console.error('AI: executeMove failed', {
      move,
      phase: currentState.phase,
    });
    return passTurn(state);
  }

  return currentState;
}

/**
 * Execute a complete AI turn with per-step phase validation (#12).
 */
export function executeAITurn(
  state: FabADiffyState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium',
  options: AISearchOptions = {}
): FabADiffyState {
  const move = getAIMove(state, aiPlayer, difficulty, options);

  if (!move) {
    return passTurn(state);
  }

  return applyAIMoveSteps(state, move);
}
