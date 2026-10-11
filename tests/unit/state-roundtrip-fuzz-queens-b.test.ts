/**
 * State round-trip fuzz shard — queens-guards, second play seed, early moves
 * (q-mp-1108 / q-mp-1325). Seed-B late moves live in *-queens-b2.test.ts so the
 * ~6s AI-heavy case can parallelize without dropping checkpoints.
 * Leave seed-A (q-mp-1291) alone.
 */
import { describe, it } from 'vitest';

import {
  FUZZ_PLAY_SEED_B,
  QUEENS_SEED_B_SPLIT_MOVE,
  adapterById,
  runRoundTripFuzz,
} from './helpers/state-roundtrip-fuzz-run';

describe('State round-trip fuzz (queens-guards seed B early)', () => {
  it('queens-guards seed B early: serialize / legal / AI through split move', () => {
    runRoundTripFuzz(adapterById('queens-guards'), FUZZ_PLAY_SEED_B, {
      assertToMove: QUEENS_SEED_B_SPLIT_MOVE,
      assertFinal: false,
    });
  }, 120_000);
});
