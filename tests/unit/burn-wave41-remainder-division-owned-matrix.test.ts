/**
 * Wave 41 — Remainder Islands calculateDivision dense matrix + countOwned.
 * Beyond wave39 single-row math. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  calculateDivision,
  countOwnedIslands,
  previewDivision,
  setSelectedIsland,
} from '../../src/games/remainder-islands/rules';
import {
  createInitialState,
  ISLAND_VALUES,
} from '../../src/games/remainder-islands/types';

describe('Wave 41 remainder — division dense matrix', () => {
  it('cartesian totals × island values match floor/mod', () => {
    const totals = [2, 3, 7, 11, 12];
    for (const total of totals) {
      for (const value of ISLAND_VALUES) {
        const d = calculateDivision(total, value);
        expect(d.dividend).toBe(total);
        expect(d.divisor).toBe(value);
        expect(d.quotient).toBe(Math.floor(total / value));
        expect(d.remainder).toBe(total % value);
        expect(d.quotient * value + d.remainder).toBe(total);
      }
    }
  });

  it('previewDivision matches calculateDivision for every island', () => {
    const state = {
      ...createInitialState(),
      currentRoll: { die1: 4, die2: 3, total: 7 },
    };
    for (const island of state.islands) {
      expect(previewDivision(state, island.id)).toEqual(
        calculateDivision(7, island.value)
      );
    }
  });

  it('countOwnedIslands tracks mixed owners', () => {
    const state = createInitialState();
    const islands = state.islands.map((island, idx) => {
      if (idx % 3 === 0) return { ...island, owner: 'player1' as const };
      if (idx % 3 === 1) return { ...island, owner: 'player2' as const };
      return island;
    });
    const counts = countOwnedIslands({ ...state, islands });
    expect(counts.player1 + counts.player2).toBeLessThanOrEqual(islands.length);
    expect(counts.player1).toBe(
      islands.filter((i) => i.owner === 'player1').length
    );
    expect(counts.player2).toBe(
      islands.filter((i) => i.owner === 'player2').length
    );
  });

  it('setSelectedIsland null clears preview', () => {
    const state = setSelectedIsland(createInitialState(), 'island-x');
    expect(state.selectedIsland).toBe('island-x');
    expect(setSelectedIsland(state, null).selectedIsland).toBeNull();
  });
});
