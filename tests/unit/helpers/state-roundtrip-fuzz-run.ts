/**
 * Shared runner for state round-trip fuzz shards
 * (q-mp-1108 / q-mp-1291 / q-mp-1325 / q-mp-1343 / q-mp-1367).
 * Same seeds, move caps, and assertion schedule as the pre-shard suite.
 * Optional assert-move windows let expensive queens seed-A / seed-B work split
 * across files without dropping serialize / AI checkpoints when all shards run.
 * Fab seed-A / seed-B live in separate files (same both-seed coverage).
 */
import { expect } from 'vitest';

import {
  ALL_GAME_ADAPTERS,
  type GameFuzzAdapter,
} from './state-roundtrip-games';
import {
  AI_COMPARE_SEED,
  FUZZ_PLAY_SEED,
  canonMoves,
  createRng,
  pickOne,
  structuredRoundTrip,
  withSeededRandom,
} from './state-roundtrip';

/** Second play seed (widens coverage without exploding runtime). */
export const FUZZ_PLAY_SEED_B = FUZZ_PLAY_SEED ^ 0x9e3779b9;

/**
 * Split point for queens-guards seed-A early/late shards (q-mp-1291).
 * Early asserts moves 1..SPLIT; late mid/final shards (q-mp-1343) cover
 * SPLIT+1..end together. Same seed, move cap, and every-5th AI schedule.
 */
export const QUEENS_SEED_A_SPLIT_MOVE = 14;

/**
 * Mid/final split inside seed-A late window (q-mp-1343).
 * Mid asserts SPLIT+1..MID; final asserts MID+1..end + final AI/clone.
 * Leave QUEENS_SEED_A_SPLIT_MOVE and seed-B splits alone.
 */
export const QUEENS_SEED_A_MID_SPLIT_MOVE = 21;

/**
 * Split point for queens-guards seed-B early/late shards (q-mp-1325).
 * Same windowing contract as seed-A; leave seed-A files / split alone.
 */
export const QUEENS_SEED_B_SPLIT_MOVE = 14;

const FUZZ_PLAY_SEEDS = [FUZZ_PLAY_SEED, FUZZ_PLAY_SEED_B] as const;

export { AI_COMPARE_SEED, FUZZ_PLAY_SEED, ALL_GAME_ADAPTERS };
export type { GameFuzzAdapter };

/** Sorted ids every registry / shard suite must cover together. */
export const REGISTERED_GAME_IDS = [
  'calla',
  'contig-60',
  'fab-a-diffy',
  'fiar',
  'frac-fact',
  'fraction-pinball',
  'hex',
  'hex-a-gone',
  'juggle',
  'kings-quadraphages',
  'kwatro-sinko',
  'par-55',
  'pent-em-in',
  'prime-gold',
  'queens-guards',
  'ramrod',
  'remainder-islands',
  'star-track',
  'stars-bars',
  'sum-dominoes',
] as const;

/** Optional move window for parallel shards (inclusive 1-based move numbers). */
export type RoundTripFuzzOptions = {
  /** First move to fully assert (serialize / legal / AI). Default 1. */
  assertFromMove?: number;
  /** Last move to fully assert. Default: no upper bound. */
  assertToMove?: number;
  /** Initial empty-board snapshot asserts. Default: true when asserting from ≤1. */
  assertInitial?: boolean;
  /** Final AI + structuredClone asserts. Default: true when no assertToMove. */
  assertFinal?: boolean;
};

export function adapterById(id: string): GameFuzzAdapter {
  const adapter = ALL_GAME_ADAPTERS.find((a) => a.id === id);
  if (!adapter) {
    throw new Error(`state-roundtrip fuzz: missing adapter ${id}`);
  }
  return adapter;
}

export function runRoundTripFuzz(
  adapter: GameFuzzAdapter,
  playSeed: number,
  options: RoundTripFuzzOptions = {}
): void {
  const assertFromMove = options.assertFromMove ?? 1;
  const assertToMove = options.assertToMove ?? Number.POSITIVE_INFINITY;
  const assertInitial = options.assertInitial ?? assertFromMove <= 1;
  const assertFinal = options.assertFinal ?? !Number.isFinite(assertToMove);

  const rng = createRng(playSeed);

  const state0 = withSeededRandom(playSeed, () => adapter.create());
  let state = state0;

  // Initial snapshot
  if (assertInitial) {
    const restored = adapter.roundTrip(state);
    expect(adapter.normalize(restored)).toEqual(adapter.normalize(state));
    expect(canonMoves(adapter.legalMoves(restored))).toBe(
      canonMoves(adapter.legalMoves(state))
    );
  }

  let movesPlayed = 0;
  for (let i = 0; i < adapter.maxMoves; i++) {
    if (adapter.isOver(state)) break;

    const legal = adapter.legalMoves(state);
    if (legal.length === 0) break;

    const choice = pickOne(rng, legal);
    state = withSeededRandom(playSeed + i + 1, () =>
      adapter.apply(state, choice)
    );
    movesPlayed++;

    const inAssertWindow =
      movesPlayed >= assertFromMove && movesPlayed <= assertToMove;
    if (!inAssertWindow) {
      // Late shard: keep applying through the prefix; early shard never reaches here
      // once it breaks at assertToMove (below).
      continue;
    }

    const restored = adapter.roundTrip(state);
    expect(
      adapter.normalize(restored),
      `${adapter.id}: deep equality after move ${movesPlayed}`
    ).toEqual(adapter.normalize(state));

    expect(
      canonMoves(adapter.legalMoves(restored)),
      `${adapter.id}: legal moves after move ${movesPlayed}`
    ).toBe(canonMoves(adapter.legalMoves(state)));

    // AI search is expensive (Queens/FIAR/Hex); sample every 5th move + end.
    if (movesPlayed % 5 === 0) {
      const aiOriginal = adapter.aiChoice(state);
      const aiRestored = adapter.aiChoice(restored);
      expect(aiRestored, `${adapter.id}: AI after move ${movesPlayed}`).toEqual(
        aiOriginal
      );
    }

    // Early shard can stop once its assert window is done (same seed prefix).
    if (movesPlayed >= assertToMove && Number.isFinite(assertToMove)) break;
  }

  if (assertFinal) {
    // Final AI parity checkpoint (covers short playouts that never hit % 5)
    {
      const restored = adapter.roundTrip(state);
      const aiOriginal = adapter.aiChoice(state);
      const aiRestored = adapter.aiChoice(restored);
      expect(aiRestored, `${adapter.id}: AI at end`).toEqual(aiOriginal);
    }

    // structuredClone path must also preserve identity for Map/Set games
    const viaClone = structuredRoundTrip(state);
    expect(adapter.normalize(viaClone)).toEqual(adapter.normalize(state));
    expect(canonMoves(adapter.legalMoves(viaClone))).toBe(
      canonMoves(adapter.legalMoves(state))
    );
  }

  expect(movesPlayed).toBeGreaterThanOrEqual(0);
}

/** Both historical seeds for one adapter (identical coverage to pre-shard suite). */
export function runRoundTripFuzzBothSeeds(adapter: GameFuzzAdapter): void {
  for (const seed of FUZZ_PLAY_SEEDS) {
    runRoundTripFuzz(adapter, seed);
  }
}
