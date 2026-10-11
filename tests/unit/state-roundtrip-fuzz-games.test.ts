/**
 * State round-trip fuzz shard — non-queens games except fab-a-diffy (q-mp-1108 /
 * q-mp-1344). Each game still runs both historical play seeds (identical coverage).
 * fab-a-diffy lives in state-roundtrip-fuzz-fab.test.ts.
 */
import { describe, it } from 'vitest';

import {
  ALL_GAME_ADAPTERS,
  runRoundTripFuzzBothSeeds,
} from './helpers/state-roundtrip-fuzz-run';

const NON_QUEENS_NON_FAB = ALL_GAME_ADAPTERS.filter(
  (a) => a.id !== 'queens-guards' && a.id !== 'fab-a-diffy'
);

describe('State round-trip fuzz (non-queens games)', () => {
  it.each(NON_QUEENS_NON_FAB.map((a) => [a.id, a] as const))(
    '%s: random legal play → serialize → deserialize preserves state, moves, AI',
    (id, adapter) => {
      void id;
      runRoundTripFuzzBothSeeds(adapter);
    },
    120_000
  );
});
