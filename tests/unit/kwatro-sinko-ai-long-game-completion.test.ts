/**
 * Regression: Kwatro-Sinko AI must finish long seeded games without thrashing
 * past the playtest 90-turn / tablet harness budget.
 *
 * Root cause guarded here: prior heuristics left chips on numbered home rows and
 * oscillated center positions for hundreds of plies (playtest recheck 2026-10-07:
 * Easy/Med/Hard timed out at 90 turns on Blue). Win / scoring rules are untouched.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  createInitialState,
  getValidMoves,
  selectChip,
  moveChip,
  hasValidMoves,
  passTurn,
} from '../../src/games/kwatro-sinko/rules';
import {
  executeAITurn,
  getAIMove,
  AI_THINK_BUDGET_MS,
  type AIDifficulty,
} from '../../src/games/kwatro-sinko/ai';
import type { KwaState, Player } from '../../src/games/kwatro-sinko/types';

afterEach(() => {
  vi.restoreAllMocks();
});

const DIFFICULTIES: AIDifficulty[] = ['easy', 'medium', 'hard'];
const SEEDS = [1, 7, 42, 99, 12345, 777, 9999];
/** Playtest harness stopped at 90 human turns; AI-vs-AI gets 2× that as a ceiling. */
const MAX_PLIES = 180;
/** Wall-clock bound for a full seeded game on CI (AI decision work only). */
const GAME_WALL_MS = 5_000;
/** Per-think budget — well under the 1.5s tablet profile aim. */
const THINK_MS_LIMIT = 100;

function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function withSeededRandom<T>(seed: number, fn: () => T): T {
  const rnd = mulberry32(seed);
  const original = Math.random;
  Math.random = rnd;
  try {
    return fn();
  } finally {
    Math.random = original;
  }
}

function playAiVsAi(
  difficulty: AIDifficulty,
  seed: number
): {
  plies: number;
  winner: Player | null;
  phase: KwaState['phase'];
  maxThinkMs: number;
  wallMs: number;
} {
  return withSeededRandom(seed, () => {
    let state = createInitialState();
    let maxThinkMs = 0;
    const wallStart = performance.now();
    for (let ply = 0; ply < MAX_PLIES; ply++) {
      if (state.phase === 'gameOver') {
        return {
          plies: ply,
          winner: state.winner,
          phase: state.phase,
          maxThinkMs,
          wallMs: performance.now() - wallStart,
        };
      }
      const seat = state.currentPlayer;
      const t0 = performance.now();
      state = executeAITurn(state, seat, difficulty);
      maxThinkMs = Math.max(maxThinkMs, performance.now() - t0);
    }
    return {
      plies: MAX_PLIES,
      winner: state.winner,
      phase: state.phase,
      maxThinkMs,
      wallMs: performance.now() - wallStart,
    };
  });
}

/**
 * Human-vs-AI stand-in: Blue (player1) picks any legal evacuate-first move;
 * Red (player2) uses the real AI at the given difficulty.
 */
function humanEvacuateMove(state: KwaState): {
  chipId: string;
  nodeId: string;
} | null {
  if (state.currentPlayer !== 'player1') return null;
  if (!hasValidMoves(state)) return null;

  const owned = [...state.chips.values()].filter((c) => c.owner === 'player1');
  // Prefer chips still on numbered spaces moving onto non-numbered.
  for (const chip of owned) {
    const from = chip.position ? state.nodes.get(chip.position) : null;
    if (!from?.isNumbered) continue;
    for (const nodeId of getValidMoves(state, chip.id)) {
      const to = state.nodes.get(nodeId);
      if (to && !to.isNumbered) return { chipId: chip.id, nodeId };
    }
  }
  for (const chip of owned) {
    const moves = getValidMoves(state, chip.id);
    if (moves.length > 0) return { chipId: chip.id, nodeId: moves[0] };
  }
  return null;
}

