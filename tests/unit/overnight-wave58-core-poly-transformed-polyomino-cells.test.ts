/**
 * Overnight HEAVY leftover after #274 — getTransformedPolyomino matches transformCells.
 * Distinct from wave57 symmetry-O / prevRotation. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  getTransformedPolyomino,
  transformCells,
  cellsToKey,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 58 core poly — transformed polyomino', () => {
  it('getTransformedPolyomino cells equal transformCells for L-tromino', () => {
    const L = SIMPLE_SHAPES.find((s) => s.id === 'tromino-L')!;
    expect(L).toBeTruthy();
    const shaped = getTransformedPolyomino(L, 90, true);
    expect(cellsToKey(shaped.cells)).toBe(
      cellsToKey(transformCells(L.cells, 90, true))
    );
    expect(shaped.id).toBe(L.id);
  });
});
