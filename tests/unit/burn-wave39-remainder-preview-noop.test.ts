/**
 * Wave 39 — Remainder Islands previewDivision / selectIsland no-ops.
 * After wave 35 empty-valids. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  calculateDivision,
  selectIsland,
  previewDivision,
  setSelectedIsland,
  performRoll,
} from '../../src/games/remainder-islands/rules';
import { createInitialState } from '../../src/games/remainder-islands/types';

describe('Wave 39 remainder — division math', () => {
  it('calculateDivision quotient/remainder matrix', () => {
    expect(calculateDivision(17, 5)).toEqual({
      dividend: 17,
      divisor: 5,
      quotient: 3,
      remainder: 2,
    });
    expect(calculateDivision(12, 4).remainder).toBe(0);
    expect(calculateDivision(7, 10).quotient).toBe(0);
  });
});

describe('Wave 39 remainder — preview / select no-ops', () => {
  it('previewDivision null without roll or unknown island', () => {
    const state = createInitialState();
    expect(previewDivision(state, 'island-1')).toBeNull();
    const rolled = {
      ...state,
      currentRoll: { die1: 3, die2: 4, total: 7 },
    };
    expect(previewDivision(rolled, 'no-such-island')).toBeNull();
  });

  it('previewDivision returns math when roll + island exist', () => {
    const state = createInitialState();
    const island = state.islands[0];
    const rolled = {
      ...state,
      currentRoll: { die1: 5, die2: 6, total: 11 },
    };
    const preview = previewDivision(rolled, island.id);
    expect(preview).toEqual(calculateDivision(11, island.value));
  });

  it('selectIsland identity when phase is rolling / invalid id', () => {
    const state = createInitialState();
    expect(selectIsland(state, 'x')).toBe(state);
    const selecting = {
      ...state,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 2, die2: 2, total: 4 },
      validIslands: ['only-this'],
    };
    expect(selectIsland(selecting, 'other')).toBe(selecting);
    expect(selectIsland(selecting, 'ghost-missing')).toBe(selecting);
  });

  it('setSelectedIsland stores preview id; performRoll leaves non-rolling alone', () => {
    const state = createInitialState();
    const previewing = setSelectedIsland(state, 'island-x');
    expect(previewing.selectedIsland).toBe('island-x');
    const stuck = {
      ...state,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 1, die2: 1, total: 2 },
    };
    expect(performRoll(stuck)).toBe(stuck);
  });
});
