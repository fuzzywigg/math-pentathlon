/**
 * Wave 38 — symmetry counts / equivalence / ghost id misses.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  SIMPLE_SHAPES,
  TETROMINOES,
  getSymmetryCount,
  arePolyominoesEquivalent,
  getAllTransformations,
  getShapeById,
  getPolyominoById,
} from '../../src/core/polyomino';

describe('Wave 38 poly-symmetry — catalog / miss', () => {
  it('O tetromino has fewer unique transforms than L', () => {
    const O = getShapeById('O', TETROMINOES)!;
    const L = getShapeById('L', TETROMINOES)!;
    expect(getSymmetryCount(O)).toBeLessThan(getSymmetryCount(L));
    expect(getAllTransformations(O).length).toBe(getSymmetryCount(O));
  });

  it('I monomino-like simple shapes stay equivalent to themselves', () => {
    for (const s of SIMPLE_SHAPES.slice(0, 4)) {
      expect(arePolyominoesEquivalent(s, s)).toBe(true);
      expect(getSymmetryCount(s)).toBeGreaterThanOrEqual(1);
    }
  });

  it('size-mismatch shapes are never equivalent', () => {
    const mono = SIMPLE_SHAPES.find((s) => s.size === 1)!;
    const tetra = TETROMINOES[0];
    expect(arePolyominoesEquivalent(mono, tetra)).toBe(false);
  });

  it('ghost ids miss both catalog lookups', () => {
    expect(getShapeById('ghost-xyz', TETROMINOES)).toBeUndefined();
    expect(getPolyominoById('nope-not-real')).toBeUndefined();
  });

  it('L and J are equivalent under flip when both exist', () => {
    const L = getShapeById('L', TETROMINOES)!;
    const J = getShapeById('J', TETROMINOES)!;
    expect(arePolyominoesEquivalent(L, J)).toBe(true);
  });
});
