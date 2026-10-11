/**
 * State round-trip fuzz shard — queens-guards, primary play seed, late final moves
 * (q-mp-1343). Fast-forwards through mid-split then asserts mid+1 through end
 * (final AI + structuredClone). Pair with *-queens-a.test.ts / *-a2 for full
 * seed-A coverage. Leave seed-B (q-mp-1325) alone.
 */
import { describe, it } from 'vitest';

import {
  FUZZ_PLAY_SEED,
  QUEENS_SEED_A_MID_SPLIT_MOVE,
  adapterById,
  runRoundTripFuzz,
} from './helpers/state-roundtrip-fuzz-run';

describe('State round-trip fuzz (queens-guards seed A late final)', () => {
  it('queens-guards seed A late final: serialize / legal / AI after mid + final', () => {
    runRoundTripFuzz(adapterById('queens-guards'), FUZZ_PLAY_SEED, {
      assertFromMove: QUEENS_SEED_A_MID_SPLIT_MOVE + 1,
      assertInitial: false,
      assertFinal: true,
    });
  }, 120_000);
});
