/**
 * Wave 39 — checkLineAlignment empty/undefined leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { checkLineAlignment } from '../../src/core/alignment';

describe('Wave 39 align — checkLineAlignment empty', () => {
  it('empty positions are not aligned', () => {
    expect(checkLineAlignment([], () => 'X')).toEqual({
      isAligned: false,
      value: null,
    });
  });

  it('undefined first cell fails', () => {
    const result = checkLineAlignment(
      [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
      ],
      () => undefined
    );
    expect(result.isAligned).toBe(false);
    expect(result.value).toBeNull();
  });

  it('null first cell fails', () => {
    const result = checkLineAlignment(
      [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
      ],
      () => null
    );
    expect(result.isAligned).toBe(false);
  });

  it('matching non-null line aligns', () => {
    const board = [['A', 'A', 'A']];
    const result = checkLineAlignment(
      [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
      ],
      (r, c) => board[r]?.[c]
    );
    expect(result).toEqual({ isAligned: true, value: 'A' });
  });

  it('mismatch mid-line fails with null value', () => {
    const board = [['A', 'B', 'A']];
    const result = checkLineAlignment(
      [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
      ],
      (r, c) => board[r]?.[c]
    );
    expect(result.isAligned).toBe(false);
    expect(result.value).toBeNull();
  });
});
