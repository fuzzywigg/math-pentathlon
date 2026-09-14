/**
 * Wave 42 — getAllRotations uniqueness leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  getAllRotations,
  cellsToKey,
  TETROMINOES,
  PENTOMINOES,
  getPolyominoById,
} from '../../src/core/polyomino';

describe('Wave 42 poly-xform — all rotations unique', () => {
  it('O has one unique rotation', () => {
    expect(getAllRotations(getPolyominoById('O')!.cells)).toHaveLength(1);
  });

  it('I has two unique rotations', () => {
    expect(getAllRotations(getPolyominoById('I')!.cells)).toHaveLength(2);
  });

  it('L tetromino has four unique rotations', () => {
    const keys = getAllRotations(getPolyominoById('L')!.cells).map(cellsToKey);
    expect(new Set(keys).size).toBe(4);
    expect(keys).toHaveLength(4);
  });

  it('every returned rotation is normalized to origin', () => {
    for (const shape of TETROMINOES) {
      for (const rot of getAllRotations(shape.cells)) {
        expect(Math.min(...rot.map((c) => c.row))).toBe(0);
        expect(Math.min(...rot.map((c) => c.col))).toBe(0);
      }
    }
  });

  it('F pentomino yields four unique rotations', () => {
    const F = PENTOMINOES.find((s) => s.id === 'F')!;
    expect(getAllRotations(F.cells)).toHaveLength(4);
  });
});
