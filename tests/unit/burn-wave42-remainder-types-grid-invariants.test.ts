/**
 * Wave 42 — Remainder island grid size + chip constants. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  GRID_ROWS,
  GRID_COLS,
  INITIAL_CHIPS_PER_PLAYER,
  TOTAL_TURNS,
  ISLAND_VALUES,
} from '../../src/games/remainder-islands/types';

describe('Wave 42 remainder — grid invariants', () => {
  it('island count matches staggered grid; values cycle', () => {
    const s = createInitialState();
    let expected = 0;
    for (let row = 0; row < GRID_ROWS; row++) {
      expected += row % 2 === 0 ? GRID_COLS : GRID_COLS - 1;
    }
    expect(s.islands).toHaveLength(expected);
    expect(s.player1Chips).toBe(INITIAL_CHIPS_PER_PLAYER);
    expect(s.turnsRemaining).toBe(TOTAL_TURNS);
    expect(new Set(s.islands.map((i) => i.value)).size).toBe(ISLAND_VALUES.length);
  });
});
