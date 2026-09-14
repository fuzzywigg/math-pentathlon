/**
 * Wave 38 — flip/rotate polyomino vs getTransformedPolyomino agreement.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  TETROMINOES,
  getShapeById,
  flipPolyomino,
  rotatePolyomino,
  getTransformedPolyomino,
  rotateCells90CW,
  normalizeCells,
  cellsToKey,
  transformCells,
} from '../../src/core/polyomino';

describe('Wave 38 poly-flip-rotate — equivalence', () => {
  it('rotatePolyomino matches transform 90 unflipped', () => {
    const L = getShapeById('L', TETROMINOES)!;
    const rotated = rotatePolyomino(L);
    const via = getTransformedPolyomino(L, 90, false);
    expect(cellsToKey(rotated.cells)).toBe(cellsToKey(via.cells));
  });

  it('flip then rotate matches transformCells chain', () => {
    const T = getShapeById('T', TETROMINOES)!;
    const flipped = flipPolyomino(T);
    const flippedRotated = rotatePolyomino(flipped);
    const direct = transformCells(T.cells, 90, true);
    expect(cellsToKey(flippedRotated.cells)).toBe(cellsToKey(direct));
  });

  it('rotateCells90CW matches rotateCells normalize path', () => {
    const S = getShapeById('S', TETROMINOES)!;
    expect(cellsToKey(normalizeCells(rotateCells90CW(S.cells)))).toBe(
      cellsToKey(rotatePolyomino(S).cells)
    );
  });

  it('canFlip=false shapes still transform via raw APIs', () => {
    const shape = {
      ...getShapeById('O', TETROMINOES)!,
      canFlip: false,
      canRotate: false,
    };
    const viaFlagAware = getTransformedPolyomino(shape, 90, true);
    // getTransformedPolyomino uses transformCells which ignores flags
    expect(viaFlagAware.cells.length).toBe(shape.cells.length);
    const flipped = flipPolyomino(shape);
    expect(flipped.cells.length).toBe(shape.cells.length);
  });
});
