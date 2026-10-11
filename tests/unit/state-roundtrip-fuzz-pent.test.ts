/**
 * State round-trip fuzz shard — pent-em-in both play seeds (q-mp-1368).
 * Split from state-roundtrip-fuzz-games.test.ts so the heaviest remaining
 * non-queens/non-fab case (~560ms) can run in parallel; coverage identical.
 */
import { describe, it } from 'vitest';

import {
  adapterById,
  runRoundTripFuzzBothSeeds,
} from './helpers/state-roundtrip-fuzz-run';

describe('State round-trip fuzz (pent-em-in)', () => {
  it('pent-em-in: random legal play → serialize → deserialize preserves state, moves, AI', () => {
    runRoundTripFuzzBothSeeds(adapterById('pent-em-in'));
  }, 120_000);
});
