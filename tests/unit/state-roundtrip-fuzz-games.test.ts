/**
 * State round-trip fuzz shard — remaining non-queens games after fab / pent /
 * fiar / juggle extraction (q-mp-1108 / q-mp-1344 / q-mp-1368). Each game still
 * runs both historical play seeds (identical coverage).
 * fab-a-diffy → state-roundtrip-fuzz-fab.test.ts
 * pent-em-in → state-roundtrip-fuzz-pent.test.ts
 * fiar → state-roundtrip-fuzz-fiar.test.ts
 * juggle → state-roundtrip-fuzz-juggle.test.ts
 */
import { describe, it } from 'vitest';

import {
  ALL_GAME_ADAPTERS,
  runRoundTripFuzzBothSeeds,
} from './helpers/state-roundtrip-fuzz-run';

const SHARDED_OUT = new Set([
  'queens-guards',
  'fab-a-diffy',
  'pent-em-in',
  'fiar',
  'juggle',
]);

const REMAINING_GAMES = ALL_GAME_ADAPTERS.filter((a) => !SHARDED_OUT.has(a.id));

describe('State round-trip fuzz (non-queens games)', () => {
  it.each(REMAINING_GAMES.map((a) => [a.id, a] as const))(
    '%s: random legal play → serialize → deserialize preserves state, moves, AI',
    (id, adapter) => {
      void id;
      runRoundTripFuzzBothSeeds(adapter);
    },
    120_000
  );
});
