/**
 * State round-trip fuzz shard — all games except queens-guards (q-mp-1108).
 * Each game still runs both historical play seeds (identical coverage).
 */
import { describe, it } from 'vitest';

import {
  ALL_GAME_ADAPTERS,
  runRoundTripFuzzBothSeeds,
} from './helpers/state-roundtrip-fuzz-run';

const NON_QUEENS = ALL_GAME_ADAPTERS.filter((a) => a.id !== 'queens-guards');

describe('State round-trip fuzz (non-queens games)', () => {
  it.each(NON_QUEENS.map((a) => [a.id, a] as const))(
    '%s: random legal play → serialize → deserialize preserves state, moves, AI',
    (id, adapter) => {
      void id;
      runRoundTripFuzzBothSeeds(adapter);
    },
    120_000
  );
});
