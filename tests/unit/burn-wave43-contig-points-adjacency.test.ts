/**
 * Wave 43 TOKENMAXX — Contig calculatePoints adjacency leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { calculatePoints } from '../../src/games/contig-60/rules';
import { createInitialState } from '../../src/games/contig-60/types';

describe('Wave 43 contig — calculatePoints', () => {
  it('unknown value → 0; isolated empty → 0; owned neighbors score', () => {
    const state = createInitialState();
    expect(calculatePoints(state, 9999)).toBe(0);
    expect(calculatePoints(state, 1)).toBe(0);

    const cells = new Map(state.cells);
    // own neighbors of cell 5 (row0 col4): values 4,6,14,15,16 etc.
    const cell5 = cells.get(5)!;
    const owned = new Map(cells);
    for (const [v, c] of owned) {
      if (Math.abs(c.row - cell5.row) <= 1 && Math.abs(c.col - cell5.col) <= 1 && v !== 5) {
        owned.set(v, { ...c, owner: 'player2' });
      }
    }
    const scored = calculatePoints({ ...state, cells: owned }, 5);
    expect(scored).toBeGreaterThan(0);
  });
});
