/**
 * Wave 42 — getLinePositions / checkLineAlignment leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  getLinePositions,
  checkLineAlignment,
  createArrayAccessor,
} from '../../src/core/alignment';

const dim = { rows: 4, cols: 4 };

describe('Wave 42 align-compat — line positions', () => {
  it('horizontal length-3 from (0,0) yields three cells', () => {
    expect(getLinePositions({ row: 0, col: 0 }, 'horizontal', 3, dim)).toEqual([
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
    ]);
  });

  it('vertical OOB returns null', () => {
    expect(getLinePositions({ row: 2, col: 0 }, 'vertical', 3, dim)).toBeNull();
  });

  it('diagonal-down fits when room remains', () => {
    expect(
      getLinePositions({ row: 0, col: 0 }, 'diagonal-down', 4, dim)
    ).toHaveLength(4);
  });

  it('diagonal-up null when climbing off the board', () => {
    expect(
      getLinePositions({ row: 0, col: 0 }, 'diagonal-up', 2, dim)
    ).toBeNull();
  });

  it('checkLineAlignment detects matching vs mixed lines', () => {
    const grid = [
      ['A', 'A', 'A', null],
      ['A', 'B', null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const get = createArrayAccessor(grid);
    const aligned = getLinePositions({ row: 0, col: 0 }, 'horizontal', 3, dim)!;
    expect(checkLineAlignment(aligned, get)).toEqual({
      isAligned: true,
      value: 'A',
    });
    const mixed = [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ];
    expect(checkLineAlignment(mixed, get).isAligned).toBe(false);
  });

  it('empty positions → not aligned', () => {
    expect(checkLineAlignment([], () => 'X')).toEqual({
      isAligned: false,
      value: null,
    });
  });
});
