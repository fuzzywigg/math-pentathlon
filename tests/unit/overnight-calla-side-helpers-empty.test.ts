/**
 * Overnight HEAVY after #214/#215 — Calla side-empty / totals leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  isSideEmpty,
  getSideTotalCubes,
  getPlayerCalla,
  PITS_PER_SIDE,
  INITIAL_CUBES_PER_PIT,
} from '../../src/games/calla/types';

describe('Overnight calla — side helpers', () => {
  it('opening totals and empty detection', () => {
    const s = createInitialState();
    expect(isSideEmpty(s, 'player1')).toBe(false);
    expect(getSideTotalCubes(s, 'player1')).toBe(PITS_PER_SIDE * INITIAL_CUBES_PER_PIT);
    expect(getPlayerCalla(s, 'player1')).toBe(0);
    const emptied = { ...s, player1Pits: new Array(PITS_PER_SIDE).fill(0) };
    expect(isSideEmpty(emptied, 'player1')).toBe(true);
    expect(isSideEmpty(emptied, 'player2')).toBe(false);
  });
});
