/**
 * State round-trip fuzz shard — queens-guards, primary play seed, early moves
 * (q-mp-1108 / q-mp-1291). Seed-A late mid/final moves live in *-queens-a2 /
 * *-queens-a3.test.ts (q-mp-1343) so the AI-heavy case can parallelize without
 * dropping checkpoints.
 */
import { describe, it } from 'vitest';

import {
  FUZZ_PLAY_SEED,
  QUEENS_SEED_A_SPLIT_MOVE,
  adapterById,
  runRoundTripFuzz,
} from './helpers/state-roundtrip-fuzz-run';

describe('State round-trip fuzz (queens-guards seed A early)', () => {
  it('queens-guards seed A early: serialize / legal / AI through split move', () => {
    runRoundTripFuzz(adapterById('queens-guards'), FUZZ_PLAY_SEED, {
      assertToMove: QUEENS_SEED_A_SPLIT_MOVE,
      assertFinal: false,
    });
  }, 120_000);
});
