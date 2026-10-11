/**
 * State round-trip fuzz shard — fab-a-diffy primary play seed (q-mp-1344 /
 * q-mp-1367). Seed-B lives in *-fab-b.test.ts so both historical seeds can
 * parallelize without dropping checkpoints. Leave games file and queens
 * shards alone.
 */
import { describe, it } from 'vitest';

import {
  FUZZ_PLAY_SEED,
  adapterById,
  runRoundTripFuzz,
} from './helpers/state-roundtrip-fuzz-run';

describe('State round-trip fuzz (fab-a-diffy seed A)', () => {
  it('fab-a-diffy seed A: random legal play → serialize → deserialize preserves state, moves, AI', () => {
    runRoundTripFuzz(adapterById('fab-a-diffy'), FUZZ_PLAY_SEED);
  }, 120_000);
});
