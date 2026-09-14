/**
 * Wave 42 — areCellsConnected / isAdjacent leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  areCellsConnected,
  isAdjacent,
  TETROMINOES,
  normalizeCells,
} from '../../src/core/polyomino';

describe('Wave 42 poly-xform — connected adjacent', () => {
  it('empty and singleton are connected', () => {
    expect(areCellsConnected([])).toBe(true);
    expect(areCellsConnected([{ row: 0, col: 0 }])).toBe(true);
  });

  it('catalog tetrominoes are connected after normalize', () => {
    for (const shape of TETROMINOES) {
      expect(areCellsConnected(normalizeCells(shape.cells))).toBe(true);
    }
  });

  it('diagonal-only pair is not connected', () => {
    expect(
      areCellsConnected([
        { row: 0, col: 0 },
        { row: 1, col: 1 },
      ])
    ).toBe(false);
  });

  it('isAdjacent true for orthogonal neighbor, false for diagonal', () => {
    const cells = [{ row: 0, col: 0 }];
    expect(isAdjacent({ row: 0, col: 1 }, cells)).toBe(true);
    expect(isAdjacent({ row: 1, col: 1 }, cells)).toBe(false);
    expect(isAdjacent({ row: 0, col: 0 }, cells)).toBe(false);
  });

  it('disjunct two-cell gap is disconnected', () => {
    expect(
      areCellsConnected([
        { row: 0, col: 0 },
        { row: 0, col: 2 },
      ])
    ).toBe(false);
  });
});
