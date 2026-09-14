/**
 * Wave 42 — Par 55 createInitialState board stagger leftovers after #186. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState } from '../../src/games/par-55/rules';
import { CONFIG, createBaseId } from '../../src/games/par-55/types';

describe('Wave 42 par55 — initial board stagger', () => {
  it('even rows have BOARD_COLS bases; odd rows one fewer', () => {
    const state = createInitialState();
    for (let row = 0; row < CONFIG.BOARD_ROWS; row++) {
      const expectedCols =
        row % 2 === 1 ? CONFIG.BOARD_COLS - 1 : CONFIG.BOARD_COLS;
      let count = 0;
      for (let col = 0; col < CONFIG.BOARD_COLS; col++) {
        const id = createBaseId(row, col);
        if (state.bases.has(id)) count++;
      }
      expect(count).toBe(expectedCols);
    }
  });

  it('total base count matches staggered hex grid formula', () => {
    const state = createInitialState();
    let expected = 0;
    for (let row = 0; row < CONFIG.BOARD_ROWS; row++) {
      expected += row % 2 === 1 ? CONFIG.BOARD_COLS - 1 : CONFIG.BOARD_COLS;
    }
    expect(state.bases.size).toBe(expected);
    expect(state.bases.size).toBe(33); // 7+6+7+6+7
  });

  it('each base has row/col matching its id and adjacency lists', () => {
    const state = createInitialState();
    for (const base of state.bases.values()) {
      expect(base.id).toBe(createBaseId(base.row, base.col));
      expect(base.adjacentBases.every((id) => state.bases.has(id))).toBe(true);
      for (const adjId of base.adjacentBases) {
        const adj = state.bases.get(adjId)!;
        expect(adj.adjacentBases).toContain(base.id);
      }
    }
  });

  it('center seed block occupies middle row/col', () => {
    const state = createInitialState();
    const centerRow = Math.floor(CONFIG.BOARD_ROWS / 2);
    const centerCol = Math.floor(CONFIG.BOARD_COLS / 2);
    const centerId = createBaseId(centerRow, centerCol);
    const center = state.bases.get(centerId);
    expect(center?.block).toBeTruthy();
    expect(center?.placedBy).toBeNull();
  });
});
