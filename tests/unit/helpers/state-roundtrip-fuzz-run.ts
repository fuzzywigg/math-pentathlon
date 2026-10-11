/**
 * Shared runner for state round-trip fuzz shards (q-mp-1108).
 * Same seeds, move caps, and assertion schedule as the pre-shard suite.
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

export const FUZZ_PLAY_SEEDS = [FUZZ_PLAY_SEED, FUZZ_PLAY_SEED_B] as const;

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

export function adapterById(id: string): GameFuzzAdapter {
  const adapter = ALL_GAME_ADAPTERS.find((a) => a.id === id);
  if (!adapter) {
    throw new Error(`state-roundtrip fuzz: missing adapter ${id}`);
  }
  return adapter;
}

export function runRoundTripFuzz(
  adapter: GameFuzzAdapter,
  playSeed: number
): void {
  const rng = createRng(playSeed);

  const state0 = withSeededRandom(playSeed, () => adapter.create());
  let state = state0;

  // Initial snapshot
  {
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
  }

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

  expect(movesPlayed).toBeGreaterThanOrEqual(0);
}

/** Both historical seeds for one adapter (identical coverage to pre-shard suite). */
export function runRoundTripFuzzBothSeeds(adapter: GameFuzzAdapter): void {
  for (const seed of FUZZ_PLAY_SEEDS) {
    runRoundTripFuzz(adapter, seed);
  }
}
