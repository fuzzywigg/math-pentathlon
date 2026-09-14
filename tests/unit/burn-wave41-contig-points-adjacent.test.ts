/**
 * Wave 41 — Contig 60 calculatePoints adjacent owned chips.
 * Unknown value → 0; adjacent owners add 1 each. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState } from '../../src/games/contig-60/types';
import { calculatePoints } from '../../src/games/contig-60/rules';

describe('Wave 41 contig-60 — calculatePoints adjacent', () => {
  it('unknown / missing value returns 0', () => {
    const state = createInitialState();
    expect(calculatePoints(state, -1)).toBe(0);
    expect(calculatePoints(state, 9999)).toBe(0);
  });

  it('opening board yields 0 for every corner-ish cell', () => {
    const state = createInitialState();
    // Top-left 1, bottom-right 216, mid 60
    for (const v of [1, 10, 60, 216]) {
      expect(calculatePoints(state, v)).toBe(0);
    }
  });

  it('counts each adjacent owned chip (any owner)', () => {
    const state = createInitialState();
    // Cell 5 at (0,4); neighbors include 4,6,14,15,16 and maybe more
    const target = 5;
    const cell = state.cells.get(target)!;
    // Own two orthogonal neighbors
    const left = state.grid[cell.row][cell.col - 1]!;
    const right = state.grid[cell.row][cell.col + 1]!;
    state.cells.get(left)!.owner = 'player1';
    state.cells.get(right)!.owner = 'player2';
    expect(calculatePoints(state, target)).toBe(2);

    // Add below neighbor
    const below = state.grid[cell.row + 1][cell.col]!;
    state.cells.get(below)!.owner = 'player1';
    expect(calculatePoints(state, target)).toBe(3);
  });

  it('corner cell 1 only scores owned neighbors that exist', () => {
    const state = createInitialState();
    // Neighbors of (0,0): (0,1)=2, (1,0)=11, (1,1)=12
    state.cells.get(2)!.owner = 'player1';
    state.cells.get(11)!.owner = 'player1';
    expect(calculatePoints(state, 1)).toBe(2);
    state.cells.get(12)!.owner = 'player2';
    expect(calculatePoints(state, 1)).toBe(3);
  });
});
