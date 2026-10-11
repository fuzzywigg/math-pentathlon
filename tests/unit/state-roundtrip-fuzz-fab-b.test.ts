/**
 * State round-trip fuzz shard — fab-a-diffy second play seed (q-mp-1367).
 * Pair with *-fab.test.ts for full both-seed coverage (identical to pre-1367
 * runRoundTripFuzzBothSeeds). Leave games file and queens shards alone.
 */
import { describe, it } from 'vitest';

import {
  FUZZ_PLAY_SEED_B,
  adapterById,
  runRoundTripFuzz,
} from './helpers/state-roundtrip-fuzz-run';

describe('State round-trip fuzz (fab-a-diffy seed B)', () => {
  it('fab-a-diffy seed B: random legal play → serialize → deserialize preserves state, moves, AI', () => {
    runRoundTripFuzz(adapterById('fab-a-diffy'), FUZZ_PLAY_SEED_B);
  }, 120_000);
});
