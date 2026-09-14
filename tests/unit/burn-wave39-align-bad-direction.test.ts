/**
 * Wave 39 — findAlignmentAt unknown direction leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { findAlignmentAt, hasAlignment } from '../../src/core/alignment';

describe('Wave 39 align — bad direction / hasAlignment', () => {
  const dims = { rows: 4, cols: 4 };
  const board = [
    ['X', 'X', 'X', 'X'],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
  ];
  const get = (r: number, c: number) => board[r]?.[c] ?? null;

  it('unknown direction name returns null', () => {
    expect(
      findAlignmentAt(
        { row: 0, col: 0 },
        'sideways' as 'horizontal',
        dims,
        get,
        { requiredLength: 3 }
      )
    ).toBeNull();
  });

  it('valid horizontal finds alignment', () => {
    const result = findAlignmentAt(
      { row: 0, col: 0 },
      'horizontal',
      dims,
      get,
      { requiredLength: 4 }
    );
    expect(result).not.toBeNull();
    expect(result!.length).toBe(4);
  });

  it('hasAlignment true for filled row', () => {
    expect(hasAlignment(dims, get, { requiredLength: 4 })).toBe(true);
  });

  it('hasAlignment false on empty board', () => {
    expect(hasAlignment(dims, () => null, { requiredLength: 3 })).toBe(false);
  });
});
