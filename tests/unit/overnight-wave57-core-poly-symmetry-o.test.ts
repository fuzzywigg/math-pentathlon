/**
 * Overnight HEAVY leftover after #264 — getSymmetryCount(O) is 1 unique transform.
 * Distinct from wave56 O rotate/flip flags. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  TETROMINOES,
  getSymmetryCount,
  getAllTransformations,
} from '../../src/core/polyomino';

describe('Wave 57 core poly — O symmetry', () => {
  it('O has a single unique transformation', () => {
    const O = TETROMINOES.find((s) => s.id === 'O')!;
    expect(getSymmetryCount(O)).toBe(1);
    expect(getAllTransformations(O)).toHaveLength(1);
  });
});
