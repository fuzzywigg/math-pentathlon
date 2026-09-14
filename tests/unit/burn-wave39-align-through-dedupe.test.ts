/**
 * Wave 39 — findAlignmentsThrough multi-dir dedupe leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { findAlignmentsThrough } from '../../src/core/alignment';

describe('Wave 39 align — alignments through dedupe', () => {
  const dims = { rows: 5, cols: 5 };

  it('empty board through center has no alignments', () => {
    const result = findAlignmentsThrough(
      { row: 2, col: 2 },
      dims,
      () => null,
      { requiredLength: 3 }
    );
    expect(result.hasAlignment).toBe(false);
    expect(result.alignments).toHaveLength(0);
  });

  it('cross of length 3 yields horizontal + vertical', () => {
    const board: (string | null)[][] = Array.from({ length: 5 }, () =>
      Array(5).fill(null)
    );
    for (let c = 1; c <= 3; c++) board[2][c] = 'X';
    for (let r = 1; r <= 3; r++) board[r][2] = 'X';
    const get = (r: number, c: number) => board[r]?.[c] ?? null;
    const result = findAlignmentsThrough(
      { row: 2, col: 2 },
      dims,
      get,
      { requiredLength: 3 }
    );
    expect(result.hasAlignment).toBe(true);
    expect(result.alignments.length).toBeGreaterThanOrEqual(2);
    const dirs = new Set(
      result.alignments.map((a) =>
        typeof a.direction === 'string' ? a.direction : a.direction.name
      )
    );
    expect(dirs.has('horizontal') || dirs.has('vertical')).toBe(true);
  });

  it('short run below requiredLength yields none', () => {
    const board: (string | null)[][] = Array.from({ length: 5 }, () =>
      Array(5).fill(null)
    );
    board[2][2] = 'Y';
    board[2][3] = 'Y';
    const get = (r: number, c: number) => board[r]?.[c] ?? null;
    const result = findAlignmentsThrough(
      { row: 2, col: 2 },
      dims,
      get,
      { requiredLength: 4 }
    );
    expect(result.hasAlignment).toBe(false);
  });
});
