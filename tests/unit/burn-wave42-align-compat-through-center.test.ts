/**
 * Wave 42 — findAlignmentsThrough / countMaxAligned from center.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  findAlignmentsThrough,
  countMaxAligned,
  createArrayAccessor,
  getArrayDimensions,
} from '../../src/core/alignment';

describe('Wave 42 align-compat — through center', () => {
  it('full row through center reports horizontal alignment', () => {
    const grid = [
      [null, null, null, null, null],
      [null, null, null, null, null],
      ['Z', 'Z', 'Z', 'Z', 'Z'],
      [null, null, null, null, null],
      [null, null, null, null, null],
    ];
    const dims = getArrayDimensions(grid);
    const get = createArrayAccessor(grid);
    const r = findAlignmentsThrough({ row: 2, col: 2 }, dims, get, {
      requiredLength: 5,
    });
    expect(r.hasAlignment).toBe(true);
    expect(r.alignments.some((a) => a.length >= 5)).toBe(true);
  });

  it('countMaxAligned on full column returns length 5', () => {
    const grid = Array.from({ length: 5 }, () =>
      Array.from({ length: 5 }, () => null as string | null)
    );
    for (let r = 0; r < 5; r++) grid[r][2] = 'Q';
    const dims = getArrayDimensions(grid);
    const get = createArrayAccessor(grid);
    const best = countMaxAligned({ row: 2, col: 2 }, dims, get);
    expect(best.count).toBe(5);
    expect(best.direction).toMatch(/vertical/);
  });

  it('singleton center falls back to count 1', () => {
    const grid = Array.from({ length: 3 }, () =>
      Array.from({ length: 3 }, () => null as string | null)
    );
    grid[1][1] = 'S';
    const dims = getArrayDimensions(grid);
    const get = createArrayAccessor(grid);
    expect(countMaxAligned({ row: 1, col: 1 }, dims, get).count).toBe(1);
  });

  it('requiredLength above run suppresses through-alignments', () => {
    const grid = [
      [null, null, null],
      ['A', 'A', 'A'],
      [null, null, null],
    ];
    const dims = getArrayDimensions(grid);
    const get = createArrayAccessor(grid);
    const r = findAlignmentsThrough({ row: 1, col: 1 }, dims, get, {
      requiredLength: 4,
    });
    expect(r.hasAlignment).toBe(false);
  });
});
