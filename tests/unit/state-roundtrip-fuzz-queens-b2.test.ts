/**
 * State round-trip fuzz shard — queens-guards, second play seed, late moves
 * (q-mp-1325). Fast-forwards the seed-B prefix then asserts from split+1 through
 * end (final AI + structuredClone). Pair with *-queens-b.test.ts for full coverage.
 * Leave seed-A (q-mp-1291) alone.
 */
import { describe, it } from 'vitest';

import {
  FUZZ_PLAY_SEED_B,
  QUEENS_SEED_B_SPLIT_MOVE,
  adapterById,
  runRoundTripFuzz,
} from './helpers/state-roundtrip-fuzz-run';

describe('State round-trip fuzz (queens-guards seed B late)', () => {
  it('queens-guards seed B late: serialize / legal / AI after split + final', () => {
    runRoundTripFuzz(adapterById('queens-guards'), FUZZ_PLAY_SEED_B, {
      assertFromMove: QUEENS_SEED_B_SPLIT_MOVE + 1,
      assertInitial: false,
      assertFinal: true,
    });
  }, 120_000);
});
