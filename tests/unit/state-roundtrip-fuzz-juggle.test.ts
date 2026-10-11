/**
 * State round-trip fuzz shard — juggle both play seeds (q-mp-1368).
 * Split from state-roundtrip-fuzz-games.test.ts so the third-heaviest remaining
 * non-queens/non-fab case (~420ms) can run in parallel; coverage identical.
 */
import { describe, it } from 'vitest';

import {
  adapterById,
  runRoundTripFuzzBothSeeds,
} from './helpers/state-roundtrip-fuzz-run';

describe('State round-trip fuzz (juggle)', () => {
  it('juggle: random legal play → serialize → deserialize preserves state, moves, AI', () => {
    runRoundTripFuzzBothSeeds(adapterById('juggle'));
  }, 120_000);
});
