/**
 * Overnight HEAVY leftover after #274 — flipPolyomino returns new shape object.
 * Distinct from wave57 flip-vertical cells. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  flipPolyomino,
  cellsToKey,
  normalizeCells,
  flipCellsHorizontal,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 58 core poly — flipPolyomino new', () => {
  it('returns a new object with horizontally flipped cells', () => {
    const shape = SIMPLE_SHAPES.find((s) => s.cells.length >= 2)!;
    const flipped = flipPolyomino(shape);
    expect(flipped).not.toBe(shape);
    expect(cellsToKey(flipped.cells)).toBe(
      cellsToKey(normalizeCells(flipCellsHorizontal(shape.cells)))
    );
  });
});
