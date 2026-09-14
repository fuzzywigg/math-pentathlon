/**
 * Wave 42 — DIRECTION_VECTORS / CARDINAL_DIRECTIONS delta contracts.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  DIRECTION_VECTORS,
  CARDINAL_DIRECTIONS,
  getNeighbors,
} from '../../src/core/alignment';

describe('Wave 42 align-compat — cardinal vectors', () => {
  it('horizontal / vertical vectors are unit steps', () => {
    expect(DIRECTION_VECTORS.horizontal).toEqual({ row: 0, col: 1 });
    expect(DIRECTION_VECTORS.vertical).toEqual({ row: 1, col: 0 });
  });

  it('diagonal vectors are ±1 on both axes', () => {
    expect(DIRECTION_VECTORS['diagonal-down']).toEqual({ row: 1, col: 1 });
    expect(DIRECTION_VECTORS['diagonal-up']).toEqual({ row: -1, col: 1 });
  });

  it('CARDINAL_DIRECTIONS pairs forward+reverse on each axis', () => {
    const keys = CARDINAL_DIRECTIONS.map((d) => `${d.dRow},${d.dCol}`).sort();
    expect(keys).toEqual(['-1,0', '0,-1', '0,1', '1,0']);
  });

  it('4-connect neighbors equal cardinal count at interior cell', () => {
    const n = getNeighbors({ row: 1, col: 1 }, { rows: 3, cols: 3 }, 4);
    expect(n).toHaveLength(4);
  });

  it('corner 4-connect yields two neighbors', () => {
    expect(getNeighbors({ row: 0, col: 0 }, { rows: 3, cols: 3 }, 4)).toHaveLength(
      2
    );
  });
});
