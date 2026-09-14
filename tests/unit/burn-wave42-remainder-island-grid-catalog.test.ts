/** Wave 42 — Remainder island grid catalog. Tests-only. */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  GRID_ROWS,
  GRID_COLS,
  ISLAND_VALUES,
} from '../../src/games/remainder-islands/types';

describe('Wave 42 remainder — island grid catalog', () => {
  it('grid has expected island count from stagger cols', () => {
    const state = createInitialState();
    let expected = 0;
    for (let row = 0; row < GRID_ROWS; row++) {
      expected += row % 2 === 0 ? GRID_COLS : GRID_COLS - 1;
    }
    expect(state.islands).toHaveLength(expected);
  });

  it('every island value is from ISLAND_VALUES', () => {
    const state = createInitialState();
    for (const island of state.islands) {
      expect(ISLAND_VALUES).toContain(island.value);
    }
  });

  it('island ids are unique and follow island-row-col pattern', () => {
    const state = createInitialState();
    const ids = state.islands.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const island of state.islands) {
      expect(island.id).toMatch(/^island-\d+/);
      expect(island.owner).toBeNull();
      expect(island.chips).toBe(0);
    }
  });

  it('odd rows have one fewer island than even rows', () => {
    const state = createInitialState();
    for (let row = 0; row < GRID_ROWS; row++) {
      const count = state.islands.filter((i) => i.row === row).length;
      const expected = row % 2 === 0 ? GRID_COLS : GRID_COLS - 1;
      expect(count).toBe(expected);
    }
  });

  it('values cycle through ISLAND_VALUES in creation order', () => {
    const state = createInitialState();
    state.islands.forEach((island, idx) => {
      expect(island.value).toBe(ISLAND_VALUES[idx % ISLAND_VALUES.length]);
    });
  });
});
