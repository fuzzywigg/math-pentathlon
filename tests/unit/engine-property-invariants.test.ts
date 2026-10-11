/**
 * Property-style / randomized invariant tests for every rules engine.
 *
 * Stacked on the integration tip. Tests only — reuses GameFuzzAdapter,
 * engine-invariants-helpers (mulberry32), and undo-audit serializeState.
 * No fast-check. Deterministic seeds for CI reproducibility.
 *
 * Invariants (all 20 games unless noted):
 * - legal-move generation: sampled legal moves apply without throw + round-trip
 * - apply keeps state valid (seat, normalize idempotent)
 * - turn order: seat changes flip to opponent; hex strictly alternates
 * - undo: prefix replay restores snapshots exactly
 * - game-over: isOver ⇒ empty legalMoves; stable under roundTrip
 * - serialization: adapter.roundTrip preserves normalize(state)
 *
 * q-mp-1351: seeded playouts + secondary validators live in game-group shards
 * (`engine-property-invariants-{heavy,mid,light}.test.ts`). This file keeps the
 * registry / seat-policy docs and asserts the shards partition all games.
 */
import { describe, it, expect } from 'vitest';

import { ALL_GAME_ADAPTERS } from './helpers/state-roundtrip-games';
import {
  SAME_SEAT_OK_GAMES,
  STRICT_ALTERNATE_GAMES,
} from './helpers/engine-property-invariants';
import {
  ENGINE_PROPERTY_ALL_GROUP_IDS,
  ENGINE_PROPERTY_HEAVY_IDS,
  ENGINE_PROPERTY_LIGHT_IDS,
  ENGINE_PROPERTY_MID_IDS,
} from './helpers/engine-property-invariants-groups';

describe('Engine property invariants — registry', () => {
  it('covers all 20 registered games', () => {
    expect(ALL_GAME_ADAPTERS.map((a) => a.id).sort()).toEqual(
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

  it('documents seat-policy sets', () => {
    expect(STRICT_ALTERNATE_GAMES.has('hex')).toBe(true);
    expect(SAME_SEAT_OK_GAMES.has('calla')).toBe(true);
    expect(SAME_SEAT_OK_GAMES.has('kings-quadraphages')).toBe(true);
  });

  it('game-group shards partition all registered games', () => {
    const registered = ALL_GAME_ADAPTERS.map((a) => a.id).sort();
    expect([...ENGINE_PROPERTY_ALL_GROUP_IDS].sort()).toEqual(registered);
    expect(new Set(ENGINE_PROPERTY_ALL_GROUP_IDS).size).toBe(
      ENGINE_PROPERTY_ALL_GROUP_IDS.length
    );
    expect(ENGINE_PROPERTY_HEAVY_IDS.length).toBeGreaterThan(0);
    expect(ENGINE_PROPERTY_MID_IDS.length).toBeGreaterThan(0);
    expect(ENGINE_PROPERTY_LIGHT_IDS.length).toBeGreaterThan(0);
  });
});
