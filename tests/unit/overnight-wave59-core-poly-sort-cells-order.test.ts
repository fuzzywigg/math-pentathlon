/**
 * Overnight HEAVY leftover after #280 — sortCells row-major non-mutating.
 * Distinct from wave58 canonicalize/transformed leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sortCells } from '../../src/core/polyomino';

describe('Wave 59 core poly — sort cells order', () => {
  it('sorts row-major and leaves input untouched', () => {
    const input = [
      { row: 1, col: 2 },
      { row: 0, col: 1 },
      { row: 1, col: 0 },
    ];
    const snapshot = input.map((c) => ({ ...c }));
    expect(sortCells(input)).toEqual([
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 2 },
    ]);
    expect(input).toEqual(snapshot);
  });
});
