/**
 * Wave 28 — getAllRotations / getAllOrientations / getTransformedCells flags.
 * Distinct from getAllTransformations smoke in polyomino.test (ignores flags).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  getAllRotations,
  getAllOrientations,
  getAllTransformations,
  getTransformedCells,
  getTransformedPolyomino,
  cellsToKey,
  TETROMINOES,
  PENTOMINOES,
  SIMPLE_SHAPES,
  getPolyominoById,
  type PolyominoShape,
  type Rotation,
} from '../../src/core/polyomino';

function byId(id: string): PolyominoShape {
  const s = getPolyominoById(id);
  if (!s) throw new Error(`missing ${id}`);
  return s;
}

describe('Wave 28 poly-orient — getAllRotations uniqueness', () => {
  it('O square yields a single unique rotation', () => {
    const O = byId('O');
    expect(getAllRotations(O.cells)).toHaveLength(1);
  });

  it('I bar yields exactly two unique rotations', () => {
    const I = byId('I');
    const rots = getAllRotations(I.cells);
    expect(rots).toHaveLength(2);
    const keys = new Set(rots.map(cellsToKey));
    expect(keys.size).toBe(2);
  });

  it('T yields four unique rotations', () => {
    expect(getAllRotations(byId('T').cells)).toHaveLength(4);
  });

  it('each returned rotation set is already normalized to origin', () => {
    for (const cells of getAllRotations(byId('L').cells)) {
      expect(Math.min(...cells.map((c) => c.row))).toBe(0);
      expect(Math.min(...cells.map((c) => c.col))).toBe(0);
    }
  });
});

describe('Wave 28 poly-orient — getAllOrientations respects canFlip/canRotate', () => {
  it('O with canRotate=false / canFlip=false yields one orientation', () => {
    const O = byId('O');
    expect(O.canRotate).toBe(false);
    expect(O.canFlip).toBe(false);
    expect(getAllOrientations(O)).toHaveLength(1);
  });

  it('I with canRotate and no flip yields two orientations', () => {
    const I = byId('I');
    expect(I.canRotate).toBe(true);
    expect(I.canFlip).toBe(false);
    expect(getAllOrientations(I)).toHaveLength(2);
  });

  it('L-tromino mirrors are rotation-equivalent (orbit size 4)', () => {
    const L = SIMPLE_SHAPES.find((s) => s.id === 'tromino-L')!;
    expect(L.canFlip).toBe(true);
    const orients = getAllOrientations(L);
    const rots = getAllRotations(L.cells);
    expect(orients.length).toBe(4);
    expect(rots.length).toBe(4);
    expect(orients.length).toBe(getAllTransformations(L).length);
  });

  it('canRotate=false still includes flip variant when canFlip', () => {
    const shape: PolyominoShape = {
      id: 'no-rot-flip',
      name: 'test',
      cells: [
        { row: 0, col: 0 },
        { row: 1, col: 0 },
        { row: 1, col: 1 },
      ],
      color: '#000',
      canRotate: false,
      canFlip: true,
      size: 3,
      order: 3,
    };
    const orients = getAllOrientations(shape);
    expect(orients).toHaveLength(2);
  });

  it('pentomino F has 8 orientations when flags allow', () => {
    const F = PENTOMINOES.find((s) => s.id === 'F')!;
    expect(F.canRotate && F.canFlip).toBe(true);
    expect(getAllOrientations(F)).toHaveLength(8);
  });
});

describe('Wave 28 poly-orient — getTransformedCells flag gates', () => {
  it('ignores requested flip when shape.canFlip is false', () => {
    const T = byId('T');
    expect(T.canFlip).toBe(false);
    const plain = getTransformedCells(T, 0, false);
    const forced = getTransformedCells(T, 0, true);
    expect(cellsToKey(plain)).toBe(cellsToKey(forced));
  });

  it('ignores requested rotation when shape.canRotate is false', () => {
    const O = byId('O');
    const a = getTransformedCells(O, 0, false);
    const b = getTransformedCells(O, 90, false);
    expect(cellsToKey(a)).toBe(cellsToKey(b));
  });

  it('applies flip then rotation; L-tromino still collapses to 4 keys', () => {
    const L = SIMPLE_SHAPES.find((s) => s.id === 'tromino-L')!;
    const keys = new Set<string>();
    for (const flipped of [false, true]) {
      for (const rot of [0, 90, 180, 270] as Rotation[]) {
        keys.add(cellsToKey(getTransformedCells(L, rot, flipped)));
      }
    }
    expect(keys.size).toBe(4);
  });

  it('chiral F pentomino yields 8 distinct transformed keys', () => {
    const F = PENTOMINOES.find((s) => s.id === 'F')!;
    const keys = new Set<string>();
    for (const flipped of [false, true]) {
      for (const rot of [0, 90, 180, 270] as Rotation[]) {
        keys.add(cellsToKey(getTransformedCells(F, rot, flipped)));
      }
    }
    expect(keys.size).toBe(8);
  });

  it('getTransformedPolyomino mirrors getTransformedCells geometry', () => {
    const J = TETROMINOES.find((s) => s.id === 'J')!;
    for (const rot of [0, 90, 180, 270] as Rotation[]) {
      const cells = getTransformedCells(J, rot, false);
      const shape = getTransformedPolyomino(J, rot, false);
      expect(cellsToKey(shape.cells)).toBe(cellsToKey(cells));
      expect(shape.id).toBe(J.id);
    }
  });
});
