/**
 * State round-trip fuzz shard — queens-guards, primary play seed (q-mp-1108).
 * Split from state-roundtrip-fuzz.test.ts so the expensive AI playout can run
 * in parallel with seed-B and the other-games shard.
 */
import { describe, it } from 'vitest';

import {
  FUZZ_PLAY_SEED,
  adapterById,
  runRoundTripFuzz,
} from './helpers/state-roundtrip-fuzz-run';

describe('State round-trip fuzz (queens-guards seed A)', () => {
  it('queens-guards seed A: random legal play → serialize → deserialize preserves state, moves, AI', () => {
    runRoundTripFuzz(adapterById('queens-guards'), FUZZ_PLAY_SEED);
  }, 120_000);
});
