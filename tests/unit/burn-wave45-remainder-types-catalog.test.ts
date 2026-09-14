/**
 * Wave 45 TOKENMAXX — Remainder types/catalog leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  ISLAND_VALUES,
  GRID_ROWS,
  GRID_COLS,
  TOTAL_TURNS,
  createInitialState,
  getOpponent,
} from '../../src/games/remainder-islands/types';

describe('Wave 45 remainder — types catalog', () => {
  it('island values 2–9 and grid/turns invariants', () => {
    expect(ISLAND_VALUES).toEqual([2, 3, 4, 5, 6, 7, 8, 9]);
    expect(GRID_ROWS).toBe(5);
    expect(GRID_COLS).toBe(7);
    expect(TOTAL_TURNS).toBe(24);
    const s = createInitialState();
    expect(s.islands.length).toBeGreaterThan(10);
    expect(s.turnsRemaining).toBe(TOTAL_TURNS);
    expect(getOpponent('player2')).toBe('player1');
  });
});
