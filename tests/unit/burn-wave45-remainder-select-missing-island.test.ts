/**
 * Wave 45 TOKENMAXX — Remainder selectIsland missing-row identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { selectIsland } from '../../src/games/remainder-islands/rules';

describe('Wave 45 remainder — select missing island', () => {
  it('identity when islandId listed valid but row deleted', () => {
    const base = createInitialState();
    const ghostId = base.islands[0].id;
    const state = {
      ...base,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 2, die2: 3, total: 5 },
      validIslands: [ghostId],
      islands: base.islands.slice(1),
    };
    expect(selectIsland(state, ghostId)).toBe(state);
  });
});
