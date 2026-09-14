/**
 * Wave 38 — canonicalize / sort / cellsToKey permutation invariance.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  canonicalizeCells,
  sortCells,
  cellsToKey,
  areCellsEquivalent,
} from '../../src/core/polyomino';

describe('Wave 38 poly-canonicalize — permutation / empty', () => {
  it('empty canonicalize and key are empty', () => {
    expect(canonicalizeCells([])).toEqual([]);
    expect(sortCells([])).toEqual([]);
    expect(cellsToKey([])).toBe('');
  });

  it('permute order yields identical key and canonicalize', () => {
    const a = [
      { row: 2, col: 1 },
      { row: 0, col: 0 },
      { row: 1, col: 0 },
    ];
    const b = [a[2], a[0], a[1]];
    expect(cellsToKey(a)).toBe(cellsToKey(b));
    expect(canonicalizeCells(a)).toEqual(canonicalizeCells(b));
    expect(areCellsEquivalent(a, b)).toBe(true);
  });

  it('sortCells is top-to-bottom left-to-right without mutating', () => {
    const cells = [
      { row: 1, col: 2 },
      { row: 0, col: 5 },
      { row: 1, col: 0 },
    ];
    const sorted = sortCells(cells);
    expect(sorted).toEqual([
      { row: 0, col: 5 },
      { row: 1, col: 0 },
      { row: 1, col: 2 },
    ]);
    expect(cells[0]).toEqual({ row: 1, col: 2 });
  });

  it('disconnected set still gets a stable sorted key', () => {
    const disconnected = [
      { row: 0, col: 0 },
      { row: 5, col: 5 },
    ];
    expect(cellsToKey(disconnected)).toBe('0,0|5,5');
    expect(canonicalizeCells(disconnected)).toEqual([
      { row: 0, col: 0 },
      { row: 5, col: 5 },
    ]);
  });
});
