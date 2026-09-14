/**
 * Wave 39 — Contig calculatePoints adjacency leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, getAdjacentPositions } from '../../src/games/contig-60/types';
import { calculatePoints, doRollDice, placeChip } from '../../src/games/contig-60/rules';

describe('Wave 39 Contig — calculate points adj', () => {
  it('empty board placement scores 0', () => {
    const state = createInitialState();
    const anyValue = [...state.cells.keys()][0];
    expect(calculatePoints(state, anyValue)).toBe(0);
  });

  it('unknown value returns 0', () => {
    expect(calculatePoints(createInitialState(), 99999)).toBe(0);
  });

  it('adjacent owned cells increase points', () => {
    let state = createInitialState();
    // Own a cell then score a neighbor if both exist
    const value = [...state.cells.keys()][10];
    const cell = state.cells.get(value)!;
    const adj = getAdjacentPositions(cell.row, cell.col);
    expect(adj.length).toBeGreaterThan(0);
    const adjVal = state.grid[adj[0].row][adj[0].col];
    if (adjVal == null) return;
    const cells = new Map(state.cells);
    cells.set(value, { ...cell, owner: 'player1' });
    state = { ...state, cells };
    expect(calculatePoints(state, adjVal)).toBeGreaterThanOrEqual(1);
  });

  it('getAdjacentPositions corners have fewer neighbors', () => {
    expect(getAdjacentPositions(0, 0).length).toBeLessThan(
      getAdjacentPositions(2, 2).length
    );
  });

  it('doRollDice identity wrong phase', () => {
    const state = { ...createInitialState(), phase: 'calculating' as const };
    expect(doRollDice(state)).toBe(state);
  });
});
