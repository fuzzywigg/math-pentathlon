/**
 * Wave 39 — alignment compat line-through / normalize leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  findAlignmentAt,
  findAlignmentsThrough,
  countMaxAligned,
  normalizePosition,
  createArrayAccessor,
} from '../../src/core/alignment';

describe('Wave 39 alignment — line through', () => {
  const grid = [
    [1, 1, 1, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [2, 2, 2, 2],
  ];
  const get = createArrayAccessor(grid);
  const dims = { rows: 4, cols: 4 };

  it('findAlignmentAt detects horizontal three', () => {
    const hit = findAlignmentAt(
      { row: 0, col: 1 },
      'horizontal',
      dims,
      get,
      { requiredLength: 3 }
    );
    expect(hit).not.toBeNull();
    expect(hit!.length).toBeGreaterThanOrEqual(3);
  });

  it('findAlignmentsThrough returns alignments object', () => {
    const all = findAlignmentsThrough({ row: 0, col: 1 }, dims, get, {
      requiredLength: 3,
    });
    expect(all.hasAlignment).toBe(true);
    expect(all.alignments.length).toBeGreaterThanOrEqual(1);
  });

  it('countMaxAligned on bottom row is 4', () => {
    const result = countMaxAligned({ row: 3, col: 1 }, dims, get);
    expect(result.count).toBeGreaterThanOrEqual(4);
  });

  it('normalizePosition wraps when enabled', () => {
    const wrapped = normalizePosition(
      { row: -1, col: 5 },
      dims,
      { wrapVertical: true, wrapHorizontal: true }
    );
    expect(wrapped.row).toBe(3);
    expect(wrapped.col).toBe(1);
  });
});
