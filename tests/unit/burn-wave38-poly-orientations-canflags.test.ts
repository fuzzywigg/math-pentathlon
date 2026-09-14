/**
 * Wave 38 — getAllOrientations respects canRotate/canFlip flags.
 * Distinct from getAllTransformations. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  TETROMINOES,
  getShapeById,
  getAllOrientations,
  getAllTransformations,
  cellsToKey,
} from '../../src/core/polyomino';

describe('Wave 38 poly-orientations — can flags', () => {
  it('canRotate=false canFlip=false yields single orientation', () => {
    const base = getShapeById('L', TETROMINOES)!;
    const frozen = { ...base, canRotate: false, canFlip: false };
    expect(getAllOrientations(frozen)).toHaveLength(1);
  });

  it('canFlip=false orientations are subset of all transformations', () => {
    const base = getShapeById('L', TETROMINOES)!;
    const noFlip = { ...base, canFlip: false, canRotate: true };
    const orients = getAllOrientations(noFlip).map((c) => cellsToKey(c));
    const all = new Set(
      getAllTransformations(base).map((s) => cellsToKey(s.cells))
    );
    for (const key of orients) {
      expect(all.has(key)).toBe(true);
    }
    expect(orients.length).toBeLessThanOrEqual(getAllTransformations(base).length);
  });

  it('orientations keys are unique', () => {
    const T = getShapeById('T', TETROMINOES)!;
    const keys = getAllOrientations(T).map((c) => cellsToKey(c));
    expect(new Set(keys).size).toBe(keys.length);
  });
});
