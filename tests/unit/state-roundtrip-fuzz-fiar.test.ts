/**
 * State round-trip fuzz shard — fiar both play seeds (q-mp-1368).
 * Split from state-roundtrip-fuzz-games.test.ts so the next-heaviest remaining
 * non-queens/non-fab case (~490ms) can run in parallel; coverage identical.
 */
import { describe, it } from 'vitest';

import {
  adapterById,
  runRoundTripFuzzBothSeeds,
} from './helpers/state-roundtrip-fuzz-run';

describe('State round-trip fuzz (fiar)', () => {
  it('fiar: random legal play → serialize → deserialize preserves state, moves, AI', () => {
    runRoundTripFuzzBothSeeds(adapterById('fiar'));
  }, 120_000);
});
