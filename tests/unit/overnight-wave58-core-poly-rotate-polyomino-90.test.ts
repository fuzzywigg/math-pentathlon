/**
 * Overnight HEAVY leftover after #274 — rotatePolyomino applies 90° CW.
 * Distinct from wave57 prev/next rotation wrap. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  rotatePolyomino,
  cellsToKey,
  normalizeCells,
  rotateCells,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 58 core poly — rotatePolyomino 90', () => {
  it('rotatePolyomino matches normalize(rotateCells 90)', () => {
    const shape = SIMPLE_SHAPES.find((s) => s.id === 'domino')!;
    const rotated = rotatePolyomino(shape);
    expect(cellsToKey(rotated.cells)).toBe(
      cellsToKey(normalizeCells(rotateCells(shape.cells, 90)))
    );
  });
});
