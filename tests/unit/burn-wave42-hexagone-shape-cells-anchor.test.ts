/**
 * Wave 42 leftovers D — Hex-a-Gone shape cells anchor. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  getShapeCells,
  type BlockShape,
} from '../../src/games/hex-a-gone/types';

const SHAPES: BlockShape[] = [
  'hexagon',
  'trapezoid',
  'rhombus',
  'triangle',
  'square',
];

describe('Wave 42 hexagone — getShapeCells anchor / rotation ignored', () => {
  it('returns single [{q,r}] anchor cell for all 5 shapes', () => {
    for (const shape of SHAPES) {
      expect(getShapeCells(shape, 2, -1, 0)).toEqual([{ q: 2, r: -1 }]);
    }
  });

  it('rotation param is ignored for all shapes', () => {
    for (const shape of SHAPES) {
      const r0 = getShapeCells(shape, 0, 0, 0);
      const r3 = getShapeCells(shape, 0, 0, 3);
      const r5 = getShapeCells(shape, 0, 0, 5);
      expect(r0).toEqual([{ q: 0, r: 0 }]);
      expect(r3).toEqual(r0);
      expect(r5).toEqual(r0);
    }
  });
});
