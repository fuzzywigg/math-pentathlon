/**
 * Overnight TOKENMAXX — Calla types constants leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  PITS_PER_SIDE,
  INITIAL_CUBES_PER_PIT,
  TOTAL_CUBES,
  getOppositePitIndex,
  isSideEmpty,
  getSideTotalCubes,
  getOpponent,
} from '../../src/games/calla/types';

describe('Overnight calla — types helpers', () => {
  it('constants and pit helpers', () => {
    expect(PITS_PER_SIDE).toBe(5);
    expect(INITIAL_CUBES_PER_PIT).toBe(3);
    expect(TOTAL_CUBES).toBe(30);
    expect(getOppositePitIndex(0)).toBe(4);
    expect(getOppositePitIndex(2)).toBe(2);
    expect(getOpponent('player1')).toBe('player2');
    const s = createInitialState();
    expect(isSideEmpty(s, 'player1')).toBe(false);
    expect(getSideTotalCubes(s, 'player1')).toBe(15);
  });
});
