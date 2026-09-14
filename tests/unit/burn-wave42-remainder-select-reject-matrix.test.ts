/**
 * Wave 42 — Remainder Islands selectIsland reject matrix.
 * Beyond wave41 score/claim success. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { selectIsland } from '../../src/games/remainder-islands/rules';

describe('Wave 42 remainder — selectIsland rejects', () => {
  it('identity when phase is rolling or gameOver', () => {
    const rolling = createInitialState();
    expect(selectIsland(rolling, 'island-0-0')).toBe(rolling);

    const over = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player2' as const,
      currentRoll: { die1: 1, die2: 1, total: 2 },
      validIslands: ['island-0-0'],
    };
    expect(selectIsland(over, 'island-0-0')).toBe(over);
  });

  it('identity when currentRoll null even if selectIsland phase', () => {
    const state = {
      ...createInitialState(),
      phase: 'selectIsland' as const,
      currentRoll: null,
      validIslands: ['island-0-0'],
    };
    expect(selectIsland(state, 'island-0-0')).toBe(state);
  });

  it('identity for id not in validIslands', () => {
    const base = createInitialState();
    const state = {
      ...base,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 3, die2: 4, total: 7 },
      validIslands: [base.islands[0].id],
    };
    expect(selectIsland(state, base.islands[1].id)).toBe(state);
    expect(selectIsland(state, 'nope')).toBe(state);
  });
});
