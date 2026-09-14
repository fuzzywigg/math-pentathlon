/**
 * Wave 38 — translateCells Cell vs (row,col) overload agreement.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { translateCells, normalizeCells } from '../../src/core/polyomino';

describe('Wave 38 poly-translate — dual overload', () => {
  const cells = [
    { row: 1, col: 2 },
    { row: 3, col: 4 },
  ];

  it('Cell overload matches numeric overload', () => {
    const viaCell = translateCells(cells, { row: -1, col: 5 });
    const viaNums = translateCells(cells, -1, 5);
    expect(viaCell).toEqual(viaNums);
    expect(viaCell).toEqual([
      { row: 0, col: 7 },
      { row: 2, col: 9 },
    ]);
  });

  it('zero offsets are identity copies', () => {
    const next = translateCells(cells, 0, 0);
    expect(next).toEqual(cells);
    expect(next).not.toBe(cells);
    expect(next[0]).not.toBe(cells[0]);
  });

  it('empty input stays empty for both overloads', () => {
    expect(translateCells([], { row: 9, col: 9 })).toEqual([]);
    expect(translateCells([], 9, 9)).toEqual([]);
  });

  it('negative offsets then normalize recover relative shape', () => {
    const moved = translateCells(cells, -10, -20);
    const norm = normalizeCells(moved);
    expect(norm).toEqual([
      { row: 0, col: 0 },
      { row: 2, col: 2 },
    ]);
  });
});
