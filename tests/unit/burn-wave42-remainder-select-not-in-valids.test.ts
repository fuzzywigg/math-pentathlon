/** Wave 42 — Remainder selectIsland rejects ids not in valids. Tests-only. */
import { describe, it, expect } from 'vitest';

import { selectIsland } from '../../src/games/remainder-islands/rules';
import { createInitialState } from '../../src/games/remainder-islands/types';

describe('Wave 42 remainder — select not in valids', () => {
  it('id absent from validIslands → identity', () => {
    const base = createInitialState();
    const allowed = base.islands[0].id;
    const forbidden = base.islands[1].id;
    const state = {
      ...base,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 4, die2: 4, total: 8 },
      validIslands: [allowed],
    };
    expect(selectIsland(state, forbidden)).toBe(state);
  });

  it('empty validIslands rejects any real island id', () => {
    const base = createInitialState();
    const state = {
      ...base,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 1, die2: 2, total: 3 },
      validIslands: [] as string[],
    };
    expect(selectIsland(state, base.islands[0].id)).toBe(state);
  });

  it('ghost id not in valids → identity', () => {
    const base = createInitialState();
    const state = {
      ...base,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 2, die2: 5, total: 7 },
      validIslands: [base.islands[0].id],
    };
    expect(selectIsland(state, 'ghost-island')).toBe(state);
  });

  it('valid id succeeds and leaves invalid path unused', () => {
    const base = createInitialState();
    const island = base.islands[0];
    const state = {
      ...base,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 3, die2: 3, total: 6 },
      validIslands: [island.id],
    };
    const next = selectIsland(state, island.id);
    expect(next).not.toBe(state);
    expect(next.phase).toBe('rolling');
    // Rejected id still identity
    expect(selectIsland(state, base.islands[2].id)).toBe(state);
  });
});
