/**
 * Wave 43 — Hex-a-Gone getShapeCells single-cell footprints. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getShapeCells, type BlockShape } from '../../src/games/hex-a-gone/types';

describe('Wave 43 hex-a-gone — shape cells single footprint', () => {
  it('every shape footprint is exactly one cell at anchor', () => {
    const shapes: BlockShape[] = [
      'hexagon',
      'trapezoid',
      'rhombus',
      'triangle',
      'square',
    ];
    for (const shape of shapes) {
      for (const rot of [0, 1, 2, 3, 4, 5]) {
        expect(getShapeCells(shape, 2, -1, rot)).toEqual([{ q: 2, r: -1 }]);
      }
    }
  });
});
