/**
 * State round-trip fuzz shard — queens-guards, second play seed (q-mp-1108).
 * Split from state-roundtrip-fuzz.test.ts so the expensive AI playout can run
 * in parallel with seed-A and the other-games shard.
 */
import { describe, it } from 'vitest';

import {
  FUZZ_PLAY_SEED_B,
  adapterById,
  runRoundTripFuzz,
} from './helpers/state-roundtrip-fuzz-run';

describe('State round-trip fuzz (queens-guards seed B)', () => {
  it('queens-guards seed B: random legal play → serialize → deserialize preserves state, moves, AI', () => {
    runRoundTripFuzz(adapterById('queens-guards'), FUZZ_PLAY_SEED_B);
  }, 120_000);
});
