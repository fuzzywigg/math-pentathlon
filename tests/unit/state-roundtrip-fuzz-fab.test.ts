/**
 * State round-trip fuzz shard — fab-a-diffy both play seeds (q-mp-1344).
 * Split from state-roundtrip-fuzz-games.test.ts so the heaviest non-queens
 * case (~1.1s) can run in parallel; coverage is identical (both seeds).
 */
import { describe, it } from 'vitest';

import {
  adapterById,
  runRoundTripFuzzBothSeeds,
} from './helpers/state-roundtrip-fuzz-run';

describe('State round-trip fuzz (fab-a-diffy)', () => {
  it('fab-a-diffy: random legal play → serialize → deserialize preserves state, moves, AI', () => {
    runRoundTripFuzzBothSeeds(adapterById('fab-a-diffy'));
  }, 120_000);
});
