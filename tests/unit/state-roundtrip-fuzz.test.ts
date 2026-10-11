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
 *
 * q-mp-1108: registry + seed pin stay here; per-game playouts live in sibling
 * shards so Vitest can parallelize (queens AI dominates wall when serialized).
 * Sibling shards:
 * - state-roundtrip-fuzz-queens-a.test.ts / -queens-a2.test.ts (seed A early/late)
 * - state-roundtrip-fuzz-queens-b.test.ts / -queens-b2.test.ts (seed B early/late)
 * - state-roundtrip-fuzz-games.test.ts (all other games, both seeds)
 */
import { describe, it, expect } from 'vitest';

import {
  AI_COMPARE_SEED,
  ALL_GAME_ADAPTERS,
  REGISTERED_GAME_IDS,
} from './helpers/state-roundtrip-fuzz-run';

describe('State round-trip fuzz (all games)', () => {
  it('registry covers every available game id', () => {
    const ids = ALL_GAME_ADAPTERS.map((a) => a.id).sort();
    expect(ids).toEqual([...REGISTERED_GAME_IDS].sort());
  });

  it('AI compare seed is stable across helper exports', () => {
    expect(AI_COMPARE_SEED).toBe(42);
  });
});
