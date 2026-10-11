/**
 * State round-trip fuzz shard — queens-guards, primary play seed, late mid moves
 * (q-mp-1291 / q-mp-1343). Fast-forwards the seed-A prefix then asserts from
 * early-split+1 through mid-split. Final late moves + end checkpoints live in
 * *-queens-a3.test.ts. Pair with *-queens-a.test.ts / *-a3 for full seed-A coverage.
 */
import { describe, it } from 'vitest';

import {
  FUZZ_PLAY_SEED,
  QUEENS_SEED_A_MID_SPLIT_MOVE,
  QUEENS_SEED_A_SPLIT_MOVE,
  adapterById,
  runRoundTripFuzz,
} from './helpers/state-roundtrip-fuzz-run';

describe('State round-trip fuzz (queens-guards seed A late mid)', () => {
  it('queens-guards seed A late mid: serialize / legal / AI through mid split', () => {
    runRoundTripFuzz(adapterById('queens-guards'), FUZZ_PLAY_SEED, {
      assertFromMove: QUEENS_SEED_A_SPLIT_MOVE + 1,
      assertToMove: QUEENS_SEED_A_MID_SPLIT_MOVE,
      assertInitial: false,
      assertFinal: false,
    });
  }, 120_000);
});