function playHumanVsAi(
  difficulty: AIDifficulty,
  seed: number
): {
  plies: number;
  winner: Player | null;
  phase: KwaState['phase'];
  maxAiThinkMs: number;
  wallMs: number;
} {
  return withSeededRandom(seed, () => {
    let state = createInitialState();
    let maxAiThinkMs = 0;
    const wallStart = performance.now();
    for (let ply = 0; ply < MAX_PLIES; ply++) {
      if (state.phase === 'gameOver') {
        return {
          plies: ply,
          winner: state.winner,
          phase: state.phase,
          maxAiThinkMs,
          wallMs: performance.now() - wallStart,
        };
      }
      if (state.currentPlayer === 'player1') {
        const move = humanEvacuateMove(state);
        if (!move) {
          state = passTurn(state);
        } else {
          state = selectChip(state, move.chipId);
          state = moveChip(state, move.nodeId);
        }
      } else {
        const t0 = performance.now();
        state = executeAITurn(state, 'player2', difficulty);
        maxAiThinkMs = Math.max(maxAiThinkMs, performance.now() - t0);
      }
    }
    return {
      plies: MAX_PLIES,
      winner: state.winner,
      phase: state.phase,
      maxAiThinkMs,
      wallMs: performance.now() - wallStart,
    };
  });
}

describe('Kwatro-Sinko AI long-game completion (seeded)', () => {
  it('exposes a tablet think budget well under 1.5s', () => {
    expect(AI_THINK_BUDGET_MS).toBeLessThanOrEqual(100);
    expect(AI_THINK_BUDGET_MS).toBeLessThan(1500);
  });

  it.each(DIFFICULTIES)(
    'AI-vs-AI %s finishes every seed with a winner under ply/time bounds',
    (difficulty) => {
      for (const seed of SEEDS) {
        const result = playAiVsAi(difficulty, seed);
        expect(
          result.phase,
          `${difficulty}/${seed} must reach gameOver (got ${result.phase} after ${result.plies} plies)`
        ).toBe('gameOver');
        expect(result.winner).not.toBeNull();
        expect(result.plies).toBeLessThan(MAX_PLIES);
        // Historical thrash exceeded 90 human turns; require a decisive finish.
        expect(result.plies).toBeLessThanOrEqual(90);
        expect(result.maxThinkMs).toBeLessThan(THINK_MS_LIMIT);
        expect(result.wallMs).toBeLessThan(GAME_WALL_MS);
      }
    }
  );

  it.each(DIFFICULTIES)(
    'human-vs-AI %s (evacuate human + AI Red) reaches end screen under bounds',
    (difficulty) => {
      for (const seed of SEEDS) {
        const result = playHumanVsAi(difficulty, seed);
        expect(
          result.phase,
          `${difficulty}/${seed} HvA must reach gameOver (got ${result.phase} after ${result.plies})`
        ).toBe('gameOver');
        expect(result.winner).not.toBeNull();
        expect(result.plies).toBeLessThanOrEqual(90);
        expect(result.maxAiThinkMs).toBeLessThan(THINK_MS_LIMIT);
        expect(result.wallMs).toBeLessThan(GAME_WALL_MS);
      }
    }
  );

  it('Hard AI thinks stay under budget across a mid-game seed sample', () => {
    withSeededRandom(42, () => {
      let state = createInitialState();
      // Advance a few plies then sample pure getAIMove cost.
      for (let i = 0; i < 6; i++) {
        if (state.phase === 'gameOver') break;
        state = executeAITurn(state, state.currentPlayer, 'hard');
      }
      if (state.phase === 'gameOver') return;
      const times: number[] = [];
      for (let i = 0; i < 30; i++) {
        const t0 = performance.now();
        const move = getAIMove(state, state.currentPlayer, 'hard');
        times.push(performance.now() - t0);
        expect(move === null || typeof move.chipId === 'string').toBe(true);
      }
      expect(Math.max(...times)).toBeLessThan(THINK_MS_LIMIT);
    });
  });
});
