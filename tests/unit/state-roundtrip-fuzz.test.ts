/**
 * Property / fuzz tests: play N random legal moves, serialize → deserialize,
 * assert deep equality, identical legal-move sets, and identical AI choice
 * under a fixed seed.
 *
 * Serialization path:
 * - kings-quadraphages: dedicated serializeGameState / deserializeGameState
 * - all other games: Map/Set-aware JSON (localStorage-shaped mid-game save stand-in)
 *
 * Move caps: DEFAULT_MAX_MOVES for most games; LOOP_PRONE_MAX_MOVES for
 * Kwatro-Sinko and FIAR (movement phases can run indefinitely).
 */
import { describe, it, expect } from 'vitest';

import {
  ALL_GAME_ADAPTERS,
  type GameFuzzAdapter,
} from './helpers/state-roundtrip-games';
import {
  FUZZ_PLAY_SEED,
  AI_COMPARE_SEED,
  canonMoves,
  createRng,
  pickOne,
  structuredRoundTrip,
  withSeededMathRandom,
} from './helpers/state-roundtrip';

function runRoundTripFuzz(adapter: GameFuzzAdapter, playSeed: number): void {
  const rng = createRng(playSeed);

  const state0 = withSeededMathRandom(playSeed, () => adapter.create());
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
    state = withSeededMathRandom(playSeed + i + 1, () =>
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
      expect(
        aiRestored,
        `${adapter.id}: AI after move ${movesPlayed}`
      ).toEqual(aiOriginal);
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

describe('State round-trip fuzz (all games)', () => {
  it('registry covers every available game id', () => {
    const ids = ALL_GAME_ADAPTERS.map((a) => a.id).sort();
    expect(ids).toEqual(
      [
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
      ].sort()
    );
  });

  it.each(ALL_GAME_ADAPTERS.map((a) => [a.id, a] as const))(
    '%s: random legal play → serialize → deserialize preserves state, moves, AI',
    (id, adapter) => {
      void id;
      runRoundTripFuzz(adapter, FUZZ_PLAY_SEED);
      // Second seed to widen coverage without exploding runtime
      runRoundTripFuzz(adapter, FUZZ_PLAY_SEED ^ 0x9e3779b9);
    },
    120_000
  );

  it('AI compare seed is stable across helper exports', () => {
    expect(AI_COMPARE_SEED).toBe(42);
  });
});
