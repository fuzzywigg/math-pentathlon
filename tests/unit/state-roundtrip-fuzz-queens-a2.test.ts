/**
 * State round-trip fuzz shard — queens-guards, primary play seed, late moves
 * (q-mp-1291). Fast-forwards the seed-A prefix then asserts from split+1 through
 * end (final AI + structuredClone). Pair with *-queens-a.test.ts for full coverage.
 */
import { describe, it } from 'vitest';

import {
  FUZZ_PLAY_SEED,
  QUEENS_SEED_A_SPLIT_MOVE,
  adapterById,
  runRoundTripFuzz,
} from './helpers/state-roundtrip-fuzz-run';

describe('State round-trip fuzz (queens-guards seed A late)', () => {
  it('queens-guards seed A late: serialize / legal / AI after split + final', () => {
    runRoundTripFuzz(adapterById('queens-guards'), FUZZ_PLAY_SEED, {
      assertFromMove: QUEENS_SEED_A_SPLIT_MOVE + 1,
      assertInitial: false,
      assertFinal: true,
    });
  }, 120_000);
});
