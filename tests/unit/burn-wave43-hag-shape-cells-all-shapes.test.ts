/**
 * Wave 43 — getShapeCells all shapes leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getShapeCells, type BlockShape } from '../../src/games/hex-a-gone/types';

describe('Wave 43 hag — shape cells', () => {
  it('every shape returns relative cells at anchor', () => {
    const shapes: BlockShape[] = [
      'hexagon',
      'trapezoid',
      'rhombus',
      'triangle',
      'square',
    ];
    for (const shape of shapes) {
      const cells = getShapeCells(shape, 2, -1, 0);
      expect(cells.length).toBeGreaterThan(0);
      expect(cells[0]).toEqual({ q: 2, r: -1 });
    }
  });
});
