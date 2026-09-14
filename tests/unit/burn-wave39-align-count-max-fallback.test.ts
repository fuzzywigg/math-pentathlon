/**
 * Wave 39 — countMaxAligned empty-cell fallback leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { countMaxAligned } from '../../src/core/alignment';

describe('Wave 39 align — countMaxAligned fallback', () => {
  const dims = { rows: 4, cols: 4 };

  it('null at pos falls back to count 1 horizontal', () => {
    const get = () => null;
    const result = countMaxAligned({ row: 1, col: 1 }, dims, get);
    expect(result.count).toBe(1);
    expect(result.direction).toBe('horizontal');
    expect(result.positions).toEqual([{ row: 1, col: 1 }]);
  });

  it('horizontal run reports max length through center', () => {
    const board = [
      [null, null, null, null],
      ['A', 'A', 'A', null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const get = (r: number, c: number) => board[r]?.[c] ?? null;
    const result = countMaxAligned({ row: 1, col: 1 }, dims, get);
    expect(result.count).toBe(3);
    expect(result.direction).toBe('horizontal');
    expect(result.positions).toHaveLength(3);
  });

  it('vertical beat when longer than horizontal', () => {
    const board = [
      [null, 'B', null, null],
      [null, 'B', 'B', null],
      [null, 'B', null, null],
      [null, 'B', null, null],
    ];
    const get = (r: number, c: number) => board[r]?.[c] ?? null;
    const result = countMaxAligned({ row: 1, col: 1 }, dims, get);
    expect(result.count).toBe(4);
    expect(result.direction).toBe('vertical');
  });
});
